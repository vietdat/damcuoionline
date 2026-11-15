import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import TableLabel from './TableLabel.jsx';
import ChibiCharacter from './ChibiCharacter.jsx';
import soundManager from '../../audio/soundManager.js';

/**
 * WeddingTableMesh
 * - Chairs and seated guests strictly face the center [0, 0, 0] of the banquet table
 * - Empty seats feature an elegant golden halo indicator (no weird green spheres)
 */
export function WeddingTableMesh({ table, onSelectTable, isFocused = false }) {
  const [hovered, setHovered] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const handleTableClick = (e) => {
    e.stopPropagation();
    soundManager.playClick();
    if (onSelectTable) {
      onSelectTable(table.id, null);
    }
  };

  const handleSeatClick = (e, seatIndex) => {
    e.stopPropagation();
    soundManager.playClick();
    if (onSelectTable) {
      onSelectTable(table.id, seatIndex);
    }
  };

  return (
    <group
      position={table.position}
      onClick={handleTableClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Floating Table Name Label (Elevated at y = 2.15 - 2.35) */}
      <TableLabel
        name={table.name}
        clinks={table.cheersCount}
        isHovered={hovered}
        isFocused={isFocused}
      />

      {/* Radiant Golden Floor Ring & Spotlight when table is focused/selected */}
      {isFocused && (
        <>
          <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.55, 1.85, 48]} />
            <meshStandardMaterial
              color="#FBBF24"
              emissive="#F59E0B"
              emissiveIntensity={0.85}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <pointLight position={[0, 2.6, 0]} color="#FEF3C7" intensity={1.8} distance={6} decay={2} />
        </>
      )}

      {/* Main Table Top & Cloth */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[1.05, 1.15, 0.7, 36]} />
        <meshStandardMaterial color="#991B1B" roughness={0.4} />
      </mesh>

      {/* Gold Tablecloth Border Trim */}
      <mesh position={[0, 0.73, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.06, 0.025, 16, 36]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Inner Rotating Lazy Susan (Mâm xoay kính) */}
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.03, 32]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Table Base Column */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 0.4, 16]} />
        <meshStandardMaterial color="#7F1D1D" roughness={0.5} />
      </mesh>

      {/* Soft Contact Shadow beneath table */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.75, 32]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.45} />
      </mesh>

      {/* ================= 6 SEATS AROUND TABLE ================= */}
      {table.seats.map((seat, i) => {
        const angle = (i * Math.PI * 2) / 6;
        const seatDist = 1.28; // Ergonomic seating tucked neatly at table edge (prevents back-to-back collision)
        const chairX = Math.cos(angle) * seatDist;
        const chairZ = Math.sin(angle) * seatDist;
        const isEmpty = !seat.guest;
        const isThisSeatHovered = hoveredSeat === seat.index;

        // Perfect inward orientation: chair and guest face directly towards table center [0, 0, 0]
        const chairRotationY = -angle - Math.PI / 2;

        return (
          <group
            key={seat.index}
            position={[chairX, 0, chairZ]}
            rotation={[0, chairRotationY, 0]}
          >
            {/* Chair Base / Seat Cushion */}
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.42]} />
              <meshStandardMaterial color="#991B1B" roughness={0.4} />
            </mesh>

            {/* Chair Legs */}
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Chair Backrest (Behind the guest) */}
            <mesh position={[0, 0.65, -0.19]}>
              <boxGeometry args={[0.4, 0.52, 0.05]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.7} roughness={0.2} />
            </mesh>

            {/* IF OCCUPIED: Render Seated Chibi Character Facing Inward */}
            {!isEmpty && (
              <group position={[0, 0.4, 0]} scale={[0.6, 0.6, 0.6]}>
                <ChibiCharacter
                  gender={seat.guest.gender || 'male'}
                  outfit={seat.guest.outfit || 'vest_den'}
                  accessory="none"
                />
              </group>
            )}

            {/* Show seated guest's name directly above their head in Hall Scene */}
            {!isEmpty && seat.guest && (isFocused || seat.guest.isTikTokGuest) && (
              <Html position={[0, 1.48, 0]} center distanceFactor={7.5}>
                <div className="pointer-events-none select-none flex items-center justify-center animate-in fade-in duration-200">
                  {seat.guest.isTikTokGuest ? (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white px-2 py-0.5 rounded-full shadow-lg border border-pink-300 text-[8.5px] font-black whitespace-nowrap animate-pulse">
                      <span>🎵</span>
                      <span>{seat.guest.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-sm text-amber-200 px-1.5 py-0.5 rounded-full border border-amber-400/50 shadow-md text-[8.5px] font-bold whitespace-nowrap">
                      <span>{seat.guest.gender === 'female' ? '🌸' : '🎩'}</span>
                      <span>{seat.guest.name}</span>
                    </div>
                  )}
                </div>
              </Html>
            )}

            {/* IF EMPTY: Elegant Golden Halo & Subtle Sparkle Indicator */}
            {isEmpty && (
              <group
                position={[0, 0.41, 0]}
                onClick={(e) => handleSeatClick(e, seat.index)}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredSeat(seat.index);
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredSeat(null);
                  document.body.style.cursor = 'auto';
                }}
              >
                {/* Golden Pulsing Halo Disc on Cushion */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.06, 0.16, 32]} />
                  <meshBasicMaterial
                    color="#FBBF24"
                    transparent
                    opacity={isThisSeatHovered ? 0.95 : 0.6}
                  />
                </mesh>

                {/* Floating Golden Cross / Sparkle Emblem */}
                <group position={[0, 0.08, 0]} scale={isThisSeatHovered ? [1.25, 1.25, 1.25] : [1, 1, 1]}>
                  {/* Vertical bar */}
                  <mesh>
                    <boxGeometry args={[0.03, 0.12, 0.03]} />
                    <meshStandardMaterial color="#FEF08A" emissive="#F59E0B" emissiveIntensity={0.6} metalness={0.8} />
                  </mesh>
                  {/* Horizontal bar */}
                  <mesh>
                    <boxGeometry args={[0.12, 0.03, 0.03]} />
                    <meshStandardMaterial color="#FEF08A" emissive="#F59E0B" emissiveIntensity={0.6} metalness={0.8} />
                  </mesh>
                </group>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default WeddingTableMesh;
