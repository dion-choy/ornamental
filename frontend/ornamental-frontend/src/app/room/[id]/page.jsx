"use client";
import css from "@/styles/Room.module.css";
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import MyScene from "@/components/CanvasScene";
import Auth from "@/components/auth.jsx";
import Controls from "@/components/Controls";
import { useParams } from "next/navigation";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { PerspectiveCamera } from "three";
import { addGift, getNoPlayers, getRoom, getUser, startSecretSanta } from "@/components/api/api";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SAOPass } from "three/addons/postprocessing/SAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { EJSON } from "bson";
import { useCookies } from "next-client-cookies";
import { stringToDate } from "@/lib/myDateFunction";

function updateTime(endTime) {
    console.log(endTime);
}

export default function Home() {
    const { id } = useParams();
    const cookies = useCookies();
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
    const [authorVisible, setAuthorVisible] = useState(false);
    const [giftGUIVisible, setGiftGUIVisible] = useState(false);
    const [selectedGift, setSelectedGift] = useState("");
    const [giftData, setGiftData] = useState([]);
    const [timeLeft, setTimeLeft] = useState("-- Days --:--:--");

    useEffect(() => {
        console.log(id);
        getNoPlayers(id).then((no) => {
            setNumReindeers(no);
        });
        getRoom(id).then((roomStr) => {
            const room = EJSON.parse(roomStr);
            setOrnaments(room.ornaments);
            setGiftData(room.gifts);
            const endDate = stringToDate(room.secret_santa.end_date);
            setInterval(() => {
                const curDate = new Date();
                let timeDelta = endDate - curDate;
                timeDelta = timeDelta < 0 ? 0 : timeDelta;
                let days = Math.floor(timeDelta / 86400000);
                timeDelta %= 86400000;
                let hours = Math.floor(timeDelta / 3600000);
                timeDelta %= 3600000;
                let mins = Math.floor(timeDelta / 60000);
                timeDelta %= 60000;
                let secs = Math.floor(timeDelta / 1000);

                setTimeLeft(`${days} Days ${hours}:${mins}:${secs}`);
            }, 1000);
        });
    }, []);

    function showAuthor() {
        console.log("Show author");
        getUser(EJSON.stringify(this.authorId)).then((authorStr) => {
            const author = EJSON.parse(authorStr);
            setAuthorVisible(author.name);
        });
    }

    function hideAuthor() {
        console.log("Hide author");
        setAuthorVisible(false);
    }

    function giftClickHandler(object) {
        if (object.giftType == selectedGift || selectedGift == "") {
            setGiftGUIVisible(!giftGUIVisible);
        }
        setSelectedGift(object.giftType);
    }

    function addGiftHandler() {
        console.log("Add gift");
        let userId = cookies.get("userId");
        getUser(userId).then((userStr) => {
            const user = EJSON.parse(userStr);

            addGift(
                id,
                userId,
                0,
                Math.PI * Math.random(),
                (() => {
                    switch (selectedGift) {
                        case "Gift Box":
                            return 1;
                        case "Gift Bag":
                            return 2;
                        case "Gift Cylinder":
                            return 3;
                        default:
                            return 0;
                    }
                })(),
                1
            ).then(() => {
                console.log("test");
            });
        });
    }

    useEffect(() => {
        console.log(`Gift gui is ${giftGUIVisible ? "on" : "off"}`);
    }, [giftGUIVisible]);

    return (
        <div className={css.scene}>
            <Auth code={id} />
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
                    camSetting={camSetting}
                    giftClickHandler={giftClickHandler}
                    giftData={giftData}
                />
                <CameraHelper />
                <Controls rotate={0.4} camSetting={camSetting} />
            </Canvas>

            <div className={css.overlay}>
                <img className={css.timerUI} src="/assets/Time.svg" alt="Gift!" />
                <div className={css.container}>
                    <div className={css.timer}>{timeLeft}</div>
                </div>

                <div
                    style={{
                        display: giftGUIVisible ? "block" : "none",
                    }}
                >
                    <div className="namerectdiv">
                        <div className={css.namerect}>
                            {selectedGift}
                            <div className={css.confirmbutton}>
                                <button
                                    onClick={() => {
                                        addGiftHandler();
                                    }}
                                >
                                    <img src="/assets/Gift.png" alt="Gift!" />
                                    Confirm!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: authorVisible ? "block" : "none",
                    }}
                >
                    <div className="namerectdiv">
                        <div className={css.namerect}>
                            <p>{authorVisible}</p>
                        </div>
                    </div>
                </div>

                <div id={css["admin-panel"]}>
                    <strong>ADMIN</strong>
                    <button onClick={() => startSecretSanta(id)}>Start Secret Santa</button>
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
                            if (x == 0) {
                                setGiftGUIVisible(false);
                            }
                        }}
                    >
                        <img src={`/assets/${camSetting ? "cancel.png" : "Gift.png"}`} alt="Gift!" />
                        {camSetting ? "Cancel" : "Gift!"}
                    </button>
                </div>
            </div>
        </div>
    );
}
