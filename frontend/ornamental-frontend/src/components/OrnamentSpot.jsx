import React from "react";

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
            <group visible={props.choose}>
                {availSpots.map((coord, index) => (
                    <mesh name={"avail_ornament"} position={coord} key={index}>
                        <sphereGeometry args={[0.1, 30, 10]} />
                        <meshPhysicalMaterial color={"white"} transparent={true} opacity={0.3} />
                    </mesh>
                ))}
            </group>
            {taken.map((coord, index) => (
                <mesh name={"ornament"} position={coord} key={index + availSpots.length}>
                    <sphereGeometry args={[0.1, 30, 10]} />
                    <meshPhysicalMaterial color={"black"} />
                </mesh>
            ))}
        </group>
    );
}
