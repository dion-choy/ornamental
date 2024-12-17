import React, { useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { CubeTextureLoader } from "three";

function Skybox(props) {
    const { scene } = useThree();

    const [texture] = useLoader(CubeTextureLoader, [
        ["./test.png", "./test.png", "./test.png", "./test.png", "./test.png", "./test.png"],
    ]);

    scene.background = texture;
    scene.environment = texture;

    return null;
}

export default Skybox;
