"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import "@/styles/name.css";
import "@/styles/Home.css";

import {
  InputCard,
  QuizCard,
  ResponseCollectedCard,
  ResultCard,
} from "@/components/SetupCards";
import SnowingBG from "@/components/SnowingBG";
import { motion } from "motion/react";
import { delay, easeIn, easeInOut } from "motion";
import { getRoom } from "@/components/api/api";
import { EJSON } from "bson";

const TestCardsPage = () => {
    const [cards, setCards] = useState(
        Array(5).fill({
          placeholder: "",
          subtitle: "Loading...",
          cardNum: "Loading...",
          options: ["Loading... option1", "Loading... option2", "Loading...option3", "Loading...option4"],
        }),
      );
    
      // Animation to move card to the center
      const animateToCenter = (delay = 0) => {
        return {
          top: "50vh",
          left: "50vw",
          transform: "translate(-50%, -50%) rotateZ(0deg)",
          transition: { easeInOut, duration: 1, delay: delay },
        };
      };
    
      // Animation to move card to the side
      const animateToSide = (offset) => {
        let randAngle = Math.random() * 5;
        return {
          top: "50vh",
          left: `15.${offset}vw`,
          transform:
            `translate(-50%, -50%) rotateY(180deg) rotateZ(${randAngle}deg)`,
          zIndex: 1,
          transition: { easeInOut, duration: 1 },
        };
      };
    
      const [animations, setAnimations] = useState([
        animateToCenter,
        {},
        {},
        {},
        {},
      ]);
    
      // Animation to fly card up
      const animateFlyUp = (delay) => {
        return {
          top: "-50vh",
          left: "15vw",
          transform: `translate(-50%, -50%) rotateY(180deg) rotateZ(0deg)`,
          zIndex: 1,
          transition: { delay: delay, easeInOut, duration: 0.5 },
        };
      };
    
      const [responses, setResponses] = useState([]);
      const [finalCard, setFinalCard] = useState(false);
    
      useEffect(() => {
          // Fetch room data and set cards
          getRoom('0000').then((room) => {
            console.log(EJSON.parse(room));
            const cardsDetails = EJSON.parse(room).questions.map((
              question,
              index,
            ) => ({
              subtitle: question,
              placeholder: "Enter your response",
              cardNum: index + 1,
            }));
            setCards(cardsDetails);
          });
        }, ['0000']);
      const dataHandler = (data) => {
        setResponses([...responses, data]);
        console.log(data.stage)
        switch (data.stage) {
          case 0:
            setAnimations([
              animateToSide(3),
              animateToCenter,
              {},
              {},
              {},
            ]);
            break;
          case 1:
            setAnimations([
              animateToSide(3),
              animateToSide(6),
              animateToCenter,
              {},
              {},
            ]);
            break;
          case 2:
            setAnimations([
              animateToSide(3),
              animateToSide(6),
              animateToSide(6),
              animateToCenter,
              {},
            ]);
            break;
          case 3:
            setAnimations([
              animateToSide(3),
              animateToSide(6),
              animateToSide(6),
              animateToSide(6),
              animateToCenter,
            ]);
            break;
          case 4:
            setAnimations([
              animateFlyUp(1),
              animateFlyUp(1),
              animateFlyUp(1),
              animateFlyUp(1),
              {
                top: [null, "50vh", "-50vh"],
                left: [null, "15vw", "15vw"],
                transform: [
                  null,
                  "translate(-50%, -50%) rotateY(180deg) rotateZ(0deg)",
                  "translate(-50%, -50%) rotateY(180deg) rotateZ(0deg)",
                ],
                zIndex: 1,
                transition: { easeInOut, duration: 2, times: [0, 0.5, 1] },
              },
            ]);
            setFinalCard(true);
            break;
        }
      };
    
      return (
        <>
          {/* <ResponseCollectedCard cardNum={6} props={responses}/> */}
          {cards.map((card, index) => {
            let rotation = (45 / 5 * index) - 45 / 5 - 45;
            return (
              <motion.div
                key={`card-${index}`}
                animate={animations[index]}
                initial={{
                  transformOrigin: "50% 100%",
                  rotateZ: rotation,
                  left: "100%",
                }}
                style={{
                  position: "absolute",
                  zIndex: `${5 - index}`,
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}
              >
                <QuizCard
                  index={index}
                  sendDataToParent={dataHandler}
                  subtitle={card.subtitle}
                  placeholder={card.placeholder}
                  cardNum={card.cardNum}
                  options={card.options}
                />
              </motion.div>
            );
          })}
        </>
      );
    }
export default TestCardsPage;