"use client";
import React, { useState, useEffect } from "react";
import { redirect } from 'next/navigation'
import "@/styles/name.css";
import "@/styles/Cards.css"
import { ResultCard, InputCard, CalendarCard } from "@/components/SetupCards";
import SnowingBG from "@/components/SnowingBG";
import { motion } from "motion/react";
import { delay, easeIn, easeInOut } from "motion";
import { checkCode, createRoom } from "@/components/api/api";
import questions from "@/lib/questions.json"
import ReturnButton from "@/components/ReturnButton";

function createRoomPage() {
  const [cards, setCards] = useState([
    { subtitle: "Every iconic group has a name", placeholder: "Enter your iconic name", cardNum: "1" },
    { subtitle: "When should the gifts be exchanged?", placeholder: "Select a date", cardNum: "2" },
    { subtitle: "Let's make this room uniquely yours", placeholder: "Enter description", cardNum: "3" },
  ])

  const animateToCenter = (delay = 0) => {
    return {
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

  const [groupName, setGroupName] = useState();
  const [date, setDate] = useState();
  const [groupDesc, setGroupDesc] = useState();

  const [finalCard, setFinalCard] = useState(false);

  const dataHandler = (data) => {
    switch (data.stage) {
      case -1:
        // Refresh cards
        setAnimations([
          animateToCenter,
          {},
          {},
        ])
        setFinalCard(false);
        break;

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

  async function conf() {
    let ok = false
    let code = Math.floor(Math.random() * 90000) + 10000;
    console.log(code)
    while (!ok) {
      if (!await checkCode(code)) {
        ok = true
      } else {
        code = Math.floor(Math.random() * 90000) + 10000;
      }
    }
    const selectedQuestions = questions
      .sort(() => Math.random() - 0.5) // Shuffle the array
      .slice(0, 5); // Take the first 5 items

    console.log(date)

    createRoom(code, groupName, date, 50, groupDesc, 5, selectedQuestions).then((res) => { redirect("/room/" + code.toString()) })
  }


  return (
    <>
      <div className="absolute top-5 left-5">
        <ReturnButton/>
      </div>
      {finalCard ?
        <motion.div
          initial={{ top: "-50vh", left: "50vw", transform: "translate(-50%, -50%)" }}
          animate={animateToCenter(4)}
          style={{ position: "absolute" }}>
          <ResultCard subtitle={"Does this sound like your room?"} cardNum={4} 
          groupName={groupName} date={date} description={groupDesc} sendDataToParent={dataHandler} confirmation={conf} />
        </motion.div> : null}


      {cards.map((card, index) => {
        let rotation = (45 / 3 * index) - 45 / 3 - 45;
        if (index == 1) {
          return (
            <motion.div key={index}
            animate={animations[index]}
            initial={{ transformOrigin: "50% 100%", rotateZ: rotation, left: "100%" }}

            style={{ position: "absolute", zIndex: `${3 - index}`, backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}>
            <CalendarCard index={index} sendDataToParent={dataHandler} subtitle={card.subtitle} placeholder={card.placeholder} cardNum={card.cardNum}/>
          </motion.div>
          )
        }
        return (
          <motion.div key={index}
            animate={animations[index]}
            initial={{ transformOrigin: "50% 100%", rotateZ: rotation, left: "100%" }}

            style={{ position: "absolute", zIndex: `${3 - index}`, backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}>
            <InputCard index={index} sendDataToParent={dataHandler} subtitle={card.subtitle} placeholder={card.placeholder} cardNum={card.cardNum}></InputCard>
          </motion.div>
        )
      })}


      {/* Snowflakes */}
      <SnowingBG></SnowingBG>
    </>


  );
}

export default createRoomPage;
