import React from 'react'
import { useState, useEffect } from 'react';

function SnowingBG() {
    const [snowPos, setSnowPos] = useState([])
    function createSnowflake() {
        return ({
            id: Math.random().toString(36).substr(2, 9),
            leftOffset: Math.random() * window.innerWidth,
            animationDelay: Math.random() * 5
        });
    }

    function replaceSnowPos(id) {
        setSnowPos((prevSnow) =>
            prevSnow.map((flake) =>
                flake.id === id ? createSnowflake() : flake
            )
        );
    }

    useEffect(() => {
        const initialSnow = Array.from({ length: 10 }, createSnowflake);
        setSnowPos(initialSnow);
    }, []);
    return (
        <>
            {snowPos.map((snowflake, index) => (
                <div key={snowflake.id} className="snowflake" style={{ top: "-10%", left: `${snowflake.leftOffset}px`, animationDelay: `${snowflake.animationDelay}s` }} onAnimationEnd={() => replaceSnowPos(snowflake.id)}>
                    <img src="assets/snowflake.png" alt="Snowflake" />
                </div>
            ))}
        </>

    )


}

export default SnowingBG