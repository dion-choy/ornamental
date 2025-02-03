import React, { useRef, useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { PointLight, AnimationMixer, MeshBasicMaterial } from "three";

function Model(props) {
    const gltf = useLoader(GLTFLoader, props.file);
    const rotate = useRef();
    let mixer;

    useEffect(() => {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }

            if (child.name.substring(0, 11) == "GN_Instance") {
                child.material.emissiveIntensity = 3;
            }

            if (child.name == "Fire") {
                child.children = [];

                const fireLight = new PointLight(0xf7ad00, 5, 100, 0.1);
                fireLight.name = "fireLight";
                fireLight.position.set(0, 0, 0);
                fireLight.castShadow = true;
                fireLight.shadow.bias = -0.0025;
                fireLight.shadow.mapSize.width = props.shadows;
                fireLight.shadow.mapSize.height = props.shadows;
                fireLight.shadow.camera.far = 10;

                child.add(fireLight);
                child.receiveShadow = false;
                child.castShadow = false;
                const color = child.material.color;
                child.material = new MeshBasicMaterial({ color: 0xffffff });
                child.material.color = color;
            }
        });

        if (gltf.animations.length) {
            mixer = new AnimationMixer(gltf.scene);
            for (const anim of gltf.animations) {
                mixer.clipAction(anim).play();
            }
        }
    }, [gltf, props.shadows]);

    return (
        <mesh position={props.position}>
            <primitive object={gltf.scene} ref={rotate} scale={2} />
        </mesh>
    );
}

export default Model;
