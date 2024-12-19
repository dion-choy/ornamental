"use client";
import React, { useState, useEffect, useRef } from "react";
import { redirect } from 'next/navigation'
import css from "@/styles/home.css";
import {startSecretSanta,getUser, checkPlayer, checkCode, getNoPlayers, createRoom,createUser,addPlayer, addOrnament, getRoom } from "@/components/api/api";
import { motion } from "motion/react"
import { BSON, EJSON, ObjectId } from 'bson';
function test() {
  async function createR(){
    let text=(await createRoom(1325,"my amaziung room","24/1/23",55.5,"for pro people",5,["what is the meaning of life","how do you fit 2 ducks into a 1 duck stream","does your toilet paper face towards or away from the wall","do you like kids"]))
    let json=EJSON.parse(text)
    console.log(json)
  }
async function createU(){
    let text=(await createUser("password","amongus"))
    let json=EJSON.parse(text)
    console.log(await addPlayer(EJSON.stringify(json.insertedId),1325))
    console.log(await getUser(EJSON.stringify(json.insertedId)))
    console.log(await addOrnament(1325,EJSON.stringify(json.insertedId),1,2))
    console.log(json)
  }
  async function getp(){
    console.log(await getNoPlayers(1325))
  }

  async function getR(){
    console.log(await getRoom(1325))
  }
  async function startS(){
    console.log(await startSecretSanta(1325))
  }
  async function checkp(){
    console.log(EJSON.parse(await checkPlayer("amongus", "password")))
    console.log(EJSON.parse(await checkPlayer("amongjs", "password")))
    console.log(EJSON.parse(await checkPlayer("amongjs", "passwor")))
  }
  return (
    <div>
      <div onClick={()=>{createR()}}>createRoom</div>   
      <div onClick={()=>{createU()}}>createuser</div>   
      <div onClick={()=>{getp()}}>getnoof players</div>   
      <div onClick={()=>{checkp()}}>check password</div>   
      <div onClick={()=>{getR()}}>getroom</div>   
      <div onClick={()=>{startS()}}>start santa</div>   
    </div>
  )
}
export default test
