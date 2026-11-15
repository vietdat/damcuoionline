import { create } from 'zustand';
import socketService from '../services/socketService.js';
import soundManager from '../audio/soundManager.js';

export const OUTFITS = [
  { id: 'vest_den', name: 'Vest Bảnh Bao', color: '#1E293B', description: 'Lịch lãm, chuẩn thanh niên nghiêm túc', forGender: 'all' },
  { id: 'vay_da_hoi', name: 'Váy Dạ Hội', color: '#E11D48', description: 'Lộng lẫy, kiêu sa chiếm trọn spotlight', forGender: 'female' },
  { id: 'ao_dai', name: 'Áo Dài Cưới', color: '#DC2626', description: 'Truyền thống, thướt tha đậm chất Việt', forGender: 'all' },
  { id: 'quan_dui', name: 'Quần Đùi Ba Lỗ', color: '#2563EB', description: 'Thoải mái như ở nhà, lầy lội meme', forGender: 'all' },
];

export const ACCESSORIES = [
  { id: 'none', name: 'Không phụ kiện' },
  { id: 'kinh_ram', name: 'Kính Râm Cực Ngầu' },
  { id: 'hoa_cuoi', name: 'Bó Hoa Cưới' },
  { id: 'ly_bia', name: 'Ly Bia Cụng' },
];

export const ROLES = [
  'Bạn Chú Rể',
  'Bạn Cô Dâu',
  'Hội FA Săn Vía',
  'Người Yêu Cũ',
  'Bà Con Xa',
];

export const BANQUET_DISH_LIST = [
  'canh_bong',
  'ga_luoc',
  'tom_hap',
  'xoi_gac',
  'nem_ran',
  'nom_sen'
];

