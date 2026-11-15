import { TikTokLiveConnection } from 'tiktok-live-connector';

class TikTokService {
  constructor() {
    this.connection = null;
    this.uniqueId = '';
    this.isConnected = false;
    this.roomInfo = null;
    this.viewerCount = 0;
    this.likeCount = 0;
    this.recentEvents = [];
    this.guestSeatMap = new Map(); // uniqueId/nickname -> { tableId, seatIndex }
    this.waitingGuests = new Map(); // userKey -> { id, name, gender, outfit, joinedAt }
    this.likeBatchTimer = null;
    this.accumulatedLikes = 0;
    this.lastLikeSender = '';
  }

  /**
   * Get current connection status and recent log
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      uniqueId: this.uniqueId,
      viewerCount: this.viewerCount,
      likeCount: this.likeCount,
      recentEvents: this.recentEvents.slice(0, 25),
      waitingGuests: Array.from(this.waitingGuests.values())
    };
  }

  /**
   * Push event to history and cap at 35 items
   */
  _pushEvent(event) {
    this.recentEvents.unshift(event);
    if (this.recentEvents.length > 35) {
      this.recentEvents.pop();
    }
  }

  /**
   * Helper: Find target table or pick first available table
   */
  _resolveTable(tables, targetTableId) {
    let table = tables.find((t) => t.id === Number(targetTableId));
    if (!table) {
      table = tables[0];
    }
    return table;
  }

  /**
   * Helper: Assign a guest to an empty seat in the table
   */
  _claimSeatForTikTokUser(tables, targetTableId, userKey, displayName, io) {
    const table = this._resolveTable(tables, targetTableId);
    if (!table) return null;

    // Check if user is already seated somewhere
    if (this.guestSeatMap.has(userKey)) {
      return this.guestSeatMap.get(userKey);
    }

    // Find first empty seat
    let emptySeat = table.seats.find((s) => !s.guest);
    let resolvedTable = table;

    // If target table is full, search any other table with an empty seat
    if (!emptySeat) {
      for (const t of tables) {
        emptySeat = t.seats.find((s) => !s.guest);
        if (emptySeat) {
          resolvedTable = t;
          break;
        }
      }
    }

    if (!emptySeat) {
      console.log(`[TikTokService] All 72 seats in 12 tables are completely filled!`);
      return null;
    }

    const seatIndex = emptySeat.index;
    
    // Check if user was waiting at the gate: reuse their gender and outfit if available
    const existingWaiting = this.waitingGuests.get(userKey);
    const isFemale = existingWaiting ? (existingWaiting.gender === 'female') : (Math.random() > 0.5);
    const guestData = {
      id: userKey,
      name: displayName,
      gender: isFemale ? 'female' : 'male',
      outfit: existingWaiting ? existingWaiting.outfit : (isFemale ? (Math.random() > 0.5 ? 'vay_da_hoi' : 'ao_dai') : (Math.random() > 0.5 ? 'vest_den' : 'quan_dui')),
      accessory: 'none',
      isTikTokGuest: true
    };

    const seatLocation = { tableId: resolvedTable.id, seatIndex };
    this.guestSeatMap.set(userKey, seatLocation);

    // 1. Remove from entrance gate waiting list
    this.waitingGuests.delete(userKey);
    io.emit('tiktok:guest_left_gate', { guestId: userKey });

    // 2. Broadcast that character is WALKING down the central aisle to their table!
    io.emit('tiktok:guest_walk_to_table', {
      guest: guestData,
      tableId: resolvedTable.id,
      seatIndex,
      duration: 2.6
    });

    // 3. When walk arrives at table (~2.6s later), lock seat and emit table:seat_updated
    setTimeout(() => {
      resolvedTable.seats[seatIndex] = {
        index: seatIndex,
        guest: guestData
      };

      io.emit('table:seat_updated', {
        tableId: resolvedTable.id,
        seatIndex,
        guest: guestData
      });

      io.emit('hall:table_summary', {
        tableId: resolvedTable.id,
        occupiedSeats: resolvedTable.seats.filter((s) => !!s.guest).length
      });
    }, 2600);

    return seatLocation;
  }

