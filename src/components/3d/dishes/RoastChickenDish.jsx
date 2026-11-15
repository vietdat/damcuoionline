import React, { useRef } from 'react';
import soundManager from '../../../audio/soundManager.js';
import useWeddingStore from '../../../store/useWeddingStore.js';

/**
 * Đĩa Gà Luộc Lá Chanh Vàng Óng (Traditional Vietnamese Boiled Chicken with Lime Leaves)
 * High-end procedural 3D banquet dish:
 * - Porcelain gold-rimmed bone china plate.
 * - Sliced tender chicken cuts with glossy golden skin (#F59E0B).
 * - Two plump crossed drumsticks with bone ends.
 * - Freshly sliced lime leaf slivers (lá chanh thái chỉ).
 * - Companion dipping saucer with salt, black pepper & red chili slices.
 */
export function RoastChickenDish({ position = [0.45, 0.755, 0] }) {
  const meshRef = useRef();
  const { eatDish } = useWeddingStore();

  const handleDishClick = (e) => {
    e.stopPropagation();
    soundManager.playEat();
    eatDish();
  };

  return (
    <group
      ref={meshRef}
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
      {/* Plate Base Foot */}
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.008, 32]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
      </mesh>
      {/* Plate Basin Body */}
      <mesh position={[0, 0.016, 0]}>
        <cylinderGeometry args={[0.175, 0.15, 0.022, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.12} metalness={0.05} />
      </mesh>
      {/* Plate Gold Fillet Trim (Snug fit on plate lip) */}
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.172, 0.004, 12, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ================= 2. CHICKEN CUTS PILE ================= */}
      {/* Center mound of cut chicken pieces */}
      {[
        [-0.04, 0.038, -0.02, 0.1],
        [0.05, 0.038, 0.01, -0.2],
        [-0.01, 0.042, 0.04, 0.3],
        [0.02, 0.046, -0.04, -0.15],
        [-0.03, 0.052, 0.02, 0.05]
      ].map(([cx, cy, cz, cr], idx) => (
        <mesh key={idx} position={[cx, cy, cz]} rotation={[0.08, cr, 0.05]}>
          <boxGeometry args={[0.07, 0.028, 0.055]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.28} metalness={0.06} />
        </mesh>
      ))}

      {/* Plump Chicken Drumstick 1 */}
      <group position={[-0.04, 0.065, 0.02]} rotation={[0.15, 0.3, 0.25]}>
        <mesh scale={[1.2, 0.8, 0.9]}>
          <sphereGeometry args={[0.036, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.25} />
        </mesh>
        <mesh position={[0.042, 0.012, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <cylinderGeometry args={[0.009, 0.011, 0.05, 12]} />
          <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
        </mesh>
      </group>

      {/* Plump Chicken Drumstick 2 */}
      <group position={[0.035, 0.072, -0.02]} rotation={[-0.1, -0.3, -0.25]}>
        <mesh scale={[1.2, 0.8, 0.9]}>
          <sphereGeometry args={[0.034, 16, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.25} />
        </mesh>
        <mesh position={[-0.04, 0.012, 0]} rotation={[0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.009, 0.011, 0.05, 12]} />
          <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
        </mesh>
      </group>

      {/* Sliced Fresh Lime Leaf Slivers (Lá chanh thái sợi nhuyễn) */}
      {[
        [-0.02, 0.082, 0.01, 0.4],
        [0.02, 0.086, -0.01, -0.5],
        [-0.04, 0.076, -0.03, 1.1],
        [0.035, 0.08, 0.025, -0.8],
        [0, 0.09, 0.005, 0.15],
        [-0.01, 0.085, 0.035, 0.7]
      ].map(([lx, ly, lz, lr], idx) => (
        <mesh key={idx} position={[lx, ly, lz]} rotation={[0, lr, 0]}>
          <boxGeometry args={[0.028, 0.003, 0.006]} />
          <meshStandardMaterial color="#16A34A" roughness={0.5} />
        </mesh>
      ))}

      {/* ================= 3. COMPANION DIPPING SAUCER (ĐĨA MUỐI TIÊU CHANH ỚT) ================= */}
      <group position={[0.11, 0.025, 0.11]} scale={[0.65, 0.65, 0.65]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.035, 0.018, 20]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
        </mesh>
        {/* Salt Bed */}
        <mesh position={[0, 0.009, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.002, 16]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.8} />
        </mesh>
        {/* Black Pepper Flakes */}
        {[-0.015, 0.01, -0.008, 0.012].map((ox, i) => (
          <mesh key={i} position={[ox, 0.011, (i % 2 === 0 ? 0.01 : -0.01)]}>
            <sphereGeometry args={[0.003, 6, 6]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
        ))}
        {/* Red Chili Slices */}
        <mesh position={[0.015, 0.011, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.009, 0.003, 8, 12]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export default RoastChickenDish;
