"use client";
import React, { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import "@/styles/Home.css";
import { checkCode, hasSecretSantaStarted } from "@/components/api/api";
import { motion } from "motion/react";

function test() {
	async function checksanta(){
		console.log(await hasSecretSantaStarted(41934))
	}
	return (<>
		<button onClick={checksanta}> check santa</button>
	</>)
    
}

export default test;
