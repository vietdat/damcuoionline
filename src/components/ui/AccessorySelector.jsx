import React from 'react';
import useWeddingStore, { ACCESSORIES } from '../../store/useWeddingStore.js';
import { Glasses, Wine, Flower2, CircleOff } from 'lucide-react';
import soundManager from '../../audio/soundManager.js';

export function AccessorySelector() {
  const { selectedAccessory, setSelectedAccessory } = useWeddingStore();

  const handleSelect = (id) => {
    soundManager.playClick();
    setSelectedAccessory(id);
  };

  const getIcon = (id) => {
    switch (id) {
      case 'kinh_ram':
        return <Glasses className="w-3.5 h-3.5 text-amber-300" />;
      case 'hoa_cuoi':
        return <Flower2 className="w-3.5 h-3.5 text-pink-400" />;
      case 'ly_bia':
        return <Wine className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <CircleOff className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/85 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 shadow-2xl space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
        <Glasses className="w-3.5 h-3.5 text-amber-400" />
        Phụ kiện đi kèm:
      </label>

      <div className="flex flex-wrap gap-1.5">
        {ACCESSORIES.map((item) => {
          const isSelected = selectedAccessory === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl font-medium transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-900 font-bold shadow-md shadow-amber-900/40 scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
              }`}
            >
              {getIcon(item.id)}
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AccessorySelector;
