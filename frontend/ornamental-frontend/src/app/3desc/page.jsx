"use client";
import React, { useState, useEffect } from "react";
import css from "@/styles/name.css";
import { redirect } from 'next/navigation'


function createRoom() {
  const [snowPos, setSnowPos] = useState([]);
  

  // Function to create a single snowflake
  function createSnowflake() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      leftOffset: Math.random() * window.innerWidth,
      animationDelay: Math.random() * 5,
    };
  }

  // Continuously add new snowflakes at intervals
  useEffect(() => {
    const initialSnow = Array.from({ length: 20 }, createSnowflake); // Start with 20 snowflakes
    setSnowPos(initialSnow);

    const interval = setInterval(() => {
      setSnowPos((prevSnow) => [
        ...prevSnow.filter((flake) => flake.id !== prevSnow[0]?.id), // Remove oldest flake
        createSnowflake(), // Add new snowflake
      ]);
    }, 1000); // Add a new snowflake every second

    return () => clearInterval(interval); // Clean up interval
  }, []);

  return (
    <div className="container">
      <div className="card">
        <img src="assets/logo.svg" alt="Ornamental" />
        <p className="subtitle">DESC HERE</p>
        <img src="assets/candycane.svg" alt="Candy Cane" />
        


        <input
          className="input-field"
          type="text"
          placeholder="Enter an Iconic Name"
        />
        <button className="next-btn" onClick={() => redirect("/3desc")}>Next</button>
        <div className="progress-indicator">
          <span className="circle active"></span>
          <span className="circle active"></span>
          <span className="circle active"></span>
          <span className="circle"></span>
        </div>
      </div>

      {/* Snowflakes */}
      {snowPos.map((snowflake) => (
        <div
          key={snowflake.id}
          className="snowflake"
          style={{
            top: "-10%",
            left: `${snowflake.leftOffset}px`,
            animationDelay: `${snowflake.animationDelay}s`,
          }}
        >
          <img src="assets/snowflake.png" alt="Snowflake" />
        </div>
      ))}
    </div>
  );
}

export default createRoom;
