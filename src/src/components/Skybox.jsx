import React, { useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { CubeTextureLoader } from "three";

// DION File
function Skybox(props) {
  const { scene } = useThree();

  // Load textures
  const [texture] = useLoader(CubeTextureLoader, [
    [
      "/bg/px.png",
      "/bg/nx.png",
      "/bg/py.png",
      "/bg/ny.png",
      "/bg/pz.png",
      "/bg/nz.png",
    ],
  ]);

  scene.background = texture; // Apply to scene
  scene.environment = texture;

  return null;
}

export default Skybox;
