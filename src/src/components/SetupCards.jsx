import React, { useState } from "react";
import cardStyle from "@/styles/Cards.module.css";
import style from "@/styles/General.module.css";
import "@/styles/Calendar.css"
import { motion } from "motion/react";
import Calendar from "react-calendar";
import { dateToString } from "@/lib/myDateFunction";
import { hasSeenOnboarding } from "@/components/api/api";
import { useCookies } from "next-client-cookies";

export function InputCard(props) {
    const [textValue, setTextValue] = useState("");
    return (
        <div className={cardStyle.card}>
            <div className={cardStyle['card-back']} style={{ transform: "rotateY(180deg)" }}></div>

            <div className={cardStyle['card-front']} style={{ transform: "rotateY(0deg)" }}>
                <p className={cardStyle.circle + " text-4xl font-bold"}>{props.cardNum}</p>
                <img className={cardStyle.logo} src="/assets/logo.svg" alt="Ornamental" />
                <p className={cardStyle.subtitle}>{props.subtitle}</p>
                <img src="/assets/candycane.svg" alt="Candy Cane" />

                <input
                    className={style['input-field']}
                    type="text"
                    placeholder={props.placeholder}
                    onChange={(e) => {
                        setTextValue(e.target.value);
                    }}
                    onKeyUp={(event) => {
                        if (event.key === "Enter" && textValue !== "") {
                            props.sendDataToParent({
                                stage: props.index,
                                value: textValue,
                            });
                        }
                    }}
                />

                {!(textValue === "") ? (
                    <motion.button
                        className={style['next-btn']}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.2 } }}
                        onClick={() =>
                            props.sendDataToParent({
                                stage: props.index,
                                value: textValue,
                            })
                        }
                    >
                        Next
                    </motion.button>
                ) : null}
            </div>
        </div>
    );
}

export function CalendarCard(props) {
    const handleDateChange = (value) => {
        const formattedDate = dateToString(value); // Format the date
        props.sendDataToParent({
            stage: props.index,
            value: formattedDate,
        });
    };

    return (
        <div className={cardStyle.card}>
            <div className={cardStyle['card-back']} style={{ transform: "rotateY(180deg)" }}></div>

            <div className={cardStyle['card-front']} style={{ transform: "rotateY(0deg)" }}>
                <p className={cardStyle.circle + " text-4xl font-bold"}>{props.cardNum}</p>
                {/* <img className={cardStyle.logo} src="/assets/logo.svg" alt="Ornamental" /> */}
                <p className={cardStyle.subtitle}>{props.subtitle}</p>
                <img src="/assets/candycane.svg" alt="Candy Cane"/>

                <div className={cardStyle["custom-calendar-container"]}>
                    <Calendar
                       className={cardStyle["custom-calendar"]}
                        onChange={handleDateChange}
                    />
                </div>
            </div>
        </div>
    );
}

export function ResultCard(props) {
    return (
        <div className={cardStyle.card}>
            <div className={cardStyle['card-back']} style={{ transform: "rotateY(180deg)" }}></div>

            <div className={cardStyle['card-front']} style={{ transform: "rotateY(0deg)" }}>
                <p className={cardStyle.circle + " text-4xl font-bold"}>{props.cardNum}</p>
                <img className={cardStyle.logo} src="/assets/logo.svg" alt="Ornamental" />
                <p className={cardStyle.subtitle}>{props.subtitle}</p>
                <img src="/assets/candycane.svg" alt="Candy Cane" />
                <table className="w-full font-semibold text-1xl">
                    <tbody>
                        <tr>
                            <td>Room Name: </td>
                            <td className="text-right">{props.groupName}</td>
                        </tr>
                        <tr>
                            <td>Gift Date: </td>
                            <td className="text-right">{props.date}</td>
                        </tr>
                        <tr>
                            <td>Description: </td>
                            <td className="text-right">{props.description}</td>
                        </tr>
                    </tbody>
                </table>
            
                <div className="w-full my-6 flex grow flex-col justify-between">
                    <motion.button
                        className={style['next-btn']}
                        onClick={() => props.confirmation()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 5.5 }}
                    >
                        Yep
                    </motion.button>
                    <motion.button
                        className={style['next-btn'] + " italic"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 7 }}
                        onClick={() =>
                            props.sendDataToParent({
                                stage: -1,
                            })
                        }
                    >
                        uhh no...
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export function ResponseCollectedCard(props) {
    const cookies = useCookies();
    console.log(props.responses);
    console.log(props)
    console.log("help me for life ")
    return (
        <div className={cardStyle.card}>
            <div className={cardStyle['card-back']} style={{ transform: "rotateY(180deg)" }}></div>

            <div className={cardStyle['card-front']} style={{ transform: "rotateY(0deg)" }}>
                <p className={cardStyle.circle + " text-4xl font-bold"}>{props.cardNum}</p>
                <img className={cardStyle.logo} src="/assets/logo.svg" alt="Ornamental" />
                <p className={cardStyle.subtitle} style={{ fontSize: 29 }}>
                    Thank you for responding!
                </p>
                <img src="/assets/candycane.svg" alt="Candy Cane" />

                <div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 2, delay: 1 + 3.5 } }}
                    >
                        <p className={cardStyle.subtitle}>This will help your peers</p>
                        <p className={cardStyle.subtitle}>get to know you better</p>
                    </motion.div>

                    <p className={cardStyle.subtitle}>&nbsp;</p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 2, delay: 4 + 3 } }}
                        className={cardStyle.subtitle}
                    >
                        so that everyone's happy
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 2, delay: 4 + 4 } }}
                    className="w-full my-6 flex grow flex-col justify-between"
                >
                    <button
                        className={style['next-btn']}
                        onClick={() => {
                            hasSeenOnboarding(cookies.get("userId"), props.responses);
                            props.onComplete();
                        }}
                    >
                        Awesome
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export function QuizCard(props) {
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
