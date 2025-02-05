import React from "react";
import { useEffect, useState } from "react";
import style from "@/styles/Snowflake.module.css";

function SnowingBG() {
  const [snowPos, setSnowPos] = useState([]);

  // Function to create a new snowflake with random properties
  function createSnowflake() {
    return {
      id: Math.random().toString(36).substr(2, 9), // Unique ID for each snowflake
      leftOffset: Math.random() * window.innerWidth, // Random horizontal position
      animationDelay: Math.random() * 5, // Random animation delay
    };
  }

  // Function to replace a snowflake with a new one when its animation ends
  function replaceSnowPos(id) {
    setSnowPos((prevSnow) =>
      prevSnow.map((flake) => (flake.id === id ? createSnowflake() : flake))
    );
  }

  useEffect(() => {
    // Initialize snowflakes on component mount
    const initialSnow = Array.from({ length: 10 }, createSnowflake);
    setSnowPos(initialSnow);
  }, []);

  return (
    <>
      {snowPos.map((snowflake, index) => (
        <div
          key={snowflake.id}
          className={style.snowflake}
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
    </>
  );
}

export default SnowingBG;
