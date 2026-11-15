import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import ChibiCharacter from './ChibiCharacter.jsx';
import BanquetSoupBowl from './dishes/BanquetSoupBowl.jsx';
import RoastChickenDish from './dishes/RoastChickenDish.jsx';
import SteamedShrimpDish from './dishes/SteamedShrimpDish.jsx';
import StickyRiceDish from './dishes/StickyRiceDish.jsx';
import CrispySpringRollsDish from './dishes/CrispySpringRollsDish.jsx';
import FestiveSaladDish from './dishes/FestiveSaladDish.jsx';
import BeerMugMesh from './BeerMugMesh.jsx';
import CheersSparks from './CheersSparks.jsx';
import RedEnvelope3D from './RedEnvelope3D.jsx';
import StageVideoScreen from './StageVideoScreen.jsx';
import WeddingCouple from './WeddingCouple.jsx';
import StageCelebrationFX from './StageCelebrationFX.jsx';
import useWeddingStore from '../../store/useWeddingStore.js';

/**
 * Scene 3: Bàn Tiệc Cận Cảnh (Mâm Cỗ & Cụng Ly)
 * Fully fixed:
 * - Ergonomic table altitude (y = 0.73m).
 * - All dishes, 6 beer mugs and red envelope rest perfectly on top of the Lazy Susan & tablecloth.
 * - All 6 chairs and seated companions face 100% inward toward the center.
 * - Warm ambient banquet hall with chandelier lighting and velvet drapes.
 * - Elevated camera angle preventing button occlusion.
 */
