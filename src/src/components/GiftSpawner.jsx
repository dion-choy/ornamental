import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

const GiftSpawner = ({ parentGiftDatas = [], showAuthor, hideAuthor }) => {
    const giftPositions = useMemo(() => {
        const positions = parentGiftDatas.map((_, i) => {
            const radius = 1;
            const angle = (Math.PI * 2 * i) / parentGiftDatas.length;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return { id: i, position: [x, 0, z] };
        });
        return positions;
    }, [parentGiftDatas]);

    const prepareGift = useCallback((giftType, color, author) => {
        const gift = useLoader(
            GLTFLoader,
            (() => {
                switch (giftType) {
                    case 1:
                        return "/models/BoxGift.glb";
                    case 2:
                        return "/models/BagGift.glb";
                    case 3:
                        return "/models/CylinderGift.glb";
                    default:
                        throw new Error("Not valid gift choice");
                }
            })()
        ).scene.clone(true);

        gift.traverse((child) => {
            if (child.isMesh) {
                child.name = "treeGift";
                child.authorId = author;
                child.showAuthor = showAuthor;
                child.hideAuthor = hideAuthor;
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.name === "RibbonMaterial") {
                    child.material = new THREE.MeshStandardMaterial({ color });
                }
            }
        });

        return gift;
    });

    const [giftDatas, setGiftDatas] = useState([]);

    useEffect(() => {
        setGiftDatas(
            parentGiftDatas.map((gift, index) => ({
                id: index,
                scale: gift.size || 1,
                author: gift.authorid,
                giftType: gift.shape,
                color: new THREE.Color().setHSL(Math.random(), 1, 0.5), // Assign a random color once
            }))
        );
    }, [parentGiftDatas]);

    return (
        <group>
            {giftPositions.map((giftPos) => {
                const giftData = giftDatas.find((gift) => gift.id === giftPos.id);
                if (giftData) {
                    return (
                        <mesh key={giftPos.id} position={giftPos.position} scale={giftData.scale}>
                            <primitive
                                object={prepareGift(giftData.giftType, giftData.color, giftData.author)}
                                rotation={[0, giftData.rotation || 0, 0]}
                                scale={0.2}
                            />
                        </mesh>
                    );
                }
                return null;
            })}
        </group>
    );
};

export default GiftSpawner;
