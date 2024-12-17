import React from "react";
import { useThree } from "@react-three/fiber";
import CubeTextureLoader from "three";

function Skybox(props) {
    const size = props.size;
    const { scene } = useThree();

    const loader = new CubeTextureLoader();
    const texture = loader.load("/test.png");

    scene.background.set(texture);

    return (
        <mesh
            position={props.position}
            rotateX={props.rotateX}
            rotateY={props.rotateY}
            recieveShadow={true}
            castShadow
        ></mesh>
    );
}

export default Skybox;
