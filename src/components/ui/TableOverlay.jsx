import React, { useState, useEffect } from 'react';
import useWeddingStore from '../../store/useWeddingStore.js';
import soundManager from '../../audio/soundManager.js';
import socketService from '../../services/socketService.js';
import VietQRModal from './VietQRModal.jsx';
import CertificateModal from './CertificateModal.jsx';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Beer,
  Utensils,
  Gift,
  Sparkles,
  Pencil,
  Check,
  X,
  Tag,
  MessageCircle,
  Send,
  Award
} from 'lucide-react';

const SUGGESTED_NAMES = [
  'Hội Bạn Thân',
  'Đồng Nghiệp IT',
  'Team FA Săn Vía',
  'Người Yêu Cũ 💔',
  'Mâm Nhậu Tới Bến 🍻',
  'Hội Bạn Cấp 3',
  'Bà Con Họ Hàng',
  'Hội Gen Z Quậy Cỗ'
];

export function TableOverlay() {
  const {
    tables,
    selectedTableId,
    setScene,
    isMuted,
    toggleMute,
    fullnessLevel,
    serveNextDish,
    triggerCheers,
    setQRModalOpen,
    isCheersTriggered,
    cheersPhase,
    updateTableName,
    sendTableMessage,
    setTikTokModalOpen,
    isTikTokConnected
  } = useWeddingStore();

  const currentTable = tables.find((t) => t.id === selectedTableId) || tables[0];
  const dishes = currentTable.dishes || [];
  const cheersCount = currentTable.cheersCount || 0;

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameInput, setEditNameInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCertificateOpen, setCertificateOpen] = useState(false);

  // Automatically mute stage video sound upon entering the banquet table
  useEffect(() => {
    const video = window.__stageVideoElement || document.getElementById('stage-wedding-video-element');
    if (video) {
      video.muted = true;
    }
  }, []);

  const handleBackToHall = () => {
    soundManager.playClick();
    socketService.leaveSeat();
    setScene(2);
  };

  const handleMuteToggle = () => {
    soundManager.toggleMute();
    toggleMute();
  };

  const handleClink = () => {
    soundManager.playCheersChant();
    triggerCheers();
  };

  const handleServe = () => {
    soundManager.playClick();
    serveNextDish();
  };

  const handleSendChat = (e) => {
    if (e) e.preventDefault();
    if (chatInput.trim()) {
      soundManager.playChatPop();
      sendTableMessage(chatInput.trim());
      setChatInput('');
      setIsChatOpen(false); // Auto-close to immediately view the 3D speech bubble above head
    }
  };

  const handleStartEditName = () => {
    soundManager.playClick();
    setEditNameInput(currentTable.name);
    setIsEditingName(true);
  };

  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    if (editNameInput.trim()) {
      soundManager.playClick();
      updateTableName(currentTable.id, editNameInput.trim());
    }
    setIsEditingName(false);
  };

  const handleSelectPreset = (name) => {
    setEditNameInput(name);
  };

  return (
    <>
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 sm:p-4 md:p-6 z-20 overflow-hidden">
        {/* ================= TOP HEADER (STREAMLINED LUXURY CAPSULES) ================= */}
        <div className="flex items-center justify-between pointer-events-auto gap-1.5 sm:gap-2">
          {/* Back to Hall button */}
          <button
            type="button"
            onClick={handleBackToHall}
            className="h-9 sm:h-10 flex items-center gap-1.5 bg-slate-950/85 hover:bg-slate-900 backdrop-blur-xl px-2.5 sm:px-3.5 rounded-full border border-slate-700/80 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-white transition shadow-xl active:scale-95 cursor-pointer shrink-0"
            title="Quay lại sảnh tiệc 3D"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Rời Bàn</span>
          </button>

          {/* Table Info & Cheers Pill Capsule (Click to Edit Name) */}
          <div className="h-9 sm:h-10 bg-slate-950/90 backdrop-blur-2xl px-2.5 sm:px-3.5 rounded-full border border-amber-400/50 shadow-2xl shadow-black/80 flex items-center gap-2 transition-all shrink-0">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1.5 h-full">
                <input
                  type="text"
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  maxLength={24}
                  autoFocus
                  placeholder="Nhập tên bàn..."
                  className="bg-slate-800/90 text-amber-200 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full border border-amber-400 focus:outline-none w-28 sm:w-40 text-center"
                />
                <button
                  type="submit"
                  className="p-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow transition cursor-pointer shrink-0"
                  title="Lưu tên bàn"
                >
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 shadow transition cursor-pointer shrink-0"
                  title="Hủy"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </form>
            ) : (
              <div
                onClick={handleStartEditName}
                className="group cursor-pointer flex items-center gap-2 h-full"
                title="Bấm để đổi tên bàn tiệc"
              >
                {/* Table Name */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400 shrink-0" />
                  <h2 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-200 transition tracking-wide drop-shadow truncate max-w-[85px] sm:max-w-[160px] whitespace-nowrap">
                    {currentTable.name}
                  </h2>
                  <Pencil className="w-3 h-3 text-amber-400/60 group-hover:text-amber-300 group-hover:scale-110 transition shrink-0" />
                </div>

                {/* Vertical Divider */}
                <div className="h-3.5 w-px bg-amber-500/30 shrink-0" />

                {/* Cheers Count Pill Tag (Strict Single Line) */}
                <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30 text-[10px] sm:text-xs font-black text-amber-300 shadow-sm shrink-0 whitespace-nowrap">
                  <span>🍻</span>
                  <span className="whitespace-nowrap">{cheersCount} ly</span>
                </div>
              </div>
            )}

            {/* Fullness Level Bar (Desktop) */}
            <div className="hidden md:flex items-center gap-2 border-l border-slate-700/80 pl-2.5 h-full">
              <span className="text-[10px] text-slate-400 font-bold">No:</span>
              <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${fullnessLevel}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">{fullnessLevel}%</span>
            </div>
          </div>

          {/* Header Action Buttons (TikTok Live + Thẻ Ăn Cỗ + Mute Toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
            {/* TikTok Live Interactive Control */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setTikTokModalOpen(true);
              }}
              className={`h-9 sm:h-10 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full text-xs font-bold transition shadow-lg border active:scale-95 cursor-pointer shrink-0 ${
                isTikTokConnected
                  ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white border-pink-300 shadow-pink-500/30 animate-pulse'
                  : 'bg-slate-950/85 hover:bg-slate-900 text-pink-300 border-slate-700/80 hover:border-pink-400'
              }`}
              title="Đấu nối TikTok Live Interactive"
            >
              <span className={`w-2 h-2 rounded-full ${isTikTokConnected ? 'bg-white' : 'bg-pink-400 animate-ping'}`} />
              <span className="hidden sm:inline">TikTok Live</span>
              <span className="sm:hidden font-black text-[11px]">LIVE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setCertificateOpen(true);
              }}
              className="h-9 sm:h-10 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs px-2.5 sm:px-3 rounded-full border border-white shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Nhận Thẻ VIP Ăn Cỗ Thế Kỷ"
            >
              <Award className="w-4 h-4 text-slate-950 shrink-0" />
              <span className="hidden sm:inline">Thẻ Ăn Cỗ</span>
            </button>

            <button
              type="button"
              onClick={handleMuteToggle}
              className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-950/85 hover:bg-slate-900 backdrop-blur-xl rounded-full border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition shadow-xl cursor-pointer flex items-center justify-center shrink-0"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips dropdown when editing name */}
        {isEditingName && (
          <div className="self-center pointer-events-auto bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-amber-400/60 shadow-2xl max-w-md -mt-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Gợi ý tên bàn nhanh:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_NAMES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl border transition cursor-pointer font-medium ${
                    editNameInput === preset
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                      : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Center Toast when Cheers is triggered (Matching uploaded audio: Hai ba Zô! Hai ba Zô! Hai ba Uống!) */}
        {isCheersTriggered && (
          <div className="self-center pointer-events-none transition-all duration-200">
            {cheersPhase === 1 && (
              <div className="animate-bounce bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 font-black text-lg md:text-xl px-5 py-2 rounded-full shadow-2xl border-2 border-white tracking-wider flex items-center gap-2">
                <span>HAI... BA...</span>
                <span className="text-red-700 bg-white px-2 py-0.5 rounded-lg uppercase font-black shadow">ZÔ! 🍻</span>
              </div>
            )}
            {cheersPhase === 2 && (
              <div className="animate-bounce bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white font-black text-lg md:text-xl px-5 py-2 rounded-full shadow-2xl border-2 border-yellow-300 tracking-wider flex items-center gap-2">
                <span>HAI... BA...</span>
                <span className="text-yellow-300 bg-red-800/90 px-2 py-0.5 rounded-lg uppercase font-black shadow animate-pulse">ZÔ! 🍻</span>
              </div>
            )}
            {cheersPhase === 3 && (
              <div className="animate-pulse scale-105 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white font-black text-xl md:text-2xl px-6 py-2.5 rounded-full shadow-2xl border-2 border-yellow-300 tracking-wider flex items-center gap-2.5">
                <span>HAI... BA...</span>
                <span className="text-yellow-300 bg-slate-950 px-2.5 py-0.5 rounded-xl uppercase font-black underline decoration-wavy decoration-yellow-400 shadow-xl">UỐNG! 🍻🎉</span>
              </div>
            )}
          </div>
        )}

        {/* ================= BOTTOM GROUP: CHAT INPUT (POPUP) + CAPSULE ACTION DOCK (OPTION 1) ================= */}
        <div className="w-full max-w-lg mx-auto pointer-events-auto space-y-2 pb-1 px-1">
          {/* Popup Chat Input Bar (Only visible when toggled open) */}
          {isChatOpen && (
            <form
              onSubmit={handleSendChat}
              className="flex items-center gap-2 bg-slate-950/95 backdrop-blur-2xl px-3.5 py-2 rounded-2xl border-2 border-amber-400 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="text-amber-400 pl-0.5">
                <MessageCircle className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                maxLength={80}
                autoFocus
                placeholder="Nhắn tin lên bóng chat trên đầu..."
                className="flex-1 bg-transparent text-white text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none py-1"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow cursor-pointer shrink-0 ${
                  chatInput.trim()
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 active:scale-95 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="Gửi tin nhắn"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                title="Đóng khung chat"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Unified Glassmorphism Capsule Dock (Option 1) */}
          <div className="bg-slate-950/85 backdrop-blur-2xl p-1 sm:p-1.5 rounded-full border border-amber-500/30 shadow-2xl shadow-black/80 flex items-center justify-between gap-1 sm:gap-2">
            {/* 1. Mâm Cỗ Pill */}
            {dishes.length < 6 ? (
              <button
                type="button"
                onClick={handleServe}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-200 border border-slate-700/80 hover:border-amber-400/80 shadow-md active:scale-95 transition-all cursor-pointer shrink-0 group"
                title="Dọn món tiếp theo lên mâm"
              >
                <Utensils className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-white group-hover:text-amber-200 whitespace-nowrap">
                  Món ({dishes.length}/6)
                </span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-md cursor-default shrink-0 opacity-95"
                title="Mâm cỗ đã đủ 6 món"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-emerald-200 whitespace-nowrap">
                  Đủ 6 Món
                </span>
              </button>
            )}

            {/* 2. CỤNG LY 🍻 Hero Gold Pill (Centerpiece - Protected from shrinking) */}
            <button
              type="button"
              onClick={handleClink}
              className="flex-1 min-w-[105px] sm:min-w-[130px] flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-200 hover:to-amber-400 text-slate-950 font-black shadow-xl shadow-amber-500/40 border-2 border-white/90 active:scale-95 transition-all cursor-pointer relative overflow-hidden group shrink-0"
              title="Cụng ly 1 2 3 Zô cùng cả bàn!"
            >
              {/* Shimmer light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              <Beer className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-950 shrink-0 group-hover:rotate-12 transition-transform" />
              <span className="text-[11px] sm:text-sm font-black uppercase tracking-wider drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] whitespace-nowrap">
                CỤNG LY 🍻
              </span>
            </button>

            {/* 3. Mừng Cưới 🧧 Pill */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setQRModalOpen(true);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold border border-yellow-300/60 shadow-lg shadow-red-950/40 active:scale-95 transition-all cursor-pointer shrink-0 group"
              title="Mừng cưới cô dâu chú rể qua VietQR"
            >
              <Gift className="w-3.5 h-3.5 text-yellow-300 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold text-amber-50 group-hover:text-yellow-200 whitespace-nowrap">
                Mừng Cưới
              </span>
            </button>

            {/* 4. Chat Pill Button (Seamlessly docked, toggles popup input) */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsChatOpen(!isChatOpen);
              }}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border shadow-md active:scale-95 transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                isChatOpen
                  ? 'bg-amber-400 text-slate-950 border-white shadow-amber-500/40'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white border-slate-700/80 hover:border-amber-400/80'
              }`}
              title={isChatOpen ? 'Đóng khung chat' : 'Nhắn tin chúc mừng'}
            >
              {isChatOpen ? (
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* VietQR Modal */}
      <VietQRModal />

      {/* Certificate Modal (Thẻ Chứng Nhận Ăn Cỗ) */}
      <CertificateModal isOpen={isCertificateOpen} onClose={() => setCertificateOpen(false)} />
    </>
  );
}

export default TableOverlay;
