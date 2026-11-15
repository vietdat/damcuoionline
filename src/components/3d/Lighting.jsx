import React from 'react';

/**
 * Lighting component for the Virtual Wedding scene.
 * Adheres to threejs-performance-master:
 * - Warm ambient light for cozy banquet feeling
 * - Directional light for depth without expensive realtime shadows
 */
export function Lighting() {
  return (
    <>
      {/* Warm ambient base light */}
      <ambientLight color="#FFFBEB" intensity={0.7} />
      
      {/* Key light for 3D depth */}
      <directionalLight 
        position={[5, 8, 5]} 
        color="#FEF3C7" 
        intensity={1.0} 
        castShadow={false} // Performance: Bake shadows or use contact planes
      />

      {/* Subtle fill light */}
      <directionalLight 
        position={[-5, 4, -5]} 
        color="#FDE68A" 
        intensity={0.4} 
        castShadow={false}
      />
    </>
  );
}

export default Lighting;
