import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useWeddingStore from '../../store/useWeddingStore.js';

/**
 * 3D Stage Celebration FX:
 * Fireworks bursts, shimmering golden confetti & VIP tribute banner
 * triggered on stage when a TikTok viewer sends a major gift!
 */
export function StageCelebrationFX({ position = [0, 4.2, -9.5] }) {
  const vipCelebration = useWeddingStore((s) => s.vipCelebration);
  const pointsRef = useRef();
  const count = 140;

  // Generate particle trajectories for explosive fireworks
  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#F59E0B'), // Gold
      new THREE.Color('#EF4444'), // Red
      new THREE.Color('#EC4899'), // Pink
      new THREE.Color('#8B5CF6'), // Purple
      new THREE.Color('#10B981'), // Green
      new THREE.Color('#FBBF24')  // Yellow
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      // Spherical explosion velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 1.8 + Math.random() * 3.6;

      vel[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      vel[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta) + 0.8;
      vel[i * 3 + 2] = speed * Math.cos(phi);

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, vel, col];
  }, [vipCelebration]);

  useFrame((state, delta) => {
    if (!vipCelebration || !pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const array = posAttr.array;

    for (let i = 0; i < count; i++) {
      // Apply velocity & gentle gravity
      array[i * 3] += velocities[i * 3] * delta;
      array[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      array[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      velocities[i * 3 + 1] -= 1.8 * delta; // Gravity
    }
    posAttr.needsUpdate = true;
  });

  if (!vipCelebration) return null;

  return (
    <group position={position}>
      {/* Explosive Sparkling Fireworks Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Bursting Flash Point Light */}
      <pointLight color="#FEF08A" intensity={3.5} distance={15} decay={2} />

      {/* Floating 3D VIP Tribute Banner above Stage */}
      <Html position={[0, 1.8, 0]} center distanceFactor={8}>
        <div className="pointer-events-none select-none flex flex-col items-center animate-in zoom-in-50 duration-300">
          <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full border-2 border-yellow-200 shadow-2xl flex items-center gap-2 whitespace-nowrap animate-bounce">
            <span>🎆</span>
            <span>ĐẠI GIA {vipCelebration.sender}</span>
            <span className="text-yellow-200 font-bold">TẶNG {vipCelebration.giftName}</span>
            <span>👑</span>
          </div>
          <div className="text-[10px] text-amber-300 font-bold drop-shadow mt-0.5">
            ✨ Cả hôn trường xin cảm ơn chúc phúc! ✨
          </div>
        </div>
      </Html>
    </group>
  );
}

export default StageCelebrationFX;
