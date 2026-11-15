import React from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import Pedestal from './Pedestal.jsx';
import ChibiCharacter from './ChibiCharacter.jsx';
import useWeddingStore from '../../store/useWeddingStore.js';

/**
 * Scene 1: Lobby & 360° Dress-up Scene
 */
export function LobbyScene() {
  const { selectedOutfit, selectedAccessory, guestGender, guestName } = useWeddingStore();
  const { size } = useThree();
  const isDesktop = size.width >= 768;

  // Responsive scaling and positioning:
  // On mobile portrait, scale down to 0.65 and elevate so the entire Chibi character,
  // outfit, shoes, and pedestal fit in the upper viewport above the bottom cards.
  const posX = isDesktop ? -1.1 : 0;
  const posY = isDesktop ? -0.35 : 0.22;
  const groupScale = isDesktop ? 1.0 : 0.65;
  const targetY = isDesktop ? 0.5 : posY + 0.75 * groupScale;

  return (
    <group position={[posX, posY, 0]} scale={[groupScale, groupScale, groupScale]}>
      {/* 3D Festive Stage */}
      <Pedestal />

      {/* 3D Chibi Character with active gender, outfit & accessory */}
      <ChibiCharacter gender={guestGender} outfit={selectedOutfit} accessory={selectedAccessory} />

      {/* Floating Character Name Badge above Head */}
      {guestName && (
        <Html position={[0, 1.85, 0]} center distanceFactor={isDesktop ? 4.5 : 5.5}>
          <div className="pointer-events-none select-none flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-3 py-1 rounded-full border-2 border-white shadow-xl text-xs font-black whitespace-nowrap animate-pulse">
            <span>⭐</span>
            <span>{guestName}</span>
          </div>
        </Html>
      )}

      {/* 360° Horizontal Orbit Controls centered around character */}
      <OrbitControls
        target={[posX, targetY, 0]}
        enablePan={false}
        enableZoom={true}
        minDistance={isDesktop ? 2.5 : 2.8}
        maxDistance={isDesktop ? 6.0 : 6.5}
        minPolarAngle={Math.PI / 2.7} // Keep character upright
        maxPolarAngle={Math.PI / 1.95}
        rotateSpeed={0.8}
      />
    </group>
  );
}

export default LobbyScene;
