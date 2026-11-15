import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import HallEnvironment from './HallEnvironment.jsx';
import WeddingTableMesh from './WeddingTableMesh.jsx';
import ChibiCharacter from './ChibiCharacter.jsx';
import StageCelebrationFX from './StageCelebrationFX.jsx';
import TikTokGuestsManager from './TikTokGuestsManager.jsx';
import useWeddingStore from '../../store/useWeddingStore.js';

/**
 * Scene 2: Sảnh tiệc cưới 3D toàn cảnh & Chọn bàn ngồi (3rd-Person Walk-in Flow)
 * - 3rd-Person Experience: User's customized Chibi character actually WALKS from the
 *   aisle into the selected banquet table with cute waddle steps & follow camera.
 * - Confirmed 2-Step Entry: Bấm vào bàn -> Nhân vật đi vào bàn -> Bấm lần 2 để vào mâm.
 */
export function HallScene() {
  const {
    tables,
    focusedTableId,
    focusTable,
    guestName,
    guestGender,
    selectedOutfit,
    selectedAccessory
  } = useWeddingStore();

  const { size, camera } = useThree();
  const isMobile = size.width < 768;

  const controlsRef = useRef(null);
  const prevFocusedId = useRef(focusedTableId);
  const isAnimating = useRef(false);
  const animStartTime = useRef(0);
  const startCamPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endCamPos = useRef(new THREE.Vector3());
  const endTarget = useRef(new THREE.Vector3());

  // 3rd-Person Walking Avatar Refs & Geometry
  const avatarGroupRef = useRef();
  const avatarCurrentPos = useRef(new THREE.Vector3(0, 0, 6.6)); // Starts at Welcome Stand Platform [0, 0, 6.6]
  const avatarStartPos = useRef(new THREE.Vector3(0, 0, 6.6));
  const avatarEndPos = useRef(new THREE.Vector3(0, 0, 6.6));
  const avatarCtrlPos = useRef(new THREE.Vector3(0, 0, 6.6));
  const avatarRotationY = useRef(Math.PI); // Facing north towards stage
  const isAvatarWalking = useRef(false);
  const walkStartTime = useRef(0);
  const WALK_DURATION = 1.7; // 1.7s smooth, adorable walking animation

  // Trigger 3rd-person walk whenever focusedTableId changes
  useEffect(() => {
    if (prevFocusedId.current !== focusedTableId) {
      prevFocusedId.current = focusedTableId;

      if (controlsRef.current) {
        startCamPos.current.copy(camera.position);
        startTarget.current.copy(controlsRef.current.target);

        if (focusedTableId !== null) {
          // Find target table coordinates
          const targetTable = tables.find((t) => t.id === focusedTableId);
          if (targetTable) {
            const posX = isMobile
              ? targetTable.position[0] <= -5
                ? -6.8
                : targetTable.position[0] < 0
                ? -2.9
                : targetTable.position[0] >= 5
                ? 6.8
                : 2.9
              : targetTable.position[0];
            const posZ = targetTable.position[2];

            // 1. Plan Avatar Walk Path (Quadratic Bezier Curve from Welcome Stand to Table)
            avatarStartPos.current.copy(avatarCurrentPos.current);
            const standOffsetX = posX < 0 ? 0.4 : -0.4;
            avatarEndPos.current.set(posX + standOffsetX, 0, posZ + 1.25);
            // Control point: moves down the aisle along Z first before turning into the table row
            avatarCtrlPos.current.set(avatarStartPos.current.x, 0, posZ + 1.25);

            isAvatarWalking.current = true;
            walkStartTime.current = performance.now();

            // 2. 3rd-Person Camera Pose (Follows behind character looking at the table)
            endTarget.current.set(posX, 0.8, posZ);
            const camOffsetX = posX < 0 ? (isMobile ? 0.35 : 0.6) : (isMobile ? -0.35 : -0.6);
            endCamPos.current.set(
              posX + camOffsetX,
              isMobile ? 2.3 : 2.5,
              posZ + (isMobile ? 3.0 : 3.4)
            );
          }
        } else {
          // Return walk back to Welcome Stand Platform at [0, 0, 6.6]!
          avatarStartPos.current.copy(avatarCurrentPos.current);
          avatarEndPos.current.set(0, 0, 6.6);
          avatarCtrlPos.current.set(0, 0, avatarStartPos.current.z);

          isAvatarWalking.current = true;
          walkStartTime.current = performance.now();

          // Zoom out back to grand hall overview
          endTarget.current.set(isMobile ? -0.2 : 0, 1.2, 0.2);
          endCamPos.current.set(
            isMobile ? 4.2 : 0,
            isMobile ? 8.2 : 7.5,
            isMobile ? 13.5 : 12.8
          );
        }

        isAnimating.current = true;
        animStartTime.current = performance.now();
      }
    }
  }, [focusedTableId, isMobile, tables, camera]);

  // Frame-rate independent 3rd-person walk & camera follow loop
  useFrame((state) => {
    const now = performance.now();

    // 1. Avatar Walking Motion (Bezier Path + Chibi Waddle)
    if (isAvatarWalking.current && avatarGroupRef.current) {
      const elapsed = (now - walkStartTime.current) / 1000;
      const progress = Math.min(1, elapsed / WALK_DURATION);

      // Smooth quadratic ease-in-out curve
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      // Quadratic Bezier interpolation: P(t) = (1-t)^2 * P0 + 2*(1-t)*t * P_ctrl + t^2 * P1
      const invT = 1 - ease;
      const x = invT * invT * avatarStartPos.current.x + 2 * invT * ease * avatarCtrlPos.current.x + ease * ease * avatarEndPos.current.x;
      const z = invT * invT * avatarStartPos.current.z + 2 * invT * ease * avatarCtrlPos.current.z + ease * ease * avatarEndPos.current.z;

      // Calculate tangent vector for walking orientation
      const dx = 2 * invT * (avatarCtrlPos.current.x - avatarStartPos.current.x) + 2 * ease * (avatarEndPos.current.x - avatarCtrlPos.current.x);
      const dz = 2 * invT * (avatarCtrlPos.current.z - avatarStartPos.current.z) + 2 * ease * (avatarEndPos.current.z - avatarCtrlPos.current.z);

      if (Math.hypot(dx, dz) > 0.001) {
        avatarRotationY.current = Math.atan2(dx, dz);
      }

      // Adorable Chibi step bounce & side-to-side waddle
      const stepBounce = Math.abs(Math.sin(elapsed * 13)) * 0.12;
      const stepWaddle = Math.sin(elapsed * 13) * 0.08;

      avatarCurrentPos.current.set(x, stepBounce, z);
      avatarGroupRef.current.position.set(x, stepBounce, z);
      avatarGroupRef.current.rotation.set(0, avatarRotationY.current, stepWaddle);

      if (progress >= 1) {
        isAvatarWalking.current = false;
        avatarGroupRef.current.position.set(avatarEndPos.current.x, 0, avatarEndPos.current.z);
        // Arrived at table: smoothly face inward toward table center
        const targetTable = tables.find((t) => t.id === focusedTableId);
        if (targetTable) {
          const tX = isMobile
            ? targetTable.position[0] <= -5 ? -6.8 : targetTable.position[0] < 0 ? -2.9 : targetTable.position[0] >= 5 ? 6.8 : 2.9
            : targetTable.position[0];
          avatarGroupRef.current.rotation.set(
            0,
            Math.atan2(tX - avatarEndPos.current.x, targetTable.position[2] - avatarEndPos.current.z),
            0
          );
        } else {
          // Returned back to entrance welcome stand: face North towards the stage
          avatarGroupRef.current.rotation.set(0, Math.PI, 0);
        }
      }
    } else if (avatarGroupRef.current) {
      // Idle gentle breathing when standing
      const t = state.clock.elapsedTime;
      avatarGroupRef.current.position.y = Math.sin(t * 3) * 0.015;
    }

    // 2. 3rd-Person Follow Camera Interpolation
    if (isAnimating.current && controlsRef.current) {
      const elapsed = (now - animStartTime.current) / 1000;
      const progress = Math.min(1, elapsed / WALK_DURATION);

      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      if (focusedTableId !== null && isAvatarWalking.current) {
        // Smoothly trail behind character
        controlsRef.current.target.set(
          avatarCurrentPos.current.x,
          0.85,
          avatarCurrentPos.current.z
        );
        camera.position.lerpVectors(startCamPos.current, endCamPos.current, ease);
      } else {
        camera.position.lerpVectors(startCamPos.current, endCamPos.current, ease);
        controlsRef.current.target.lerpVectors(startTarget.current, endTarget.current, ease);
      }
      controlsRef.current.update();

      if (progress >= 1) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Wedding Hall Architecture & Stage Decor */}
      <HallEnvironment isMobile={isMobile} />

      {/* 3D Stage Celebration FX (TikTok Live VIP Fireworks) */}
      <StageCelebrationFX position={[0, 4.2, -9.8]} />

      {/* Realtime TikTok Guests at Gate & Walking down the Aisle */}
      <TikTokGuestsManager />

      {/* 12 Banquet Tables arranged in 4 grand columns flanking the central aisle */}
      {tables.map((table) => {
        // On mobile portrait, cluster tables with generous 3.9m spacing between columns to prevent chair collisions
        // Left Outer (-7.4) -> -6.8 | Left Inner (-3.6) -> -2.9
        // Right Inner (+3.6) -> +2.9 | Right Outer (+7.4) -> +6.8
        const posX = isMobile
          ? table.position[0] <= -5
            ? -6.8
            : table.position[0] < 0
            ? -2.9
            : table.position[0] >= 5
            ? 6.8
            : 2.9
          : table.position[0];
        const responsivePos = [posX, table.position[1], table.position[2]];

        return (
          <WeddingTableMesh
            key={table.id}
            table={{ ...table, position: responsivePos }}
            onSelectTable={focusTable}
            isFocused={focusedTableId === table.id}
          />
        );
      })}

      {/* ================= 3RD-PERSON GUEST AVATAR (Nhân Vật Khách Mời Của Bạn) ================= */}
      <group
        ref={avatarGroupRef}
        position={[0, 0, 6.6]}
        rotation={[0, Math.PI, 0]}
        scale={[0.65, 0.65, 0.65]}
      >
        <ChibiCharacter
          gender={guestGender}
          outfit={selectedOutfit}
          accessory={selectedAccessory}
        />

        {/* Floating VIP Name Badge above Avatar */}
        <Html position={[0, 2.2, 0]} center distanceFactor={6.5}>
          <div className="pointer-events-none select-none flex flex-col items-center">
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full border-2 border-white shadow-xl text-[10px] font-black whitespace-nowrap animate-pulse">
              <span>⭐</span>
              <span>{guestName} (Bạn)</span>
            </div>
            {focusedTableId === null && (
              <div className="mt-1 bg-slate-950/90 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-400/50 shadow whitespace-nowrap">
                👇 Chạm vào bàn để bước vào
              </div>
            )}
          </div>
        </Html>
      </group>

      {/* 3D Orbit Controls for exploring the hall */}
      <OrbitControls
        ref={controlsRef}
        enablePan={!isMobile}
        enableZoom={true}
        minDistance={focusedTableId !== null ? 2.2 : 5}
        maxDistance={focusedTableId !== null ? (isMobile ? 8.5 : 10.5) : (isMobile ? 16.5 : 18.5)}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        minAzimuthAngle={-Math.PI / 2.15}
        maxAzimuthAngle={Math.PI / 2.15}
        target={isMobile ? [-0.2, 1.2, 0.2] : [0, 1.0, 0.2]}
      />
    </group>
  );
}

export default HallScene;
