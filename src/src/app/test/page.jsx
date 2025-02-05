"use client";
import React, { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import "@/styles/Home.css";
import {
  checkCode,
  getQuestions,
  hasSecretSantaStarted,
} from "@/components/api/api";
import { motion } from "motion/react";

function test() {
  async function checksanta() {
    console.log(await hasSecretSantaStarted(41934));
    console.log(await getQuestions(0000));
  }
  return (
    <>
      <button onClick={checksanta}>check santa</button>
    </>
  );
}

export default test;
