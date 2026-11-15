import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import soundManager from '../../audio/soundManager.js';

/**
 * WeddingCouple (Cô Dâu & Chú Rể đứng ở góc sân khấu)
 * Stylized 3D Procedural Chibi Bride & Groom standing together on the stage dais.
 *
 * Features:
 * - Chú Rể (Quang Trung): Elegant tuxedo with red bow tie & gold boutonniere.
 * - Cô Dâu (Thúy Lan): Pure white lace bridal gown, rose bouquet, sparkling tiara & translucent veil.
 * - Interactive: Click to hear greeting chime and show speech bubble.
 * - Floating celebratory love hearts.
 */
export function WeddingCouple({ position = [-2.6, 0.6, 0.7], rotation = [0, 0.35, 0] }) {
  const coupleGroupRef = useRef();
  const heartsGroupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [showSpeech, setShowSpeech] = useState(false);

  // Gentle breathing and subtle swaying animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coupleGroupRef.current) {
      coupleGroupRef.current.position.y = position[1] + Math.sin(t * 2.5) * 0.015;
    }
    if (heartsGroupRef.current) {
      heartsGroupRef.current.children.forEach((heart, i) => {
        heart.position.y = 1.6 + ((t * 0.6 + i * 0.5) % 1.2);
        heart.rotation.z = Math.sin(t * 2 + i) * 0.2;
        if (heart.material) {
          const progress = ((t * 0.6 + i * 0.5) % 1.2) / 1.2;
          heart.material.opacity = Math.sin(progress * Math.PI) * 0.8;
        }
      });
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    soundManager.playEnterFanfare();
    setShowSpeech((prev) => !prev);
  };

  return (
    <group
      ref={coupleGroupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* ================= 1. CEREMONIAL CARPET DISC (THẢM TRÒN PHẲNG) ================= */}
      {/* Crimson Velvet Round Carpet (Nằm phẳng 100% trên mặt sàn) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.15, 36]} />
        <meshStandardMaterial color="#881337" roughness={0.4} />
      </mesh>
      {/* Gold Perimeter Trim Ring (Nằm phẳng 100% bo quanh thảm, không dựng đứng) */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.08, 1.15, 36]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ================= 2. CHÚ RỂ (GROOM - QUANG TRUNG) ================= */}
      <group position={[-0.38, 0.52, 0]} scale={[0.82, 0.82, 0.82]}>
        {/* Head */}
        <mesh position={[0, 0.95, 0]} scale={[1, 0.96, 0.96]}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshStandardMaterial color="#FFEDD5" roughness={0.35} />
        </mesh>

        {/* Groom Hair: Korean neat side-part */}
        <mesh position={[0, 1.05, -0.05]} rotation={[-0.45, 0, 0]} scale={[1.04, 1.04, 1.06]}>
          <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.85]} />
          <meshStandardMaterial color="#1E1E1E" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.25, 0.32]} scale={[1.1, 0.35, 0.3]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#1E1E1E" roughness={0.7} />
        </mesh>

        {/* Eyes & Cheeks & Smile */}
        <mesh position={[-0.14, 0.95, 0.4]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.14, 0.95, 0.4]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[-0.2, 0.88, 0.37]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#FDA4AF" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.2, 0.88, 0.37]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#FDA4AF" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 0.85, 0.41]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.035, 0.01, 8, 12, Math.PI]} />
          <meshBasicMaterial color="#9F1239" />
        </mesh>

        {/* Groom Body: Tuxedo Suit */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.28, 0.34, 0.65, 20]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
        {/* White Shirt Collar V-Shape */}
        <mesh position={[0, 0.52, 0.22]} scale={[0.18, 0.22, 0.05]}>
          <coneGeometry args={[0.5, 0.8, 3]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Red Bow Tie */}
        <mesh position={[0, 0.56, 0.26]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#E11D48" roughness={0.3} />
        </mesh>
        {/* Boutonniere (Hoa cài áo chú rể) */}
        <mesh position={[-0.15, 0.52, 0.25]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.2} metalness={0.6} />
        </mesh>

        {/* Legs & Shoes */}
        <mesh position={[-0.12, -0.05, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.35, 12]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
        <mesh position={[0.12, -0.05, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.35, 12]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
        <mesh position={[-0.12, -0.22, 0.04]}>
          <boxGeometry args={[0.12, 0.08, 0.18]} />
          <meshStandardMaterial color="#020617" roughness={0.2} />
        </mesh>
        <mesh position={[0.12, -0.22, 0.04]}>
          <boxGeometry args={[0.12, 0.08, 0.18]} />
          <meshStandardMaterial color="#020617" roughness={0.2} />
        </mesh>
      </group>

      {/* ================= 3. CÔ DÂU (BRIDE - THÚY LAN) ================= */}
      <group position={[0.38, 0.52, 0]} scale={[0.8, 0.8, 0.8]}>
        {/* Head */}
        <mesh position={[0, 0.95, 0]} scale={[1, 0.96, 0.96]}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshStandardMaterial color="#FFEDD5" roughness={0.35} />
        </mesh>

        {/* Long Brown Hair with Bun */}
        <mesh position={[0, 1.05, -0.05]} rotation={[-0.45, 0, 0]} scale={[1.04, 1.04, 1.06]}>
          <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.85]} />
          <meshStandardMaterial color="#3B1E08" roughness={0.65} />
        </mesh>
        {/* Hair Bun at back */}
        <mesh position={[0, 1.1, -0.42]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#3B1E08" roughness={0.65} />
        </mesh>
        {/* Side Drapes */}
        <mesh position={[-0.38, 0.7, 0.02]} scale={[0.2, 1.1, 0.35]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#3B1E08" roughness={0.65} />
        </mesh>
        <mesh position={[0.38, 0.7, 0.02]} scale={[0.2, 1.1, 0.35]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#3B1E08" roughness={0.65} />
        </mesh>

        {/* Tiara / Bridal Crown */}
        <mesh position={[0, 1.34, 0.15]}>
          <coneGeometry args={[0.15, 0.12, 5]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Translucent Bridal Veil (Khăn voan trắng bay bổng) */}
        <mesh position={[0, 0.8, -0.32]} rotation={[0.25, 0, 0]}>
          <planeGeometry args={[0.7, 1.1]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={0.6}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Eyes & Cheeks & Smile */}
        <mesh position={[-0.14, 0.95, 0.4]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.14, 0.95, 0.4]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[-0.2, 0.88, 0.37]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#FDA4AF" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.2, 0.88, 0.37]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#FDA4AF" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0.85, 0.41]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.035, 0.01, 8, 12, Math.PI]} />
          <meshBasicMaterial color="#BE123C" />
        </mesh>

        {/* Bride Body: Magnificent Pure White Wedding Gown */}
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.24, 0.3, 0.4, 20]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Flared Gown Skirt */}
        <mesh position={[0, 0.05, 0]}>
          <coneGeometry args={[0.55, 0.65, 24]} />
          <meshStandardMaterial color="#FFFBEB" roughness={0.35} />
        </mesh>
        {/* Dress Gold Waistline Trim */}
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.02, 8, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Rose Bouquet (Bó hoa cưới cầm tay) */}
        <group position={[-0.15, 0.32, 0.36]} rotation={[0.4, 0.2, -0.3]}>
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.03, 0.02, 0.16, 8]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#E11D48" roughness={0.4} />
          </mesh>
          <mesh position={[0.05, 0.06, 0.02]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#FFF1F2" roughness={0.4} />
          </mesh>
          <mesh position={[-0.05, 0.06, -0.02]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#FDA4AF" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ================= 4. FLOATING HEARTS FX ================= */}
      <group ref={heartsGroupRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.25, 1.6 + i * 0.3, 0.2]} scale={[0.12, 0.12, 0.12]}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshBasicMaterial color="#F43F5E" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* ================= 5. INTERACTIVE 3D/2D SPEECH BUBBLE ================= */}
      <Html position={[0, 2.1, 0]} center distanceFactor={10}>
        <div
          className={`pointer-events-none select-none transition-all duration-300 transform flex flex-col items-center ${
            showSpeech || isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="bg-slate-950/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-amber-400 shadow-2xl text-center whitespace-nowrap">
            <div className="text-[12px] font-black text-amber-300 flex items-center justify-center gap-1.5">
              <span>💍 Cô Dâu & Chú Rể</span>
            </div>
            <p className="text-[11px] text-white font-bold mt-0.5">
              Quang Trung & Thúy Lan
            </p>
            <p className="text-[10px] text-amber-200/90 italic">
              "Cảm ơn bạn đã đến chung vui cùng chúng mình! 🥂"
            </p>
          </div>
          <div className="w-2 h-2 bg-amber-400 rotate-45 -mt-1 shadow" />
        </div>
      </Html>
    </group>
  );
}

export default WeddingCouple;
