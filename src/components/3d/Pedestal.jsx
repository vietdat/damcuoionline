import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Festive 3D Pedestal for Scene 1 (Dress-up stage)
 * Fixed: Golden rim is properly rotated horizontally to hug the circular base
 */
export function Pedestal() {
  const glowRingRef = useRef();

  useFrame((state, delta) => {
    if (glowRingRef.current) {
      glowRingRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Main Red Velvet Platform Base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.3, 1.45, 0.3, 48]} />
        <meshStandardMaterial color="#991B1B" roughness={0.4} />
      </mesh>

      {/* Gold Rim Border - ROTATED HORIZONTALLY to hug the rim perimeter */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.035, 16, 64]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Decorative Gold Circular Carpet Inner */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.28, 48]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.6} />
      </mesh>

      {/* Golden Inner Trim Ring on Carpet */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.0, 48]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Glowing Energy Ring on Floor */}
      <mesh ref={glowRingRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.15, 48]} />
        <meshBasicMaterial color="#FEF08A" transparent opacity={0.35} />
      </mesh>

      {/* Soft Contact Shadow beneath pedestal */}
      <mesh position={[0, -0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.65, 32]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default Pedestal;