  /**
   * Connect to TikTok Live room using uniqueId (TikTok username)
   */
  async connect(rawUniqueId, io, getTables) {
    if (this.isConnected) {
      this.disconnect(io);
    }

    const uniqueId = String(rawUniqueId || '').trim().replace(/^@/, '');
    if (!uniqueId) {
      throw new Error('TikTok Username không được để trống.');
    }

    this.uniqueId = uniqueId;
    console.log(`[TikTokService] Connecting to TikTok Live room: @${uniqueId}...`);

    try {
      this.connection = new TikTokLiveConnection(uniqueId, {
        processInitialData: false,
        enableExtendedGiftInfo: true,
        requestPollingIntervalMs: 1000,
        clientParams: {
          app_language: 'vi-VN',
          webcast_language: 'vi-VN'
        }
      });

      const state = await this.connection.connect();
      this.isConnected = true;
      this.roomInfo = state.roomInfo || null;
      console.log(`[TikTokService] Connected successfully to room @${uniqueId} (RoomId: ${state.roomId})`);

      this._bindEventListeners(io, getTables);

      io.emit('tiktok:status_changed', {
        isConnected: true,
        uniqueId: this.uniqueId,
        roomId: state.roomId
      });

      return { success: true, roomId: state.roomId };
    } catch (err) {
      this.isConnected = false;
      this.connection = null;
      console.error(`[TikTokService] Connection error:`, err.message);
      io.emit('tiktok:status_changed', {
        isConnected: false,
        error: err.message
      });
      throw err;
    }
  }

  /**
   * Bind event listeners for real TikTok webcast events
   */
  _bindEventListeners(io, getTables) {
    if (!this.connection) return;

    // 1. CHAT EVENT
    this.connection.on('chat', (data) => {
      this._handleChatMessage(data, io, getTables);
    });

    // 2. LIKE EVENT
    this.connection.on('like', (data) => {
      this._handleLikeMessage(data, io, getTables);
    });

    // 3. GIFT EVENT
    this.connection.on('gift', (data) => {
      this._handleGiftMessage(data, io, getTables);
    });

    // 4. MEMBER (JOIN) EVENT
    this.connection.on('member', (data) => {
      this._handleMemberJoin(data, io);
    });

    // 5. VIEWER COUNT UPDATE
    this.connection.on('roomUser', (data) => {
      if (typeof data.viewerCount === 'number') {
        this.viewerCount = data.viewerCount;
        io.emit('tiktok:viewer_count', { viewerCount: this.viewerCount });
      }
    });

    // 6. STREAM DISCONNECTED / ENDED
    this.connection.on('disconnected', () => {
      console.warn(`[TikTokService] TikTok Live room disconnected.`);
      this.isConnected = false;
      io.emit('tiktok:status_changed', { isConnected: false, reason: 'DISCONNECTED' });
    });

    this.connection.on('streamEnd', () => {
      console.warn(`[TikTokService] TikTok Live room ended by host.`);
      this.isConnected = false;
      io.emit('tiktok:status_changed', { isConnected: false, reason: 'STREAM_ENDED' });
    });
  }

