"use client";
import React, { useState, useEffect } from "react";
import css from "@/styles/home.css";
import { motion } from "motion/react"

function Home() {

  const [snowPos, setSnowPos] = useState([])
  const [displayInputCode, setDisplayInputCode] = useState(false);

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
    <div>
      <div className="container">
        <div className="logo">
          <img src="/logo.png" alt="Ornamental Logo" />
        </div>

        <p style={{fontSize: "40px"}}>It's secret santa</p>
        <p style={{fontSize: "20px"}}>but <b>better</b></p>

        <div className="candy-cane">
          <img src="/candycane.png" alt="Candy Cane Divider" />
        </div>

        <div className="buttons">
          <button className="btn create">Create a Room</button>
          <button className="btn join" onClick={() => setDisplayInputCode(true)}>Join a Room</button>
          
          {displayInputCode? 
          (<motion.input initial={{ opacity: 0, y: -50 }}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, y: {type: "spring", visualDuration: 0.4, bounce: 0.5}}}
            
            placeholder="Enter Room code" id="code" className="btn"></motion.input>)
           : null}
          
        </div>

        {snowPos.map((snowflake, index) => (
          <div key={snowflake.id} className="snowflake" style={{ top: "-10%", left: `${snowflake.leftOffset}px`, animationDelay: `${snowflake.animationDelay}s` }} onAnimationEnd={() => replaceSnowPos(snowflake.id)}>
            <img src="/snowflake.png" alt="Snowflake" />
          </div>
        ))}
      </div>

      <div className="info-container">
        <h2>About</h2>
      </div>


    </div>
  );
}

export default Home;
