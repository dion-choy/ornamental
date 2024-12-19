"use client";
import React, { useState, useEffect } from "react";
import { redirect } from 'next/navigation'
import css from "@/styles/name.css";
import { ResultCard, SetupCard } from "@/components/SetupCards";
import SnowingBG from "@/components/SnowingBG";
import { motion } from "motion/react";
import { delay, easeIn, easeInOut } from "motion";

function createRoom() {
  const [cards, setCards] = useState([
    { subtitle: "Every iconic group has a name", placeholder: "Enter your iconic name", cardNum: "1" },
    { subtitle: "When should the gifts be exchanged?", placeholder: "Select a date", cardNum: "2" },
    { subtitle: "Let's make this room uniquely yours", placeholder: "Enter description", cardNum: "3" },
  ])

  const animateToCenter = (delay = 0) => { return {
    top: "50vh", left: "50vw",
    transform: "translate(-50%, -50%) rotateZ(0deg)",
    transition: { easeInOut, duration: 1, delay: delay }
  }
  };

  const animateToSide = (offset) => {
    let randAngle = Math.random() * 5;
    console.log(randAngle)
    return {
      top: "50vh", left: `15.${offset}vw`,
      transform: `translate(-50%, -50%) rotateY(180deg) rotateZ(${randAngle}deg)`,
      zIndex: 0,
      transition: { easeInOut, duration: 1 }
    }
  }


  const [animations, setAnimations] = useState([
    animateToCenter,
    {},
    {},
  ])

  const animateFlyUp = (delay) => {
    return {
      top: "-50vh", left: "15vw",
      transform: `translate(-50%, -50%) rotateY(180deg) rotateZ(0deg)`,
      zIndex: 0,
      transition: { delay: delay, easeInOut, duration: 0.5 }
    }
  }

  const [groupName, setGroupName] = useState("");
  const [date, setDate] = useState("");
  const [groupDesc, setGroupDesc] = useState("");

  const [finalCard, setFinalCard] = useState(false);



  const dataHandler = (data) => {
    switch (data.stage) {
      case 0:
        setGroupName(data.value)
        setAnimations([
          animateToSide(3),
          animateToCenter,
          {},
        ])
        break;
      case 1:
        setDate(data.value)
        setAnimations([
          animateToSide(3),
          animateToSide(6),
          animateToCenter,
        ])
        break;
      case 2:
        setGroupDesc(data.value)
        setAnimations([
          animateFlyUp(1),
          animateFlyUp(1),
          {
            top: [null, "50vh", "-50vh"], left: [null, "15vw", "15vw"],
            transform: [null,
              "translate(-50%, -50%) rotateY(180deg) rotateZ(0deg)",
              "translate(-50%, -50%) rotateY(180deg) rotateZ(0deg)"
            ],
            zIndex: 0,
            transition: { easeInOut, duration: 2, times: [0, 0.5, 1] }
          },
        ])
        setFinalCard(true);
        break;
    }
  }



  return (
    <>
      {finalCard ? 
      <motion.div
        initial={{top: "-50vh", left: "50vw", transform: "translate(-50%, -50%)"}}
        animate={animateToCenter(4)}
        style={{position: "absolute"}}>
        <ResultCard subtitle={"Does this sound like your room?"} cardNum={4} groupName={groupName} date={date} description={groupDesc} />
      </motion.div> : null}
      {cards.map((card, index) => {
        let rotation = (45 / 3 * index) - 45 / 3 - 45;
        return (
          <motion.div key={index}
            animate={animations[index]}
            initial={{ transformOrigin: "50% 100%", rotateZ: rotation, left: "100%" }}

            style={{ position: "absolute", zIndex: `${3 - index}`, backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}>
            <SetupCard index={index} sendDataToParent={dataHandler} subtitle={card.subtitle} placeholder={card.placeholder} cardNum={card.cardNum}></SetupCard>
          </motion.div>
        )
      })}


      {/* Snowflakes */}
      <SnowingBG></SnowingBG>
    </>


  );
}

export default createRoom;
