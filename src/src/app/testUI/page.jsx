"use client";
import style from "@/styles/Room.module.css";
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import CanvasScene from "@/components/CanvasScene";
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
import cardStyle from "@/styles/Cards.module.css";

export default function Home() {
    const { id } = useParams();
    const cookies = useCookies();
    const [numReindeers, setNumReindeers] = useState(0);
    const [chooseOrnament, setChooseOrnament] = useState(false);
    const [camSetting, setCamSetting] = useState(0);
    const audioRef = useRef(null); // Ref for audio playback
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
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [celebrateVisible, setCelebrateVisible] = useState(false);

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
                load();
            });
        });
    }

    function celebrationTime() {
        setCelebrateVisible(!celebrateVisible);
        if (audioRef.current) {
            audioRef.current.play(); // Play the audio
        }
    }
    return (
        <div className={style.scene}>
            {firstTime && (
                <SecretSantaAnnouncement roomId={parseInt(id)} userid={cookies.get("userId")}>
                    {" "}
                </SecretSantaAnnouncement>
            )}

            {celebrateVisible && (
                <div className="namerectdiv">
                    <div
                        className={style.namerect + " " + style.settings_menu}
                        style={{ top: "50%", width: "80vw", height: "80vh" }}
                    >
                        <img src="/assets/yatta.gif" alt="yatta" />
                    </div>
                </div>
            )}

            <div id={style["admin-panel"]}>
                <button
                    onClick={() => {
                        celebrationTime();
                    }}
                >
                    Celebrate
                </button>
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

            <audio ref={audioRef} src="/assets/yatta.mp3" preload="auto" />
        </div>
    );
}
