"use client";
import { addPlayer, checkPlayer, hasSecretSantaStarted, checkPlayerId, createUser } from "@/components/api/api";
import { useCookies } from "next-client-cookies";
import React, { useState, useEffect } from "react";
import { BSON, EJSON, ObjectId } from "bson";
import style from "@/styles/Auth.module.css";

export default function Auth(props) {
    const cookies = useCookies();
    const [isLoggedIn, setLog] = useState(false);
    const [ok, setOk] = useState(true);
    const [canSignUp, setCanSignUp] = useState(true);
    const [exists, setExists] = useState(true);
    const [userN, setuserN] = useState("");
    const [password, setPassword] = useState("");

    const userid = cookies.get("userId");

    useEffect(() => {
        if (userid === undefined) {
            setLog(false);
        } else {
            checkPlayerId(userid, props.code).then((res) => {
                if (res === false) {
                    setLog(false);
                } else {
                    setLog(true);
                }
            });
        }

        hasSecretSantaStarted(props.code).then((res) => {
            setCanSignUp(res);
        });
    }, []);

    async function login() {
        let res = await checkPlayer(userN, password, props.code);
        if (res === false) {
            setOk(false);
        } else {
            setOk(true);
            res = EJSON.parse(res);
            cookies.set("userId", EJSON.stringify(res._id));
            setLog(true);
            props.load();
        }
    }

    async function signUp() {
        let res = await checkPlayer(userN, password, props.code);
        if (res === false) {
            setExists(true);
            let res = EJSON.parse(await createUser(password, userN));
            await addPlayer(EJSON.stringify(res.insertedId), props.code);
            cookies.set("userId", EJSON.stringify(res.insertedId));
            setLog(true);
            props.load();
        } else {
            setExists(false);
        }
    }

    function handleUsername(e) {
        setuserN(e.target.value);
    }

    function handlePassword(e) {
        setPassword(e.target.value);
    }

    return (
        <>
            {isLoggedIn ? (
                ""
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            position: "absolute",
                            top: "50vh",
                            left: "50vw",
                            transform: `translate(-50%, -50%)`,
                            zIndex: "101",
                            backgroundColor: "#24223F",
                            padding: "20px",
                            borderRadius: "20px",
                        }}
                    >
                        <input
                            className={style.btn}
                            placeholder="Username"
                            style={{ marginBottom: "10px" }}
                            onChange={handleUsername}
                        />
                        <input
                            className={style.btn}
                            placeholder="password"
                            type="password"
                            style={{ marginBottom: "10px" }}
                            onChange={handlePassword}
                        />
                        {ok ? "" : <div>wrong username or password</div>}
                        {exists ? "" : <div>user exists</div>}
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" }}>
                            <button className={style.btn} style={{ width: "auto" }} onClick={login}>
                                Login
                            </button>
                            {canSignUp ? "" :
                                <button className={style.btn} style={{ width: "auto" }} onClick={signUp}>
                                    Sign up
                                </button>
                            }
                        </div>
                    </div>
                    <div
                        style={{
                            width: "100vw",
                            backdropFilter: "blur(10px)",
                            height: "100vh",
                            position: "absolute",
                            top: "0",
                            left: "0",
                            backgroundColor: "#00000055",
                            zIndex: "100",
                        }}
                    ></div>
                </>
            )}
        </>
    );
}
