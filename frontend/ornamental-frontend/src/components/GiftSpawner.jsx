import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import { getRoom } from "@/components/api/api";
import { EJSON } from "bson";
import { useParams } from "next/navigation";

const GiftSpawner = ({ giftCount = 4, parentGiftDatas = [] }) => {
    const { id } = useParams();
    const centralPoint = new THREE.Vector3(0, 0, 0); // Center position (x, y, z)

    // Load the deer model
    const giftModel = useLoader(GLTFLoader, "/models/BoxGift.glb"); // Place deer.glb in /public/models

    // Generate deer positions and rotations
    const giftPositions = useMemo(() => {
        const positions = [];

        for (let i = 0; i < giftCount; i++) {
            // Randomly generate positions in a circle around the center
            const radius = 1; // Deer will spawn 10-15 units away from center
            const angle = (Math.PI * 2 * i) / giftCount; // Spread evenly in a circle
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = 0; // Keep deers on the ground plane

            // Calculate rotation to face the center
            const id = i;
            // const direction = new THREE.Vector3().subVectors(centralPoint, position).normalize(); // Direction vector towards the center
            // const rotation = Math.atan2(direction.x, direction.z); // Y-axis rotation

            positions.push({ id: id, position: [x, y, z] });
        }

        return positions;
    }, [giftCount]);

    const loadGiftDatas = () => {
        // const giftList = [{ id: 3, scale: 1, author: "Me", rotation: 2, giftType: "small", color: "#FF0000" }];
        return parentGiftDatas.map((gift) => {
            gift.id = gift.position;
            gift.scale = gift.size;
            gift.author = gift.authorId;
            gift.giftType = gift.shape;
            gift.color = "#FF0000";
            return gift;
        });
    };

    const prepareGift = (giftType = null, color) => {
        const clonedGift = giftModel.scene.clone(true); // Deep clone of the model

        // Find the "nose" mesh and apply a unique material
        clonedGift.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.name === "RibbonMaterial") {
                    const threeColor = new THREE.Color().setRGB(1, 0, 0);
                    // randColor.setHSL(Math.random(), 1, 0.5);
                    child.material = new THREE.MeshStandardMaterial({
                        color: threeColor, // Random color
                    });
                }
            }
        });

        // console.log(clonedGift);
        return clonedGift;
    };

    const [giftDatas, setGiftDatas] = useState([]);

    useEffect(() => {
        setGiftDatas(loadGiftDatas());
        // setGiftDatas([{ id: 3, scale: 1, author: "Me", rotation: 2, giftType: "small", color: "#FF0000" }]);
    }, []);

    useEffect(() => {
        console.log(giftDatas);
    }, [giftDatas]);

    return (
        <group>
            {giftPositions.map((giftPos, gpIndex) => {
                // console.log(giftPos);
                for (let i = 0; i < giftDatas.length; i++) {
                    if (giftPos.id === giftDatas[i].id) {
                        // console.log("ITEM FOUND")
                        return (
                            <mesh key={giftPos.id} position={giftPos.position} scale={giftDatas[i].scale}>
                                <primitive
                                    key={giftPos.id}
                                    object={prepareGift()}
                                    rotation={[0, giftDatas[i].rotation, 0]} // Rotate deer to face center
                                    scale={[0.2, 0.2, 0.2]} // Adjust scale if needed
                                />
                            </mesh>
                        );
                    }
                }

                //
            })}
        </group>
    );
};

export default GiftSpawner;
