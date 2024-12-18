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
            <Canvas
                ref={cam}
                shadows
                className={css.canvas}
                camera={{
                    position: [7, 4, 7],
                    fov: 100,
                }}
            >
                <MyScene numReindeers={numReindeers} />
            </Canvas>

            <div className={css.overlay}>
                <div className={css.container}>
                    <div className={css.timer}>10 days 10 hours 10 minutes 10 seconds</div>
                </div>

                <div id="admin-panel">
                    <strong>ADMIN</strong>
                    <button>Start Secret Santa</button>
                    <button>Start Next Activity</button>
                </div>

                <div className={css.giftbutton}>
                    <button>
                        <img src="/Gift.png" alt="Gift!" />
                        Gift!
                    </button>
                </div>
            </div>
        </div>
    );
}
