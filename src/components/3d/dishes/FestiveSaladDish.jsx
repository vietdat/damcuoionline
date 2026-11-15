import React from 'react';
import soundManager from '../../../audio/soundManager.js';
import useWeddingStore from '../../../store/useWeddingStore.js';

/**
 * Đĩa Nộm Ngó Sen Tôm Thịt (Festive Vietnamese Lotus Root Salad)
 * High-end procedural 3D banquet dish:
 * - Porcelain plate with gold-trimmed rim.
 * - Refreshing mound of julienned lotus roots, crisp carrots & cucumbers.
 * - Poached prawns & tender pork slices mixed in.
 * - Generously crowned with crushed roasted golden peanuts & fresh herbs.
 * - Carved red chili blossom on top.
 */
export function FestiveSaladDish({ position = [0.139, 0.755, -0.428] }) {
  const { eatDish } = useWeddingStore();

  const handleDishClick = (e) => {
    e.stopPropagation();
    soundManager.playEat();
    eatDish();
  };

  return (
    <group
      position={position}
      onClick={handleDishClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      {/* ================= 1. PORCELAIN SERVING DISH ================= */}
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.008, 32]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.016, 0]}>
        <cylinderGeometry args={[0.175, 0.15, 0.022, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.12} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.172, 0.004, 12, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ================= 2. CRISP SALAD MOUND ================= */}
      {/* Base salad dome */}
      <mesh position={[0, 0.038, 0]} scale={[1.15, 0.55, 1.1]}>
        <sphereGeometry args={[0.088, 16, 16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.6} />
      </mesh>

      {/* Shredded Carrot Slivers (Cà rốt bào sợi) */}
      {[
        [-0.04, 0.045, 0.02, 0.4],
        [0.05, 0.048, -0.01, -0.6],
        [-0.01, 0.052, -0.04, 1.2],
        [0.03, 0.055, 0.04, -0.8],
        [-0.02, 0.06, 0.01, 0.2]
      ].map(([sx, sy, sz, sr], idx) => (
        <mesh key={`c-${idx}`} position={[sx, sy, sz]} rotation={[0.1, sr, 0.05]}>
          <boxGeometry args={[0.045, 0.003, 0.006]} />
          <meshStandardMaterial color="#EA580C" roughness={0.4} />
        </mesh>
      ))}

      {/* Crisp Cucumber Slivers (Dưa chuột thái mỏng) */}
      {[
        [0.02, 0.048, 0.035, -0.3],
        [-0.035, 0.05, -0.025, 0.7],
        [0.04, 0.056, -0.03, -1.1],
        [-0.05, 0.042, 0.01, 0.5]
      ].map(([gx, gy, gz, gr], idx) => (
        <mesh key={`g-${idx}`} position={[gx, gy, gz]} rotation={[0.08, gr, -0.06]}>
          <boxGeometry args={[0.042, 0.003, 0.008]} />
          <meshStandardMaterial color="#16A34A" roughness={0.4} />
        </mesh>
      ))}

      {/* Prawn & Pork Slices on Salad */}
      {[-0.045, 0.038].map((px, i) => (
        <mesh key={`p-${i}`} position={[px, 0.055, i === 0 ? 0.035 : -0.03]} rotation={[-0.2, i * 1.8, 0.3]}>
          <cylinderGeometry args={[0.018, 0.018, 0.006, 12]} />
          <meshStandardMaterial color={i === 0 ? '#FB7185' : '#EA580C'} roughness={0.3} />
        </mesh>
      ))}

      {/* ================= 3. CRUSHED ROASTED PEANUTS (LẠC RANG GIÃ GIẬP) ================= */}
      {[
        [-0.02, 0.068, 0.01],
        [0.025, 0.07, -0.015],
        [0, 0.072, 0.025],
        [-0.03, 0.064, -0.02],
        [0.035, 0.066, 0.02],
        [-0.01, 0.074, -0.01],
        [0.015, 0.072, 0.005]
      ].map(([nx, ny, nz], idx) => (
        <mesh key={`n-${idx}`} position={[nx, ny, nz]}>
          <sphereGeometry args={[0.004, 6, 6]} />
          <meshStandardMaterial color="#CA8A04" roughness={0.7} />
        </mesh>
      ))}

      {/* Fresh Mint / Rau Răm Sprigs */}
      {[-0.035, 0.03].map((mx, i) => (
        <mesh key={`m-${i}`} position={[mx, 0.07, 0.015 * (i === 0 ? 1 : -1)]} rotation={[0, i * 2, 0.4]}>
          <sphereGeometry args={[0.014, 8, 8]} scale={[1.2, 0.2, 0.6]} />
          <meshStandardMaterial color="#15803D" roughness={0.5} />
        </mesh>
      ))}

      {/* Crown Carved Red Chili Blossom */}
      <group position={[0, 0.078, 0]} scale={[0.7, 0.7, 0.7]}>
        {[0, 1, 2, 3].map((p) => {
          const ang = (p * Math.PI) / 2;
          return (
            <mesh key={p} position={[Math.cos(ang) * 0.012, 0.008, Math.sin(ang) * 0.012]} rotation={[0.4, ang, 0.2]}>
              <coneGeometry args={[0.009, 0.025, 5]} />
              <meshStandardMaterial color="#DC2626" roughness={0.3} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default FestiveSaladDish;
