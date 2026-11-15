import React from 'react';
import soundManager from '../../../audio/soundManager.js';
import useWeddingStore from '../../../store/useWeddingStore.js';
import DishSteamParticles from '../DishSteamParticles.jsx';

/**
 * Tô Canh Bóng Thập Cẩm (Traditional Grand Banquet Soup Bowl)
 * Prestigious center centerpiece dish:
 * - Large deep porcelain soup bowl with gold rim.
 * - Crystal clear golden simmering broth (#FDE68A).
 * - Plump seasoned pork meatballs (viên mọc thịt).
 * - Braised shiitake mushrooms (nấm hương) with scored caps.
 * - Carved carrot blossom flowers (cà rốt tỉa hoa).
 * - Fresh green snow peas & scallions.
 * - Delicate puffed fish maw / pig skin (bóng bì).
 * - Warm rising steam particles.
 */
export function BanquetSoupBowl({ position = [0, 0.755, 0] }) {
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
      {/* ================= 1. DEEP CERAMIC SOUP BOWL ================= */}
      {/* Bowl Foot Ring */}
      <mesh position={[0, 0.006, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.012, 32]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
      </mesh>
      {/* Bowl Flared Body */}
      <mesh position={[0, 0.048, 0]}>
        <cylinderGeometry args={[0.18, 0.11, 0.075, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.12} metalness={0.05} />
      </mesh>
      {/* Gold Rim Lip */}
      <mesh position={[0, 0.086, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.178, 0.005, 12, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ================= 2. GOLDEN SAVORY BROTH ================= */}
      <mesh position={[0, 0.072, 0]}>
        <cylinderGeometry args={[0.165, 0.165, 0.008, 32]} />
        <meshStandardMaterial
          color="#FDE68A"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.86}
        />
      </mesh>

      {/* ================= 3. RICH FLOATING INGREDIENTS ================= */}
      {/* 4 Plump Seasoned Pork Meatballs (Viên Mọc Thịt Nấm) */}
      {[
        [-0.07, 0.078, 0.03],
        [0.065, 0.078, 0.04],
        [-0.04, 0.078, -0.06],
        [0.05, 0.078, -0.055]
      ].map(([mx, my, mz], idx) => (
        <group key={`m-${idx}`} position={[mx, my, mz]}>
          <mesh>
            <sphereGeometry args={[0.024, 14, 14]} />
            <meshStandardMaterial color="#E2B19D" roughness={0.5} />
          </mesh>
          {/* Black pepper fleck */}
          <mesh position={[0.008, 0.018, 0.004]}>
            <sphereGeometry args={[0.003, 6, 6]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 3 Braised Shiitake Mushrooms (Nấm Hương) with Scored Caps */}
      {[
        [0, 0.082, 0.07, 0.3],
        [-0.08, 0.082, -0.02, -0.4],
        [0.08, 0.082, 0, 1.2]
      ].map(([sx, sy, sz, srot], idx) => (
        <group key={`s-${idx}`} position={[sx, sy, sz]} rotation={[0.1, srot, 0.1]}>
          {/* Mushroom Cap */}
          <mesh scale={[1.2, 0.55, 1.1]}>
            <sphereGeometry args={[0.026, 12, 12]} />
            <meshStandardMaterial color="#3B1E08" roughness={0.65} />
          </mesh>
          {/* Cross incision cut on cap */}
          <mesh position={[0, 0.014, 0]}>
            <boxGeometry args={[0.026, 0.002, 0.004]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.014, 0]}>
            <boxGeometry args={[0.004, 0.002, 0.026]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 4 Carved Carrot Blossom Flowers (Cà Rốt Tỉa Hoa 5 Cánh) */}
      {[
        [-0.025, 0.076, 0.02, 0.2],
        [0.03, 0.076, 0.015, -0.5],
        [0.01, 0.076, -0.07, 0.8],
        [-0.05, 0.076, -0.03, -1.0]
      ].map(([cx, cy, cz, crot], idx) => (
        <mesh key={`c-${idx}`} position={[cx, cy, cz]} rotation={[0.08, crot, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.006, 5]} />
          <meshStandardMaterial color="#EA580C" roughness={0.35} />
        </mesh>
      ))}

      {/* Crisp Snow Peas / Broccoli Greens */}
      {[
        [-0.02, 0.076, 0.08, 0.5],
        [0.04, 0.076, -0.03, -0.8]
      ].map(([px, py, pz, prot], idx) => (
        <mesh key={`p-${idx}`} position={[px, py, pz]} rotation={[0.1, prot, 0.2]} scale={[1.4, 0.3, 0.6]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#16A34A" roughness={0.4} />
        </mesh>
      ))}

      {/* Delicate Puffed Pig Skin / Maw (Bóng Bì) */}
      {[
        [0, 0.08, 0],
        [-0.04, 0.079, 0.05]
      ].map(([bx, by, bz], idx) => (
        <mesh key={`b-${idx}`} position={[bx, by, bz]} scale={[1, 0.4, 0.7]}>
          <sphereGeometry args={[0.019, 8, 8]} />
          <meshStandardMaterial color="#FED7AA" roughness={0.7} />
        </mesh>
      ))}

      {/* Chopped Scallions (Hành hoa thái nhỏ rải đều) */}
      {[
        [-0.03, 0.076, -0.01],
        [0.025, 0.076, 0.05],
        [-0.06, 0.076, 0.07],
        [0.05, 0.076, -0.02],
        [0.01, 0.076, 0.03]
      ].map(([hx, hy, hz], idx) => (
        <mesh key={`h-${idx}`} position={[hx, hy, hz]}>
          <cylinderGeometry args={[0.0035, 0.0035, 0.004, 6]} />
          <meshStandardMaterial color="#22C55E" roughness={0.5} />
        </mesh>
      ))}

      {/* ================= 4. STEAM PARTICLES ================= */}
      <DishSteamParticles position={[0, 0.09, 0]} />
    </group>
  );
}

export default BanquetSoupBowl;
