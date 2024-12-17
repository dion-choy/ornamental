import React, { useRef, useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader, useFrame } from "@react-three/fiber";

function Model(props) {
    const gltf = useLoader(GLTFLoader, props.file);
    const rotate = useRef();

    useFrame(() => {
        if (props.rotate) {
            rotate.current.rotation.y += props.rotate;
        }
    });

    useEffect(() => {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, gltf);

    return (
        <mesh castShadow receiveShadow>
            <primitive object={gltf.scene} ref={rotate} scale={2} />
        </mesh>
    );
}

export default Model;
