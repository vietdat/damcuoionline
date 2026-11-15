import React from 'react';
import soundManager from '../../../audio/soundManager.js';
import useWeddingStore from '../../../store/useWeddingStore.js';

/**
 * Đĩa Tôm Sú Hấp Nước Dừa (Steamed Tiger Prawns with Coconut Water)
 * High-end procedural 3D banquet dish:
 * - Porcelain plate with gold-trimmed rim.
 * - 6 vibrant scarlet red-orange tiger prawns arranged in an elegant pinwheel wreath.
 * - Carved red chili blossom center garnish with fresh green coriander.
 * - Fanned cucumber slices on the side.
 */
export function SteamedShrimpDish({ position = [0.139, 0.755, 0.428] }) {
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

      {/* ================= 2. 6 TIGER PRAWNS ARRANGED CIRCULARLY ================= */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI * 2) / 6;
        const rad = 0.088;
        const px = Math.cos(angle) * rad;
        const pz = Math.sin(angle) * rad;
        return (
          <group
            key={i}
            position={[px, 0.032, pz]}
            rotation={[0, -angle + Math.PI / 1.7, 0]}
          >
            {/* Prawn Head & Thorax */}
            <mesh position={[0.038, 0.012, 0]} scale={[1.2, 0.8, 0.75]}>
              <sphereGeometry args={[0.018, 12, 12]} />
              <meshStandardMaterial color="#C2410C" roughness={0.3} metalness={0.05} />
            </mesh>
            {/* Antennae */}
            <mesh position={[0.055, 0.016, 0.004]} rotation={[0, 0.3, 0.4]}>
              <cylinderGeometry args={[0.001, 0.001, 0.04, 6]} />
              <meshStandardMaterial color="#F97316" roughness={0.4} />
            </mesh>

            {/* Curved Prawn Body Arch */}
            <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.038, 0.014, 10, 16, Math.PI * 0.75]} />
              <meshStandardMaterial color="#EA580C" roughness={0.28} metalness={0.04} />
            </mesh>

            {/* Prawn Tail Fan */}
            <group position={[-0.034, 0.006, -0.018]} rotation={[0, 0.5, 0]}>
              <mesh scale={[1.5, 0.2, 0.8]}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshStandardMaterial color="#9A3412" roughness={0.4} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* ================= 3. CARVED CHILI FLOWER & GARNISH ================= */}
      {/* Central Chili Blossom */}
      <group position={[0, 0.036, 0]}>
        {[0, 1, 2, 3].map((petal) => {
          const pang = (petal * Math.PI) / 2;
          return (
            <mesh
              key={petal}
              position={[Math.cos(pang) * 0.014, 0.006, Math.sin(pang) * 0.014]}
              rotation={[0.3, pang, 0.3]}
              scale={[0.4, 0.15, 1.2]}
            >
              <coneGeometry args={[0.012, 0.03, 6]} />
              <meshStandardMaterial color="#DC2626" roughness={0.25} />
            </mesh>
          );
        })}
        {/* Flower Center Pollen */}
        <mesh position={[0, 0.01, 0]}>
          <sphereGeometry args={[0.007, 8, 8]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.3} />
        </mesh>
      </group>

      {/* Fresh Green Cilantro Sprigs */}
      {[-0.025, 0.025].map((gx, idx) => (
        <mesh key={idx} position={[gx, 0.034, 0.02]} rotation={[0, idx * 1.5, 0.2]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color="#15803D" roughness={0.6} />
        </mesh>
      ))}

      {/* Fanned Crisp Cucumber Slices on rim */}
      {[-0.1, -0.115, -0.125].map((cx, i) => (
        <mesh key={i} position={[cx, 0.025, 0.05 + i * 0.025]} rotation={[0.2, 0.6, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.003, 16]} />
          <meshStandardMaterial color="#22C55E" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export default SteamedShrimpDish;
