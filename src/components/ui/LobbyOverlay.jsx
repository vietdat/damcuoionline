import React, { useState } from 'react';
import NameInputModal from './NameInputModal.jsx';
import OutfitSelector from './OutfitSelector.jsx';
import AccessorySelector from './AccessorySelector.jsx';
import EnterButton from './EnterButton.jsx';
import useWeddingStore from '../../store/useWeddingStore.js';
import soundManager from '../../audio/soundManager.js';
import {
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Shirt,
  Glasses,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';

export function LobbyOverlay() {
  const { isMuted, toggleMute } = useWeddingStore();
  const [mobileTab, setMobileTab] = useState('name'); // 'name', 'outfit', 'accessory'
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);

  const handleMuteToggle = () => {
    soundManager.toggleMute();
    toggleMute();
  };

  const handleTabChange = (tab) => {
    soundManager.playClick();
    setMobileTab(tab);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-20 overflow-hidden">
      {/* ================= TOP LEFT: WEDDING BANNER ================= */}
      <div className="flex items-start justify-between md:justify-start gap-4 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-xl max-w-[280px] md:max-w-md">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Tiệc Cưới Trực Tuyến</span>
          </div>
          <h2 className="text-base md:text-xl font-extrabold text-white leading-tight mt-0.5">
            Quang Trung & Thúy Lan
          </h2>
          <p className="text-[11px] text-amber-200/70">
            Ngày 08/11/2026 • Hôn Lễ Trực Tuyến 3D
          </p>
        </div>

        {/* Audio Mute Toggle */}
        <button
          type="button"
          onClick={handleMuteToggle}
          className="bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition shadow-lg pointer-events-auto"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
        </button>
      </div>

      {/* ================= 360° ROTATION HINT ================= */}
      <div className="pointer-events-none text-center self-center md:self-auto md:absolute md:bottom-6 md:left-[28%] md:-translate-x-1/2">
        <p className="text-[11px] md:text-xs text-amber-200/80 bg-slate-900/80 backdrop-blur px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-lg inline-flex items-center gap-1.5">
          <span>👆</span>
          <span>Vuốt chuột / ngón tay để xoay 360° nhân vật</span>
        </p>
      </div>

      {/* ================= DESKTOP LAYOUT (SIDEBAR TRÊN BÊN PHẢI) ================= */}
      <div className="hidden md:flex md:absolute md:right-6 md:top-6 md:bottom-6 md:w-[420px] flex-col justify-between bg-slate-950/80 backdrop-blur-xl p-4 rounded-3xl border border-amber-500/30 shadow-2xl pointer-events-auto overflow-hidden">
        <div className="space-y-3 overflow-y-auto pr-1">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <span>🎭</span> Tùy Biến Khách Mời
            </h3>
            <p className="text-[11px] text-slate-400">Chọn tên, lên đồ chuẩn bị vào ăn cỗ</p>
          </div>

          <NameInputModal />
          <OutfitSelector />
          <AccessorySelector />
        </div>

        {/* Enter Button pinned at bottom */}
        <div className="pt-3 border-t border-slate-800/80">
          <EnterButton />
        </div>
      </div>

      {/* ================= MOBILE LAYOUT (COLLAPSIBLE / EXPANDABLE) ================= */}
      <div className="md:hidden w-full max-w-md mx-auto pointer-events-auto pb-1 flex flex-col items-center">
        {/* Collapse / Expand Toggle Handle */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setIsFormCollapsed(!isFormCollapsed);
          }}
          className={`mb-1.5 px-3.5 py-1 rounded-full border shadow-lg flex items-center gap-1.5 text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
            isFormCollapsed
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-white shadow-amber-500/40 animate-pulse font-extrabold'
              : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-500/40 backdrop-blur-md'
          }`}
          title={isFormCollapsed ? 'Mở bảng chọn đồ' : 'Thu gọn bảng để ngắm trọn vẹn 3D'}
        >
          {isFormCollapsed ? (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-950" />
              <span>Mở Bảng Chọn Đồ</span>
              <ChevronUp className="w-3.5 h-3.5 text-slate-950" />
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Thu Gọn Để Ngắm 3D</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
            </>
          )}
        </button>

        {/* Collapsible Form Container (Tabs + Content) */}
        <div
          className={`w-full transition-all duration-300 ease-in-out overflow-hidden space-y-2 ${
            isFormCollapsed ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[300px] opacity-100'
          }`}
        >
          {/* Mobile Tab Switcher */}
          <div className="flex bg-slate-900/90 backdrop-blur p-1 rounded-xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => handleTabChange('name')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                mobileTab === 'name' ? 'bg-amber-500 text-slate-900 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Tên</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('outfit')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                mobileTab === 'outfit' ? 'bg-amber-500 text-slate-900 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Đồ Tiệc</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('accessory')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                mobileTab === 'accessory' ? 'bg-amber-500 text-slate-900 shadow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Glasses className="w-3.5 h-3.5" />
              <span>Phụ Kiện</span>
            </button>
          </div>

          {/* Tab Content (Only 1 active card) */}
          <div className="max-h-[195px] overflow-y-auto">
            {mobileTab === 'name' && <NameInputModal />}
            {mobileTab === 'outfit' && <OutfitSelector />}
            {mobileTab === 'accessory' && <AccessorySelector />}
          </div>
        </div>

        {/* Enter Button (Always accessible) */}
        <div className="w-full mt-2">
          <EnterButton />
        </div>
      </div>
    </div>
  );
}

export default LobbyOverlay;
