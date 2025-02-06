import React, { useEffect, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { AnimationMixer, MeshBasicMaterial, PointLight } from "three";

// DION File
function Model(props) {
    const gltf = useLoader(GLTFLoader, props.file); // Load the GLTF model
    const rotate = useRef();
    let mixer;

    useEffect(() => {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true; // Set  all meshes to cast and receive shadows
                child.receiveShadow = true;
            }

            // Increase emissive intensity for specific meshes
            if (child.name.substring(0, 11) == "GN_Instance") {
                child.material.emissiveIntensity = 3;
            }

            // Add a point light to the "Fire" mesh
            if (child.name == "Fire") {
                child.children = [];

                const fireLight = new PointLight(0xf7ad00, 5, 100, 0.1);
                fireLight.name = "fireLight";
                fireLight.position.set(0, 0, 0);
                fireLight.castShadow = true;
                fireLight.shadow.bias = -0.0025;
                fireLight.shadow.mapSize.width = props.shadows; // Shadow resolution
                fireLight.shadow.mapSize.height = props.shadows;
                fireLight.shadow.camera.far = 10;

                child.add(fireLight);
                child.receiveShadow = false; // Recreate fire mesh without casting shadows
                child.castShadow = false;
                const color = child.material.color;
                child.material = new MeshBasicMaterial({ color: 0xffffff });
                child.material.color = color;
            }
        });

    }, [gltf, props.shadows]);

    // Set up animation mixer if there are animations
    if (gltf.animations.length) {
        mixer = new AnimationMixer(gltf.scene);
        gltf.animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.play();
        });
    }

    useFrame((state, delta) => {
        mixer?.update(delta)
    })

    return (
        <mesh position={props.position}>
            <primitive object={gltf.scene} ref={rotate} scale={2} />
        </mesh>
    );
}

export default Model;