  /**
   * Core logic for handling incoming chat comments
   */
  _handleChatMessage(data, io, getTables) {
    const rawComment = String(data.comment || '').trim();
    const nickname = data.nickname || data.uniqueId || 'Khách TikTok';
    const userKey = data.uniqueId || nickname;
    const tables = getTables();

    // Check for table selection syntax: #ban1, #ban 2, ban3, bàn 4, table 5
    const tableMatch = rawComment.match(/(?:#|mâm|mam|bàn|ban|table)\s*(\d{1,2})/i);
    let seatedInfo = this.guestSeatMap.get(userKey);

    if (tableMatch) {
      const parsedNum = parseInt(tableMatch[1], 10);
      const targetTableId = Math.min(12, Math.max(1, parsedNum));

      seatedInfo = this._claimSeatForTikTokUser(tables, targetTableId, userKey, nickname, io);

      this._pushEvent({
        id: `chat_${Date.now()}_${Math.random()}`,
        type: 'join',
        user: nickname,
        tableId: targetTableId,
        text: `Vừa chọn ngồi vào Bàn ${targetTableId}!`,
        timestamp: Date.now()
      });

      io.emit('tiktok:live_event', {
        type: 'join',
        user: nickname,
        tableId: targetTableId,
        message: `⭐ ${nickname} vừa bước vào Bàn ${targetTableId}!`
      });
    }

    // If user is seated, display speech bubble above their head at their table
    if (seatedInfo) {
      io.emit('table:chat_message', {
        tableId: seatedInfo.tableId,
        seatIndex: seatedInfo.seatIndex,
        text: rawComment,
        sender: nickname,
        timestamp: Date.now()
      });
    }

    this._pushEvent({
      id: `comment_${Date.now()}_${Math.random()}`,
      type: 'chat',
      user: nickname,
      text: rawComment,
      timestamp: Date.now()
    });

    io.emit('tiktok:live_event', {
      type: 'chat',
      user: nickname,
      text: rawComment
    });
  }

  /**
   * Core logic for handling likes (batched to prevent clink storm)
   */
  _handleLikeMessage(data, io, getTables) {
    const count = Number(data.likeCount) || 1;
    this.likeCount += count;
    this.accumulatedLikes += count;
    this.lastLikeSender = data.nickname || 'Khách TikTok';

    // Batch trigger every 1.2s to prevent audio distortion
    if (!this.likeBatchTimer) {
      this.likeBatchTimer = setTimeout(() => {
        const tables = getTables();
        const activeTable = tables.find((t) => t.seats.some((s) => !!s.guest)) || tables[0];
        if (activeTable) {
          activeTable.cheersCount = (activeTable.cheersCount || 0) + Math.min(5, Math.ceil(this.accumulatedLikes / 10));

          io.emit('table:cheers_wave', {
            tableId: activeTable.id,
            cheersCount: activeTable.cheersCount,
            triggeredBy: `${this.lastLikeSender} (❤️ Thả tim)`
          });
        }

        this._pushEvent({
          id: `like_${Date.now()}`,
          type: 'like',
          user: this.lastLikeSender,
          count: this.accumulatedLikes,
          timestamp: Date.now()
        });

        io.emit('tiktok:live_event', {
          type: 'like',
          user: this.lastLikeSender,
          count: this.accumulatedLikes,
          message: `❤️ ${this.lastLikeSender} vừa thả ${this.accumulatedLikes} tim! Cụng ly nào 🍻`
        });

        this.accumulatedLikes = 0;
        this.likeBatchTimer = null;
      }, 1200);
    }
  }

  /**
   * Core logic for handling gift donations
   */
  _handleGiftMessage(data, io, getTables) {
    // Only process finished gift streaks
    if (data.giftType === 1 && !data.repeatEnd) {
      return;
    }

    const nickname = data.nickname || data.uniqueId || 'Đại Gia TikTok';
    const giftName = data.giftName || 'Hoa Hồng';
    const diamondCount = Number(data.diamondCount) || 1;
    const repeatCount = Number(data.repeatCount) || 1;
    const totalDiamonds = diamondCount * repeatCount;
    const tables = getTables();

    console.log(`[TikTokService] Gift received: ${nickname} sent ${giftName} x${repeatCount} (${totalDiamonds} xu)`);

    // VIP Gift Celebration: 10 diamonds or more (Bánh kem, pháo hoa, nhẫn, sư tử...)
    if (totalDiamonds >= 10 || diamondCount >= 5) {
      this._pushEvent({
        id: `gift_vip_${Date.now()}`,
        type: 'vip_gift',
        user: nickname,
        giftName,
        count: repeatCount,
        diamonds: totalDiamonds,
        timestamp: Date.now()
      });

      // Broadcast VIP celebration across entire ballroom (triggers 3D fireworks on stage)
      io.emit('tiktok:vip_celebration', {
        sender: nickname,
        giftName,
        count: repeatCount,
        diamonds: totalDiamonds,
        timestamp: Date.now()
      });
    } else {
      // Small gift (1 xu rose / ice cream): Serve next delicious dish on a table or trigger cheers
      const targetTable = tables.find((t) => t.seats.some((s) => !!s.guest)) || tables[0];
      if (targetTable) {
        targetTable.cheersCount = (targetTable.cheersCount || 0) + 1;
        io.emit('table:cheers_wave', {
          tableId: targetTable.id,
          cheersCount: targetTable.cheersCount,
          triggeredBy: `${nickname} (🎁 Tặng ${giftName})`
        });
      }

      this._pushEvent({
        id: `gift_${Date.now()}`,
        type: 'gift',
        user: nickname,
        giftName,
        count: repeatCount,
        timestamp: Date.now()
      });

      io.emit('tiktok:live_event', {
        type: 'gift',
        user: nickname,
        giftName,
        count: repeatCount,
        message: `🎁 ${nickname} vừa tặng ${giftName} x${repeatCount}!`
      });
    }
  }

  /**
   * Core logic for member join: adds guest to entrance gate waiting list
   */
  _handleMemberJoin(data, io) {
    const nickname = data.nickname || data.uniqueId || 'Khách Mời';
    const userKey = data.uniqueId || nickname;

    if (!this.guestSeatMap.has(userKey) && !this.waitingGuests.has(userKey)) {
      const isFemale = Math.random() > 0.5;
      const waitingGuest = {
        id: userKey,
        name: nickname,
        gender: isFemale ? 'female' : 'male',
        outfit: isFemale ? (Math.random() > 0.5 ? 'vay_da_hoi' : 'ao_dai') : (Math.random() > 0.5 ? 'vest_den' : 'quan_dui'),
        joinedAt: Date.now()
      };

      // Cap waiting list at 10 guests to keep scene light & clean
      if (this.waitingGuests.size >= 10) {
        const oldestKey = this.waitingGuests.keys().next().value;
        this.waitingGuests.delete(oldestKey);
        io.emit('tiktok:guest_left_gate', { guestId: oldestKey });
      }

      this.waitingGuests.set(userKey, waitingGuest);
      io.emit('tiktok:guest_waiting', { guest: waitingGuest });
    }

    this._pushEvent({
      id: `member_${Date.now()}`,
      type: 'member',
      user: nickname,
      timestamp: Date.now()
    });

    io.emit('tiktok:live_event', {
      type: 'member',
      user: nickname,
      message: `🎉 ${nickname} vừa bước vào sảnh cưới!`
    });
  }

  /**
   * Disconnect cleanly from TikTok Live
   */
  disconnect(io) {
    if (this.connection) {
      try {
        this.connection.disconnect();
      } catch (e) {
        console.warn(`[TikTokService] Error while disconnecting:`, e.message);
      }
      this.connection = null;
    }

    this.isConnected = false;
    this.uniqueId = '';
    this.viewerCount = 0;
    this.likeCount = 0;

    if (io) {
      io.emit('tiktok:status_changed', { isConnected: false });
    }
    console.log(`[TikTokService] Disconnected from TikTok Live.`);
  }

  /**
   * SIMULATOR ENGINE: Allows 1-click testing directly from Admin UI
   */
  simulateEvent(type, payload = {}, io, getTables) {
    console.log(`[TikTokService] Running Simulator Event: ${type}`, payload);

    switch (type) {
      case 'chat_table': {
        const tableId = payload.tableId || Math.floor(Math.random() * 12) + 1;
        // If there's a guest waiting at the entrance gate, use that guest!
        const firstWaitingKey = this.waitingGuests.keys().next().value;
        const waitingGuest = firstWaitingKey ? this.waitingGuests.get(firstWaitingKey) : null;

        const fakeName = payload.name || (waitingGuest ? waitingGuest.name : `Khách TikTok #${Math.floor(Math.random() * 899 + 100)}`);
        const uniqueId = waitingGuest ? waitingGuest.id : `tiktok_${Date.now()}`;

        this._handleChatMessage(
          {
            comment: `#ban${tableId} Cho mình ngồi bàn này nhé!`,
            nickname: fakeName,
            uniqueId: uniqueId
          },
          io,
          getTables
        );
        break;
      }
      case 'member': {
        const fakeName = payload.name || `Khách Mới #${Math.floor(Math.random() * 899 + 100)}`;
        this._handleMemberJoin(
          {
            nickname: fakeName,
            uniqueId: `tiktok_gate_${Date.now()}_${Math.floor(Math.random() * 1000)}`
          },
          io
        );
        break;
      }
      case 'chat_wish': {
        const fakeName = payload.name || 'Người Xem TikTok';
        const wishes = [
          'Chúc cô dâu chú rể trăm năm hạnh phúc! 💍',
          'Mâm này cụng ly tưng bừng quá ae ơi! 🍻',
          'Đám cưới online đỉnh quá! DÔ 100%!',
          'Chúc 2 bạn sớm sinh quý tử nhé ❤️',
          'Cho xin 1 chân vào ngồi mâm này với!'
        ];
        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        this._handleChatMessage(
          {
            comment: randomWish,
            nickname: fakeName,
            uniqueId: payload.uniqueId || `guest_${Date.now()}`
          },
          io,
          getTables
        );
        break;
      }
      case 'like': {
        this._handleLikeMessage(
          {
            likeCount: payload.count || 25,
            nickname: payload.name || 'Fan Cứng TikTok'
          },
          io,
          getTables
        );
        break;
      }
      case 'gift_rose': {
        this._handleGiftMessage(
          {
            giftName: 'Hoa Hồng 🌹',
            diamondCount: 1,
            repeatCount: payload.count || 5,
            repeatEnd: true,
            nickname: payload.name || 'Bạn Tặng Hoa'
          },
          io,
          getTables
        );
        break;
      }
      case 'gift_vip': {
        this._handleGiftMessage(
          {
            giftName: payload.giftName || 'Pháo Hoa Cưới 🎆',
            diamondCount: 100,
            repeatCount: 1,
            repeatEnd: true,
            nickname: payload.name || 'Đại Gia Săn Vía'
          },
          io,
          getTables
        );
        break;
      }
      case 'member': {
        this._handleMemberJoin(
          {
            nickname: payload.name || `Khách Mới #${Math.floor(Math.random() * 899 + 100)}`
          },
          io
        );
        break;
      }
      default:
        console.warn(`[TikTokService] Unknown simulator event type: ${type}`);
    }

    return { success: true };
  }
}

export const tiktokService = new TikTokService();
export default tiktokService;
