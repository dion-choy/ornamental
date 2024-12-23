import React, { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";

export default function Gift(props) {
    const gltf = useLoader(GLTFLoader, props.file);
    const [gift, setGift] = useState({});

    useEffect(() => {
        const clonedGift = gltf.scene.clone(true);
        clonedGift.traverse((child) => {
            child.name = "gift";
            child.giftType = props.type;
        });
        setGift(clonedGift);
    }, []);

    return (
        <mesh position={props.position}>
            <primitive object={gift} scale={props.scale} />
        </mesh>
    );
}
