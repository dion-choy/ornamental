import React from "react";
import * as THREE from "three";

function removeAvail(event) {
    const sphere = new THREE.SphereGeometry(0.1, 30, 10);
    const material = new THREE.MeshPhysicalMaterial({ color: 0x000000 });
    const usedOrn = new THREE.Mesh(sphere, material);
    usedOrn.name = "ornament";
    usedOrn.position.set(...event.object.position);
    event.object.copy(usedOrn, true);
    event.object.parent.add(usedOrn);
    event.object.parent.remove(event.object);
}

export default function OrnamentSpot(props) {
    const viableSpots = [
        [0.1, 1.9, 0.7],
        [-0.25, 2.38, 0.25],
        [-0.9, 0.7, 0.8],
        [0.4, 1.3, -0.95],
        [0.9, 0.8, -0.1],
        [0.8, 1.5, 0.3],
        [0.1, 2.5, -0.24],
        [-0.85, 1.45, -0.34],
    ];

    const availSpots = [];
    const taken = [];
    for (let i = 0; i < viableSpots.length; i++) {
        if (!props.taken?.includes(i)) {
            availSpots.push(viableSpots[i]);
        } else {
            taken.push(viableSpots[i]);
        }
    }

    return (
        <group>
            {availSpots.map((coord, index) => (
                <mesh
                    visible={props.choose}
                    name={"avail_ornament"}
                    position={coord}
                    key={index}
                    onClick={(event) => {
                        removeAvail(event);
                    }}
                >
                    <sphereGeometry args={[0.1, 30, 10]} />
                    <meshPhysicalMaterial color={"white"} transparent={true} opacity={0.3} />
                </mesh>
            ))}
            {taken.map((coord, index) => (
                <mesh name={"ornament"} position={coord} key={index + availSpots.length}>
                    <sphereGeometry args={[0.1, 30, 10]} />
                    <meshPhysicalMaterial color={"black"} />
                </mesh>
            ))}
        </group>
    );
}
