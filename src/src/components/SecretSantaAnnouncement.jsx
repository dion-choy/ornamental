"use client"
import { motion } from "motion/react";
import React, { useState, useEffect } from 'react'
// import "@/styles/SpiralScene.css"
import spiralStyle from "@/styles/Spiralscene.module.css"
import { getReceiverFromSanta, getRoom, getUsers } from "@/components/api/api";
import SecretSantaOnboarding from "@/components/SecretSantaOnboarding";
import { EJSON } from "bson";
import SnowingBG from "@/components/SnowingBG";
import style from '@/styles/name.css';


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


    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [deersEnded, setDeersEnded] = useState(0)
    const [fadeAway, setFadeAway] = useState()
    const [playerNames, setPlayerObjects] = useState([])
    const [distortions, setDistortions] = useState([]);


    function incrDeersEnded() { setDeersEnded((prevDeer) => (prevDeer += 1)) }

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        getUsers(EJSON.stringify(props.users)).then((response) => {
            console.log(response)
            const namelist = EJSON.parse(response).map(user => user.name)
            console.log(namelist)
            setPlayerObjects(namelist)
            setDistortions(namelist.map(() => generateDistortion()));
        })
    }, []);

    useEffect(() => {
        console.log(deersEnded)
        if (deersEnded > playerNames.length) {
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
            {playerNames.map((name, index) => {
                // State to track the animation trigger for the child
                // Function to trigger a new distortion after the animation ends
                
                const triggerNewDistortion = () => {
                    setDistortions((prevDistort) => 
                        prevDistort.map((dist, i) =>
                            i === index ? generateDistortion(dist.rotate) : dist
                        ));
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
                            duration: 5, // Total animation time for the parent
                            ease: "easeOut", // Smooth easing
                            delay: 0.3 * index, // Stagger each square's start time
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
                                x: distortions[index]?.x || 0,
                                y: distortions[index]?.y || 0,
                            }}
                            transition={{
                                duration: 0.5, // Duration for each unique distortion
                                ease: "easeInOut", // Smooth easing for distortion
                                onComplete: triggerNewDistortion, // Trigger new distortion after each cycle
                            }}
                        >
                            {/* <img src="/assets/cartoonDeer.png" style={{filter: "drop-shadow(5px 5px 5px #222)"}}></img> */}
                            <motion.img src="/assets/cartoonDeer.png"
                                initial={{
                                    filter: "drop-shadow(18px 16px 100px 30px #000)"
                                }}
                                animate={{
                                    rotate: distortions[index]?.rotate || 0,
                                    filter: "drop-shadow(18px 16px 20px #000)"
                                }}
                                transition={{
                                    duration: 0.5, // Duration for each unique distortion
                                    ease: "easeInOut", // Smooth easing for distortion
                                    filter: {
                                        duration: 10
                                    }
                                }} />
                            <p className={spiralStyle["reindeer-name"] + " text-2xl mx-5"}>{name}</p>

                        </motion.div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export function SecretSantaAnnouncement( {roomId = 1325, userid, onComplete}) {
    const [animStage, setAnimationStage] = useState(0)
    const [isDisplaySanta, setIsDisplaySanta] = useState()
    
    const [users, setUsers] = useState([
        "Alice", "Bob", "Charlie", "Diana", "Ethan", 
        "Fiona", "George", "Hannah", "Ian", "Jasmine",
        "Kevin", "Laura", "Michael", "Nina", "Oliver", 
        "Paula", "Quentin", "Rachel", "Steve", "Tina"
      ]);

    useEffect(() => {
        getRoom(roomId).then((roomStr) => {
            const room = EJSON.parse(roomStr);
            setUsers(room.list_of_users);
        });
        let temp = getReceiverFromSanta(userid)
        console.log("THIS IS TEMP", temp)
        setIsDisplaySanta(temp);
    }, [])

    function incAnimStage() {
        if (animStage == 5) onComplete();
        setAnimationStage((prevStage) => prevStage += 1)
    }

    return (
        <> 
            { (animStage != 5)? 
            <>
            <div id={spiralStyle["main-scene"]} className="absolute" style={{zIndex:21}}>
                {4 > animStage > 0 ? <>
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

                {animStage == 2 ? <SpiralAnimation users={users} onComplete={incAnimStage} /> : null}

                {animStage > 2 && animStage < 4 ? <>
                    <motion.h2 className="block mt-40 text-3xl font-extrabold"
                    initial={{opacity: 0, fontSize: "0rem", color: "#FFF"}}
                    animate={{opacity: 1, fontSize: "3rem", color: "#DDDBFF"}}
                    transition={{duration: 1, delay: 0.2, type: "spring", stiffness: 300}}
                    >{isDisplaySanta}</motion.h2>



                    <motion.div className="flex mx-auto justify-center flex-row mt-48" whileHover={{
                            scale: 1.4,
                            transition: {duration: 1, type: "spring", bounce: 0.6},
                        }}>
                        <motion.button id={spiralStyle["next-btn"]} className="block text-3xl font-bold"
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1, transition: {duration: 1, delay: 2.2, type: "spring", bounce: 0.6}}}
                        onClick={incAnimStage}>let's get onboarding</motion.button>
                    </motion.div>

                    
                </>: null}
                
                <SnowingBG/>
                
                {animStage == 4 ? <SecretSantaOnboarding roomId={roomId} onComplete={incAnimStage}/> : null}
            </div>

            <motion.div id={spiralStyle["screen-cover"]}
                initial={{ y: "100%" }}
                animate={{ y: "0" }} transition={{ duration: 1, ease: "easeOut" }}
                onAnimationComplete={incAnimStage}
                style={{zIndex:20}}>
            </motion.div>
            </>
            : null}
            
        </>
    )
}
