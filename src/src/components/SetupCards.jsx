import React, { useEffect, useState } from "react";
import cardStyle from "@/styles/Cards.module.css";
import style from "@/styles/General.module.css";
import "@/styles/Calendar.css";
import { motion } from "motion/react";
import Calendar from "react-calendar";
import { dateToString } from "@/lib/myDateFunction";
import { hasSeenOnboarding } from "@/components/api/api";
import { useCookies } from "next-client-cookies";
import { animate } from "motion";

export function InputCard(props) {
	const [textValue, setTextValue] = useState("");
	return (
		<div className={cardStyle.card}>
			<div
				className={cardStyle["card-back"]}
				style={{ transform: "rotateY(180deg)" }}
			>
			</div>

			<div
				className={cardStyle["card-front"]}
				style={{ transform: "rotateY(0deg)" }}
			>
				<p className={cardStyle.circle + " text-4xl font-bold"}>
					{props.cardNum}
				</p>
				<img
					className={cardStyle.logo}
					src="/assets/logo.svg"
					alt="Ornamental"
				/>
				<p className={cardStyle.subtitle}>{props.subtitle}</p>
				<img src="/assets/candycane.svg" alt="Candy Cane" />

				<input
					className={style["input-field"]}
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

				{!(textValue === "")
					? (
						<motion.button
							className={style["next-btn"]}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { duration: 0.2 } }}
							onClick={() =>
								props.sendDataToParent({
									stage: props.index,
									value: textValue,
								})}
						>
							Next
						</motion.button>
					)
					: null}
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
			<div
				className={cardStyle["card-back"]}
				style={{ transform: "rotateY(180deg)" }}
			>
			</div>

			<div
				className={cardStyle["card-front"]}
				style={{ transform: "rotateY(0deg)" }}
			>
				<p className={cardStyle.circle + " text-4xl font-bold"}>
					{props.cardNum}
				</p>
				{/* <img className={cardStyle.logo} src="/assets/logo.svg" alt="Ornamental" /> */}
				<p className={cardStyle.subtitle}>{props.subtitle}</p>
				<img src="/assets/candycane.svg" alt="Candy Cane" />

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
			<div
				className={cardStyle["card-back"]}
				style={{ transform: "rotateY(180deg)" }}
			>
			</div>

			<div
				className={cardStyle["card-front"]}
				style={{ transform: "rotateY(0deg)" }}
			>
				<p className={cardStyle.circle + " text-4xl font-bold"}>
					{props.cardNum}
				</p>
				<img
					className={cardStyle.logo}
					src="/assets/logo.svg"
					alt="Ornamental"
				/>
				<p className={cardStyle.subtitle}>{props.subtitle}</p>
				<img src="/assets/candycane.svg" alt="Candy Cane" />
				<table className="w-full font-semibold text-1xl">
					<tbody>
						<tr>
							<td>Room Name:</td>
							<td className="text-right">{props.groupName}</td>
						</tr>
						<tr>
							<td>Gift Date:</td>
							<td className="text-right">{props.date}</td>
						</tr>
						<tr>
							<td>Description:</td>
							<td className="text-right">{props.description}</td>
						</tr>
					</tbody>
				</table>

				<div className="w-full my-6 flex grow flex-col justify-between">
					<motion.button
						className={style["next-btn"]}
						onClick={() => props.confirmation()}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 5.5 }}
					>
						Yep
					</motion.button>
					<motion.button
						className={style["next-btn"] + " italic"}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 7 }}
						onClick={() =>
							props.sendDataToParent({
								stage: -1,
							})}
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
	console.log(props);
	return (
		<div className={cardStyle.card}>
			<div
				className={cardStyle["card-back"]}
				style={{ transform: "rotateY(180deg)" }}
			>
			</div>

			<div
				className={cardStyle["card-front"]}
				style={{ transform: "rotateY(0deg)" }}
			>
				<p className={cardStyle.circle + " text-4xl font-bold"}>
					{props.cardNum}
				</p>
				<img
					className={cardStyle.logo}
					src="/assets/logo.svg"
					alt="Ornamental"
				/>
				<p className={cardStyle.subtitle} style={{ fontSize: 29 }}>
					Thank you for responding!
				</p>
				<img src="/assets/candycane.svg" alt="Candy Cane" />

				<div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 2, delay: 1 + 3.5 },
						}}
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
						className={style["next-btn"]}
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

