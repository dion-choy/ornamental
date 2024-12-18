"use client";
import React, { useState, useEffect } from "react";
import { redirect } from 'next/navigation'
import css from "@/styles/home.css";
import {checkCode}from "@/components/api/api";
import { motion } from "motion/react"

function Home() {

  const [snowPos, setSnowPos] = useState([])
  const [code, setCode] = useState(0);
  const [can, setCan] = useState(true);
  const [displayInputCode, setDisplayInputCode] = useState(false);
  const handleCode = (e) => {
    console.log("amongus")
    const value = e.target.value;
    setCode(value
    );
    console.log(value);
  };

  function createSnowflake() {
    return ({
      id: Math.random().toString(36).substr(2, 9),
      leftOffset:Math.random() * window.innerWidth,
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
    <div className="container" >
    <div className="logo">
    <img src="/logo.png" alt="Ornamental Logo" />
    </div>

    <p style={{fontSize: "40px"}}>It's secret santa</p>
    <p style={{fontSize: "20px"}}>but <b>better</b></p>

    <div className="candy-cane">
    <img src="/candycane.png" alt="Candy Cane Divider" />
    </div>

    <div className="buttons">
    <button className="btn create" onClick={()=>redirect("/createRoom")}>Create a Room</button>
    <button className="btn join" onClick={() => setDisplayInputCode(true)}>Join a Room</button>

    {displayInputCode?
      (<div style={{display:'flex', flexDirection:'column' }}><motion.input initial={{ opacity: 0, y: -50 }}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, y: {type: "spring", visualDuration: 0.4, bounce: 0.5}}}

        onChange={handleCode}
        placeholder="Enter Room code" id="code" className="btn"  ></motion.input>
        <motion.button initial={{ opacity: 0, y: -50 }}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4, y: {type: "spring", visualDuration: 0.4, bounce: 0.5}}}

        className="btn" onClick={()=>{checkCode(code).then((c)=>{if (!c){setCan(c)}else{redirect("/rooms/"+code)}})}} style={{marginTop:'10px', backgroundColor:'#DDDBFF', '&hover':{color:'white', backgroundColor:'#24223F'}}} >Enter!</motion.button>
        {(can)?"":"Wrong Code"}
        </div>)
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

