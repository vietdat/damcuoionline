import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import ChibiCharacter from './ChibiCharacter.jsx';
import useWeddingStore from '../../store/useWeddingStore.js';

// Predefined standing slots at the entrance foyer (Bục đón khách & Cổng hoa)
const GATE_SLOTS = [
  [-1.25, 6.3],
  [1.25, 6.3],
  [-0.75, 6.95],
  [0.75, 6.95],
  [-1.65, 6.8],
  [1.65, 6.8],
  [-0.45, 7.35],
  [0.45, 7.35],
  [-1.2, 7.4],
  [1.2, 7.4]
];

/**
 * 1. Single Waiting Guest standing at the Entrance Gate
 */
function WaitingGuest({ guest, index }) {
  const groupRef = useRef();
  const slot = GATE_SLOTS[index % GATE_SLOTS.length];
  // Subtle rotation facing towards stage (Math.PI +/- angle)
  const rotY = Math.PI + (index % 2 === 0 ? 0.2 : -0.2);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime + index * 0.5;
      // Gentle idle breathing
      groupRef.current.position.y = Math.sin(t * 2.5) * 0.015;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[slot[0], 0, slot[1]]}
      rotation={[0, rotY, 0]}
      scale={[0.62, 0.62, 0.62]}
    >
      <ChibiCharacter
        gender={guest.gender || 'male'}
        outfit={guest.outfit || 'vest_den'}
        accessory="none"
      />

      {/* Floating Badge above Head */}
      <Html position={[0, 2.15, 0]} center distanceFactor={7.5}>
        <div className="pointer-events-none select-none flex flex-col items-center">
          <div className="flex items-center gap-1 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white px-2 py-0.5 rounded-full border border-pink-300 shadow-xl text-[9px] font-black whitespace-nowrap animate-pulse">
            <span>🎵</span>
            <span>{guest.name}</span>
          </div>
          <div className="mt-0.5 bg-slate-950/85 text-amber-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-amber-400/40 shadow whitespace-nowrap">
            Đang chờ bàn...
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * 2. Single Walking Guest moving from Gate down the central aisle into their assigned Table
 */
function WalkingGuest({ guest, tables, isMobile }) {
  const groupRef = useRef();
  const targetTable = tables.find((t) => t.id === guest.targetTableId) || tables[0];

  // Resolve target table coordinates
  const targetX = useMemo(() => {
    const origX = targetTable.position[0];
    if (!isMobile) return origX;
    return origX <= -5 ? -6.8 : origX < 0 ? -2.9 : origX >= 5 ? 6.8 : 2.9;
  }, [targetTable, isMobile]);

  const targetZ = targetTable.position[2];

  // Bezier Path:
  // P0 = [0, 0, 6.6] (Gate)
  // P_ctrl = [0, 0, targetZ + 1.25] (Aisle)
  // P1 = [targetX + offset, 0, targetZ + 1.25] (Table entrance)
  const standOffsetX = targetX < 0 ? 0.35 : -0.35;
  const p0 = useMemo(() => new THREE.Vector3(0, 0, 6.6), []);
  const pCtrl = useMemo(() => new THREE.Vector3(0, 0, targetZ + 1.25), [targetZ]);
  const p1 = useMemo(() => new THREE.Vector3(targetX + standOffsetX, 0, targetZ + 1.25), [targetX, standOffsetX, targetZ]);

  useFrame(() => {
    if (!groupRef.current) return;

    const now = performance.now();
    const elapsed = (now - guest.startTime) / 1000;
    const progress = Math.min(1, Math.max(0, elapsed / (guest.duration || 2.6)));

    // Smooth quadratic ease
    const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
    const invT = 1 - ease;

    // Quadratic Bezier Formula: P(t) = (1-t)^2 * P0 + 2*(1-t)*t * P_ctrl + t^2 * P1
    const x = invT * invT * p0.x + 2 * invT * ease * pCtrl.x + ease * ease * p1.x;
    const z = invT * invT * p0.z + 2 * invT * ease * pCtrl.z + ease * ease * p1.z;

    // Direction tangent for facing orientation
    const dx = 2 * invT * (pCtrl.x - p0.x) + 2 * ease * (p1.x - pCtrl.x);
    const dz = 2 * invT * (pCtrl.z - p0.z) + 2 * ease * (p1.z - pCtrl.z);
    let rotY = Math.PI;
    if (Math.hypot(dx, dz) > 0.001) {
      rotY = Math.atan2(dx, dz);
    }

    // Chibi bouncy waddle
    const stepBounce = Math.abs(Math.sin(elapsed * 14)) * 0.12;
    const stepWaddle = Math.sin(elapsed * 14) * 0.08;

    groupRef.current.position.set(x, stepBounce, z);
    groupRef.current.rotation.set(0, rotY, stepWaddle);
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 6.6]}
      rotation={[0, Math.PI, 0]}
      scale={[0.62, 0.62, 0.62]}
    >
      <ChibiCharacter
        gender={guest.gender || 'male'}
        outfit={guest.outfit || 'vest_den'}
        accessory="none"
      />

      {/* Floating Walking Action Badge */}
      <Html position={[0, 2.15, 0]} center distanceFactor={7.5}>
        <div className="pointer-events-none select-none flex flex-col items-center">
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-2 py-0.5 rounded-full border border-white shadow-xl text-[9px] font-black whitespace-nowrap animate-bounce">
            <span>🚶</span>
            <span>{guest.name}</span>
            <span>➔</span>
            <span>Bàn {guest.targetTableId}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * Main TikTok Guests Manager
 * Renders all waiting guests at the gate and active walking guests down the aisle!
 */
export function TikTokGuestsManager() {
  const waitingGuests = useWeddingStore((s) => s.waitingGuests);
  const walkingGuests = useWeddingStore((s) => s.walkingGuests);
  const tables = useWeddingStore((s) => s.tables);
  const { size } = useThree();
  const isMobile = size.width < 768;

  return (
    <group>
      {/* 1. Guests standing at the Entrance Gate waiting for a table */}
      {waitingGuests.map((guest, idx) => (
        <WaitingGuest key={guest.id} guest={guest} index={idx} />
      ))}

      {/* 2. Guests actively walking from the gate down the central aisle to their table */}
      {walkingGuests.map((guest) => (
        <WalkingGuest
          key={guest.id}
          guest={guest}
          tables={tables}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
}

export default TikTokGuestsManager;
