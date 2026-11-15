import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import soundManager from '../../audio/soundManager.js';
import useWeddingStore from '../../store/useWeddingStore.js';

export function RedEnvelope3D({ position = [0.45, 0.74, 0.55] }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { setQRModalOpen } = useWeddingStore();

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 6) * 0.02 + 0.02;
    } else if (meshRef.current) {
      meshRef.current.position.y = position[1];
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    soundManager.playClick();
    setQRModalOpen(true);
  };

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0.4]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Red Envelope Pouch */}
      <mesh>
        <boxGeometry args={[0.22, 0.32, 0.015]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.3} />
      </mesh>

      {/* Gold Trim Flap */}
      <mesh position={[0, 0.08, 0.009]}>
        <coneGeometry args={[0.11, 0.08, 3]} />
        <meshStandardMaterial color="#DC2626" roughness={0.3} />
      </mesh>

      {/* Golden "Hỷ" Double Happiness emblem on front */}
      <mesh position={[0, -0.02, 0.01]}>
        <circleGeometry args={[0.045, 16]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default RedEnvelope3D;
