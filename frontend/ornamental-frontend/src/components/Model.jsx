import React, { useRef, useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader, useFrame } from "@react-three/fiber";
import { AnimationMixer } from "three";

function Model(props) {
    const gltf = useLoader(GLTFLoader, props.file);
    const rotate = useRef();
    let mixer;

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
            }
        });

        if (gltf.animations.length) {
            mixer = new AnimationMixer(gltf.scene);
            for (const anim of gltf.animations) {
                mixer.clipAction(anim).play();
            }
        }
    }, [gltf]);

    return (
        <mesh castShadow receiveShadow position={props.position}>
            <primitive object={gltf.scene} ref={rotate} scale={2} />
        </mesh>
    );
}

export default Model;
