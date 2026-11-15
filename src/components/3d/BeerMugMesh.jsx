import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useWeddingStore from '../../store/useWeddingStore.js';

/**
 * BeerMugMesh
 * Premium Stylized Vietnamese Banquet Beer Mug (Cốc bia quai thủy tinh dày sủi bọt vàng óng).
 *
 * Features:
 * - Thick heavy glass base with crystal reflections.
 * - Golden amber lager beer liquid with rising micro-carbonation bubbles.
 * - Fluffy 3D puffy foam cloud head with realistic overflow droplets.
 * - Ergonomic curved clear glass handle.
 * - Dynamic clink animation: lifts, tilts inward and clinks cheerfully on Cheers!
 */
export function BeerMugMesh({ seatIndex = 0 }) {
  const mugRef = useRef();
  const bubblesRef = useRef();
  const { isCheersTriggered, cheersPhase } = useWeddingStore();

  const angle = (seatIndex * Math.PI * 2) / 6;
  const restDist = 0.84;
  const restX = Math.cos(angle) * restDist;
  const restZ = Math.sin(angle) * restDist;

  // Animate beer mug & rising bubbles
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!mugRef.current) return;

    if (isCheersTriggered) {
      // Clink Animation synchronized with the 3 chant phases
      let targetDist = 0.34;
      let targetY = 0.94;
      let tiltAngle = 0.22;

      if (cheersPhase === 2) {
        targetDist = 0.29;
        targetY = 0.96;
        tiltAngle = 0.28;
      } else if (cheersPhase === 3) {
        targetDist = 0.25;
        targetY = 0.99;
        tiltAngle = 0.35;
      }

      const targetX = Math.cos(angle) * targetDist;
      const targetZ = Math.sin(angle) * targetDist;

      mugRef.current.position.x += (targetX - mugRef.current.position.x) * 0.2;
      mugRef.current.position.z += (targetZ - mugRef.current.position.z) * 0.2;
      mugRef.current.position.y += (targetY - mugRef.current.position.y) * 0.2;

      // Inward tilt towards center
      mugRef.current.rotation.z = Math.sin(angle) * tiltAngle;
      mugRef.current.rotation.x = -Math.cos(angle) * tiltAngle;
    } else {
      // Return gently to table resting position
      mugRef.current.position.x += (restX - mugRef.current.position.x) * 0.12;
      mugRef.current.position.z += (restZ - mugRef.current.position.z) * 0.12;
      mugRef.current.position.y += (0.755 - mugRef.current.position.y) * 0.12;

      mugRef.current.rotation.z *= 0.85;
      mugRef.current.rotation.x *= 0.85;
    }

    // Micro-bubbles rising animation
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((b, i) => {
        b.position.y = 0.04 + ((t * 0.15 + i * 0.04) % 0.12);
      });
    }
  });

  return (
    <group ref={mugRef} position={[restX, 0.755, restZ]}>
      {/* ================= 1. HEAVY GLASS BASE ================= */}
      <mesh position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.076, 0.082, 0.036, 24]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.05}
          metalness={0.15}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* ================= 2. TRANSPARENT GLASS OUTER WALL ================= */}
      <mesh position={[0, 0.115, 0]}>
        <cylinderGeometry args={[0.078, 0.072, 0.18, 24]} />
        <meshStandardMaterial
          color="#F1F5F9"
          roughness={0.06}
          metalness={0.1}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Glass Top Lip Ring */}
      <mesh position={[0, 0.205, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.077, 0.007, 12, 24]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.05}
          metalness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* ================= 3. GOLDEN AMBER LAGER BEER ================= */}
      <mesh position={[0, 0.105, 0]}>
        <cylinderGeometry args={[0.072, 0.066, 0.155, 20]} />
        <meshStandardMaterial
          color="#F59E0B"
          roughness={0.15}
          metalness={0.15}
        />
      </mesh>

      {/* Carbonation Micro-Bubbles inside beer */}
      <group ref={bubblesRef}>
        {[
          [-0.03, 0.05, 0.02],
          [0.02, 0.08, -0.03],
          [-0.01, 0.11, 0.04],
          [0.035, 0.07, 0.01],
          [-0.02, 0.13, -0.02]
        ].map(([bx, by, bz], i) => (
          <mesh key={i} position={[bx, by, bz]}>
            <sphereGeometry args={[0.006, 8, 8]} />
            <meshStandardMaterial color="#FEF08A" roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* ================= 4. FLUFFY BEER FOAM HEAD (BỌT BIA BÔNG XỐP) ================= */}
      {/* Foam Base Crown */}
      <mesh position={[0, 0.195, 0]}>
        <cylinderGeometry args={[0.075, 0.074, 0.03, 20]} />
        <meshStandardMaterial color="#FFFDF5" roughness={0.85} />
      </mesh>

      {/* Puffy 3D Foam Dollops / Clouds on Rim */}
      {[
        [0, 0.215, 0, 0.038],
        [0.045, 0.21, 0.02, 0.028],
        [-0.04, 0.212, 0.03, 0.03],
        [0.02, 0.214, -0.045, 0.032],
        [-0.035, 0.208, -0.035, 0.026],
        [0.05, 0.205, -0.01, 0.024],
        [-0.055, 0.205, 0.01, 0.025]
      ].map(([fx, fy, fz, fr], idx) => (
        <mesh key={idx} position={[fx, fy, fz]}>
          <sphereGeometry args={[fr, 12, 12]} />
          <meshStandardMaterial color="#FFFDF5" roughness={0.88} />
        </mesh>
      ))}

      {/* Delicious Foam Droplet Drip on outside of glass */}
      <mesh position={[0.077, 0.175, 0.02]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#FFFDF5" roughness={0.8} />
      </mesh>

      {/* ================= 5. CURVED THICK GLASS HANDLE ================= */}
      <group position={[0.092, 0.11, 0]} rotation={[0, 0, -Math.PI / 2]}>
        {/* Main Handle Arc */}
        <mesh>
          <torusGeometry args={[0.055, 0.015, 12, 24, Math.PI * 1.15]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.06}
            metalness={0.15}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>
    </group>
  );
}

export default BeerMugMesh;
