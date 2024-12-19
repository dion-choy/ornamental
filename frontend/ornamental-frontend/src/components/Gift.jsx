import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader, useFrame, useThree } from "@react-three/fiber";

export default function Gift(props) {
    const gltf = useLoader(GLTFLoader, props.file);
    const object = useRef();
    const { scene } = useThree();
    const [gift, setGift] = useState({});

    useEffect(() => {
        const clonedGift = gltf.scene.clone(true);
        clonedGift.traverse((child) => {
            child.name = "gift";
            if (child.isMesh) {
                child.onClick = () => {
                    console.log("clicked");
                };
            }
        });
        setGift(clonedGift);
    }, [gltf]);

    useEffect(() => {
        console.log(object.current);
    }, [object]);

    return (
        <mesh
            ref={object}
            onClick={() => {
                console.log("clicked");
            }}
            position={props.position}
        >
            <primitive object={gift} scale={props.scale} />
        </mesh>
    );
}
