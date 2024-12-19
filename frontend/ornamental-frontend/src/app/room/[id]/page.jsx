"use client";
import css from "@/styles/Home.module.css";
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import MyScene from "@/components/CanvasScene";
import Controls from "@/components/Controls";
import { useParams } from "next/navigation";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { PerspectiveCamera } from "three";
import { getNoPlayers, getRoom } from "@/components/api/api";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SAOPass } from "three/addons/postprocessing/SAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { EJSON } from "bson";

export default function Home() {
    const { id } = useParams();
    const cam = useRef();
    const [numReindeers, setNumReindeers] = useState(0);
    const [chooseOrnament, setChooseOrnament] = useState(false);
    const [camSetting, setCamSetting] = useState(0);

    function CameraHelper() {
        const camera = new PerspectiveCamera(60, 1, 1, 3);
        return (
            <group position={[0, 2, -2.5]} rotation={[0, Math.PI / 2, 0]}>
                {/* <cameraHelper args={[camera]} />; */}
            </group>
        );
    }
    const [ornaments, setOrnaments] = useState([]);
    const [authorVisible, setAuthorVisible] = useState([]);

    useEffect(() => {
        console.log(id);
        getNoPlayers(id).then((no) => {
            setNumReindeers(no);
        });
        getRoom(id).then((roomStr) => {
            const room = EJSON.parse(roomStr);
            setOrnaments(room.ornaments);
        });
    }, []);

    useEffect(() => {
        console.log(ornaments);
    }, [ornaments]);

    function showAuthor() {
        console.log("SHOW");
        console.log(this);
    }

    function hideAuthor() {
        console.log("HIDE");
        console.log(this);
    }

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
                onCreated={({ gl, scene, camera }) => {
                    const composer = new EffectComposer(gl);
                    const renderPass = new RenderPass(scene, camera);
                    composer.addPass(renderPass);

                    const saoPass = new SAOPass(scene, camera);
                    composer.addPass(saoPass);

                    const outputPass = new OutputPass();
                    composer.addPass(outputPass);
                    saoPass.resolution.set(1024, 1024);
                    saoPass.setSize(1024, 1024);

                    saoPass.params.saoBias = -1;
                    saoPass.params.saoIntensity = 0.5;
                    saoPass.params.saoScale = 1;
                    saoPass.params.saoKernelRadius = 100;
                    saoPass.params.saoMinResolution = 0.01;
                    saoPass.params.saoBlur = true;
                    saoPass.params.saoBlurRadius = 50;
                    saoPass.params.saoBlurStdDev = 5;
                    saoPass.params.saoBlurDepthCutoff = 0.01;

                    gl.setAnimationLoop(() => composer.render());
                }}
            >
                <MyScene
                    numReindeers={numReindeers}
                    choose={chooseOrnament}
                    ornaments={ornaments}
                    showAuthor={showAuthor}
                    hideAuthor={hideAuthor}
                />
                <CameraHelper />
                <Controls rotate={0.4} camSetting={camSetting} />
            </Canvas>

            <div className={css.overlay}>
                <img className={css.timerUI} src="/assets/Time.svg" alt="Gift!" />
                <div className={css.container}>
                    <div className={css.timer}>10 days 10 hours 10 minutes 10 seconds</div>
                </div>

                <div
                    style={{
                        display: () => {
                            authorVisible ? "block" : "none";
                        },
                    }}
                >
                    <p>Author</p>
                </div>

                <div id={css["admin-panel"]}>
                    <strong>ADMIN</strong>
                    <button>Start Secret Santa</button>
                    <button>Start Next Activity</button>
                    <button
                        onClick={() => {
                            setChooseOrnament(!chooseOrnament);
                        }}
                    >
                        Choose/cancel
                    </button>
                </div>

                <div className={css.giftbutton}>
                    <button
                        onClick={() => {
                            let x = camSetting == 1 ? 0 : 1;
                            setCamSetting(x);
                        }}
                    >
                        <img src="/assets/Gift.png" alt="Gift!" />
                        Gift!
                    </button>
                </div>
            </div>
        </div>
    );
}
