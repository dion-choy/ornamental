"use client";
import css from "@/styles/Home.module.css";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import MyScene from "@/components/CanvasScene";

export default function Home() {
    const cam = useRef();
    const [numReindeers, setNumReindeers] = useState(0);
    return (
        <div className={css.scene}>
            <div className={css.overlay}>
                <input type="input" onChange={(e) => setNumReindeers(e.target.value)} />
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
                <MyScene numReindeers={numReindeers} />
            </Canvas>
        </div>
    );
}
