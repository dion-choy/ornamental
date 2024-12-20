"use client";
import React, { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import "@/styles/Home.css";
import { checkCode } from "@/components/api/api";
import { motion } from "motion/react";

function Home() {
    const [snowPos, setSnowPos] = useState([]);
    const [code, setCode] = useState(0);
    const [can, setCan] = useState(true);
    const [displayInputCode, setDisplayInputCode] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const aboutRef = useRef(null);

    const handleCode = (e) => {
        console.log("amongus");
        const value = e.target.value;
        setCode(value);
        console.log(value);
    };

    function createSnowflake() {
        return {
            id: Math.random().toString(36).substring(2, 9),
            leftOffset: Math.random() * window.innerWidth,
            animationDelay: Math.random() * 5,
        };
    }

    function replaceSnowPos(id) {
        setSnowPos((prevSnow) => prevSnow.map((flake) => (flake.id === id ? createSnowflake() : flake)));
    }

    useEffect(() => {
        const initialSnow = Array.from({ length: 10 }, createSnowflake);
        setSnowPos(initialSnow);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.2 }
        );

        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }

        return () => {
            if (aboutRef.current) {
                observer.unobserve(aboutRef.current);
            }
        };
    }, []);

    const inputCodeRef = useRef(null);

    return (
        <div>
            <div className="header-container">
                <div className="header-card"></div>
                <img className="logo inline mt-40 mb-20px" src="/assets/logo.svg" alt="Ornamental Logo" />

                <p style={{ fontSize: "40px" }}>It's secret santa</p>
                <p style={{ fontSize: "20px" }}>
                    but <b>better</b>
                </p>

                <img className="inline candy-cane" src="/assets/candycane.svg" alt="Candy Cane Divider" />

                <div className="buttons">
                    <button className="btn create" onClick={() => redirect("/createRoom")}>
                        Create a Room
                    </button>

                    {!displayInputCode ? (
                        <button
                            className="btn join"
                            onClick={() => {
                                setDisplayInputCode(true);
                            }}
                        >
                            Join a Room
                        </button>
                    ) : null}

                    {displayInputCode ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                checkCode(code).then((c) => {
                                    if (!c) {
                                        setCan(false);
                                    } else {
                                        redirect("/room/" + code);
                                    }
                                });
                            }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
                        >
                            <motion.input
                                initial={{ opacity: 0, y: -60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    y: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                                }}
                                onChange={handleCode}
                                ref={inputCodeRef}
                                placeholder="Enter Room code"
                                id="code"
                                className="btn"
                            ></motion.input>
                            <motion.button
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    y: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.2, ease: "linear" },
                                }}
                                onAnimationComplete={() => inputCodeRef.current.focus()}
                                className="btn"
                                id="enter"
                                type="submit"
                            >
                                Enter!
                            </motion.button>
                            {can ? "" : "Wrong Code"}
                        </form>
                    ) : null}
                </div>

                {snowPos.map((snowflake, index) => (
                    <div
                        key={snowflake.id}
                        className="snowflake"
                        style={{
                            top: "-10%",
                            left: `${snowflake.leftOffset}px`,
                            animationDelay: `${snowflake.animationDelay}s`,
                        }}
                        onAnimationEnd={() => replaceSnowPos(snowflake.id)}
                    >
                        <img src="/assets/snowflake.png" alt="Snowflake" />
                    </div>
                ))}
            </div>
            <div className="info-div ">
                <motion.div
                    ref={aboutRef}
                    className={`info-container ${isInView ? "fade-in" : ""}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="info-header ">About</h2>
                    <p className="info-p ">
                        Having a Secret Santa event is always fun, well... only when you know the players well. The last
                        thing you'd want to do is give them a crappy toaster when their kitchen already has 2. That is
                        why we are here today.
                    </p>
                    <br></br>
                    <h2 className="info-subheader ">What it does</h2>
                    <ul className="info-ul ">
                        <li className="info-li "> 🌟 Create a cozy virtual room and join with your friends</li>
                        <li className="info-li ">
                            🧑‍🤝‍🧑 Get to know the acquaintances you've greeted as an intern for the past 2 months through
                            short interactive questions
                        </li>
                        <li className="info-li ">
                            🎨 Personalize your room, because this room belongs to your unique friend group
                        </li>
                        <li className="info-li ">
                            🎁 Be reminded that as Santa, you have a responsibility to purchase a gift by the decided
                            deadline
                        </li>
                        <li className="info-li ">
                            💌 Feel the pressure, knowing that your peers have already bought their gifts via the
                            presents surrounding the virtual tree
                        </li>
                        <li className="info-li ">
                            🔥 Flame that <span className="highlight"> friend</span> that has yet to buy their gift
                        </li>
                        <li className="info-li "> 🎉 Deck the halls with unglams of your beloved friends</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}

export default Home;
