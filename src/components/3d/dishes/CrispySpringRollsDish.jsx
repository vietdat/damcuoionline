import React from 'react';
import soundManager from '../../../audio/soundManager.js';
import useWeddingStore from '../../../store/useWeddingStore.js';

/**
 * Đĩa Nem Rán Hà Nội Vàng Ruộm (Crispy Vietnamese Spring Rolls)
 * High-end procedural 3D banquet dish:
 * - Porcelain plate with gold-trimmed rim.
 * - Bed of fresh green curly lettuce leaves.
 * - 6 crispy, golden-brown fried spring rolls stacked neatly.
 * - Dipping bowl with sweet-sour amber fish sauce, minced garlic & red chili.
 */
export function CrispySpringRollsDish({ position = [-0.364, 0.755, -0.264] }) {
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

      {/* ================= 2. FRESH LETTUCE & HERB BED ================= */}
      {[-0.05, 0.02, 0.08].map((lx, i) => (
        <mesh
          key={i}
          position={[lx, 0.028, -0.04 + i * 0.02]}
          rotation={[0.1, i * 0.8, -0.1]}
          scale={[1.1, 0.2, 0.8]}
        >
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#22C55E" roughness={0.65} />
        </mesh>
      ))}

      {/* ================= 3. 6 GOLDEN CRISPY SPRING ROLLS ================= */}
      {/* Layer 1: Bottom 3 Rolls */}
      {[
        [-0.04, 0.042, 0.01, 0.25],
        [0.01, 0.042, 0.02, 0.28],
        [0.06, 0.042, 0.03, 0.32]
      ].map(([rx, ry, rz, rrot], idx) => (
        <group key={`b-${idx}`} position={[rx, ry, rz]} rotation={[0, rrot, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.09, 16]} />
            <meshStandardMaterial color="#D97706" roughness={0.4} metalness={0.08} />
          </mesh>
          {/* Crispy tips */}
          <mesh position={[0, 0.045, 0]}>
            <sphereGeometry args={[0.014, 10, 10]} />
            <meshStandardMaterial color="#B45309" roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.045, 0]}>
            <sphereGeometry args={[0.014, 10, 10]} />
            <meshStandardMaterial color="#B45309" roughness={0.45} />
          </mesh>
        </group>
      ))}

      {/* Layer 2: Top 2 Crossed Rolls */}
      {[
        [-0.02, 0.068, 0.015, -0.45],
        [0.035, 0.068, 0.02, -0.42]
      ].map(([rx, ry, rz, rrot], idx) => (
        <group key={`t-${idx}`} position={[rx, ry, rz]} rotation={[0, rrot, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.088, 16]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.35} metalness={0.08} />
          </mesh>
          <mesh position={[0, 0.044, 0]}>
            <sphereGeometry args={[0.014, 10, 10]} />
            <meshStandardMaterial color="#9A3412" roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.044, 0]}>
            <sphereGeometry args={[0.014, 10, 10]} />
            <meshStandardMaterial color="#9A3412" roughness={0.45} />
          </mesh>
        </group>
      ))}

      {/* Single Crown Roll */}
      <group position={[0.01, 0.094, 0.02]} rotation={[0, 0.15, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, 0.085, 16]} />
          <meshStandardMaterial color="#EA580C" roughness={0.38} metalness={0.08} />
        </mesh>
      </group>

      {/* ================= 4. AUTHENTIC DIPPING SAUCE BOWL ================= */}
      <group position={[-0.095, 0.026, 0.075]} scale={[0.7, 0.7, 0.7]}>
        {/* Sauce Bowl Body */}
        <mesh>
          <cylinderGeometry args={[0.044, 0.034, 0.026, 20]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
        </mesh>
        {/* Amber Sweet-Sour Fish Sauce */}
        <mesh position={[0, 0.009, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.005, 16]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.1} transparent opacity={0.88} />
        </mesh>
        {/* Minced Garlic Specks & Red Chili Flakes */}
        {[
          [-0.012, 0.013, 0.01],
          [0.014, 0.013, -0.008],
          [0, 0.013, 0.015],
          [-0.01, 0.013, -0.012]
        ].map(([cx, cy, cz], idx) => (
          <mesh key={idx} position={[cx, cy, cz]}>
            <sphereGeometry args={[0.0035, 6, 6]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#DC2626' : '#FEF3C7'} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default CrispySpringRollsDish;
