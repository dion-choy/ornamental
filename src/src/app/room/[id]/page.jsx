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
    startQuiz,
} from "@/components/api/api";
import { EJSON } from "bson";
import { useCookies } from "next-client-cookies";
import { stringToDate } from "@/lib/myDateFunction";
import Celebration from "@/components/Celebration";
import Quiz from "@/components/Quiz";
import Settings from "@/components/Settings";
import RoomCanvas from "@/components/RoomCanvas";

export default function Home() {
    const { id } = useParams(); // Room code id
    const cookies = useCookies();
    const [numReindeers, setNumReindeers] = useState(0); // State for number of reindeers
    const [ornaments, setOrnaments] = useState([]); // State to hold all ornaments in room
    const [giftData, setGiftData] = useState([]); // State for gifts displayed below tree

    const [chooseOrnament, setChooseOrnament] = useState(false); // State to indicate if user is choosing a gift
    const [authorVisible, setAuthorVisible] = useState(false); // State for author name GUI visible or not
    const [giftGUIVisible, setGiftGUIVisible] = useState(false); // State for whether selecting a gift GUI is open (at gift table)
    const [selectedGift, setSelectedGift] = useState(""); // State for selected gift from above gift GUI

    const [camSetting, setCamSetting] = useState(0); // State for orbiting vs viewing gift table
    const [firstTime, setFirstTime] = useState(false); // State to indicate first time viewing onboarding
    const [room, setRoom] = useState({}); // State to hold room object
    const [timeLeft, setTimeLeft] = useState("-- Days --:--:--"); // State for countdown timer
    const [seenCelebration, setSeenCelebration] = useState(true); // State for whether user seen celebration yet
    const [quizVisible, setQuizVisible] = useState(false); // State to control Quiz visibility
    const [isAdmin, setIsAdmin] = useState(false); // State if user is admin

    const [settingsVisible, setSettingsVisible] = useState(false); // State for settings GUI
    const [shadows, setShadows] = useState("high"); // State for shadows settings
    const [rotation, setRotation] = useState(true); // State for rotation settings

    function load() {
        console.log(id);
        getNoPlayers(id).then((no) => {
            setNumReindeers(no); //
        });
        getRoom(id).then((roomStr) => {
            let userId = cookies.get("userId");
            if (userId) {
                hasSeenCelebration(userId).then((res) => {
                    setSeenCelebration(res); // Load seen celebration
                });

                getUser(userId).then((res) => {
                    res = EJSON.parse(res);
                    setIsAdmin(res.is_admin); // load admin
                });
            }

            const room = EJSON.parse(roomStr);
            setRoom(room); // set room
            setOrnaments(room.ornaments); // set ornaments
            setGiftData(room.gifts); // set gifts
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
            console.log("ROOM: ", room.current_question);
            if (room.current_question) {
                console.log("IM IN");

                hasDoneQuiz(userId)
                    .then((res) => {
                        console.log("RES: ", res);
                        if (res == false) {
                            setQuizVisible(true);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    }

    useEffect(() => {
        if (!room.secret_santa) {
            return;
        }
        const endDate = stringToDate(room.secret_santa.end_date);
        setInterval(() => {
            // Interval to update time
            const curDate = new Date();
            let timeDelta = endDate - curDate;
            // If after event, time delta set 0
            timeDelta = timeDelta < 0 ? 0 : timeDelta;
            let days = Math.floor(timeDelta / 86400000);
            timeDelta %= 86400000;
            let hours = Math.floor(timeDelta / 3600000);
            timeDelta %= 3600000;
            let mins = Math.floor(timeDelta / 60000);
            timeDelta %= 60000;
            let secs = Math.floor(timeDelta / 1000);

            // If hours, min, sec smaller than 10 append 0 in front
            setTimeLeft(
                `${days} Days ${hours >= 10 ? hours : "0" + hours}:${mins >= 10 ? mins : "0" + mins}:${
                    secs >= 10 ? secs : "0" + secs
                }`
            );
        }, 1000);
    }, [room]);

    useEffect(() => {
        // Reload page every min
        load();
        setInterval(load, 60000);
    }, []);

    // Callback to show author when object hovered
    const showAuthor = useCallback((authorId) => {
        getUser(EJSON.stringify(authorId)).then((authorStr) => {
            const author = EJSON.parse(authorStr);
            setAuthorVisible(author.name);
        });
        // if prev hideAuthor timeout created, remove it
        clearTimeout(hideTimeout);
    }, []);

    // Callback to hide author when object hovered
    let hideTimeout;
    const hideAuthor = useCallback(() => {
        hideTimeout = setTimeout(() => setAuthorVisible(false), 1000);
    }, []);

    // Callback to pass to gift 3D object for toggling giftGUI
    function giftClickHandler(object) {
        if (object.giftType == selectedGift || selectedGift == "") {
            setGiftGUIVisible(!giftGUIVisible);
        }
        setSelectedGift(object.giftType);
    }

    // Handler to add gift to room
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
                <Quiz
                    roomId={id}
                    userId={cookies.get("userId")}
                    onComplete={() => {
                        setQuizVisible(false);
                        doneQuiz(cookies.get("userId"));
                    }}
                />
            )}{" "}
            {/* Render Quiz component conditionally */}
            <Auth code={id} load={load} />
            {!seenCelebration && timeLeft == "0 Days 00:00:00" && <Celebration userId={cookies.get("userId")} />}
            <RoomCanvas
                firstTime={firstTime}
                rotation={cookies.get("rotation") || rotation}
                numReindeers={numReindeers}
                choose={chooseOrnament}
                setChoose={setChooseOrnament}
                ornaments={ornaments}
                showAuthor={showAuthor}
                hideAuthor={hideAuthor}
                camSetting={camSetting}
                giftClickHandler={giftClickHandler}
                giftData={giftData}
                timeLeft={timeLeft}
                shadows={cookies.get("shadows") || shadows}
                load={load}
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
                            {room.hasOwnProperty("secret_santa") && !room.secret_santa.started && (
                                <button onClick={() => startSecretSanta(id)}>Start Secret Santa</button>
                            )}
                            {room.hasOwnProperty("secret_santa") && room.secret_santa.started && (
                                <button onClick={() => startQuiz(id)}>Show Quiz</button>
                            )}
                        </>
                    )}
                    {room.hasOwnProperty("secret_santa") && room.secret_santa.started && (
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
