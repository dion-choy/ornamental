import React, { useEffect, useRef, useState } from "react";
import { addOrnament } from "@/components/api/api";
import * as THREE from "three";
import { useParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { EJSON } from "bson";

// DION File
export default function OrnamentSpot(props) {
    const cookies = useCookies();

    // Function to remove an available spot and add an ornament
    function removeAvail(event) {
        const randColor = new THREE.Color(); // set random color
        randColor.setHSL(Math.random(), 1, 0.5);
        const material = new THREE.MeshPhysicalMaterial({ color: randColor });

        const usedOrn = new THREE.Mesh(new THREE.SphereGeometry(0.1, 30, 10), material);
        usedOrn.name = "ornament";
        usedOrn.position.set(...event.object.position);
        usedOrn.showAuthor = props.showAuthor; // set show and hide callbacks
        usedOrn.hideAuthor = props.hideAuthor;
        usedOrn.authorId = EJSON.parse(cookies.get("userId")); // set user id
        event.object.parent.add(usedOrn); // replace old position with new ornament
        event.object.parent.remove(event.object);
        console.log(event.object);
    }

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

    const groupRef = useRef();

    useEffect(() => {
        // load all taken ornament spots and add to groupRef
        for (let i = 0; i < taken.length; i++) {
            const coord = taken[i];

            const sphere = new THREE.SphereGeometry(0.1, 30, 10);
            const randColor = new THREE.Color();
            randColor.setHSL(Math.random(), 1, 0.5);
            const material = new THREE.MeshPhysicalMaterial({ color: randColor });
            const takenOrn = new THREE.Mesh(sphere, material);
            takenOrn.name = "ornament";
            takenOrn.position.set(...coord);
            takenOrn.showAuthor = props.showAuthor;
            takenOrn.hideAuthor = props.hideAuthor;
            takenOrn.authorId = props.ornaments[i].authorid;

            groupRef.current.add(takenOrn);
        }
        console.log(groupRef.current);
    }, [groupRef, taken]);

    return (
        <group ref={groupRef}>
            {avail.map((coord, index) => (
                <mesh
                    visible={props.choose}
                    name={"avail_ornament"}
                    position={coord}
                    key={index + taken.length}
                    onClick={(event) => {
                        if (props.choose) {
                            removeAvail(event);
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
                        }
                    }}
                >
                    <sphereGeometry args={[0.1, 30, 10]} />
                    <meshPhysicalMaterial color={"white"} transparent={true} opacity={0.3} />
                </mesh>
            ))}
        </group>
    );
}
