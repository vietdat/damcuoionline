import React from 'react';
import useWeddingStore from '../../store/useWeddingStore.js';
import soundManager from '../../audio/soundManager.js';
import { ArrowRight, PartyPopper } from 'lucide-react';

export function EnterButton() {
  const { guestName, enterWeddingHall } = useWeddingStore();

  const handleEnter = () => {
    // Validate name
    if (!guestName || guestName.trim() === '') {
      alert('Vui lòng nhập tên của bạn trước khi vào tiệc nhé!');
      return;
    }

    // Unlock Web Audio & play celebration fanfare
    soundManager.unlockAudio();
    soundManager.playEnterFanfare();

    // Trigger video playback under authorized user gesture
    const video = document.getElementById('stage-wedding-video-element');
    if (video) {
      video.play().catch(() => {});
    }

    // Advance to Scene 2
    enterWeddingHall();
  };

  return (
    <button
      type="button"
      onClick={handleEnter}
      className="w-full relative group overflow-hidden bg-gradient-to-r from-red-600 via-amber-500 to-red-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-red-900/40 border border-amber-300/40 flex items-center justify-center gap-2 text-base transition-all duration-300 active:scale-95 cursor-pointer"
    >
      <PartyPopper className="w-5 h-5 text-amber-200 animate-bounce" />
      <span className="tracking-wide uppercase text-sm md:text-base font-extrabold text-amber-50 drop-shadow">
        BƯỚC VÀO TIỆC CƯỚI
      </span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export default EnterButton;
