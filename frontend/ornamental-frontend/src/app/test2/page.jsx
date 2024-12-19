"use client";
import React, { useState, useEffect, useRef } from "react";
import { redirect } from 'next/navigation'
import css from "@/styles/home.css";
import Auth from "@/components/auth";
import { motion } from "motion/react"
import { BSON, EJSON, ObjectId } from 'bson';
function test2() {
 
  return (
    <div>
      <Auth code={0} />
    </div>
  )
}
export default test2
