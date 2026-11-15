import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Procedural Hot Food Steam Effect
 * Creates gentle rising steam wisps above hot banquet dishes.
 */
export function DishSteamParticles({ position = [0, 0.85, 0] }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((particle, idx) => {
        particle.position.y += delta * (0.15 + idx * 0.05);
        particle.scale.x += delta * 0.08;
        particle.scale.y += delta * 0.08;
        // Reset when too high
        if (particle.position.y > 0.5) {
          particle.position.y = 0.05;
          particle.scale.set(1, 1, 1);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 0.2,
            0.05 + i * 0.1,
            (Math.random() - 0.5) * 0.2
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export default DishSteamParticles;
