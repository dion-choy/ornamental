import React, { useCallback, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useEffect } from "react";
import * as THREE from "three";

const DeerSpawner = ({ deerCount = 0 }) => {
    const centralPoint = new THREE.Vector3(0, 0, 0); // Center position (x, y, z)

    useEffect(() => {
        // console.log("balls");
    }, []);
    // Load the deer model
    const deerModel = useLoader(GLTFLoader, "/models/reindeer.glb"); // Place deer.glb in /public/models

    // Generate deer positions and rotations
    const deerPositions = useMemo(() => {
        // console.log(deerCount);
        const positions = [];

        for (let i = 0; i < deerCount; i++) {
            // Randomly generate positions in a circle around the center
            const radius = 3; // Deer will spawn 10-15 units away from center
            const angle = (Math.PI * 2 * i) / deerCount; // Spread evenly in a circle
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = 0.35; // Keep deers on the ground plane

            // Calculate rotation to face the center
            const position = new THREE.Vector3(x, y, z);
            const direction = new THREE.Vector3().subVectors(centralPoint, position).normalize(); // Direction vector towards the center
            const rotation = Math.atan2(direction.x, direction.z); // Y-axis rotation

            positions.push({ position: [x, y, z], rotation });
        }

        return positions;
    }, [deerCount]);

    const uniqueDeer = useCallback(() => {
        const clonedDeer = deerModel.scene.clone(true); // Deep clone of the model
        console.log("I am rerunning");
        // Find the "nose" mesh and apply a unique material
        clonedDeer.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.name === "nose") {
                    const randColor = new THREE.Color();
                    randColor.setHSL(Math.random(), 1, 0.5);
                    child.material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(randColor), // Random color
                    });
                }
            }
        });

        return clonedDeer;
    }, [deerModel]);

    const deerObjects = useMemo(
        () =>
            deerPositions.map((deer, index) => ({
                key: index,
                object: uniqueDeer(),
                position: deer.position,
                rotation: [0, deer.rotation, 0],
            })),
        [deerPositions, uniqueDeer]
    );

    return (
        <group>
            {deerObjects.map(({ key, object, position, rotation }) => (
                <mesh key={key}>
                    <primitive object={object} position={position} rotation={rotation} scale={[0.5, 0.5, 0.5]} />
                </mesh>
            ))}
        </group>
    );
};

export default DeerSpawner;