export function TableFocusScene() {
  const { tables, selectedTableId, activeChatBubbles, selectedSeatIndex, guestName } = useWeddingStore();
  const { size } = useThree();
  const isMobile = size.width < 768;
  const currentTable = tables.find((t) => t.id === selectedTableId) || tables[0];
  const dishes = currentTable.dishes || ['canh_bong', 'ga_luoc'];

  // Responsive scaling for mobile: Scale down to 0.65 so full table with all 6 chairs & dishes fits completely
  const tableScale = isMobile ? 0.65 : 1.0;
  const tablePosY = isMobile ? 0.15 : 0;

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. DISTANT WEDDING STAGE & BALLROOM BACKGROUND ================= */}
      {/* Expanded Banquet Marble Floor extending towards the stage */}
      <mesh position={[0, -0.01, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 26]} />
        <meshStandardMaterial color="#0B132B" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Central Red Carpet Aisle leading from behind table to distant stage */}
      <mesh position={[0, 0.002, -5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 9.0]} />
        <meshStandardMaterial color="#881337" roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* Gold Trim for Central Carpet */}
      <mesh position={[-1.12, 0.004, -5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 9.0]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.12, 0.004, -5.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 9.0]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Distant Mid-Ground Banquet Tables on Left & Right wings (Creates authentic ballroom depth) */}
      {[-3.8, 3.8].map((x) => (
        <group key={x} position={[x, 0, -4.6]}>
          {/* Table Top */}
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.95, 1.05, 0.7, 24]} />
            <meshStandardMaterial color="#991B1B" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.732, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.96, 0.02, 12, 24]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Seated Guests in the distance */}
          {[0, 1.57, 3.14].map((ang, idx) => (
            <group
              key={idx}
              position={[Math.cos(ang) * 1.3, 0.4, Math.sin(ang) * 1.3]}
              rotation={[0, -ang - Math.PI / 2, 0]}
              scale={[0.5, 0.5, 0.5]}
            >
              <ChibiCharacter
                gender={idx % 2 === 0 ? 'male' : 'female'}
                outfit={idx % 2 === 0 ? 'vest_den' : 'vay_da_hoi'}
              />
            </group>
          ))}
        </group>
      ))}

      {/* ================= DISTANT GRAND STAGE (Z = -9.5m) ================= */}
      <group position={[0, 0, -9.5]}>
        {/* TikTok VIP Fireworks celebration FX */}
        <StageCelebrationFX position={[0, 4.2, 0]} />

        {/* Raised Stage Platform */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[13.0, 0.7, 3.8]} />
          <meshStandardMaterial color="#991B1B" roughness={0.4} />
        </mesh>
        {/* Stage Gold Perimeter Trim */}
        <mesh position={[0, 0.71, 0]}>
          <boxGeometry args={[12.9, 0.04, 3.7]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Backdrop Backing Board */}
        <mesh position={[0, 2.9, -1.2]}>
          <planeGeometry args={[8.5, 4.8]} />
          <meshStandardMaterial color="#0B132B" roughness={0.5} side={THREE.FrontSide} />
        </mesh>
        {/* Stage Gold Arch Crown */}
        <mesh position={[0, 5.3, -1.18]}>
          <boxGeometry args={[8.6, 0.25, 0.15]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* LIVE STAGE LED VIDEO SCREEN (Tỷ lệ chuẩn 16:9, phát video sân khấu xa xa) */}
        <StageVideoScreen width={7.2} height={4.05} />

        {/* Cô Dâu & Chú Rể đứng ở góc sân khấu */}
        <WeddingCouple position={[-2.4, 0.72, 0.6]} rotation={[0, 0.25, 0]} />

        {/* Bánh cưới 4 tầng bên trái sân khấu */}
        <group position={[-4.2, 0.72, 0.2]}>
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

        {/* Tháp ly champagne bên phải sân khấu */}
        <group position={[3.6, 0.72, 0.2]}>
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

      {/* Hall Back Wall & Curtains in the Far Distance */}
      <mesh position={[0, 5.0, -11.5]}>
        <planeGeometry args={[32, 10.5]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} side={THREE.FrontSide} />
      </mesh>
      {[-6.8, 6.8].map((side) => (
        <group key={side} position={[side, 4.0, -11.2]}>
          <mesh>
            <cylinderGeometry args={[0.9, 1.3, 7.5, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#7F1D1D" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Warm Stage Spotlight in the distance */}
      <pointLight position={[0, 6.5, -8.0]} color="#FEF3C7" intensity={1.5} distance={14} decay={2} />

      {/* ================= 2. FOREGROUND BANQUET TABLE ================= */}
      <group position={[0, tablePosY, 0]} scale={[tableScale, tableScale, tableScale]}>
        {/* Decorative Gold Floor Medallion Ring under Table */}
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.6, 2.75, 48]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Warm Dining Chandelier Point Light directly above center of table */}
        <pointLight position={[0, 2.8, 0]} color="#FFFBEB" intensity={1.8} distance={7} decay={2} />
        {/* Warm Fill Light */}
        <directionalLight position={[4, 6, 4]} color="#FEF3C7" intensity={0.9} />

      {/* ================= 2. BANQUET TABLE GEOMETRY (ALTITUDE: 0.73m) ================= */}
      {/* Main Table Top & Cloth (Top surface at y = 0.38 + 0.35 = 0.73m) */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[1.1, 1.2, 0.7, 48]} />
        <meshStandardMaterial color="#991B1B" roughness={0.4} />
      </mesh>

      {/* Gold Tablecloth Border Trim */}
      <mesh position={[0, 0.732, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.11, 0.025, 16, 48]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Inner Rotating Lazy Susan Glass Plate (Surface at y = 0.75m) */}
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.02, 32]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.15} metalness={0.15} />
      </mesh>

      {/* Table Center Base Column */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.25, 0.38, 0.36, 16]} />
        <meshStandardMaterial color="#7F1D1D" roughness={0.5} />
      </mesh>

      {/* ================= 3. TRADITIONAL 6-DISH BANQUET FEAST (ON LAZY SUSAN AT Y = 0.755m) ================= */}
      {/* Dish 6 (Centerpiece): Tô Canh Bóng Thập Cẩm (Center [0, 0.755, 0]) */}
      {dishes.includes('canh_bong') && <BanquetSoupBowl position={[0, 0.755, 0]} />}

      {/* Dish 1: Gà Luộc Lá Chanh (Angle 0° -> [0.45, 0.755, 0]) */}
      {dishes.includes('ga_luoc') && <RoastChickenDish position={[0.45, 0.755, 0]} />}

      {/* Dish 2: Tôm Sú Hấp Nước Dừa (Angle 72° -> [0.139, 0.755, 0.428]) */}
      {dishes.includes('tom_hap') && <SteamedShrimpDish position={[0.139, 0.755, 0.428]} />}

      {/* Dish 3: Xôi Gấc Hạt Sen Chữ Hỷ (Angle 144° -> [-0.364, 0.755, 0.264]) */}
      {dishes.includes('xoi_gac') && <StickyRiceDish position={[-0.364, 0.755, 0.264]} />}

      {/* Dish 4: Nem Rán Hà Nội Vàng Ruộm (Angle 216° -> [-0.364, 0.755, -0.264]) */}
      {dishes.includes('nem_ran') && <CrispySpringRollsDish position={[-0.364, 0.755, -0.264]} />}

      {/* Dish 5: Nộm Ngó Sen Tôm Thịt (Angle 288° -> [0.139, 0.755, -0.428]) */}
      {dishes.includes('nom_sen') && <FestiveSaladDish position={[0.139, 0.755, -0.428]} />}

      {/* ================= 4. 6 BEER MUGS (RESTING ON TABLECLOTH AT Y = 0.76m) ================= */}
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <BeerMugMesh key={idx} seatIndex={idx} />
      ))}

      {/* Cheers Particle Burst on Clink */}
      <CheersSparks />

      {/* 3D Red Envelope on table (Surface at y = 0.755m, nestled in spacious wedge) */}
      <RedEnvelope3D position={[0.52, 0.755, 0.35]} />

      {/* ================= 5. 6 SEATS & COMPANIONS (FACING 100% INWARD) ================= */}
      {currentTable.seats.map((seat, i) => {
        const angle = (i * Math.PI * 2) / 6;
        const seatDist = 1.45;
        const chairX = Math.cos(angle) * seatDist;
        const chairZ = Math.sin(angle) * seatDist;
        const hasGuest = !!seat.guest;
        const isSelf = seat.index === selectedSeatIndex || seat.guest?.isSelf;
        const displayName = isSelf ? (seat.guest?.name || guestName || 'Bạn') : (seat.guest?.name || 'Khách Mời');
        const bubble = activeChatBubbles?.[seat.index];

        return (
          <group
            key={seat.index}
            position={[chairX, 0, chairZ]}
            rotation={[0, -angle - Math.PI / 2, 0]}
          >
            {/* Chair Cushion */}
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.45, 0.08, 0.45]} />
              <meshStandardMaterial color="#B91C1C" roughness={0.4} />
            </mesh>
            {/* Chair Leg */}
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.32, 8]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Chair Backrest (Behind the guest at z = -0.20m) */}
            <mesh position={[0, 0.65, -0.2]}>
              <boxGeometry args={[0.42, 0.52, 0.05]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.7} roughness={0.2} />
            </mesh>

            {/* Guest Seated Facing Table Center */}
            {hasGuest && (
              <group position={[0, 0.38, 0]} scale={[0.62, 0.62, 0.62]}>
                <ChibiCharacter
                  gender={seat.guest.gender || 'male'}
                  outfit={seat.guest.outfit || 'vest_den'}
                  accessory="none"
                />
              </group>
            )}

            {/* Floating Character Name Tag Directly Above Head */}
            {hasGuest && (
              <Html position={[0, 1.48, 0]} center distanceFactor={isMobile ? 6.5 : 7.2}>
                <div className="pointer-events-none select-none flex items-center justify-center scale-90 sm:scale-100">
                  {isSelf ? (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-2 py-0.5 rounded-full border border-white shadow-lg text-[9px] font-black whitespace-nowrap animate-pulse">
                      <span>⭐</span>
                      <span className="truncate max-w-[95px]">{displayName} (Bạn)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-sm text-amber-200 px-1.5 py-0.5 rounded-full border border-amber-400/50 shadow-md text-[8.5px] font-bold whitespace-nowrap">
                      <span>{seat.guest.gender === 'female' ? '🌸' : '🎩'}</span>
                      <span className="truncate max-w-[85px]">{displayName}</span>
                    </div>
                  )}
                </div>
              </Html>
            )}

            {/* Speech Bubble Floating Above Head & Name Tag */}
            {hasGuest && bubble && (
              <Html position={[0, 1.9, 0]} center distanceFactor={isMobile ? 3.5 : 4.0}>
                <div className="pointer-events-none select-none flex flex-col items-center animate-in fade-in zoom-in-90 duration-200">
                  <div className="bg-slate-950/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-400 shadow-xl text-center max-w-[130px] sm:max-w-[145px]">
                    <div className="text-[9px] font-black text-amber-300 leading-none truncate">
                      {bubble.sender}
                    </div>
                    <p className="text-[10px] font-semibold text-white mt-0.5 break-words leading-tight drop-shadow">
                      {bubble.text}
                    </p>
                  </div>
                  {/* Bubble Tail */}
                  <div className="w-1.5 h-1.5 bg-amber-400 rotate-45 -mt-0.5 shadow" />
                </div>
              </Html>
            )}
          </group>
        );
      })}
      </group>

      {/* ================= 6. ELEVATED CAMERA ORBIT CONTROLS ================= */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={isMobile ? 2.5 : 1.8}
        maxDistance={isMobile ? 6.5 : 3.8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={isMobile ? Math.PI / 2.45 : Math.PI / 2.3}
        target={[0, isMobile ? 0.60 : 0.70, 0]}
      />
    </group>
  );
}

export default TableFocusScene;
