import React from "react";

// DION File
function LightBulb(props) {
  return (
    <mesh position={props.position}>
      <pointLight
        color={props.color} // Load color
        shadow-bias={-0.001}
        castShadow={true} // Enable cast shadows
        intensity={props.intensity} // Intensity
        shadow-camera-far={10}
        shadow-mapSize={[props.shadows, props.shadows]} // Load shadow map (resolution)
      />
      <sphereGeometry args={props.size} />
    </mesh>
  );
}

export default LightBulb;
