import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { tiktokService } from './tiktokService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static production build if dist directory exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Initial 12 banquet tables matching client configuration (6 left, 6 right)
const INITIAL_TABLES_DATA = [
  // --- LEFT WING (6 BÀN) ---
  {
    id: 1,
    name: 'Mâm Bạn Cấp 3',
    cheersCount: 42,
    dishes: ['canh_bong', 'ga_luoc', 'tom_hap', 'xoi_gac', 'nem_ran'],
    seats: [
      { index: 0, guest: { name: 'Tuấn Híp', gender: 'male', outfit: 'vest_den' } },
      { index: 1, guest: { name: 'Thảo Mèo', gender: 'female', outfit: 'vay_da_hoi' } },
      { index: 2, guest: null },
      { index: 3, guest: { name: 'Duy Cận', gender: 'male', outfit: 'quan_dui' } },
      { index: 4, guest: null },
      { index: 5, guest: null },
    ]
  },
  {
    id: 2,
    name: 'Mâm FA Săn Vía',
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
  {
    id: 7,
    name: 'Mâm Hội Bạn Thân',
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

  // --- RIGHT WING (6 BÀN) ---
  {
    id: 4,
    name: 'Mâm Nhậu Tới Bến',
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
  {
    id: 10,
    name: 'Mâm Xóm Giềng Chí Cốt',
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
  }
];

// Room state storage: weddingId -> tables Map
const weddingRooms = new Map();

function getOrCreateWeddingRoom(weddingId = 'default_wedding') {
  if (!weddingRooms.has(weddingId)) {
    // Deep clone initial tables
    const tables = JSON.parse(JSON.stringify(INITIAL_TABLES_DATA));
    weddingRooms.set(weddingId, tables);
  }
  return weddingRooms.get(weddingId);
}

// Track socket mappings: socket.id -> { weddingId, tableId, seatIndex, guestName }
const socketSessions = new Map();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    connections: io.engine.clientsCount,
    timestamp: new Date().toISOString()
  });
});

// Get initial hall state
app.get('/api/wedding/:weddingId/tables', (req, res) => {
  const weddingId = req.params.weddingId || 'default_wedding';
  const tables = getOrCreateWeddingRoom(weddingId);
  res.json({ tables });
});

// TikTok Live Interactive API Endpoints
app.get('/api/tiktok/status', (req, res) => {
  res.json(tiktokService.getStatus());
});

