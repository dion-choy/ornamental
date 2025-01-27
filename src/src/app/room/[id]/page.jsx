"use client";
import style from "@/styles/Room.module.css";
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import MyScene from "@/components/CanvasScene";
import Auth from "@/components/auth.jsx";
import { SecretSantaAnnouncement, SpiralAnimation } from "@/components/SecretSantaAnnouncement";
import Controls from "@/components/Controls";
import { redirect, useParams } from "next/navigation";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { PerspectiveCamera } from "three";
import { addGift, getNoPlayers, getRoom, getUser, startSecretSanta, hasSeenOnboarding } from "@/components/api/api";
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
    const [firstTime, setFirstTime] = useState(false);
    const [eventRunning, setEventRunning] = useState(false);
    const [room, setRoom] = useState({});
    const [jsLoaded, setLoaded] = useState(true);
    const [authorVisible, setAuthorVisible] = useState(false);
    const [giftGUIVisible, setGiftGUIVisible] = useState(false);
    const [selectedGift, setSelectedGift] = useState("");
    const [giftData, setGiftData] = useState([]);
    const [timeLeft, setTimeLeft] = useState("-- Days --:--:--");
    function load() {
        console.log(id);
        getNoPlayers(id).then((no) => {
            setNumReindeers(no);
        });
        getRoom(id).then((roomStr) => {
            let userId = cookies.get("userId");
            const room = EJSON.parse(roomStr);
            setRoom(room);
            setOrnaments(room.ornaments);
            setGiftData(room.gifts);
            if (room.secret_santa.started == true) {
                setEventRunning(true);
                let userId = cookies.get("userId");
                getUser(userId).then((res) => {
                    res = EJSON.parse(res);
                    console.log(res.has_seen_onboarding);
                    console.log("onboarding help");
                    if (res.has_seen_onboarding == false) {
                        setFirstTime(true);
                    }
                });
            }
            const endDate = stringToDate(room.secret_santa.end_date);
            if (jsLoaded) {
                setLoaded(false);
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

                    setTimeLeft(
                        `${days} Days ${hours >= 10 ? hours : "0" + hours}:${mins >= 10 ? mins : "0" + mins}:${
                            secs >= 10 ? secs : "0" + secs
                        }`
                    );
                }, 1000);
            }
        });
    }

    useEffect(() => {
        load();
        setInterval(load, 60000);
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
        let userId = cookies.get("userId");
        getRoom(id).then((roomStr) => {
            const room = EJSON.parse(roomStr);

            addGift(
                id,
                userId,
                room.gifts.length,
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
                console.log("gift added");
                load();
            });
        });
    }

    useEffect(() => {
        console.log(`Gift gui is ${giftGUIVisible ? "on" : "off"}`);
    }, [giftGUIVisible]);

    const [settingsVisible, setSettingsVisible] = useState(false);

    return (
        <div className={style.scene}>
            {firstTime && (
                <SecretSantaAnnouncement roomId={parseInt(id)} userid={cookies.get("userId")} onComplete={() => {
                    
                }}>
                    {" "}
                </SecretSantaAnnouncement>
            )}
            <Auth code={id} load={load} />
            <Canvas
                shadows
                className={style.canvas}
                camera={{
                    position: [7, 4, 7],
                    fov: 100,
                }}
                onCreated={({ gl, scene, camera }) => {
                    const composer = new EffectComposer(gl);
                    gl.setPixelRatio(window.devicePixelRatio);
                    gl.setSize(
                        window.innerWidth / (cookies.get("resolution") ? cookies.get("resolution") : 1),
                        window.innerHeight / (cookies.get("resolution") ? cookies.get("resolution") : 1),
                        false
                    );

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
                    saoPass.params.saoKernelRadius = 20;
                    saoPass.params.saoMinResolution = 0.01;
                    saoPass.params.saoBlur = true;
                    saoPass.params.saoBlurRadius = 10;
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

            <div className={style.overlay}>
                {room.hasOwnProperty("secret_santa") && room.secret_santa.started && (
                    <>
                        <img className={style.timerUI} src="/assets/Time.svg" alt="Gift!" />
                        <div className={style.container}>
                            <div className={style.timer}>{timeLeft}</div>
                        </div>
                    </>
                )}

                {giftGUIVisible && (
                    <div className="namerectdiv">
                        <div className={style.namerect}>
                            {selectedGift}
                            <div className={style.confirmbutton}>
                                <button
                                    onClick={() => {
                                        addGiftHandler();
                                        setCamSetting(0);
                                        setGiftGUIVisible(false);
                                    }}
                                >
                                    <img src="/assets/Gift.png" alt="Gift!" />
                                    Confirm!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {authorVisible && (
                    <div className="namerectdiv">
                        <div className={style.namerect}>
                            <p>{authorVisible}</p>
                        </div>
                    </div>
                )}

                {settingsVisible && (
                    <div className="namerectdiv">
                        <div
                            className={css.namerect + " " + css.settings_menu}
                            style={{ top: "50%", width: "80vw", height: "80vh" }}
                        >
                            <select
                                style={{ zIndex: 100 }}
                                onChange={(s) => {
                                    let divider;
                                    switch (s.target.value) {
                                        case "high":
                                            divider = 1;
                                            break;
                                        case "mid":
                                            divider = 2;
                                            break;
                                        case "low":
                                            divider = 5;
                                            break;
                                        case "ultralow":
                                            divider = 10;
                                            break;
                                        case "poopoo":
                                            divider = 20;
                                            break;
                                        default:
                                            divider = 5; // Default to medium resolution
                                    }
                                    cookies.set("resolution", divider);
                                    window.location.reload();
                                }}
                            >
                                <option>Resolution:</option>
                                <option value="high">High Res</option>
                                <option value="mid">Mid Res</option>
                                <option value="low">Low Res</option>
                                <option value="ultralow">Ultra Low Res</option>
                                <option value="poopoo">Poo poo</option>
                            </select>
                        </div>
                    </div>
                )}

                <div id={css["admin-panel"]}>
                    <button
                        onClick={() => {
                            setSettingsVisible(!settingsVisible);
                        }}
                    >
                        Settings
                    </button>
                    <button onClick={() => startSecretSanta(id)}>Start Secret Santa</button>
                    <button>Start Next Activity</button>
                    {eventRunning && (
                        <button
                            onClick={() => {
                                setChooseOrnament(!chooseOrnament);
                            }}
                        >
                            Add Ornaments
                        </button>
                    )}
                </div>
                {room.hasOwnProperty("secret_santa") && room.secret_santa.started && (
                    <div className={style.giftbutton}>
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
                )}
            </div>
        </div>
    );
}
