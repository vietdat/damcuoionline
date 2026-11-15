import React from 'react';
import soundManager from '../../../audio/soundManager.js';
import useWeddingStore from '../../../store/useWeddingStore.js';

/**
 * Đĩa Xôi Gấc Hạt Sen Chữ Hỷ (Ceremonial Red Gac Sticky Rice with Lotus Seeds)
 * High-end procedural 3D banquet dish:
 * - Porcelain plate with gold-trimmed rim.
 * - Crimson red glistening gac sticky rice mold.
 * - Embossed golden mung bean Double Happiness (囍) insignia.
 * - 8 tender braised lotus seeds ringed symmetrically.
 * - Toasted white sesame seed specks.
 */
export function StickyRiceDish({ position = [-0.364, 0.755, 0.264] }) {
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

      {/* ================= 2. CEREMONIAL RED GAC STICKY RICE MOLD ================= */}
      {/* Tier 1: Main Rice Base */}
      <mesh position={[0, 0.038, 0]}>
        <cylinderGeometry args={[0.108, 0.118, 0.036, 32]} />
        <meshStandardMaterial color="#DC2626" roughness={0.65} metalness={0.05} />
      </mesh>

      {/* Tier 2: Stepped Upper Crown */}
      <mesh position={[0, 0.058, 0]}>
        <cylinderGeometry args={[0.092, 0.098, 0.012, 32]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.6} />
      </mesh>

      {/* ================= 3. GOLDEN MUNG BEAN "CHỮ HỶ" MEDALLION ================= */}
      {/* Central Yellow Mung Bean Disc */}
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.004, 24]} />
        <meshStandardMaterial color="#FBBF24" roughness={0.4} />
      </mesh>
      {/* Traditional Double Happiness (囍) Geometric Filigree */}
      {[-0.018, 0.018].map((ox, i) => (
        <group key={i} position={[ox, 0.068, 0]}>
          {/* Vertical Twin Pillars */}
          <mesh position={[-0.008, 0, 0]}>
            <boxGeometry args={[0.004, 0.003, 0.028]} />
            <meshStandardMaterial color="#DC2626" roughness={0.4} />
          </mesh>
          <mesh position={[0.008, 0, 0]}>
            <boxGeometry args={[0.004, 0.003, 0.028]} />
            <meshStandardMaterial color="#DC2626" roughness={0.4} />
          </mesh>
          {/* Horizontal Crosspieces */}
          {[-0.01, 0, 0.01].map((oz, j) => (
            <mesh key={j} position={[0, 0, oz]}>
              <boxGeometry args={[0.02, 0.003, 0.003]} />
              <meshStandardMaterial color="#DC2626" roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ================= 4. 8 BRAISED LOTUS SEEDS (HẠT SEN BÙI NGỌT) ================= */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => {
        const sang = (s * Math.PI * 2) / 8;
        const srad = 0.076;
        return (
          <mesh
            key={s}
            position={[Math.cos(sang) * srad, 0.062, Math.sin(sang) * srad]}
            scale={[1, 0.65, 1]}
          >
            <sphereGeometry args={[0.014, 12, 12]} />
            <meshStandardMaterial color="#FEF08A" roughness={0.35} />
          </mesh>
        );
      })}

      {/* Toasted White Sesame Seed Specks */}
      {[
        [-0.03, 0.067, 0.03],
        [0.035, 0.067, -0.025],
        [-0.02, 0.067, -0.035],
        [0.025, 0.067, 0.035],
        [0, 0.067, 0.045]
      ].map(([vx, vy, vz], idx) => (
        <mesh key={idx} position={[vx, vy, vz]}>
          <sphereGeometry args={[0.002, 6, 6]} />
          <meshStandardMaterial color="#FFFBEB" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default StickyRiceDish;
