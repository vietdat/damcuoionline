import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * TestObject component to verify 60 FPS render loop and stylized materials.
 * Adheres to procedural-3d-stylized & senior-developer standards.
 */
export function TestObject() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
      // Gentle floating bobbing effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Red Festive Pedestal */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Gold Trim Ring */}
      <mesh position={[0, -0.4, 0]}>
        <torusGeometry args={[1.22, 0.05, 16, 32]} />
        <meshStandardMaterial color="#FBBF24" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Stylized Golden Cube representing Fortune / Happiness */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#DC2626" roughness={0.25} metalness={0.2} />
      </mesh>

      {/* Gold Ribbon / Ring floating */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <torusGeometry args={[0.75, 0.04, 16, 32]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

export default TestObject;
