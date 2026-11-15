import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import Lighting from './Lighting.jsx';
import LobbyScene from './LobbyScene.jsx';
import HallScene from './HallScene.jsx';
import TableFocusScene from './TableFocusScene.jsx';
import useWeddingStore from '../../store/useWeddingStore.js';

/**
 * CameraController adjusts the default camera angle when switching between the 3 scenes,
 * adapting dynamically to desktop widescreen vs mobile portrait aspect ratios.
 */
function CameraController({ currentScene }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const isMobile = size.width < 768;

    if (currentScene === 1) {
      if (isMobile) {
        // Mobile portrait: move camera back and look slightly higher to frame full Chibi + pedestal
        camera.position.set(0, 1.25, 5.2);
        camera.lookAt(0, 0.71, 0);
      } else {
        camera.position.set(0, 1.2, 4.3);
        camera.lookAt(0, 0.8, 0);
      }
    } else if (currentScene === 2) {
      if (isMobile) {
        // Solution 1: Cinematic Angled 35° Perspective on mobile portrait
        // Elevates camera to a dynamic diagonal vantage point overlooking all 12 banquet tables
        camera.position.set(4.2, 8.2, 13.5);
        camera.lookAt(-0.2, 1.2, 0.2);
      } else {
        // Majestic, spacious vantage point overlooking the grand aisle and all 12 tables
        camera.position.set(0, 7.5, 12.8);
        camera.lookAt(0, 1.2, -0.5);
      }
    } else if (currentScene === 3) {
      if (isMobile) {
        // Mobile portrait: elevated bird's-eye vantage point [0, 4.3, 4.2] looking down at [0, 0.60, 0]
        // Perfectly frames the entire circular table, all 6 dishes, and all 6 chairs without any clipping
        camera.position.set(0, 4.3, 4.2);
        camera.lookAt(0, 0.60, 0);
      } else {
        // Intimate, mouthwatering banquet view from elevated 40° angle (prevents button overlap)
        camera.position.set(0, 2.3, 2.6);
        camera.lookAt(0, 0.70, 0);
      }
    }
  }, [currentScene, camera, size.width]);

  return null;
}

/**
 * WeddingCanvas - The primary WebGL Canvas for Đi Đám Cưới Online 3D.
 */
export function WeddingCanvas() {
  const { currentScene } = useWeddingStore();

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 1.2, 4.3], fov: 44 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0B0F19');
        }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <CameraController currentScene={currentScene} />

          {/* Scene 1: Lobby & 360° Dress-up */}
          {currentScene === 1 && <LobbyScene />}

          {/* Scene 2: Sảnh Tiệc 3D & Chọn Bàn */}
          {currentScene === 2 && <HallScene />}

          {/* Scene 3: Bàn Tiệc Cận Cảnh (Mâm Cỗ & Cụng Ly) */}
          {currentScene === 3 && <TableFocusScene />}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default WeddingCanvas;
