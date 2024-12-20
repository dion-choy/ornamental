"use client"
import { motion } from "motion/react";
import React, { useState, useEffect } from 'react'
import "@/styles/SpiralScene.css"
import { getRoom } from "@/components/api/api";
import { EJSON } from "bson";


export const SpiralAnimation = (props) => {

    // The a parameter controls the initial size of the spiral,
    // while b controls how tightly the spiral converges.
    const generateSpiralPath = (a, b, rotations, steps) => {
        const points = [];
        for (let i = 0; i <= rotations * steps; i++) {
            const theta = (i / steps) * 2 * Math.PI; // Incrementing angle
            const r = a * Math.exp(b * theta); // Spiral radius
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            points.push({ x, y });
        }
        return points;
    };

    const players = props.users; // Placeholder squares
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [deersEnded, setDeersEnded] = useState(0)
    const [fadeAway, setFadeAway] = useState()

    function incrDeersEnded() { setDeersEnded((prevDeer) => (prevDeer += 1)) }

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, []);

    useEffect(() => {
        console.log(deersEnded)
        if (deersEnded > players.length) {
            setFadeAway({opacity:0})
        }
    }, [deersEnded])

    // Generate the spiral path with parameters (500, -0.05, 5, 100)
    const spiralPath = generateSpiralPath(1100, -0.07, 5, 50);

    // Distortion function to move each square slightly on its own path (scale of 100)
    const generateDistortion = (prevRotation = 0) => ({
        x: (Math.random() - 0.5) * 200, // Large random jitter for x
        y: (Math.random() - 0.5) * 200, // Large random jitter for y
        rotate: prevRotation + (Math.random() - 0.5) * 360
    });



    // Center offset for aligning the spiral with the center of the screen
    const centerOffset = {
        x: windowSize.width / 2,
        y: windowSize.height / 2,
    };

    return (
        <motion.div
            initial={{opacity: 1}}
            animate={fadeAway} transition={{duration: 1}}
            onAnimationComplete={props.onComplete}
            style={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {players.map((name, index) => {
                // State to track the animation trigger for the child
                const [distortion, setDistortion] = useState(generateDistortion());
                const [deerOpacity, setDeerOpacity] = useState(1);
                // Function to trigger a new distortion after the animation ends
                const triggerNewDistortion = () => {
                    setDistortion((prevDistort) => generateDistortion(prevDistort.rotate));
                };


                return (
                    <motion.div
                        key={index}
                        initial={{
                            x: spiralPath[0].x + centerOffset.x,
                            y: spiralPath[0].y + centerOffset.y,
                        }}
                        animate={{
                            x: spiralPath.map((point) => point.x + centerOffset.x),
                            y: spiralPath.map((point) => point.y + centerOffset.y),
                        }}
                        transition={{
                            duration: 10, // Total animation time for the parent
                            ease: "easeOut", // Smooth easing
                            delay: 2 * (index / players.length), // Stagger each square's start time
                            onComplete: incrDeersEnded,
                        }}
                        style={{
                            position: "absolute",
                            width: "200px",
                            height: "200px",
                        }}
                    >
                        {/* Child div with distortion */}
                        <motion.div className="-top-1/2 -left-1/2"
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                            }}
                            animate={{
                                x: distortion.x,
                                y: distortion.y,
                            }}
                            transition={{
                                duration: 1, // Duration for each unique distortion
                                ease: "easeInOut", // Smooth easing for distortion
                                onComplete: triggerNewDistortion, // Trigger new distortion after each cycle
                            }}
                        >
                            <motion.img src="/assets/cartoonDeer.png"
                                animate={{
                                    rotate: distortion.rotate
                                }}
                                transition={{
                                    duration: 1, // Duration for each unique distortion
                                    ease: "easeInOut", // Smooth easing for distortion
                                }} />
                            <p className="reindeer-name text-2xl mx-5">{name}</p>

                        </motion.div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export function SecretSantaAnnouncement() {
    const [animationStage, setAnimationStage] = useState(0)

    
    const [users, setUsers] = useState([
        "Alice", "Bob", "Charlie", "Diana", "Ethan", 
        "Fiona", "George", "Hannah", "Ian", "Jasmine",
        "Kevin", "Laura", "Michael", "Nina", "Oliver", 
        "Paula", "Quentin", "Rachel", "Steve", "Tina"
      ]);

    // useEffect(() => {
    //     getRoom(roomId).then((roomStr) => {
    //         const room = EJSON.parse(roomStr);
    //         setUsers(room.list_of_users);
    //     });
    // }, [])

    function incAnimStage() {
        setAnimationStage((prevStage) => prevStage += 1)
    }

    return (
        <>
            <div id="main-scene" className="absolute">
                {animationStage > 0 ? <>
                    <motion.h1 className="block text-5xl mt-40 font-extrabold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        Let's see whose Santa
                    </motion.h1>
                    <motion.h1 className="block text-5xl font-extrabold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} onAnimationComplete={incAnimStage}>
                        you'll be
                    </motion.h1>
                </> : null}

                {animationStage == 2 ? <SpiralAnimation users={users} onComplete={incAnimStage} /> : null}
            </div>

            <motion.div id="screen-cover"
                initial={{ y: "100%" }}
                animate={{ y: "0" }} transition={{ duration: 1, ease: "easeOut" }}
                onAnimationComplete={incAnimStage}>

            </motion.div>
        </>
    )
}
