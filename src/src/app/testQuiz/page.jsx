"use client";
import React, { useState, useEffect } from "react";
 import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation'
import "@/styles/name.css";
import cardCss from "@/styles/Cards.module.css";
import css from "@/styles/General.module.css";

import { ResultCard, InputCard, CalendarCard } from "@/components/SetupCards";
import SnowingBG from "@/components/SnowingBG"; 
import { delay, easeIn, easeInOut } from "motion";
import { checkCode, createRoom } from "@/components/api/api";
import questions from "@/lib/questions.json";
import ReturnButton from "@/components/ReturnButton";



import "@/styles/Calendar.css"
import { motion } from "motion/react";
import Calendar from "react-calendar";
import { dateToString } from "@/lib/myDateFunction";
import { hasSeenOnboarding } from "@/components/api/api";
import { useCookies } from "next-client-cookies";

function testQuiz() {
    return (
        <div className={cardCss.card}>
            <div className={cardCss['card-back']} style={{ transform: "rotateY(180deg)" }}></div>

            <div className={cardCss['card-front']} style={{ transform: "rotateY(0deg)" }}>
            <p className={cardCss.circle + " text-4xl font-bold"}>X</p>
                {/* <p className={cardCss.circle + " text-4xl font-bold"}>{props.cardNum}</p> */}
                <p className={cardCss.subtitle}>Question</p>
                {/* <p className={cardCss.subtitle}>{props.subtitle}</p> */}
                <img src="/assets/candycane.svg" alt="Candy Cane" />    
                {/* Placeholder Buttons */}
                <div className="mt-6 flex flex-col gap-4">
                    <button className={css['next-btn'] + " italic"}>
                        Option 1 Jerick is a boy
                    </button>
                    <button className={css['next-btn'] + " italic"}>
                        Option 2 Jerick is a girl
                    </button>
                    <button className={css['next-btn'] + " italic"}>
                        Option 3 Jerick is curved
                    </button>
                    <button className={css['next-btn'] + " italic"}>
                        Option 4 Jerick is chinese
                    </button>
                </div>
        
                
            </div>
        </div>
    );


}

export default testQuiz;