import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

const GiftSpawner = ({ parentGiftDatas = [] }) => {
    const centralPoint = new THREE.Vector3(0, 0, 0);

    const boxGift = useLoader(GLTFLoader, "/models/BoxGift.glb");
    const cylinderGift = useLoader(GLTFLoader, "/models/CylinderGift.glb");
    const bagGift = useLoader(GLTFLoader, "/models/BagGift.glb");

    const giftPositions = useMemo(() => {
        const positions = parentGiftDatas.map((_, i) => {
            const radius = 1;
            const angle = (Math.PI * 2 * i) / parentGiftDatas.length;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = 0;
            return { id: i, position: [x, y, z] };
        });
        return positions;
    }, [parentGiftDatas]);

    const loadGiftDatas = useCallback(() => {
        return parentGiftDatas.map((gift, index) => ({
            id: index,
            scale: gift.size || 1,
            author: gift.authorId,
            giftType: gift.shape,
            color: new THREE.Color().setHSL(Math.random(), 1, 0.5), // Assign a random color once
        }));
    }, [parentGiftDatas]);

    const prepareGift = useCallback(
        (giftType, color) => {
            let giftModel;
            switch (giftType) {
                case 1:
                    giftModel = boxGift;
                    break;
                case 2:
                    giftModel = bagGift;
                    break;
                case 3:
                    giftModel = cylinderGift;
                    break;
                default:
                    giftModel = boxGift;
            }

            const clonedGift = giftModel.scene.clone(true);

            clonedGift.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material.name === "RibbonMaterial") {
                        child.material = new THREE.MeshStandardMaterial({ color });
                    }
                }
            });

            return clonedGift;
        },
        [boxGift, bagGift, cylinderGift]
    );

    const [giftDatas, setGiftDatas] = useState([]);

    useEffect(() => {
        setGiftDatas(loadGiftDatas());
    }, [loadGiftDatas]);

    return (
        <group>
            {giftPositions.map((giftPos) => {
                const giftData = giftDatas.find((gift) => gift.id === giftPos.id);
                if (giftData) {
                    return (
                        <mesh key={giftPos.id} position={giftPos.position} scale={giftData.scale}>
                            <primitive
                                object={prepareGift(giftData.giftType, giftData.color)}
                                rotation={[0, giftData.rotation || 0, 0]}
                                scale={[0.2, 0.2, 0.2]}
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
