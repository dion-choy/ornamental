import React, { useRef, useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { PointLight, AnimationMixer, MeshBasicMaterial } from "three";

export default function Gift(props) {
    const gltf = useLoader(GLTFLoader, props.file);
    const rotate = useRef();
    let mixer;
    const { scene } = useThree();

    useFrame((state, delta) => {
        if (props.rotate) {
            rotate.current.rotation.y += props.rotate;
        }
        mixer?.update(delta);
    });

    useEffect(() => {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.emissive.set("white");
                child.material.emissive.set("white");
            }
        });
    }, [gltf]);

    return (
        <mesh
            position={props.position}
            onClick={(event, test) => {
                console.log(event);
                console.log(test);
            }}
        >
            <primitive object={gltf.scene} ref={rotate} scale={props.scale} />
        </mesh>
    );
}
