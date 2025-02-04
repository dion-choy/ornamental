import React, { useEffect, useMemo, useRef, useState } from "react";
import style from "@/styles/Room.module.css";

export default function Celebration() {
    // State to track if the timeout has finished
    const [timeoutFinished, setFinished] = useState(false);
    // Ref to access the audio element
    const audioRef = useRef();

    useEffect(() => {
        // Set the volume of the audio element
        audioRef.current.volume = 0.02;
    }, [audioRef]);

    // Set a timeout to update the state after 5 seconds
    setTimeout(() => setFinished(true), 5000);

    useMemo(() => {
        // Log the audio element and play the audio
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