export function QuizResultsCard(props) {
	return (
		<div className={cardStyle.card}>
			<div
				className={cardStyle["card-back"]}
				style={{ transform: "rotateY(180deg)" }}
			>
			</div>

			<div
				className={cardStyle["card-front"]}
				style={{ transform: "rotateY(0deg)" }}
			>
				<p className={cardStyle.circle + " text-4xl font-bold"}>
					{props.cardNum}
				</p>
				<img
					className={cardStyle.logo}
					src="/assets/logo.svg"
					alt="Ornamental"
				/>
				<p className={cardStyle.subtitle} style={{ fontSize: 29 }}>
					Thank you for responding!
				</p>
				<img src="/assets/candycane.svg" alt="Candy Cane" />

				<div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 2, delay: 1 + 3.5 },
						}}
					>
						<p className={cardStyle.subtitle}>You scored a grand total of...</p>
						{/* <p className={cardStyle.subtitle}></p> */}
					</motion.div>

					<p className={cardStyle.subtitle}>&nbsp;</p>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { duration: 2, delay: 4 + 3 } }}
						className={cardStyle.subtitle}
					>
						{props.responses.reduce((n, {correct}) => n + correct, 0) + "/" + props.responses.length}
					</motion.p>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { duration: 2, delay: 4 + 4 } }}
					className="w-full my-6 flex grow flex-col justify-between"
				>
					<button
						className={style["next-btn"]}
						onClick={() => {
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

export function QuizCard({ options, sendDataToParent, cardNum, index, answer, placeholder }) {
	const [localOptions, setLocalOptions] = useState([]);
	const [optionSelected, setOptionSelected] = useState(-1);
	// const [optionColors, setOptionColors] = useState(Array(options.length).fill(""));
	const [optionColors, setOptionColors] = useState(Array(options.length).fill("#dddbff"));


	useEffect(() => {
		console.log("ANSWER:",answer);
	}, [])

	useEffect(() => {
		console.log(options);
		setLocalOptions(options);
	}, [options])

	function evaluateAnswer(answer, answerSelectedIndex) {
		if (answer === answerSelectedIndex) {
			console.log("Correct!");
			let tempArray = Array(options.length).fill("");
			tempArray[answerSelectedIndex] = "#22c55e";
			// tempArray[answerSelectedIndex] = "!bg-green-500";
			setOptionColors(tempArray)
		} else {
			console.log(answer, answerSelectedIndex);
			console.log("Incorrect!");
			let tempArray = Array(options.length).fill("");
			tempArray[answerSelectedIndex] = "#ef4444";
			// tempArray[answerSelectedIndex] = "!bg-red-500";
			// tempArray[answer] = "!bg-green-500";
			tempArray[answer] = "#22c55e";
			setOptionColors(tempArray)

		}
	}

	return (
		<div className={cardStyle.card} style={{ position: "relative" }}>
			<div
				className={cardStyle["card-back"]}
				style={{ transform: "rotateY(180deg)" }}
			>
			</div>

			<div
				className={cardStyle["card-front"]}
				style={{ transform: "rotateY(0deg)" }}
			>
				<p className={cardStyle.circle + " text-4xl font-bold"}>{cardNum}</p>
				<p className={cardStyle.subtitle}>{placeholder}</p>
				<img src="/assets/candycane.svg" alt="Candy Cane" />

				<div className="mt-6 flex flex-col gap-4 w-full">
					{localOptions.map((option, i) => {
						return (
							<motion.button key={`option-${i}`} className={cardStyle["next-btn"] + " italic "}
								onClick={() => { 
									if (optionSelected === -1) {
										evaluateAnswer(answer, i); setOptionSelected(i)
								}}}
								animate={{ backgroundColor: optionColors[i] }}
								transition={{ duration: 0.5 }}
							>{option}</motion.button>
						)
					})}
				</div>
				
				{optionSelected !== -1 ? 
				<motion.button className={cardStyle["next-btn"]} onClick={() => {
					sendDataToParent({stage: cardNum - 1, value: optionSelected, correct: optionSelected === answer});
					setOptionSelected(-1);
					}}
					
					initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 2},
						}}
				>Next</motion.button> : null}
				
			</div>
		</div>
	);
}
