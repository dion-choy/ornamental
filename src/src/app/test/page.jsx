"use client";
import React, { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { useCookies, CookiesProvider } from "next-client-cookies";
import "@/styles/Home.css";
import { checkCode, getQuestions, hasSecretSantaStarted } from "@/components/api/api";
import { motion } from "motion/react";

function test() {
  const cookie=useCookies();
  async function checksanta() {
    console.log(await hasSecretSantaStarted(41934));
    console.log(await getQuestions("0000", cookie.get("userId")));
  }
  return (
    <>
      <button onClick={checksanta}>check santa</button>
    </>
  );
}

export default test;
