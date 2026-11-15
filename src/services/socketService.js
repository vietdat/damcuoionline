import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.listeners = new Map();
  }

  /**
   * Initialize Socket.io connection with auto-reconnection & fallback
   */
  connect() {
    if (this.socket) return this.socket;

    let socketUrl = import.meta.env.VITE_SOCKET_URL;
    if (!socketUrl && typeof window !== 'undefined') {
      // In local dev when Vite runs on port 3000, connect directly to Socket server on port 3001
      if (window.location.port === '3000') {
        socketUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
      } else {
        socketUrl = window.location.origin;
      }
    }
    if (!socketUrl) {
      socketUrl = 'http://localhost:3001';
    }

    this.socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log(`[SocketService] Connected to Realtime Server (${this.socket.id})`);
      this._emitLocal('connection:change', true);

      // Rejoin room if was in one before reconnect
      if (this.currentRoom) {
        this.socket.emit('table:join', this.currentRoom);
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.warn(`[SocketService] Disconnected: ${reason}`);
      this._emitLocal('connection:change', false);
    });

    this.socket.on('connect_error', (err) => {
      this.isConnected = false;
      console.debug('[SocketService] Connection warning:', err.message);
      this._emitLocal('connection:change', false);
    });

    return this.socket;
  }

  /**
   * Subscribe to local service events
   */
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(handler);
    }
  }

  _emitLocal(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => cb(data));
    }
  }

  /**
   * Join a banquet table room
   */
  joinTable(tableId, weddingId = 'default_wedding') {
    this.connect();
    this.currentRoom = { weddingId, tableId };
    this.socket.emit('table:join', { weddingId, tableId });
  }

  /**
   * Claim a seat atomically
   */
  claimSeat(tableId, seatIndex, guestInfo, weddingId = 'default_wedding', callback) {
    this.connect();
    this.socket.emit('seat:claim', { weddingId, tableId, seatIndex, guestInfo }, (response) => {
      if (callback) callback(response);
    });
  }

  /**
   * Leave seat
   */
  leaveSeat() {
    if (this.socket && this.isConnected) {
      this.socket.emit('seat:leave');
    }
  }

  /**
   * Broadcast cheers wave
   */
  triggerCheers(tableId, weddingId = 'default_wedding') {
    this.connect();
    this.socket.emit('table:cheers', { weddingId, tableId });
  }

  /**
   * Broadcast serve dish
   */
  serveDish(tableId, dishId, weddingId = 'default_wedding') {
    this.connect();
    this.socket.emit('table:serve_dish', { weddingId, tableId, dishId });
  }

  /**
   * Send speech bubble chat message
   */
  sendChatMessage(tableId, seatIndex, text, sender, weddingId = 'default_wedding') {
    this.connect();
    this.socket.emit('table:chat', { weddingId, tableId, seatIndex, text, sender });
  }

  /**
   * Rename table
   */
  renameTable(tableId, newName, weddingId = 'default_wedding') {
    this.connect();
    this.socket.emit('table:rename', { weddingId, tableId, newName });
  }

  /**
   * TikTok Live Interactive Methods
   */
  getTikTokStatus(callback) {
    this.connect();
    this.socket.emit('tiktok:get_status', callback);
  }

  connectTikTok(uniqueId, callback) {
    this.connect();
    this.socket.emit('tiktok:connect', { uniqueId }, callback);
  }

  disconnectTikTok(callback) {
    this.connect();
    this.socket.emit('tiktok:disconnect', callback);
  }

  simulateTikTokEvent(type, payload = {}, callback) {
    this.connect();
    this.socket.emit('tiktok:simulate', { type, payload }, callback);
  }
}

export const socketService = new SocketService();
export default socketService;