// Reorganized Layout: 12 Grand Banquet Tables (6 Left Wing, 6 Right Wing)
// 4 majestic columns flanking the central aisle (2 columns on left, 2 columns on right)
// Left Wing: Inner (X = -3.8), Outer (X = -7.4)
// Right Wing: Inner (X = +3.8), Outer (X = +7.4)
export const INITIAL_TABLES = [
  // ================= LEFT WING (6 BÀN) =================
  // --- Left Inner Column (Gần lối đi chính) ---
  {
    id: 1,
    name: 'Mâm Bạn Cấp 3',
    position: [-3.8, 0, -3.8],
    cheersCount: 42,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nem_ran'],
    seats: [
      { index: 0, guest: { name: 'Tuấn Híp', gender: 'male', outfit: 'vest_den' } },
      { index: 1, guest: { name: 'Thảo Mèo', gender: 'female', outfit: 'vay_da_hoi' } },
      { index: 2, guest: null }, // Empty for player
      { index: 3, guest: { name: 'Duy Cận', gender: 'male', outfit: 'quan_dui' } },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 2,
    name: 'Mâm FA Săn Vía',
    position: [-3.8, 0, 0.2],
    cheersCount: 68,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac'],
    seats: [
      { index: 0, guest: null },
      { index: 1, guest: { name: 'Lan Độc Thân', gender: 'female', outfit: 'ao_dai' } },
      { index: 2, guest: null },
      { index: 3, guest: { name: 'Hoàng Solo', gender: 'male', outfit: 'vest_den' } },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 3,
    name: 'Mâm Đồng Nghiệp IT',
    position: [-3.8, 0, 4.2],
    cheersCount: 88,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nom_sen'],
    seats: [
      { index: 0, guest: { name: 'Sếp Dũng', gender: 'male', outfit: 'vest_den' } },
      { index: 1, guest: null },
      { index: 2, guest: null },
      { index: 3, guest: { name: 'Hải Dev', gender: 'male', outfit: 'quan_dui' } },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  // --- Left Outer Column (Cánh trái bên ngoài) ---
  {
    id: 7,
    name: 'Mâm Hội Bạn Thân',
    position: [-7.4, 0, -3.8],
    cheersCount: 65,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nem_ran', 'nom_sen'],
    seats: [
      { index: 0, guest: { name: 'Minh Pro', gender: 'male', outfit: 'vest_den' } },
      { index: 1, guest: { name: 'Thu Trang', gender: 'female', outfit: 'vay_da_hoi' } },
      { index: 2, guest: null },
      { index: 3, guest: null },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 8,
    name: 'Mâm Bà Con Họ Hàng',
    position: [-7.4, 0, 0.2],
    cheersCount: 75,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nem_ran'],
    seats: [
      { index: 0, guest: null },
      { index: 1, guest: { name: 'Bác Năm', gender: 'male', outfit: 'ao_dai' } },
      { index: 2, guest: null },
      { index: 3, guest: { name: 'Cô Bảy', gender: 'female', outfit: 'ao_dai' } },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 9,
    name: 'Mâm Gen Z Quậy Cỗ',
    position: [-7.4, 0, 4.2],
    cheersCount: 110,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac'],
    seats: [
      { index: 0, guest: { name: 'Bảo Bảo', gender: 'male', outfit: 'quan_dui' } },
      { index: 1, guest: null },
      { index: 2, guest: null },
      { index: 3, guest: { name: 'Linh Chi', gender: 'female', outfit: 'vay_da_hoi' } },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },

  // ================= RIGHT WING (6 BÀN) =================
  // --- Right Inner Column (Gần lối đi chính) ---
  {
    id: 4,
    name: 'Mâm Nhậu Tới Bến',
    position: [3.8, 0, -3.8],
    cheersCount: 120,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nem_ran', 'nom_sen'],
    seats: [
      { index: 0, guest: { name: 'Hùng Râu', gender: 'male', outfit: 'quan_dui' } },
      { index: 1, guest: null },
      { index: 2, guest: { name: 'Nam Bia', gender: 'male', outfit: 'vest_den' } },
      { index: 3, guest: null },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 5,
    name: 'Mâm Bạn Đại Học',
    position: [3.8, 0, 0.2],
    cheersCount: 56,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nem_ran'],
    seats: [
      { index: 0, guest: null },
      { index: 1, guest: { name: 'My Xù', gender: 'female', outfit: 'vay_da_hoi' } },
      { index: 2, guest: null },
      { index: 3, guest: null },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 6,
    name: 'Người Yêu Cũ 💔',
    position: [3.8, 0, 4.2],
    cheersCount: 99,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac'],
    seats: [
      { index: 0, guest: { name: 'NYC 1', gender: 'female', outfit: 'vay_da_hoi' } },
      { index: 1, guest: null },
      { index: 2, guest: null },
      { index: 3, guest: null },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  // --- Right Outer Column (Cánh phải bên ngoài) ---
  {
    id: 10,
    name: 'Mâm Xóm Giềng Chí Cốt',
    position: [7.4, 0, -3.8],
    cheersCount: 82,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nem_ran'],
    seats: [
      { index: 0, guest: { name: 'Chú Ba', gender: 'male', outfit: 'vest_den' } },
      { index: 1, guest: null },
      { index: 2, guest: null },
      { index: 3, guest: { name: 'Bác Tư', gender: 'male', outfit: 'ao_dai' } },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 11,
    name: 'Mâm Các Bác Buôn Chuyện',
    position: [7.4, 0, 0.2],
    cheersCount: 95,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nom_sen'],
    seats: [
      { index: 0, guest: null },
      { index: 1, guest: { name: 'Bác Bán Xôi', gender: 'female', outfit: 'ao_dai' } },
      { index: 2, guest: null },
      { index: 3, guest: null },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 12,
    name: 'Mâm Anh Em Chiến Hữu',
    position: [7.4, 0, 4.2],
    cheersCount: 135,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nem_ran', 'nom_sen'],
    seats: [
      { index: 0, guest: { name: 'Toàn Rambo', gender: 'male', outfit: 'quan_dui' } },
      { index: 1, guest: null },
      { index: 2, guest: null },
      { index: 3, guest: { name: 'Chiến Căng', gender: 'male', outfit: 'vest_den' } },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
];

export const useWeddingStore = create((set, get) => ({
  // Scene management: 1 = Lobby/Dress-up, 2 = Hall/Table pick, 3 = Table focus
  currentScene: 1,
  setScene: (scene) => {
    // When entering the banquet table (Scene 3), turn off stage video sound
    if (scene === 3 && typeof window !== 'undefined') {
      const video = window.__stageVideoElement || document.getElementById('stage-wedding-video-element');
      if (video) video.muted = true;
    }
    set({ currentScene: scene, focusedTableId: null, focusedSeatIndex: null });
  },

  // Guest Information
  guestName: 'Bạn Khách Quý',
  guestRole: 'Bạn Chú Rể',
  guestGender: 'male',
  selectedOutfit: 'vest_den',
  selectedAccessory: 'kinh_ram',

  setGuestName: (name) => set({ guestName: name }),
  setGuestRole: (role) => set({ guestRole: role }),
  setGuestGender: (gender) => set((state) => {
    let outfit = state.selectedOutfit;
    if (gender === 'female' && outfit === 'vest_den') {
      outfit = 'vay_da_hoi';
    } else if (gender === 'male' && outfit === 'vay_da_hoi') {
      outfit = 'vest_den';
    }
    return { guestGender: gender, selectedOutfit: outfit };
  }),
  setSelectedOutfit: (outfitId) => set({ selectedOutfit: outfitId }),
  setSelectedAccessory: (accId) => set({ selectedAccessory: accId }),

  // Audio status
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  // Tables State
  tables: INITIAL_TABLES,
  selectedTableId: 1,
  selectedSeatIndex: 2,

  // 2-Step Table Selection (Focus & Walk-in transition in Scene 2)
  focusedTableId: null,
  focusedSeatIndex: null,

  focusTable: (tableId, seatIndex = null) => {
    const { tables, focusedTableId, selectSeatAndEnterTable } = get();
    // If the user clicks the ALREADY focused table a second time, enter Scene 3 immediately!
    if (focusedTableId === tableId) {
      const chosenSeat = seatIndex !== null ? seatIndex : (get().focusedSeatIndex ?? 0);
      selectSeatAndEnterTable(tableId, chosenSeat);
      set({ focusedTableId: null, focusedSeatIndex: null });
      return;
    }

    // Otherwise, set focus on this table and trigger smooth camera walk-in
    const targetTable = tables.find((t) => t.id === tableId) || tables[0];
    let resolvedSeat = seatIndex;
    if (resolvedSeat === null || resolvedSeat === undefined) {
      const emptySeat = targetTable.seats.find((s) => !s.guest);
      resolvedSeat = emptySeat ? emptySeat.index : 0;
    }

    set({
      focusedTableId: tableId,
      focusedSeatIndex: resolvedSeat
    });
  },

  clearFocusedTable: () => {
    set({ focusedTableId: null, focusedSeatIndex: null });
  },

  focusTableOnly: (tableId) => {
    set({
      focusedTableId: tableId,
      currentScene: 2 // Strictly stay in Scene 2 (Hall Scene)
    });
  },

  confirmEnterFocusedTable: () => {
    const { focusedTableId, focusedSeatIndex, selectSeatAndEnterTable } = get();
    if (focusedTableId !== null) {
      selectSeatAndEnterTable(focusedTableId, focusedSeatIndex ?? 0);
      set({ focusedTableId: null, focusedSeatIndex: null });
    }
  },

  // Realtime Multiplayer Socket States
  isSocketConnected: false,
  _socketInitialized: false,

  // Table gameplay states
  fullnessLevel: 25,
  isCheersTriggered: false,
  cheersPhase: 0,
  _cheersTimeouts: [],
  isQRModalOpen: false,
  activeChatBubbles: {},

  // TikTok Live Interactive States
  isTikTokModalOpen: false,
  isTikTokConnected: false,
  tikTokUsername: '',
  tikTokViewerCount: 0,
  tikTokEventsLog: [],
  waitingGuests: [],
  walkingGuests: [],
  vipCelebration: null,
  activeLiveBanner: null,

  setTikTokModalOpen: (open) => set({ isTikTokModalOpen: open }),
  setTikTokStatus: (status) => set(status),
  clearVipCelebration: () => set({ vipCelebration: null }),

  initSocket: () => {
    if (get()._socketInitialized) return;
    set({ _socketInitialized: true });

    const socket = socketService.connect();

    socketService.on('connection:change', (connected) => {
      set({ isSocketConnected: connected });
    });

    // 1. Table state sync when joining room
    socket.on('table:state_sync', ({ table }) => {
      if (!table) return;
      const { tables, selectedSeatIndex, guestName } = get();
      const updated = tables.map((t) => {
        if (t.id === table.id) {
          // Merge seats, preserving user's self flag
          const mergedSeats = table.seats.map((s, idx) => {
            if (idx === selectedSeatIndex && s.guest) {
              return { ...s, guest: { ...s.guest, isSelf: true } };
            }
            return s;
          });
          return { ...t, ...table, seats: mergedSeats };
        }
        return t;
      });
      set({ tables: updated });
    });

    // 2. Realtime seat updated by any guest in room
    socket.on('table:seat_updated', ({ tableId, seatIndex, guest }) => {
      const { tables, selectedSeatIndex } = get();
      const updated = tables.map((t) => {
        if (t.id === tableId) {
          const newSeats = [...t.seats];
          const isSelf = seatIndex === selectedSeatIndex;
          newSeats[seatIndex] = {
            index: seatIndex,
            guest: guest ? { ...guest, isSelf } : null
          };
          return { ...t, seats: newSeats };
        }
        return t;
      });
      set({ tables: updated });
    });

    // 3. Realtime cheers wave from anyone at the table
    socket.on('table:cheers_wave', ({ tableId, cheersCount }) => {
      const { tables, selectedTableId, isCheersTriggered } = get();
      const updated = tables.map((t) => (t.id === tableId ? { ...t, cheersCount } : t));
      set({ tables: updated });

      if (selectedTableId === tableId && !isCheersTriggered) {
        soundManager.playCheersChant();
        get()._runCheersAnimation();
      }
    });

    // 4. Realtime dish served by someone at table
    socket.on('table:dish_served', ({ tableId, dishes }) => {
      const { tables } = get();
      const updated = tables.map((t) => (t.id === tableId ? { ...t, dishes } : t));
      set({ tables: updated });
    });

    // 5. Realtime speech bubble chat message
    socket.on('table:chat_message', ({ tableId, seatIndex, text, sender, timestamp }) => {
      const { selectedTableId } = get();
      if (selectedTableId === tableId) {
        soundManager.playChatPop();
        set((state) => ({
          activeChatBubbles: {
            ...state.activeChatBubbles,
            [seatIndex]: { text, sender, timestamp }
          }
        }));

        setTimeout(() => {
          set((state) => {
            const cur = state.activeChatBubbles[seatIndex];
            if (cur && cur.timestamp === timestamp) {
              const next = { ...state.activeChatBubbles };
              delete next[seatIndex];
              return { activeChatBubbles: next };
            }
            return state;
          });
        }, 6000);
      }
    });

    // 6. Realtime table renamed
    socket.on('table:renamed', ({ tableId, newName }) => {
      const { tables } = get();
      const updated = tables.map((t) => (t.id === tableId ? { ...t, name: newName } : t));
      set({ tables: updated });
    });

    // 7. TikTok Live Status & Events
    socket.on('tiktok:status_changed', ({ isConnected, uniqueId }) => {
      set({
        isTikTokConnected: !!isConnected,
        tikTokUsername: uniqueId || get().tikTokUsername
      });
    });

    socket.on('tiktok:viewer_count', ({ viewerCount }) => {
      set({ tikTokViewerCount: viewerCount });
    });

    socket.on('tiktok:live_event', (event) => {
      set((state) => {
        const nextLog = [event, ...state.tikTokEventsLog].slice(0, 30);
        return {
          tikTokEventsLog: nextLog,
          activeLiveBanner: event.message || event.text ? event : state.activeLiveBanner
        };
      });

      // Clear banner after 4.5s
      setTimeout(() => {
        set((state) => {
          if (state.activeLiveBanner === event) {
            return { activeLiveBanner: null };
          }
          return state;
        });
      }, 4500);
    });

    // 8. TikTok VIP Celebration (Stage Fireworks & Gold Rain)
    socket.on('tiktok:vip_celebration', (celebration) => {
      soundManager.playFireworks();
      set({ vipCelebration: celebration });

      // Automatically end VIP celebration after 8 seconds
      setTimeout(() => {
        set({ vipCelebration: null });
      }, 8000);
    });

    // 9. TikTok Live Guests standing at entrance gate
    socket.on('tiktok:guest_waiting', ({ guest }) => {
      set((state) => {
        if (state.waitingGuests.some((g) => g.id === guest.id)) return state;
        return { waitingGuests: [...state.waitingGuests, guest].slice(-10) };
      });
    });

    socket.on('tiktok:guest_left_gate', ({ guestId }) => {
      set((state) => ({
        waitingGuests: state.waitingGuests.filter((g) => g.id !== guestId)
      }));
    });

    socket.on('tiktok:guest_walk_to_table', ({ guest, tableId, seatIndex, duration }) => {
      set((state) => ({
        waitingGuests: state.waitingGuests.filter((g) => g.id !== guest.id),
        walkingGuests: [
          ...state.walkingGuests,
          {
            ...guest,
            targetTableId: tableId,
            seatIndex,
            startTime: performance.now(),
            duration: duration || 2.6
          }
        ]
      }));

      // Automatically clean up from walking list once arrived
      setTimeout(() => {
        set((state) => ({
          walkingGuests: state.walkingGuests.filter((g) => g.id !== guest.id)
        }));
      }, 2800);
    });
  },

  // Actions
  enterWeddingHall: () => set({ currentScene: 2 }),
  
  selectSeatAndEnterTable: (tableId, seatIndex) => {
    const { guestName, guestGender, selectedOutfit, selectedAccessory, tables } = get();

    // 1. Join room and claim seat atomically over websocket
    socketService.joinTable(tableId);
    socketService.claimSeat(
      tableId,
      seatIndex,
      {
        name: guestName,
        gender: guestGender,
        outfit: selectedOutfit,
        accessory: selectedAccessory
      },
      'default_wedding',
      (res) => {
        if (res && res.success === false && res.reason === 'SEAT_TAKEN') {
          alert('Ghế này vừa có bạn khác ngồi rồi, bạn chọn ghế bên cạnh nhé!');
        }
      }
    );

    // 2. Optimistic local update
    const updatedTables = tables.map((t) => {
      if (t.id === tableId) {
        const newSeats = [...t.seats];
        newSeats[seatIndex] = {
          index: seatIndex,
          guest: {
            name: guestName,
            gender: guestGender,
            outfit: selectedOutfit,
            accessory: selectedAccessory,
            isSelf: true
          }
        };
        return { ...t, seats: newSeats };
      }
      return t;
    });

    // When sitting down at a table, turn off stage video sound
    if (typeof window !== 'undefined') {
      const video = window.__stageVideoElement || document.getElementById('stage-wedding-video-element');
      if (video) video.muted = true;
    }

    set({
      tables: updatedTables,
      selectedTableId: tableId,
      selectedSeatIndex: seatIndex,
      currentScene: 3
    });
  },

  serveNextDish: () => {
    const { tables, selectedTableId } = get();
    let nextDishId = null;

    const updated = tables.map((t) => {
      if (t.id === selectedTableId) {
        const cur = t.dishes || [];
        const missing = BANQUET_DISH_LIST.find((d) => !cur.includes(d));
        if (missing) {
          nextDishId = missing;
          return { ...t, dishes: [...cur, missing] };
        }
      }
      return t;
    });

    set({ tables: updated });

    // Sync via socket
    if (nextDishId) {
      socketService.serveDish(selectedTableId, nextDishId);
    }
  },

  eatDish: () => {
    set((state) => ({
      fullnessLevel: Math.min(100, state.fullnessLevel + 20)
    }));
  },

  _runCheersAnimation: () => {
    const { _cheersTimeouts } = get();
    if (_cheersTimeouts && _cheersTimeouts.length > 0) {
      _cheersTimeouts.forEach((tid) => clearTimeout(tid));
    }

    const tids = [];
    set({
      isCheersTriggered: true,
      cheersPhase: 1,
    });

    // Phase 2: Second "Hai ba Zô!" at ~1400ms
    tids.push(
      setTimeout(() => {
        set({ cheersPhase: 2 });
      }, 1400)
    );

    // Phase 3: Grand "Hai ba Uống!" at ~2500ms
    tids.push(
      setTimeout(() => {
        set({ cheersPhase: 3 });
      }, 2500)
    );

    // Complete / reset back to idle after audio completes at ~5800ms
    tids.push(
      setTimeout(() => {
        set({ isCheersTriggered: false, cheersPhase: 0 });
      }, 5800)
    );

    set({ _cheersTimeouts: tids });
  },

  triggerCheers: () => {
    const { tables, selectedTableId } = get();
    const updated = tables.map((t) => {
      if (t.id === selectedTableId) {
        return { ...t, cheersCount: (t.cheersCount || 0) + 1 };
      }
      return t;
    });
    set({ tables: updated });

    // Run local cheers animation
    get()._runCheersAnimation();

    // Broadcast over WebSocket to all table companions
    socketService.triggerCheers(selectedTableId);
  },

  setQRModalOpen: (open) => set({ isQRModalOpen: open }),

  updateTableName: (tableId, newName) => {
    const trimmed = (newName || '').trim();
    if (!trimmed) return;
    const { tables } = get();
    const updated = tables.map((t) => (t.id === tableId ? { ...t, name: trimmed } : t));
    set({ tables: updated });

    // Broadcast rename
    socketService.renameTable(tableId, trimmed);
  },

  sendTableMessage: (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    const { selectedSeatIndex, selectedTableId, guestName } = get();

    const timestamp = Date.now();
    set((state) => ({
      activeChatBubbles: {
        ...state.activeChatBubbles,
        [selectedSeatIndex]: {
          text: trimmed,
          sender: guestName,
          timestamp
        }
      }
    }));

    // Broadcast over WebSocket to companions
    socketService.sendChatMessage(selectedTableId, selectedSeatIndex, trimmed, guestName);

    // Auto-clear after 6 seconds
    setTimeout(() => {
      set((state) => {
        const cur = state.activeChatBubbles[selectedSeatIndex];
        if (cur && cur.timestamp === timestamp) {
          const next = { ...state.activeChatBubbles };
          delete next[selectedSeatIndex];
          return { activeChatBubbles: next };
        }
        return state;
      });
    }, 6000);
  },
}));

export default useWeddingStore;
