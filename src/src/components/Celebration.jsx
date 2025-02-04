import React, { useEffect, useMemo, useRef, useState } from "react";
import style from "@/styles/Room.module.css";

export default function Celebration() {
    const [timeoutFinished, setFinished] = useState(false);
    const audioRef = useRef();

    useEffect(() => {
        audioRef.current.volume = 0.02;
    }, [audioRef]);

    setTimeout(() => setFinished(true), 5000);

    useMemo(() => {
        console.log(audioRef.current);
        audioRef.current?.play(); // Play the audio
    }, [audioRef.current]);
    return (
        <>
            {timeoutFinished ? null : (
                <>
                    <div className="namerectdiv">
                        <div
                            className={style.namerect + " " + style.settings_menu}
                            style={{ top: "50%", width: "80vw", height: "80vh" }}
                        >
                            <img src="/assets/yatta.gif" alt="yatta" />
                        </div>
                    </div>
                    <audio ref={audioRef} src="/assets/yatta.mp3" preload="auto" />
                </>
            )}
        </>
    );
}
