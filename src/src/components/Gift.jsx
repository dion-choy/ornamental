import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";

// DION File
export default function Gift(props) {
    const gltf = useLoader(GLTFLoader, props.file); // Load the GLTF model
    const [gift, setGift] = useState({});

    useEffect(() => {
        const clonedGift = gltf.scene.clone(true); // Clone the loaded model
        clonedGift.traverse((child) => {
            child.name = "gift"; // Set the name of each child to "gift"
            child.giftType = props.type; // Set the gift type from props
        });
        setGift(clonedGift); // Update the state with the cloned model
    }, []);

    const testRef = useRef();

    return <primitive object={gift} scale={props.scale} position={props.position} />;
}
