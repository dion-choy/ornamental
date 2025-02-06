"use client";
import style from "@/styles/Room.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Auth from "@/components/auth.jsx";
import { SecretSantaAnnouncement, SpiralAnimation } from "@/components/SecretSantaAnnouncement";
import { redirect, useParams } from "next/navigation";
import {
    addGift,
    getNoPlayers,
    getRoom,
    getUser,
    hasSeenOnboarding,
    hasSeenCelebration,
    startSecretSanta,
    hasDoneQuiz,
    doneQuiz,
} from "@/components/api/api";
import { EJSON } from "bson";
import { useCookies } from "next-client-cookies";
import { stringToDate } from "@/lib/myDateFunction";
import Celebration from "@/components/Celebration";
import Quiz from "@/components/Quiz";
import Settings from "@/components/Settings";
import RoomCanvas from "@/components/RoomCanvas";

export default function Home() {
    const { id } = useParams();
    const cookies = useCookies();
    const [numReindeers, setNumReindeers] = useState(0);
    const [chooseOrnament, setChooseOrnament] = useState(false);
    const [camSetting, setCamSetting] = useState(0);
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
    const [seenCelebration, setSeenCelebration] = useState(true);
    const [quizVisible, setQuizVisible] = useState(false); // State to control Quiz visibility
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        console.log(seenCelebration);
    }, [seenCelebration]);

    function load() {
        console.log(id);
        getNoPlayers(id).then((no) => {
            setNumReindeers(no);
        });
        getRoom(id).then((roomStr) => {
            let userId = cookies.get("userId");
            if (userId) {
                hasSeenCelebration(userId).then((res) => {
                    setSeenCelebration(res);
                });

                getUser(userId).then((res) => {
                    res = EJSON.parse(res);
                    console.log(res);
                    setIsAdmin(res.is_admin);
                });
            }

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
            if (room.current_question) {
                hasDoneQuiz(userId, id).then((res) => {
                    if (res == false) {
                        setQuizVisible(true);
                    }
                })
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

    const showAuthor = useCallback((authorId) => {
        getUser(EJSON.stringify(authorId)).then((authorStr) => {
            const author = EJSON.parse(authorStr);
            setAuthorVisible(author.name);
        });
        hideAuthor();
    }, []);

    const hideAuthor = useCallback(() => {
        setTimeout(() => setAuthorVisible(false), 2000);
    }, []);

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
    const [shadows, setShadows] = useState("high");
    const [rotation, setRotation] = useState(true);

    function showQuiz() {
        setQuizVisible((prev) => !prev);
    }

    return (
        <div className={style.scene}>
            {firstTime && (
                <SecretSantaAnnouncement
                    roomId={id}
                    userid={cookies.get("userId")}
                    onComplete={() => {
                        setFirstTime(false);
                        console.log("FALSE");
                    }}
                />
            )}
            {quizVisible && (
                <Quiz roomId={id} userId={cookies.get("userId")} onComplete={() => {setQuizVisible(false); doneQuiz(cookies.get("userId"))}} />
            )}{" "}
            {/* Render Quiz component conditionally */}
            <Auth code={id} load={load} />
            {!seenCelebration && timeLeft == "0 Days 00:00:00" && <Celebration userId={cookies.get("userId")} />}
            <RoomCanvas
                firstTime={firstTime}
                rotation={cookies.get("rotation") || rotation}
                numReindeers={numReindeers}
                choose={chooseOrnament}
                ornaments={ornaments}
                showAuthor={showAuthor}
                hideAuthor={hideAuthor}
                camSetting={camSetting}
                giftClickHandler={giftClickHandler}
                giftData={giftData}
                timeLeft={timeLeft}
                shadows={cookies.get("shadows") || shadows}
            />
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
                    <div className={style.namerect + " namerectdiv"}>
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
                )}

                {authorVisible && (
                    <div className={style.namerect + " namerectdiv"}>
                        <p>{authorVisible}</p>
                    </div>
                )}

                <Settings
                    visible={settingsVisible}
                    setVis={setSettingsVisible}
                    setShadows={setShadows}
                    setRotation={setRotation}
                />

                <div id={style["admin-panel"]}>
                    <button
                        onClick={() => {
                            setSettingsVisible(!settingsVisible);
                        }}
                    >
                        Settings
                    </button>
                    {isAdmin && (
                        <>
                            <button onClick={() => startSecretSanta(id)}>Start Secret Santa</button>
                            <button onClick={() => showQuiz()}>Show Quiz</button>
                        </>
                    )}
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
