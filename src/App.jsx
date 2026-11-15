import React, { useEffect } from 'react';
import WeddingCanvas from './components/3d/WeddingCanvas.jsx';
import LobbyOverlay from './components/ui/LobbyOverlay.jsx';
import HallOverlay from './components/ui/HallOverlay.jsx';
import TableOverlay from './components/ui/TableOverlay.jsx';
import TikTokLiveModal from './components/ui/TikTokLiveModal.jsx';
import useWeddingStore from './store/useWeddingStore.js';

export function App() {
  const { currentScene, initSocket, isSocketConnected, activeLiveBanner } = useWeddingStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* Realtime Connection Status Pill (Placed bottom-left to prevent header collision) */}
      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-30 pointer-events-none">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow border transition-all ${
            isSocketConnected
              ? 'bg-slate-900/80 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-900/80 text-slate-400 border-slate-700/60'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSocketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          <span>{isSocketConnected ? 'Realtime Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Realtime TikTok Live Event Floating Banner */}
      {activeLiveBanner && (
        <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-[70] pointer-events-none animate-in slide-in-from-top-4 fade-in duration-300 max-w-[90vw]">
          <div className="bg-gradient-to-r from-slate-950/95 via-purple-950/95 to-slate-950/95 border-2 border-pink-400 shadow-2xl px-4 py-2 rounded-full flex items-center gap-2 text-xs sm:text-sm font-black text-white backdrop-blur-md whitespace-nowrap animate-bounce">
            <span className="text-base">✨</span>
            <span className="text-yellow-300">{activeLiveBanner.message || activeLiveBanner.text}</span>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas Layer */}
      <WeddingCanvas />

      {/* 2D UI Overlay Layers corresponding to current scene */}
      {currentScene === 1 && <LobbyOverlay />}
      {currentScene === 2 && <HallOverlay />}
      {currentScene === 3 && <TableOverlay />}

      {/* TikTok Live Interactive Modal (Global Dialog) */}
      <TikTokLiveModal />
    </main>
  );
}

export default App;
