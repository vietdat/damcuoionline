import React, { useState, useEffect } from 'react';
import useWeddingStore from '../../store/useWeddingStore.js';
import soundManager from '../../audio/soundManager.js';
import { ArrowLeft, Volume2, VolumeX, Sparkles, Tv, Users, Beer } from 'lucide-react';

export function HallOverlay() {
  const {
    setScene,
    isMuted,
    toggleMute,
    guestName,
    tables,
    focusedTableId,
    clearFocusedTable,
    confirmEnterFocusedTable,
    setTikTokModalOpen,
    isTikTokConnected
  } = useWeddingStore();

  const [videoSoundOn, setVideoSoundOn] = useState(false);

  const focusedTable = tables.find((t) => t.id === focusedTableId);
  const occupiedCount = focusedTable ? focusedTable.seats.filter((s) => s.guest).length : 0;

  // Sync state with stage video element
  useEffect(() => {
    const checkVideoState = () => {
      const video = window.__stageVideoElement || document.getElementById('stage-wedding-video-element');
      if (video) {
        setVideoSoundOn(!video.muted && !video.paused);
      }
    };

    const interval = setInterval(checkVideoState, 500);
    return () => clearInterval(interval);
  }, []);

  const handleMuteToggle = () => {
    soundManager.toggleMute();
    toggleMute();
  };

  const handleBackToLobby = () => {
    soundManager.playClick();
    clearFocusedTable();
    setScene(1);
  };

  const handleToggleVideoSound = () => {
    soundManager.playClick();
    const video = window.__stageVideoElement || document.getElementById('stage-wedding-video-element');
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
      }
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      video.volume = 0.9;
      setVideoSoundOn(!nextMuted);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 sm:p-4 md:p-6 z-20 overflow-hidden">
      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex items-center justify-between pointer-events-auto gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleBackToLobby}
            className="h-9 sm:h-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 sm:px-3.5 rounded-full border border-slate-700 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-white transition shadow-lg active:scale-95 cursor-pointer shrink-0"
            title="Quay lại phòng thay đồ"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Đổi Trang Phục</span>
          </button>

          {guestName && (
            <div className="h-9 sm:h-10 bg-slate-900/90 backdrop-blur-md px-3 sm:px-3.5 rounded-full border border-amber-500/30 text-xs text-amber-200/90 font-medium hidden sm:flex items-center gap-1.5 shadow-lg">
              <span>Khách:</span>
              <strong className="text-white font-bold">{guestName}</strong>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* TikTok Live Interactive Control */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setTikTokModalOpen(true);
            }}
            className={`h-9 sm:h-10 flex items-center gap-1.5 px-3 sm:px-3.5 rounded-full text-xs font-bold transition shadow-lg border active:scale-95 cursor-pointer shrink-0 ${
              isTikTokConnected
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white border-pink-300 shadow-pink-500/30 animate-pulse'
                : 'bg-slate-900/90 text-pink-300 border-slate-700 hover:border-pink-400'
            }`}
            title="Đấu nối TikTok Live Interactive"
          >
            <span className={`w-2 h-2 rounded-full ${isTikTokConnected ? 'bg-white' : 'bg-pink-400 animate-ping'}`} />
            <span className="hidden sm:inline">TikTok Live</span>
            <span className="sm:hidden font-black text-[11px]">LIVE</span>
          </button>

          {/* Quick Stage Video Sound Control in Header */}
          <button
            type="button"
            onClick={handleToggleVideoSound}
            className={`h-9 sm:h-10 flex items-center gap-1.5 px-3 sm:px-3.5 rounded-full text-xs font-bold transition shadow-lg border active:scale-95 cursor-pointer shrink-0 ${
              videoSoundOn
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30'
                : 'bg-slate-900/90 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
            title="Bật/Tắt tiếng video sân khấu"
          >
            <Tv className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">
              {videoSoundOn ? 'Tiếng Video: BẬT 🔊' : 'Bật Tiếng Video 🔇'}
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={handleMuteToggle}
            className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition shadow-lg active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
            title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* ================= BOTTOM AREA: FOCUSED TABLE ACTION CARD OR HINT ================= */}
      <div className="w-full max-w-md mx-auto pointer-events-auto pb-1">
        {focusedTable ? (
          <div className="bg-slate-950/90 backdrop-blur-2xl p-3 sm:p-3.5 rounded-[26px] border-2 border-amber-400 shadow-2xl shadow-black/80 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Table Details Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-black text-white drop-shadow truncate max-w-[150px] sm:max-w-[200px]">
                  {focusedTable.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <span>🍻</span>
                  <span>{focusedTable.cheersCount || 0} ly</span>
                </span>
                <span className="bg-slate-800 text-slate-300 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>{occupiedCount}/6</span>
                </span>
              </div>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              {/* Button: Change table / Zoom out */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  clearFocusedTable();
                }}
                className="flex-1 py-2 sm:py-2.5 px-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 text-xs font-bold transition shadow active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                title="Lùi lại góc nhìn sảnh tổng quan"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span className="whitespace-nowrap">Đổi Bàn Khác</span>
              </button>

              {/* Button: Enter Banquet Table (Hero Golden CTA) */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  confirmEnterFocusedTable();
                }}
                className="flex-[1.5] py-2 sm:py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-200 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 border-2 border-white active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 group"
                title="Bắt đầu ngồi vào bàn tiệc này"
              >
                <Sparkles className="w-4 h-4 text-slate-950 shrink-0 group-hover:rotate-12 transition-transform" />
                <span className="tracking-wide uppercase whitespace-nowrap">VÀO MÂM TIỆC 🍻</span>
              </button>
            </div>
          </div>
        ) : (
          /* Subtle Ambient Hint Pill when in Overview Mode */
          <div className="self-center bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-amber-500/30 text-amber-200/90 text-[11px] sm:text-xs font-bold shadow-xl flex items-center justify-center gap-2 animate-pulse mx-auto w-fit">
            <span>💡</span>
            <span>Chạm vào bàn bất kỳ để bước lại gần bàn tiệc</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default HallOverlay;
