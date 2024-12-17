"use client";
import css from "../styles/Home.module.css";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Floor from "../components/Floor";
import Box from "../components/Box";
import LightBulb from "../components/LightBulb";
import Controls from "@/components/Controls";
import Draggable from "@/components/Draggable";
import Model from "@/components/Model";
import Skybox from "@/components/Skybox";
import Snowflake from "@/components/Snowflake";
import DeerSpawner from "@/components/DeerSpawner";

export default function Home() {
    const cam = useRef();
    const [numReindeers, setNumReindeers] = useState(0);
    return (
        <div className={css.scene}>
            <div className={css.overlay}>
                <input type="input" onChange={ (e) => setNumReindeers(e.target.value)} />
                <p>I am above</p>
            </div>
            <Canvas
                ref={cam}
                shadows
                className={css.canvas}
                camera={{
                    position: [7, 5, 7],
                    fov: 100,
                }}
            >
                <Skybox />

                <Snowflake count={500} />

                <ambientLight intensity={0.7} color={"white"} />
                <Draggable>
                    <LightBulb position={[0, 3, 0]} size={[0.2, 30, 10]} intensity={5} color={"beige"} />
                </Draggable>
                
                <DeerSpawner deerCount={numReindeers}></DeerSpawner>
                <Model file="/christmas_tree.glb" position={[0, -0.5, 0]} />
                <Model file="/room.glb" position={[0, -0.5, 0]} />
                <Controls rotate={0.7} />
            </Canvas>
        </div>
    );
}
