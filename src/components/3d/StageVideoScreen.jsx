import React, { Suspense, useEffect } from 'react';
import { useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import soundManager from '../../audio/soundManager.js';

/**
 * VideoPlane
 * Uses Drei's official useVideoTexture to map 60 FPS video frames onto the 3D Stage Screen.
 * Placed safely at z = 0.04 to guarantee ZERO co-planar Z-fighting.
 */
function VideoPlane({ width = 7.2, height = 4.05 }) {
  const texture = useVideoTexture('/videos/wedding_stage.mp4', {
    crossOrigin: 'anonymous',
    muted: true, // Required for unblocked autoplay in Chrome/Safari
    loop: true,
    start: true,
    playsInline: true,
  });

  useEffect(() => {
    if (texture && texture.image) {
      window.__stageVideoElement = texture.image;
      texture.image.id = 'stage-wedding-video-element';
    }
  }, [texture]);

  const handleToggleSound = (e) => {
    e.stopPropagation();
    soundManager.playClick();
    if (texture && texture.image) {
      const video = texture.image;
      video.muted = !video.muted;
      video.volume = 0.9;
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  };

  return (
    <mesh
      position={[0, 0, 0.04]}
      onClick={handleToggleSound}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function FallbackScreen({ width = 7.2, height = 4.05 }) {
  return (
    <mesh position={[0, 0, 0.04]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color="#0B132B" />
    </mesh>
  );
}

/**
 * StageVideoScreen
 * Primary 3D LED Stage Screen with 16:9 Aspect Ratio.
 * Features:
 * - 4-piece hollow golden bezel framing the perimeter (never overlaps the video surface).
 * - Recessed back panel at z = -0.02 (video plane is at z = +0.04, completely preventing Z-fighting).
 * - Golden ambient backlight glow behind the screen.
 */
export function StageVideoScreen({ width = 7.2, height = 4.05 }) {
  const bezelThick = 0.1; // 10cm wide golden border
  const bezelDepth = 0.05;

  return (
    <group position={[0, 2.7, -0.95]}>
      {/* 1. 3D LED Screen Surface displaying video texture (z = +0.04) */}
      <Suspense fallback={<FallbackScreen width={width} height={height} />}>
        <VideoPlane width={width} height={height} />
      </Suspense>

      {/* 2. 4-Piece Perimeter Gold Bezel Frame (Sits around the outer edges, never covering the screen) */}
      {/* Top Border */}
      <mesh position={[0, height / 2 + bezelThick / 2, 0.035]}>
        <boxGeometry args={[width + bezelThick * 2, bezelThick, bezelDepth]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Bottom Border */}
      <mesh position={[0, -height / 2 - bezelThick / 2, 0.035]}>
        <boxGeometry args={[width + bezelThick * 2, bezelThick, bezelDepth]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Left Border */}
      <mesh position={[-width / 2 - bezelThick / 2, 0, 0.035]}>
        <boxGeometry args={[bezelThick, height, bezelDepth]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Right Border */}
      <mesh position={[width / 2 + bezelThick / 2, 0, 0.035]}>
        <boxGeometry args={[bezelThick, height, bezelDepth]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* 3. Recessed Backing Casing (z = -0.02, safely behind the video plane) */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + bezelThick * 2, height + bezelThick * 2, 0.04]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>

      {/* 4. Golden Ambient Backlight Halo */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width + 0.6, height + 0.6]} />
        <meshBasicMaterial color="#FEF08A" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default StageVideoScreen;