app.post('/api/tiktok/connect', async (req, res) => {
  const { uniqueId } = req.body || {};
  try {
    const result = await tiktokService.connect(uniqueId, io, () => getOrCreateWeddingRoom('default_wedding'));
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/tiktok/disconnect', (req, res) => {
  tiktokService.disconnect(io);
  res.json({ success: true });
});

app.post('/api/tiktok/simulate', (req, res) => {
  const { type, payload } = req.body || {};
  const result = tiktokService.simulateEvent(type, payload, io, () => getOrCreateWeddingRoom('default_wedding'));
  res.json(result);
});

// Socket.io Realtime Logic
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // 1. Join Table Event
  socket.on('table:join', ({ weddingId = 'default_wedding', tableId }) => {
    const tables = getOrCreateWeddingRoom(weddingId);
    const table = tables.find((t) => t.id === Number(tableId));
    if (!table) return;

    const roomName = `wedding:${weddingId}:table:${tableId}`;
    socket.join(roomName);

    // Send full state to newly joined client
    socket.emit('table:state_sync', { table });
    console.log(`[Socket.io] ${socket.id} joined room ${roomName}`);
  });

  // 2. Claim Seat Atomically (Anti-collision lock)
  socket.on('seat:claim', ({ weddingId = 'default_wedding', tableId, seatIndex, guestInfo }, callback) => {
    const tables = getOrCreateWeddingRoom(weddingId);
    const table = tables.find((t) => t.id === Number(tableId));
    if (!table || seatIndex < 0 || seatIndex >= table.seats.length) {
      if (typeof callback === 'function') callback({ success: false, reason: 'INVALID_SEAT' });
      return;
    }

    const currentSeat = table.seats[seatIndex];
    // If seat is already occupied by someone else
    if (currentSeat.guest && currentSeat.guest.socketId && currentSeat.guest.socketId !== socket.id) {
      if (typeof callback === 'function') {
        callback({ success: false, reason: 'SEAT_TAKEN', seat: currentSeat });
      }
      return;
    }

    // Reserve seat for this socket
    const guestData = {
      socketId: socket.id,
      name: guestInfo.name || 'Khách Quý',
      gender: guestInfo.gender || 'male',
      outfit: guestInfo.outfit || 'vest_den',
      accessory: guestInfo.accessory || 'none',
      joinedAt: Date.now()
    };

    table.seats[seatIndex] = {
      index: seatIndex,
      guest: guestData
    };

    // Record session
    socketSessions.set(socket.id, {
      weddingId,
      tableId: Number(tableId),
      seatIndex,
      guestName: guestData.name
    });

    const roomName = `wedding:${weddingId}:table:${tableId}`;
    socket.join(roomName);

    if (typeof callback === 'function') {
      callback({ success: true, seat: table.seats[seatIndex] });
    }

    // Broadcast updated seat to everyone in the room & hall
    io.to(roomName).emit('table:seat_updated', {
      tableId: Number(tableId),
      seatIndex,
      guest: guestData
    });
    // Broadcast hall-wide update
    io.emit('hall:table_summary', {
      tableId: Number(tableId),
      occupiedSeats: table.seats.filter((s) => !!s.guest).length
    });

    console.log(`[Socket.io] Seat claimed: Table ${tableId}, Seat ${seatIndex} by ${guestData.name}`);
  });

  // 3. Leave Seat
  socket.on('seat:leave', () => {
    handleSocketDisconnect(socket.id);
  });

  // 4. Trigger Cheers (Throttled Clink)
  socket.on('table:cheers', ({ weddingId = 'default_wedding', tableId }) => {
    const tables = getOrCreateWeddingRoom(weddingId);
    const table = tables.find((t) => t.id === Number(tableId));
    if (!table) return;

    table.cheersCount = (table.cheersCount || 0) + 1;
    const roomName = `wedding:${weddingId}:table:${tableId}`;

    // Broadcast wave to all participants at this table
    io.to(roomName).emit('table:cheers_wave', {
      tableId: Number(tableId),
      cheersCount: table.cheersCount,
      triggeredBy: socketSessions.get(socket.id)?.guestName || 'Bạn bè'
    });
  });

  // 5. Serve Next Dish
  socket.on('table:serve_dish', ({ weddingId = 'default_wedding', tableId, dishId }) => {
    const tables = getOrCreateWeddingRoom(weddingId);
    const table = tables.find((t) => t.id === Number(tableId));
    if (!table) return;

    if (!table.dishes.includes(dishId)) {
      table.dishes.push(dishId);
    }

    const roomName = `wedding:${weddingId}:table:${tableId}`;
    io.to(roomName).emit('table:dish_served', {
      tableId: Number(tableId),
      dishId,
      dishes: table.dishes
    });
  });

  // 6. Realtime Speech Bubble Chat
  socket.on('table:chat', ({ weddingId = 'default_wedding', tableId, seatIndex, text, sender }) => {
    const roomName = `wedding:${weddingId}:table:${tableId}`;
    io.to(roomName).emit('table:chat_message', {
      tableId: Number(tableId),
      seatIndex,
      text,
      sender: sender || socketSessions.get(socket.id)?.guestName || 'Khách',
      timestamp: Date.now()
    });
  });

  // 7. Update Table Name
  socket.on('table:rename', ({ weddingId = 'default_wedding', tableId, newName }) => {
    const tables = getOrCreateWeddingRoom(weddingId);
    const table = tables.find((t) => t.id === Number(tableId));
    if (!table) return;

    const trimmed = (newName || '').trim();
    if (!trimmed) return;

    table.name = trimmed;
    io.emit('table:renamed', {
      tableId: Number(tableId),
      newName: trimmed
    });
  });

  // 8. TikTok Live Socket Handlers
  socket.on('tiktok:get_status', (callback) => {
    if (typeof callback === 'function') {
      callback(tiktokService.getStatus());
    }
  });

  socket.on('tiktok:connect', async ({ uniqueId }, callback) => {
    try {
      const res = await tiktokService.connect(uniqueId, io, () => getOrCreateWeddingRoom('default_wedding'));
      if (typeof callback === 'function') callback({ success: true, ...res });
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('tiktok:disconnect', (callback) => {
    tiktokService.disconnect(io);
    if (typeof callback === 'function') callback({ success: true });
  });

  socket.on('tiktok:simulate', ({ type, payload }, callback) => {
    const res = tiktokService.simulateEvent(type, payload, io, () => getOrCreateWeddingRoom('default_wedding'));
    if (typeof callback === 'function') callback(res);
  });

  // 9. Disconnect Cleanup
  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    handleSocketDisconnect(socket.id);
  });
});

function handleSocketDisconnect(socketId) {
  const session = socketSessions.get(socketId);
  if (!session) return;

  const { weddingId, tableId, seatIndex, guestName } = session;
  const tables = getOrCreateWeddingRoom(weddingId);
  const table = tables.find((t) => t.id === Number(tableId));

  if (table && table.seats[seatIndex]) {
    // Release the seat if occupied by this socket
    if (table.seats[seatIndex].guest?.socketId === socketId) {
      table.seats[seatIndex].guest = null;

      const roomName = `wedding:${weddingId}:table:${tableId}`;
      io.to(roomName).emit('table:seat_updated', {
        tableId: Number(tableId),
        seatIndex,
        guest: null
      });

      io.emit('hall:table_summary', {
        tableId: Number(tableId),
        occupiedSeats: table.seats.filter((s) => !!s.guest).length
      });

      console.log(`[Socket.io] Seat released: Table ${tableId}, Seat ${seatIndex} (${guestName})`);
    }
  }

  socketSessions.delete(socketId);
}

// Fallback all other GET routes to index.html for SPA if dist exists
if (fs.existsSync(distPath)) {
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/socket.io') || req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`[Server] Đi Đám Cưới Online 3D Realtime Server running on port ${PORT}`);
});
