"use client";
import React, { useEffect, useState } from "react";
import { InputCard, ResponseCollectedCard, ResultCard } from "@/components/SetupCards";
import { motion } from "motion/react";
import { delay, easeIn, easeInOut } from "motion";
import { getRoom } from "@/components/api/api";
import { EJSON } from "bson";

function SecretSantaOnboarding({ roomId, onComplete }) {
    const [cards, setCards] = useState(
        Array(5).fill({
            placeholder: "",
            subtitle: "Loading...",
            cardNum: "Loading...",
        })
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
            transform: `translate(-50%, -50%) rotateY(180deg) rotateZ(${randAngle}deg)`,
            zIndex: 0,
            transition: { easeInOut, duration: 1 },
        };
    };

    const [animations, setAnimations] = useState([animateToCenter, {}, {}, {}, {}]);

    // Animation to fly card up
    const animateFlyUp = (delay) => {
        return {
            top: "-50vh",
            left: "15vw",
            transform: `translate(-50%, -50%) rotateY(180deg) rotateZ(0deg)`,
            zIndex: 0,
            transition: { delay: delay, easeInOut, duration: 0.5 },
        };
    };

    const [responses, setResponses] = useState([]);
    const [finalCard, setFinalCard] = useState(false);

    useEffect(() => {
        // Fetch room data and set cards
        getRoom(roomId).then((room) => {
            console.log(EJSON.parse(room));
            const cardsDetails = EJSON.parse(room).questions.map((question, index) => ({
                subtitle: question,
                placeholder: "Enter your response",
                cardNum: index + 1,
            }));
            setCards(cardsDetails);
        });
    }, [roomId]);

    useEffect(() => {
        console.log(responses);
    }, [responses]);

    const dataHandler = (data) => {
        setResponses([...responses, data]);
        switch (data.stage) {
            case 0:
                setAnimations([animateToSide(3), animateToCenter, {}, {}, {}]);
                break;
            case 1:
                setAnimations([animateToSide(3), animateToSide(6), animateToCenter, {}, {}]);
                break;
            case 2:
                setAnimations([animateToSide(3), animateToSide(6), animateToSide(6), animateToCenter, {}]);
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
                        zIndex: 0,
                        transition: { easeInOut, duration: 2, times: [0, 0.5, 1] },
                    },
                ]);
                setFinalCard(true);
                break;
        }
    };

    return (
        <>
            {finalCard ? (
                <motion.div
                    initial={{
                        top: "-50vh",
                        left: "50vw",
                        transform: "translate(-50%, -50%)",
                    }}
                    animate={animateToCenter(3.5)}
                    style={{ position: "absolute" }}
                >
                    <ResponseCollectedCard onComplete={onComplete} cardNum={6} responses={responses} />
                </motion.div>
            ) : null}

            {cards.map((card, index) => {
                let rotation = (45 / 5) * index - 45 / 5 - 45;
                return (
                    <motion.div
                        key={index}
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
                        <InputCard
                            index={index}
                            sendDataToParent={dataHandler}
                            subtitle={card.subtitle}
                            placeholder={card.placeholder}
                            cardNum={card.cardNum}
                        />
                    </motion.div>
                );
            })}
        </>
    );
}

export default SecretSantaOnboarding;
