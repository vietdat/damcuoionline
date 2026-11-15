import React from 'react';
import { Html } from '@react-three/drei';

/**
 * Redesigned TableLabel (Scene 2)
 * - Elevated to y = 2.15 so it never collides with guests or tablecloth
 * - Compact pill tag with subtle golden glow
 * - Controlled distanceFactor to prevent ballooning on zoom-out
 */
export function TableLabel({ name, clinks = 0, isHovered = false, isFocused = false }) {
  return (
    <Html position={[0, isFocused ? 2.35 : 2.15, 0]} center distanceFactor={9}>
      <div className={`pointer-events-none select-none transition-all duration-300 transform flex flex-col items-center ${
        isFocused ? 'scale-115 -translate-y-2' : isHovered ? 'scale-110 -translate-y-1' : 'scale-95'
      }`}>
        <div className={`backdrop-blur-xl px-3.5 py-1.5 rounded-full border-2 shadow-2xl flex items-center gap-2 whitespace-nowrap transition-all ${
          isFocused
            ? 'bg-amber-950/95 border-yellow-300 shadow-amber-400/60 ring-4 ring-amber-400/30'
            : 'bg-slate-950/95 border-amber-400 shadow-amber-500/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isFocused ? 'bg-yellow-300' : 'bg-emerald-400'} animate-pulse shadow-sm`} />
          <span className={`text-xs font-black tracking-wide drop-shadow ${isFocused ? 'text-amber-200' : 'text-white'}`}>
            {name}
          </span>
          <span className="text-[10px] text-slate-950 font-black bg-gradient-to-r from-amber-400 to-yellow-300 px-2 py-0.5 rounded-full shadow">
            {clinks} 🍻
          </span>
        </div>

        {/* Downward pointer caret */}
        <div className={`w-2 h-2 rotate-45 -mt-1 shadow ${isFocused ? 'bg-yellow-300' : 'bg-amber-400'}`} />

        {/* Pulsing Action Call-to-action badge when table is focused */}
        {isFocused && (
          <div className="mt-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg border border-white animate-bounce whitespace-nowrap">
            👉 Chạm lần nữa để vào tiệc 🍻
          </div>
        )}
      </div>
    </Html>
  );
}

export default TableLabel;
