import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Procedural 3D Chibi Character
 * Fixed: Hair cap properly tilted backward so the entire face & forehead are 100% bright,
 * eliminating the dark mask clipping bug completely.
 */
export function ChibiCharacter({ gender = 'male', outfit = 'vest_den', accessory = 'none' }) {
  const characterRef = useRef();
  const headRef = useRef();
  const rightArmRef = useRef();

  // Idle Animation: Breathing & subtle swaying
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (characterRef.current) {
      characterRef.current.position.y = -0.4 + Math.sin(t * 3) * 0.015;
    }
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.03;
      headRef.current.rotation.x = Math.sin(t * 2) * 0.015;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(t * 3) * 0.04;
    }
  });

  return (
    <group ref={characterRef} position={[0, -0.4, 0]}>
      {/* ================= HEAD GROUP ================= */}
      <group ref={headRef} position={[0, 1.35, 0]}>
        {/* Head Sphere (Cute Chibi skin tone) */}
        <mesh position={[0, 0, 0]} scale={[1, 0.96, 0.96]}>
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshStandardMaterial color="#FFEDD5" roughness={0.35} />
        </mesh>

        {/* ================= HAIRSTYLES (TÓC) ================= */}
        {gender === 'male' ? (
          /* ----- MALE HAIRSTYLE: Tóc Ngắn Hàn Quốc Bảnh Bao ----- */
          <group>
            {/* Hair Cap: Tilted backward (-0.48 rad) so the face & forehead are 100% open and bright */}
            <mesh position={[0, 0.1, -0.06]} rotation={[-0.48, 0, 0]} scale={[1.04, 1.04, 1.06]}>
              <sphereGeometry args={[0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.85]} />
              <meshStandardMaterial color="#29180D" roughness={0.7} />
            </mesh>

            {/* Front Bangs (High up on forehead at Y=0.33, far above the eyes at Y=0.02) */}
            <mesh position={[0, 0.34, 0.38]} scale={[1.2, 0.4, 0.3]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#29180D" roughness={0.7} />
            </mesh>
            <mesh position={[-0.2, 0.32, 0.36]} scale={[0.9, 0.35, 0.3]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#29180D" roughness={0.7} />
            </mesh>
            <mesh position={[0.2, 0.32, 0.36]} scale={[0.9, 0.35, 0.3]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#29180D" roughness={0.7} />
            </mesh>

            {/* Sideburns (2 bên mang tai) */}
            <mesh position={[-0.46, 0.05, 0.02]} scale={[0.25, 0.7, 0.4]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#29180D" roughness={0.7} />
            </mesh>
            <mesh position={[0.46, 0.05, 0.02]} scale={[0.25, 0.7, 0.4]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#29180D" roughness={0.7} />
            </mesh>
          </group>
        ) : (
          /* ----- FEMALE HAIRSTYLE: Tóc Dài Thướt Tha Kèm Hoa Cài Tóc ----- */
          <group>
            {/* Hair Cap: Tilted backward so forehead and eyes are completely free of shadows */}
            <mesh position={[0, 0.1, -0.06]} rotation={[-0.48, 0, 0]} scale={[1.04, 1.04, 1.06]}>
              <sphereGeometry args={[0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.85]} />
              <meshStandardMaterial color="#3B1E08" roughness={0.65} />
            </mesh>

            {/* Feminine Curved Bangs (Placed high at Y=0.34, forehead is bright and clear) */}
            <mesh position={[0, 0.35, 0.38]} scale={[1.2, 0.38, 0.3]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#3B1E08" roughness={0.65} />
            </mesh>
            <mesh position={[-0.18, 0.33, 0.36]} scale={[0.85, 0.35, 0.3]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#3B1E08" roughness={0.65} />
            </mesh>
            <mesh position={[0.18, 0.33, 0.36]} scale={[0.85, 0.35, 0.3]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#3B1E08" roughness={0.65} />
            </mesh>

            {/* Long Back Hair (Rơi ra phía sau lưng) */}
            <mesh position={[0, -0.25, -0.26]} scale={[1.05, 1.35, 0.65]}>
              <cylinderGeometry args={[0.36, 0.42, 0.7, 24]} />
              <meshStandardMaterial color="#3B1E08" roughness={0.65} />
            </mesh>

            {/* Left Side Hair (Bên tai trái, không che mặt) */}
            <mesh position={[-0.45, -0.15, 0.05]} scale={[0.35, 1.3, 0.4]}>
              <capsuleGeometry args={[0.08, 0.32, 12, 16]} />
              <meshStandardMaterial color="#3B1E08" roughness={0.65} />
            </mesh>

            {/* Right Side Hair (Bên tai phải, không che mặt) */}
            <mesh position={[0.45, -0.15, 0.05]} scale={[0.35, 1.3, 0.4]}>
              <capsuleGeometry args={[0.08, 0.32, 12, 16]} />
              <meshStandardMaterial color="#3B1E08" roughness={0.65} />
            </mesh>

            {/* Red Rose Hairpin on right side */}
            <group position={[0.4, 0.3, 0.2]} rotation={[0, 0.4, -0.3]}>
              <mesh>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#E11D48" roughness={0.3} />
              </mesh>
              <mesh position={[0.035, 0, 0]}>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshStandardMaterial color="#FBBF24" roughness={0.2} metalness={0.8} />
              </mesh>
            </group>
          </group>
        )}

        {/* ================= EYEBROWS (LÔNG MÀY) ================= */}
        <mesh position={[-0.16, 0.14, 0.45]} rotation={[0, 0, 0.08]} scale={[1, 0.3, 0.3]}>
          <boxGeometry args={[0.1, 0.03, 0.02]} />
          <meshBasicMaterial color="#382212" />
        </mesh>
        <mesh position={[0.16, 0.14, 0.45]} rotation={[0, 0, -0.08]} scale={[1, 0.3, 0.3]}>
          <boxGeometry args={[0.1, 0.03, 0.02]} />
          <meshBasicMaterial color="#382212" />
        </mesh>

        {/* ================= EYES (MẮT ANIME) ================= */}
        {/* Left Eye */}
        <mesh position={[-0.16, 0.02, 0.45]} scale={[1, 1.25, 0.5]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#1E1E1E" roughness={0.1} />
        </mesh>
        <mesh position={[-0.14, 0.05, 0.48]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Right Eye */}
        <mesh position={[0.16, 0.02, 0.45]} scale={[1, 1.25, 0.5]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#1E1E1E" roughness={0.1} />
        </mesh>
        <mesh position={[0.18, 0.05, 0.48]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* ================= CHEEKS (MÁ HỒNG) ================= */}
        <mesh position={[-0.24, -0.07, 0.42]} scale={[1.2, 0.7, 0.5]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color="#FDA4AF" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.24, -0.07, 0.42]} scale={[1.2, 0.7, 0.5]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color="#FDA4AF" transparent opacity={0.7} />
        </mesh>

        {/* ================= SMILE (NỤ CƯỜI) ================= */}
        <mesh position={[0, -0.11, 0.46]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.045, 0.012, 8, 16, Math.PI]} />
          <meshBasicMaterial color="#9F1239" />
        </mesh>

        {/* --- ACCESSORY: KÍNH RÂM SIÊU NGẦU --- */}
        {accessory === 'kinh_ram' && (
          <group position={[0, 0.03, 0.47]}>
            <mesh position={[-0.16, 0, 0]}>
              <boxGeometry args={[0.18, 0.12, 0.04]} />
              <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.9} />
            </mesh>
            <mesh position={[0.16, 0, 0]}>
              <boxGeometry args={[0.18, 0.12, 0.04]} />
              <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.15, 0.025, 0.03]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}
      </group>

      {/* ================= TORSO & OUTFIT ================= */}
      <group position={[0, 0.65, 0]}>
        {/* OUTFIT 1: VEST BẢNH BAO */}
        {outfit === 'vest_den' && (
          <group>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.26, 0.32, 0.52, 24]} />
              <meshStandardMaterial color="#1E293B" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.2, 0.2]}>
              <boxGeometry args={[0.12, 0.22, 0.04]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.12, 0.23]}>
              <boxGeometry args={[0.04, 0.2, 0.02]} />
              <meshStandardMaterial color="#DC2626" roughness={0.3} />
            </mesh>
            <mesh position={[-0.12, -0.36, 0]}>
              <cylinderGeometry args={[0.1, 0.09, 0.44, 16]} />
              <meshStandardMaterial color="#0F172A" roughness={0.5} />
            </mesh>
            <mesh position={[0.12, -0.36, 0]}>
              <cylinderGeometry args={[0.1, 0.09, 0.44, 16]} />
              <meshStandardMaterial color="#0F172A" roughness={0.5} />
            </mesh>
            <mesh position={[-0.12, -0.61, 0.04]}>
              <boxGeometry args={[0.12, 0.07, 0.22]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.4} />
            </mesh>
            <mesh position={[0.12, -0.61, 0.04]}>
              <boxGeometry args={[0.12, 0.07, 0.22]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.4} />
            </mesh>
          </group>
        )}

        {/* OUTFIT 2: VÁY DẠ HỘI */}
        {outfit === 'vay_da_hoi' && (
          <group>
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.22, 0.26, 0.38, 24]} />
              <meshStandardMaterial color="#E11D48" roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <cylinderGeometry args={[0.27, 0.27, 0.05, 24]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.26, 0.58, 0.62, 24]} />
              <meshStandardMaterial color="#BE123C" roughness={0.4} />
            </mesh>
            <mesh position={[-0.1, -0.62, 0.08]}>
              <boxGeometry args={[0.1, 0.06, 0.15]} />
              <meshStandardMaterial color="#881337" roughness={0.3} />
            </mesh>
            <mesh position={[0.1, -0.62, 0.08]}>
              <boxGeometry args={[0.1, 0.06, 0.15]} />
              <meshStandardMaterial color="#881337" roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* OUTFIT 3: ÁO DÀI TRUYỀN THỐNG */}
        {outfit === 'ao_dai' && (
          <group>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.24, 0.3, 0.46, 24]} />
              <meshStandardMaterial color="#DC2626" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <cylinderGeometry args={[0.2, 0.22, 0.08, 24]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.25, 0.12]}>
              <boxGeometry args={[0.34, 0.52, 0.04]} />
              <meshStandardMaterial color="#DC2626" roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.25, -0.12]}>
              <boxGeometry args={[0.34, 0.52, 0.04]} />
              <meshStandardMaterial color="#DC2626" roughness={0.3} />
            </mesh>
            <mesh position={[-0.1, -0.38, 0]}>
              <cylinderGeometry args={[0.09, 0.11, 0.48, 16]} />
              <meshStandardMaterial color="#FEF2F2" roughness={0.4} />
            </mesh>
            <mesh position={[0.1, -0.38, 0]}>
              <cylinderGeometry args={[0.09, 0.11, 0.48, 16]} />
              <meshStandardMaterial color="#FEF2F2" roughness={0.4} />
            </mesh>
            <mesh position={[-0.1, -0.61, 0.04]}>
              <boxGeometry args={[0.11, 0.07, 0.2]} />
              <meshStandardMaterial color="#1E293B" roughness={0.3} />
            </mesh>
            <mesh position={[0.1, -0.61, 0.04]}>
              <boxGeometry args={[0.11, 0.07, 0.2]} />
              <meshStandardMaterial color="#1E293B" roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* OUTFIT 4: QUẦN ĐÙI BA LỖ (MEME) */}
        {outfit === 'quan_dui' && (
          <group>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.24, 0.28, 0.46, 24]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.5} />
            </mesh>
            <mesh position={[0, -0.18, 0]}>
              <cylinderGeometry args={[0.29, 0.32, 0.26, 24]} />
              <meshStandardMaterial color="#2563EB" roughness={0.6} />
            </mesh>
            <mesh position={[-0.1, -0.42, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.38, 16]} />
              <meshStandardMaterial color="#FFEDD5" roughness={0.4} />
            </mesh>
            <mesh position={[0.1, -0.42, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.38, 16]} />
              <meshStandardMaterial color="#FFEDD5" roughness={0.4} />
            </mesh>
            <mesh position={[-0.1, -0.62, 0.04]}>
              <boxGeometry args={[0.12, 0.05, 0.22]} />
              <meshStandardMaterial color="#FBBF24" roughness={0.4} />
            </mesh>
            <mesh position={[0.1, -0.62, 0.04]}>
              <boxGeometry args={[0.12, 0.05, 0.22]} />
              <meshStandardMaterial color="#FBBF24" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* ================= ARMS & HANDS ================= */}
        {/* Left Arm */}
        <group position={[-0.32, 0.12, 0]} rotation={[0, 0, 0.2]}>
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.07, 0.06, 0.32, 16]} />
            <meshStandardMaterial color={outfit === 'quan_dui' ? '#FFEDD5' : (outfit === 'ao_dai' ? '#DC2626' : (outfit === 'vay_da_hoi' ? '#FFEDD5' : '#1E293B'))} />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#FFEDD5" />
          </mesh>
        </group>

        {/* Right Arm (Holding Accessory) */}
        <group ref={rightArmRef} position={[0.32, 0.12, 0]} rotation={[0, 0, -0.2]}>
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.07, 0.06, 0.32, 16]} />
            <meshStandardMaterial color={outfit === 'quan_dui' ? '#FFEDD5' : (outfit === 'ao_dai' ? '#DC2626' : (outfit === 'vay_da_hoi' ? '#FFEDD5' : '#1E293B'))} />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#FFEDD5" />
          </mesh>

          {/* --- ACCESSORY: BÓ HOA CƯỚI --- */}
          {accessory === 'hoa_cuoi' && (
            <group position={[0.05, -0.32, 0.15]} rotation={[0.4, 0, 0]}>
              <mesh position={[0, -0.08, 0]}>
                <coneGeometry args={[0.12, 0.22, 16]} />
                <meshStandardMaterial color="#FDF4FF" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#E11D48" roughness={0.4} />
              </mesh>
              <mesh position={[0.06, 0.04, 0.04]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#F43F5E" roughness={0.4} />
              </mesh>
              <mesh position={[-0.05, 0.05, 0.04]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
            </group>
          )}

          {/* --- ACCESSORY: LY BIA CỤNG SỦI BỌT (UPGRADED STYLIZED BEER MUG) --- */}
          {accessory === 'ly_bia' && (
            <group position={[0.08, -0.26, 0.12]}>
              {/* Heavy Glass Base */}
              <mesh position={[0, -0.09, 0]}>
                <cylinderGeometry args={[0.076, 0.082, 0.03, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.06} transparent opacity={0.6} />
              </mesh>
              {/* Outer Glass Wall */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.074, 0.18, 16]} />
                <meshStandardMaterial color="#F8FAFC" roughness={0.08} transparent opacity={0.45} />
              </mesh>
              {/* Golden Amber Beer */}
              <mesh position={[0, -0.01, 0]}>
                <cylinderGeometry args={[0.074, 0.068, 0.15, 16]} />
                <meshStandardMaterial color="#F59E0B" roughness={0.15} metalness={0.1} />
              </mesh>
              {/* Creamy Foam Cap */}
              <mesh position={[0, 0.09, 0]}>
                <cylinderGeometry args={[0.08, 0.078, 0.04, 16]} />
                <meshStandardMaterial color="#FFFDF5" roughness={0.85} />
              </mesh>
              {/* Puffy Foam Cloud Peaks */}
              <mesh position={[0.02, 0.115, 0.01]}>
                <sphereGeometry args={[0.035, 10, 10]} />
                <meshStandardMaterial color="#FFFDF5" roughness={0.88} />
              </mesh>
              <mesh position={[-0.03, 0.11, -0.02]}>
                <sphereGeometry args={[0.028, 10, 10]} />
                <meshStandardMaterial color="#FFFDF5" roughness={0.88} />
              </mesh>
              <mesh position={[0.01, 0.11, -0.03]}>
                <sphereGeometry args={[0.03, 10, 10]} />
                <meshStandardMaterial color="#FFFDF5" roughness={0.88} />
              </mesh>
              {/* Thick Glass Handle */}
              <mesh position={[0.085, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <torusGeometry args={[0.052, 0.014, 10, 20, Math.PI * 1.15]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.06} transparent opacity={0.65} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
}

export default ChibiCharacter;
