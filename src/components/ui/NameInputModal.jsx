import React from 'react';
import useWeddingStore, { ROLES } from '../../store/useWeddingStore.js';
import { User, Tag, Sparkles } from 'lucide-react';
import soundManager from '../../audio/soundManager.js';

export function NameInputModal() {
  const { guestName, guestRole, guestGender, setGuestName, setGuestRole, setGuestGender } = useWeddingStore();

  const handleGenderChange = (gender) => {
    soundManager.playClick();
    setGuestGender(gender);
  };

  const handleRoleChange = (role) => {
    soundManager.playClick();
    setGuestRole(role);
  };

  return (
    <div className="bg-slate-900/85 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-2xl space-y-3">
      {/* Gender Switcher (Nam / Nữ) */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Giới tính & Kiểu tóc:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleGenderChange('male')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              guestGender === 'male'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40 border border-blue-400 scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
            }`}
          >
            <span className="text-sm">👦</span>
            <span>Khách Nam (Tóc ngắn)</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenderChange('female')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              guestGender === 'female'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-900/40 border border-pink-400 scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
            }`}
          >
            <span className="text-sm">👧</span>
            <span>Khách Nữ (Tóc dài)</span>
          </button>
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-1.5">
          <User className="w-3.5 h-3.5 text-amber-400" />
          Tên hoặc Biệt danh của bạn:
        </label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Nhập tên của bạn (vd: Tuấn Híp, Lan FA)..."
          maxLength={25}
          className="w-full bg-slate-800/90 text-white placeholder-slate-400 px-3.5 py-2 text-sm rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          Bạn là gì của Dâu - Rể?
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((role) => {
            const isSelected = guestRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-900/40 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NameInputModal;
