# 💒 Đi Đám Cưới Online 3D

**Attend a Vietnamese wedding banquet in interactive 3D — right in your browser.**

Inspired by the viral "Đi chùa online" trend: guests who are far away can still dress up, pick a table, eat virtual dishes, shout "1-2-3, DÔ!" and send lucky money — while the bride and groom share one link and receive wishes (and VietQR payments) live. TikTok Live comments and gifts join the party in real time.

> 🇻🇳 **Tóm tắt tiếng Việt:** Game/mô phỏng đám cưới Việt Nam 3D chạy trên trình duyệt — lên đồ cho nhân vật chibi, chọn bàn tiệc, ăn cỗ ảo, cụng ly, mở bao lì xì mừng cưới qua VietQR, nhận "chứng nhận đã đi ăn cưới". Đồng bộ với TikTok Live: bình luận và quà tặng trên livestream xuất hiện ngay trong sảnh tiệc 3D.

## ✨ Features

- **Scene 1 — Dress-up lobby:** enter your name, rotate a 3D chibi character 360°, pick an outfit (suit, dress, tank top...) and walk into the party.
- **Scene 2 — Banquet hall:** orbit the camera around a 3D wedding hall, see the tables and guests already seated, tap an empty chair to sit down.
- **Scene 3 — Your table:** Vietnamese dishes appear on the table (roast chicken, steamed shrimp, sticky rice, spring rolls...), hit **"CỤNG LY!"** for a 1-2-3 cheers with sparks and sound, open a 3D red envelope to send lucky money via VietQR, and receive a **"Chứng nhận đã đi ăn cưới"** certificate.
- **TikTok Live sync:** live chat and gifts from the couple's TikTok Live appear as guests and cheers inside the 3D hall (Socket.io + `tiktok-live-connector`).
- **No sign-up:** type a name and you're in. Built mobile-first — smooth on phones.

## 🛠 Tech stack

- **Frontend:** React 18 + Vite + Three.js (`@react-three/fiber`, `@react-three/drei`) + Tailwind CSS + Zustand
- **Realtime:** Socket.io (client + server)
- **Backend:** Node.js + Express (`server/`)
- **Live:** `tiktok-live-connector`
- **Extras:** GSAP animations, Howler audio, `vton_tool/` — a Python virtual try-on experiment (see its own README)

## 🚀 Run it locally

```bash
npm install

# Frontend (Vite dev server)
npm run dev

# Backend (Socket.io + TikTok Live service, port 3001)
npm run server

# Production build
npm run build
```

Copy `.env.example` to `.env` to configure:

```bash
VITE_SOCKET_URL=   # backend URL in production (leave empty in dev to use the Vite proxy)
PORT=3001          # backend port
```

## 🗂 Project structure

```
src/
  components/3d/   # Hall, stage, tables, dishes, chibi characters, effects
  components/ui/   # Lobby, table and TikTok Live overlays, VietQR modal
  services/        # Socket.io client
  store/           # Zustand wedding store
server/            # Express + Socket.io + TikTok Live service
documents/         # PRD, system architecture, implementation plan (Vietnamese)
vton_tool/         # Python virtual try-on experiment
public/            # Audio, video and Draco 3D assets
```

## 📺 Live demo

Coming soon — deployment in progress.

## 📄 License

MIT — see [LICENSE](LICENSE).
