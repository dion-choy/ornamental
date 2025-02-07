import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { addOrnament } from "@/components/api/api";
import * as THREE from "three";
import { useParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { EJSON } from "bson";

// DION File
export default function OrnamentSpot(props) {
    const cookies = useCookies();

    const { id } = useParams();
    // Positions of ornaments
    const viableSpots = [
        [0.1, 1.9, 0.7],
        [-0.25, 2.38, 0.25],
        [-0.9, 0.7, 0.8],
        [0.4, 1.3, -0.95],
        [0.9, 0.8, -0.1],
        [0.8, 1.5, 0.3],
        [0.1, 2.5, -0.24],
        [-0.85, 1.45, -0.34],
        [0.7, 0.8, 0.9],
    ];

    const [taken, setTaken] = useState([]);
    const [avail, setAvail] = useState([]);

    // when ornaments are updated reloaod on tree.
    useEffect(() => {
        const availIndex = [...viableSpots.keys()];
        setTaken(
            props.ornaments?.map((orn) => {
                if (availIndex.includes(orn.position)) {
                    // if position is full, remove index from available indices
                    availIndex.splice(availIndex.indexOf(orn.position), 1);
                }
                return viableSpots[orn.position];
            })
        );

        setAvail(
            availIndex.map((index) => {
                return viableSpots[index];
            })
        );
    }, [props.ornaments]);

    const randColors = useMemo(() => {
        return taken.map(() => {
            const randColor = new THREE.Color();
            randColor.setHSL(Math.random(), 1, 0.5);
            return randColor;
        });
    }, [taken]);

    return (
        <group>
            {avail.map((coord, index) => (
                <mesh
                    visible={props.choose}
                    name={"avail_ornament"}
                    position={coord}
                    key={index + taken.length}
                    onClick={(event) => {
                        if (props.choose) {
                            props.setChoose(false);
                            let position;
                            for (position = 0; position < viableSpots.length; position++) {
                                if (
                                    viableSpots[position].every((value, index) => {
                                        return value == [...event.object.position][index];
                                    })
                                ) {
                                    break;
                                }
                            }
                            addOrnament(id, cookies.get("userId"), position, 0);
                            props.load();
                        }
                    }}
                    onPointerEnter={(event) => {
                        event.object.material.opacity = 1; // Highlight available positions
                    }}
                    onPointerLeave={(event) => {
                        event.object.material.opacity = 0.3; // Unhighlight objects
                    }}
                >
                    <sphereGeometry args={[0.1, 30, 10]} />
                    <meshPhysicalMaterial color={"white"} transparent={true} opacity={0.3} />
                </mesh>
            ))}
            {taken.map((coord, index) => {
                // load all taken ornament spots and add to groupRef
                const randColor = new THREE.Color();
                randColor.setHSL(Math.random(), 1, 0.5);

                return (
                    <mesh
                        name="ornament"
                        onPointerEnter={(event) => event.object.showAuthor(event.object.authorId)}
                        onPointerLeave={(event) => event.object.hideAuthor(event.object.authorId)}
                        position={coord}
                        showAuthor={props.showAuthor}
                        hideAuthor={props.hideAuthor}
                        key={index}
                        authorId={props.ornaments[index].authorid}
                    >
                        <sphereGeometry args={[0.1, 30, 10]} />
                        <meshPhysicalMaterial color={randColors != null ? randColors[index] : randColor} />
                    </mesh>
                );
            })}
        </group>
    );
}
