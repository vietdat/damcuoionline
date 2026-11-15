import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  Tv,
  MessageSquare,
  Heart,
  Gift,
  Sparkles,
  Users,
  Play,
  Square,
  AlertCircle,
  HelpCircle,
  Minimize2,
  Maximize2,
  Eye
} from 'lucide-react';
import useWeddingStore from '../../store/useWeddingStore.js';
import socketService from '../../services/socketService.js';
import soundManager from '../../audio/soundManager.js';

export function TikTokLiveModal() {
  const {
    isTikTokModalOpen,
    setTikTokModalOpen,
    isTikTokConnected,
    tikTokUsername,
    tikTokViewerCount,
    tikTokEventsLog,
    focusTableOnly,
    clearFocusedTable,
    setScene
  } = useWeddingStore();

  const [activeTab, setActiveTab] = useState('simulator'); // Default to simulator so user can test immediately!
  const [usernameInput, setUsernameInput] = useState(tikTokUsername || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Sync initial status when modal opens & strictly ensure we are in Hall Scene (Scene 2)
  useEffect(() => {
    if (isTikTokModalOpen) {
      // Return to Hall Scene (Scene 2) as requested: only view Hall Scene on TikTok Live!
      setScene(2);

      socketService.getTikTokStatus((status) => {
        if (status) {
          useWeddingStore.getState().setTikTokStatus(status);
          if (status.uniqueId) setUsernameInput(status.uniqueId);
        }
      });
    }
  }, [isTikTokModalOpen, setScene]);

  if (!isTikTokModalOpen) return null;

  const handleConnect = (e) => {
    e.preventDefault();
    const cleaned = usernameInput.trim().replace(/^@/, '');
    if (!cleaned) {
      setErrorMsg('Vui lòng nhập TikTok Username (ví dụ: damcuoionline)');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    soundManager.playClick();

    socketService.connectTikTok(cleaned, (res) => {
      setIsLoading(false);
      if (res && res.success) {
        setSuccessMsg(`Đã kết nối thành công phòng live @${cleaned}!`);
      } else {
        setErrorMsg(res?.error || 'Không thể kết nối. Hãy chắc chắn rằng bạn đang BẬT LIVE trên TikTok!');
      }
    });
  };

  const handleDisconnect = () => {
    setIsLoading(true);
    soundManager.playClick();
    socketService.disconnectTikTok(() => {
      setIsLoading(false);
      setSuccessMsg('Đã ngắt kết nối TikTok Live.');
    });
  };

  const handleSimulate = (type, payload = {}) => {
    soundManager.playClick();

    // 1. Khóa chặt ở Giao Diện Sảnh (Scene 2) cho TikTok Live!
    setScene(2);

    // 2. Luôn giữ góc nhìn TOÀN CẢNH (Panoramic View) để người xem thấy trọn vẹn cả cổng, 12 bàn và sân khấu!
    clearFocusedTable();

    // 3. Gửi sự kiện giả lập đến server
    socketService.simulateTikTokEvent(type, payload);

    if (type === 'member') {
      soundManager.playClick();
      setFeedback({
        type: 'success',
        icon: '🚶',
        text: `Khách mới vừa vào phòng và đứng chờ tại Cổng Đón Khách!`
      });
    } else if (type === 'chat_table') {
      const tid = payload.tableId || 1;
      soundManager.playChatPop();
      setFeedback({
        type: 'success',
        icon: '🪑',
        text: `Khách TikTok gõ #ban${tid}: Nhân vật đang bước dọc thảm đỏ vào Bàn ${tid}!`
      });
    } else if (type === 'chat_wish') {
      soundManager.playChatPop();
      setFeedback({
        type: 'success',
        icon: '💬',
        text: `Đã gửi lời chúc: Bong bóng thoại 3D vừa hiện trên bàn tiệc!`
      });
    } else if (type === 'like') {
      soundManager.playCheersChant();
      setFeedback({
        type: 'success',
        icon: '❤️',
        text: `Đã thả 30 tim! Cả bàn tiệc cùng nâng cốc cụng ly hô "1, 2, 3 DÔ 🍻"!`
      });
    } else if (type === 'gift_rose') {
      soundManager.playClick();
      setFeedback({
        type: 'success',
        icon: '🌹',
        text: `Đã tặng Hoa Hồng! Tự động dọn thêm 1 món ăn thịnh soạn lên mâm.`
      });
    } else if (type === 'gift_vip') {
      soundManager.playFireworks();
      setFeedback({
        type: 'vip',
        icon: '🎆',
        text: `ĐẠI GIA TẶNG PHÁO HOA VIP! Pháo hoa 3D đang nổ rực sáng trên sân khấu chính!`
      });
    }

    // Tự động đóng modal ngay lập tức để user chiêm ngưỡng toàn bộ chuyển động và hiệu ứng 3D ở Sảnh Cưới!
    setTikTokModalOpen(false);
  };

  /* ================= 1. COMPACT FLOATING DOCK MODE (THU NHỎ GÓC MÀN HÌNH ĐỂ XEM SẢNH TIỆC 3D) ================= */
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 pointer-events-auto bg-slate-950/95 backdrop-blur-2xl border-2 border-amber-400 p-2.5 sm:p-3 rounded-2xl shadow-2xl flex flex-col gap-2 max-w-[96vw] sm:max-w-md animate-in slide-in-from-bottom-5 duration-200">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5 px-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
            <span>🧪</span>
            <span>TEST TIKTOK LIVE (TRỰC TIẾP TRÊN SẢNH)</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              title="Phóng to bảng điều khiển"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTikTokModalOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              title="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Feedback Toast in Compact Mode */}
        {feedback && (
          <div className="bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/60 p-1.5 rounded-lg text-[10.5px] font-bold text-amber-200 flex items-center gap-1.5 animate-in fade-in">
            <span>{feedback.icon}</span>
            <span className="truncate">{feedback.text}</span>
          </div>
        )}

        {/* Quick Test Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleSimulate('member')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition shadow"
          >
            🚶 Vào Cổng
          </button>
          <button
            onClick={() => handleSimulate('chat_table', { tableId: 1 })}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition shadow"
          >
            🪑 Vào Bàn 1
          </button>
          <button
            onClick={() => handleSimulate('chat_table', { tableId: 2 })}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition shadow"
          >
            🪑 Vào Bàn 2
          </button>
          <button
            onClick={() => handleSimulate('chat_wish')}
            className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-400/40 font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition"
          >
            💬 Chat
          </button>
          <button
            onClick={() => handleSimulate('like', { count: 30 })}
            className="bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-400/40 font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition"
          >
            ❤️ 30 Tim
          </button>
          <button
            onClick={() => handleSimulate('gift_vip')}
            className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-black text-[11px] px-3 py-1.5 rounded-lg shadow-lg shadow-pink-500/30 active:scale-95 transition animate-pulse"
          >
            🎆 Pháo Hoa VIP
          </button>
        </div>
      </div>
    );
  }

  /* ================= 2. EXPANDED FULL MODAL MODE ================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900/95 border-2 border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-pink-500/20 text-white font-black text-xs">
              LIVE
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 leading-none">
                <span>ĐẤU NỐI TIKTOK LIVE</span>
                {isTikTokConnected ? (
                  <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/40 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    LIVE
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full border border-slate-700">
                    Chưa kết nối
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Biến bình luận, tim & quà TikTok thành hành động 3D trong sảnh cưới
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Thu nhỏ để xem sảnh tiệc 3D"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTikTokModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-slate-950/60 p-1 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('simulator');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'simulator'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🧪 Trình Giả Lập Test</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('live');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'live'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>🔴 Kết Nối Thật</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'simulator' ? (
            /* TAB 2: TRÌNH GIẢ LẬP TEST (SIMULATOR) */
            <div className="space-y-3.5">
              {/* Feedback Alert Box when an action is clicked */}
              {feedback ? (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2.5 animate-in zoom-in-95 duration-200 ${
                    feedback.type === 'vip'
                      ? 'bg-gradient-to-r from-pink-950/90 to-purple-950/90 border-pink-400/80 text-pink-200'
                      : 'bg-gradient-to-r from-emerald-950/90 to-slate-950/90 border-emerald-400/80 text-emerald-200'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{feedback.icon}</span>
                  <div className="flex-1">
                    <div className="font-black text-white text-xs">{feedback.text}</div>
                    <div className="text-[10.5px] opacity-80 mt-1 flex items-center gap-1">
                      <span>💡</span>
                      <span>Bấm nút <strong>"Thu Nhỏ Bảng"</strong> bên dưới để xem trực tiếp sảnh cưới!</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-200 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-black text-amber-300">🧪 CHẾ ĐỘ GIẢ LẬP TEST:</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Bấm các nút dưới đây để mô phỏng tương tác của người xem trên TikTok.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-[11px] shrink-0 shadow transition active:scale-95"
                    title="Thu nhỏ để xem 3D"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Thu Nhỏ Bảng</span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleSimulate('member')}
                  className="bg-emerald-950/80 hover:bg-emerald-900/90 hover:border-emerald-400 border border-emerald-500/50 text-white p-3 rounded-xl font-bold flex flex-col items-center gap-1 text-center transition-all active:scale-95 shadow"
                >
                  <span className="text-xl">🚶</span>
                  <span className="text-emerald-300">1. Khách Vào Đứng Cổng</span>
                  <span className="text-[10px] text-slate-400 font-normal">Chờ tại Bục Đón Khách</span>
                </button>

                <button
                  onClick={() => handleSimulate('chat_table', { tableId: 1 })}
                  className="bg-slate-800 hover:bg-slate-700 hover:border-amber-400 border border-slate-700 text-white p-3 rounded-xl font-bold flex flex-col items-center gap-1 text-center transition-all active:scale-95 shadow"
                >
                  <span className="text-xl">🪑</span>
                  <span className="text-amber-300">2. Bước Vào Bàn 1</span>
                  <span className="text-[10px] text-slate-400 font-normal">Đi dọc thảm đỏ vào Bàn 1</span>
                </button>

                <button
                  onClick={() => handleSimulate('chat_table', { tableId: 2 })}
                  className="bg-slate-800 hover:bg-slate-700 hover:border-amber-400 border border-slate-700 text-white p-3 rounded-xl font-bold flex flex-col items-center gap-1 text-center transition-all active:scale-95 shadow"
                >
                  <span className="text-xl">🪑</span>
                  <span className="text-amber-300">3. Bước Vào Bàn 2</span>
                  <span className="text-[10px] text-slate-400 font-normal">Đi dọc thảm đỏ vào Bàn 2</span>
                </button>

                <button
                  onClick={() => handleSimulate('chat_wish')}
                  className="bg-slate-800 hover:bg-slate-700 hover:border-sky-400 border border-slate-700 text-white p-3 rounded-xl font-bold flex flex-col items-center gap-1 text-center transition-all active:scale-95 shadow"
                >
                  <span className="text-xl">💬</span>
                  <span className="text-sky-300">4. Chat Lời Chúc</span>
                  <span className="text-[10px] text-slate-400 font-normal">Hiện bóng thoại 3D</span>
                </button>

                <button
                  onClick={() => handleSimulate('like', { count: 30 })}
                  className="bg-slate-800 hover:bg-slate-700 hover:border-rose-400 border border-slate-700 text-white p-3 rounded-xl font-bold flex flex-col items-center gap-1 text-center transition-all active:scale-95 shadow"
                >
                  <span className="text-xl">❤️</span>
                  <span className="text-rose-300">5. Thả 30 Tim</span>
                  <span className="text-[10px] text-slate-400 font-normal">Cụng ly 1, 2, 3 DÔ 🍻</span>
                </button>

                <button
                  onClick={() => handleSimulate('gift_vip', { giftName: 'Pháo Hoa Cưới 🎆' })}
                  className="bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-purple-900/80 hover:from-purple-800 hover:to-pink-800 border-2 border-pink-400 text-white p-3 rounded-xl font-black flex flex-col items-center gap-1 text-center transition-all shadow-xl shadow-pink-500/20 active:scale-95"
                >
                  <span className="text-xl animate-bounce">🎆</span>
                  <span className="text-yellow-300">6. Tặng Pháo Hoa VIP</span>
                  <span className="text-[10px] text-pink-200 font-bold">Nổ pháo hoa sân khấu!</span>
                </button>
              </div>

              {/* Event Log shown in Simulator tab too! */}
              <div>
                <div className="text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Nhật Ký Tương Tác Vừa Chạy:</span>
                  <span className="text-[10px] text-slate-500">{tikTokEventsLog.length} sự kiện</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-2.5 h-28 overflow-y-auto space-y-1 border border-white/5 font-mono text-[11px]">
                  {tikTokEventsLog.length === 0 ? (
                    <div className="text-center text-slate-600 py-6 text-[11px]">
                      Chưa có sự kiện nào. Bấm thử các nút phía trên để xem nhật ký xuất hiện!
                    </div>
                  ) : (
                    tikTokEventsLog.map((ev, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                        {ev.type === 'join' && <span className="text-amber-400 font-bold">🪑 [Vào Bàn]</span>}
                        {ev.type === 'chat' && <span className="text-sky-400 font-bold">💬 [Chat]</span>}
                        {ev.type === 'like' && <span className="text-rose-400 font-bold">❤️ [Tim]</span>}
                        {ev.type === 'gift' && <span className="text-yellow-400 font-bold">🎁 [Quà]</span>}
                        {ev.type === 'vip_gift' && <span className="text-purple-400 font-bold">🎆 [VIP]</span>}
                        {ev.type === 'member' && <span className="text-emerald-400 font-bold">🎉 [Vào]</span>}
                        <span className="text-white font-semibold">{ev.user}:</span>
                        <span className="text-slate-400 truncate">{ev.message || ev.text || ev.giftName}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 1: KẾT NỐI LIVE THẬT */
            <div className="space-y-4">
              {/* Form Connect */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/10 space-y-3">
                <label className="block text-slate-300 font-bold">
                  Nhập TikTok Username (ID kênh của bạn):
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</span>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="vd: damcuoionline"
                      disabled={isTikTokConnected || isLoading}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-white font-semibold placeholder:text-slate-600 focus:outline-none focus:border-amber-400 disabled:opacity-60"
                    />
                  </div>
                  {isTikTokConnected ? (
                    <button
                      onClick={handleDisconnect}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Ngắt Kết Nối</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleConnect}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isLoading ? 'Đang kết nối...' : 'Bắt Đầu'}</span>
                    </button>
                  )}
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-1.5 text-red-400 text-[11px] bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="text-emerald-400 text-[11px] bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    {successMsg}
                  </div>
                )}
              </div>

              {/* Status Stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Mắt Xem Trực Tiếp</div>
                    <div className="text-sm font-black text-white">{tikTokViewerCount}</div>
                  </div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Trạng Thái Sảnh</div>
                    <div className="text-sm font-black text-emerald-400">
                      {isTikTokConnected ? 'Đang Nghe Live' : 'Sẵn Sàng'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Streamer Golden Rule Tip */}
              <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-3 text-amber-200/90 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Bí quyết Livestream không bị vi phạm TikTok:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[10.5px]">
                  <li>Luôn <strong>bật Micro nói chuyện</strong> (MC dẫn dắt, đọc to tên người xem khi họ bước vào bàn).</li>
                  <li>Dùng <strong>TikTok Live Studio</strong> hoặc <strong>OBS</strong> chiếu cửa sổ web này (khung dọc 9:16).</li>
                  <li>Nhắc người xem: Gõ <strong>#ban1</strong> đến <strong>#ban12</strong> để chọn bàn tiệc!</li>
                </ul>
              </div>

              {/* Realtime Event Log */}
              <div>
                <div className="text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Nhật Ký Tương Tác Trực Tiếp:</span>
                  <span className="text-[10px] text-slate-500">{tikTokEventsLog.length} sự kiện</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-2.5 h-36 overflow-y-auto space-y-1.5 border border-white/5 font-mono text-[11px]">
                  {tikTokEventsLog.length === 0 ? (
                    <div className="text-center text-slate-600 py-8 text-[11px]">
                      Chưa có sự kiện nào. Hãy kết nối hoặc chuyển sang tab "Trình Giả Lập Test" để thử nghiệm!
                    </div>
                  ) : (
                    tikTokEventsLog.map((ev, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                        {ev.type === 'join' && <span className="text-amber-400 font-bold">🪑 [Vào Bàn]</span>}
                        {ev.type === 'chat' && <span className="text-sky-400 font-bold">💬 [Chat]</span>}
                        {ev.type === 'like' && <span className="text-rose-400 font-bold">❤️ [Tim]</span>}
                        {ev.type === 'gift' && <span className="text-yellow-400 font-bold">🎁 [Quà]</span>}
                        {ev.type === 'vip_gift' && <span className="text-purple-400 font-bold">🎆 [VIP]</span>}
                        {ev.type === 'member' && <span className="text-emerald-400 font-bold">🎉 [Vào]</span>}
                        <span className="text-white font-semibold">{ev.user}:</span>
                        <span className="text-slate-400 truncate">{ev.message || ev.text || ev.giftName}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TikTokLiveModal;
