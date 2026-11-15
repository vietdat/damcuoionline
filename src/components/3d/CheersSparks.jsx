import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useWeddingStore from '../../store/useWeddingStore.js';

export function CheersSparks() {
  const { isCheersTriggered, cheersPhase } = useWeddingStore();
  const sparksRef = useRef();
  const prevPhase = useRef(0);

  useFrame((state, delta) => {
    if (!sparksRef.current) return;
    if (isCheersTriggered) {
      sparksRef.current.visible = true;

      // When transitioning to a new chant phase, restart the burst scale
      if (prevPhase.current !== cheersPhase) {
        prevPhase.current = cheersPhase;
        const initialScale = cheersPhase === 3 ? 0.6 : 0.35;
        sparksRef.current.scale.set(initialScale, initialScale, initialScale);
      }

      // Smooth expansion and rotation during phase
      const growthRate = cheersPhase === 3 ? 2.5 : 1.6;
      sparksRef.current.scale.addScalar(delta * growthRate);
      sparksRef.current.rotation.y += delta * 5;
    } else {
      sparksRef.current.visible = false;
      sparksRef.current.scale.set(0.1, 0.1, 0.1);
      prevPhase.current = 0;
    }
  });

  return (
    <group ref={sparksRef} position={[0, 1.05, 0]} visible={false}>
      {/* Central Flash */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#FEF08A" transparent opacity={0.8} />
      </mesh>

      {/* Bursting Golden Sparks */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const ang = (i * Math.PI * 2) / 8;
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * 0.28, (Math.random() - 0.5) * 0.15, Math.sin(ang) * 0.28]}
          >
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#FBBF24" />
          </mesh>
        );
      })}
    </group>
  );
}

export default CheersSparks;
