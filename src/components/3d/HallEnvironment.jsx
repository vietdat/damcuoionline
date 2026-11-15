import React from 'react';
import * as THREE from 'three';
import StageVideoScreen from './StageVideoScreen.jsx';
import WeddingCouple from './WeddingCouple.jsx';

/**
 * Upgraded HallEnvironment (Scene 2)
 * Features:
 * - Stage with Live LED Video Screen playing the uploaded wedding clip
 * - Floral Arch framing the LED screen
 * - Spacious 36m x 36m marble floor with central grand red carpet aisle
 * - Elegant walls with red velvet curtains
 */
export function HallEnvironment({ isMobile = false }) {
  const carpetWidth = isMobile ? 1.85 : 2.6;
  const trimOffset = carpetWidth / 2 + 0.02;

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. EXPANDED MARBLE FLOOR ================= */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial color="#0B132B" roughness={0.35} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Central Grand Red Carpet Aisle (Responsive width for mobile & desktop) */}
      <mesh position={[0, 0.002, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[carpetWidth, 16]} />
        <meshStandardMaterial color="#881337" roughness={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* Gold Trim for Central Carpet */}
      <mesh position={[-trimOffset, 0.004, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[trimOffset, 0.004, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* ================= 2. ROOM WALLS & DRAPED CURTAINS ================= */}
      {/* Back Wall behind stage: Single-sided plane facing into hall. Backface is 100% culled (transparent), preventing black screen blocking */}
      <mesh position={[0, 4.5, -8.5]}>
        <planeGeometry args={[36, 9.5]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} side={THREE.FrontSide} />
      </mesh>
      {/* Back Wall Gold Crown Molding */}
      <mesh position={[0, 9.1, -8.3]}>
        <boxGeometry args={[36, 0.3, 0.2]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-17.8, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[36, 9.5, 0.4]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[17.8, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[36, 9.5, 0.4]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>

      {/* Velvet Curtain Drapes along sides */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 8.5, 4.0, -8.2]}>
          <mesh>
            <cylinderGeometry args={[0.9, 1.3, 7.5, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#7F1D1D" roughness={0.6} />
          </mesh>
          <mesh position={[0, 3.8, 0.1]}>
            <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ================= 3. GRAND WEDDING STAGE ================= */}
      <group position={[0, 0, -7.0]}>
        {/* Raised Stage Platform */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[13.5, 0.6, 4.0]} />
          <meshStandardMaterial color="#991B1B" roughness={0.4} />
        </mesh>
        {/* Stage Gold Perimeter Trim */}
        <mesh position={[0, 0.61, 0]}>
          <boxGeometry args={[13.4, 0.04, 3.9]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Backdrop Backing Board (Single-sided plane facing hall, transparent from rear) */}
        <mesh position={[0, 2.7, -1.25]}>
          <planeGeometry args={[8.4, 4.8]} />
          <meshStandardMaterial color="#0B132B" roughness={0.5} side={THREE.FrontSide} />
        </mesh>

        {/* LIVE STAGE LED VIDEO SCREEN (Tỷ lệ chuẩn 16:9, viền nổi 4 cạnh không cản trở video) */}
        <StageVideoScreen width={7.2} height={4.05} />

        {/* ================= CÔ DÂU & CHÚ RỂ ĐỨNG GÓC SÂN KHẤU ================= */}
        <WeddingCouple position={[-2.8, 0.62, 0.8]} rotation={[0, 0.25, 0]} />

        {/* Wedding Cake on Left (Dịch sang góc trái bàn tiệc) */}
        <group position={[-4.5, 0.62, 0.2]}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.65, 0.7, 0.7, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.48, 0.48, 0.3, 24]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.25, 24]} />
            <meshStandardMaterial color="#FFE4E6" roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
            <meshStandardMaterial color="#FDF2F8" roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.48, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#E11D48" roughness={0.2} />
          </mesh>
        </group>

        {/* Champagne Glass Tower on Right */}
        <group position={[3.8, 0.62, 0.2]}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.65, 0.7, 0.7, 24]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <coneGeometry args={[0.45, 0.65, 6]} />
            <meshStandardMaterial color="#FEF08A" roughness={0.1} transparent opacity={0.75} />
          </mesh>
        </group>
      </group>

      {/* ================= 4. ENTRANCE WELCOME FOYER & ARCH (CHỖ ĐỨNG CHÀO ĐÓN KHÁCH) ================= */}
      <group position={[0, 0, 6.6]}>
        {/* Welcome Stand Platform Disc (Bục đứng đón khách phủ nhung đỏ viền vàng) */}
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.35, 36]} />
          <meshStandardMaterial color="#991B1B" roughness={0.4} />
        </mesh>
        {/* Outer Gold Ring */}
        <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.32, 1.40, 36]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Inner Gold Decorative Medallion Ring */}
        <mesh position={[0, 0.009, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 0.82, 36]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Cổng Hoa Cưới Chào Đón (Floral Welcome Arch at Z = +0.8m) */}
        <group position={[0, 0, 0.8]}>
          {/* Left Column */}
          <mesh position={[-1.6, 1.7, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 3.4, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[-1.6, 3.42, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Right Column */}
          <mesh position={[1.6, 1.7, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 3.4, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[1.6, 3.42, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Top Curved Arch Bar */}
          <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[1.6, 0.065, 16, 36, Math.PI]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Romantic Rose Garlands & Floral Clusters on Arch */}
          {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => {
            const archY = 2.5 + Math.sin(Math.acos(Math.abs(x) / 1.6)) * 1.6;
            return (
              <group key={i} position={[x, archY, 0]}>
                <mesh position={[0, 0, 0.04]}>
                  <sphereGeometry args={[0.11, 12, 12]} />
                  <meshStandardMaterial color={i % 2 === 0 ? '#E11D48' : '#FFFBEB'} roughness={0.3} />
                </mesh>
                <mesh position={[0.06, 0.05, 0.04]}>
                  <sphereGeometry args={[0.08, 10, 10]} />
                  <meshStandardMaterial color="#F472B6" roughness={0.3} />
                </mesh>
                <mesh position={[-0.06, -0.04, 0.02]}>
                  <sphereGeometry args={[0.07, 8, 8]} />
                  <meshStandardMaterial color="#15803D" roughness={0.5} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Bảng Đón Khách / Standee Chúc Mừng Hạnh Phúc (Bên phải bục đón khách) */}
        <group position={[1.85, 0, 0]} rotation={[0, -0.4, 0]}>
          {/* Easel Stand Legs */}
          <mesh position={[0, 0.7, -0.15]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 1.45, 8]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
          <mesh position={[-0.25, 0.7, 0.08]} rotation={[-0.1, 0, -0.1]}>
            <cylinderGeometry args={[0.025, 0.025, 1.45, 8]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
          <mesh position={[0.25, 0.7, 0.08]} rotation={[-0.1, 0, 0.1]}>
            <cylinderGeometry args={[0.025, 0.025, 1.45, 8]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>

          {/* Welcome Board Panel */}
          <mesh position={[0, 1.15, 0.12]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.8, 1.05, 0.03]} />
            <meshStandardMaterial color="#0F172A" roughness={0.4} />
          </mesh>
          {/* Gold Board Frame */}
          <mesh position={[0, 1.15, 0.13]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.82, 1.07, 0.015]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Rose cluster on top of board */}
          <mesh position={[0, 1.7, 0.09]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#E11D48" roughness={0.3} />
          </mesh>
        </group>

        {/* Bàn Đón Khách & Hòm Thư Tiền Mừng (Bên trái bục đón khách) */}
        <group position={[-1.85, 0, 0]} rotation={[0, 0.4, 0]}>
          {/* Table Base & Cream Tablecloth */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.45, 0.52, 0.84, 24]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.845, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.46, 0.015, 12, 24]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Wedding Gift Money Box (Hòm tiền mừng cưới dát vàng) */}
          <mesh position={[0, 0.96, 0]}>
            <boxGeometry args={[0.3, 0.22, 0.22]} />
            <meshStandardMaterial color="#B91C1C" roughness={0.3} />
          </mesh>
          {/* Gold Ribbon Cross */}
          <mesh position={[0, 0.96, 0]}>
            <boxGeometry args={[0.31, 0.03, 0.23]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Vase of Red Roses */}
          <group position={[0.2, 0.86, 0.1]}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.2, 12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#E11D48" roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* Warm Golden Welcome Foyer Spotlight */}
        <pointLight position={[0, 3.2, 0]} color="#FEF3C7" intensity={1.6} distance={6} decay={2} />
      </group>
    </group>
  );
}

export default HallEnvironment;
