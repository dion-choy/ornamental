"use client";
import css from "../styles/Home.module.css";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Floor from "../components/Floor";
import Box from "../components/Box";
import LightBulb from "../components/LightBulb";
import Controls from "@/components/Controls";
import Draggable from "@/components/Draggable";
import Model from "@/components/Model";
import Skybox from "@/components/Skybox";

export default function Home() {
    const cam = useRef();
    return (
        <div className={css.scene}>
            <Canvas
                ref={cam}
                shadows
                className={css.canvas}
                camera={{
                    position: [7, 5, 7],
                    fov: 100,
                }}
            >
                {/* <Skybox /> */}

                <ambientLight intensity={2} />
                <Draggable>
                    <LightBulb position={[0, 3, 0]} />
                </Draggable>

                <Model file="/christmas_tree.glb" />
                <Model file="/room.glb" />
                <Controls />
            </Canvas>
        </div>
    );
}
