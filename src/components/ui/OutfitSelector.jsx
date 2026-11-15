import React from 'react';
import useWeddingStore, { OUTFITS } from '../../store/useWeddingStore.js';
import { Shirt, Sparkles } from 'lucide-react';
import soundManager from '../../audio/soundManager.js';

export function OutfitSelector() {
  const { selectedOutfit, setSelectedOutfit } = useWeddingStore();

  const handleSelect = (id) => {
    soundManager.playClick();
    setSelectedOutfit(id);
  };

  return (
    <div className="bg-slate-900/85 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-2xl space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
          <Shirt className="w-3.5 h-3.5 text-amber-400" />
          Chọn đồ lên tiệc cưới:
        </label>
        <span className="text-[10px] text-amber-200/70 flex items-center gap-0.5">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          Xoay 3D để ngắm
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {OUTFITS.map((item) => {
          const isSelected = selectedOutfit === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600/90 to-amber-600/90 border border-amber-300 shadow-md scale-[1.02]'
                  : 'bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700/80'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 shadow-inner border border-white/20"
                style={{ backgroundColor: item.color }}
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                <p className="text-[10px] text-slate-300 truncate">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OutfitSelector;
