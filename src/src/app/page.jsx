"use client";
import React, { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import "@/styles/Home.css";
import { checkCode } from "@/components/api/api";
import { motion } from "motion/react";
import SnowingBG from "@/components/SnowingBG";

function Home() {
  const [code, setCode] = useState(0);
  const [can, setCan] = useState(true);
  const [loading, setLoading] = useState(false);
  const [displayInputCode, setDisplayInputCode] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const aboutRef = useRef(null);

  const handleCode = (e) => {
    console.log("amongus");
    const value = e.target.value;
    setCode(value);
    console.log(value);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 },
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  const inputCodeRef = useRef(null);

  return (
    <div>
      <div className="header-container">
        <div className="header-card w-[25vw]">
          <img
            className="w-[25vw] inline mt-[22vh] mb-20px"
            src="/assets/logo.svg"
            alt="Ornamental Logo"
          />

          <p style={{ fontSize: "40px" }}>It's secret santa</p>
          <p style={{ fontSize: "20px" }}>
            but <b>better</b>
          </p>

          <img
            className="inline candy-cane"
            src="/assets/candycane.svg"
            alt="Candy Cane Divider"
          />

          <div className="buttons">
            <button
              className="btn create"
              onClick={() => redirect("/createRoom")}
            >
              Create a Room
            </button>

            {!displayInputCode
              ? (
                <button
                  className="btn join"
                  onClick={() => {
                    setDisplayInputCode(true);
                  }}
                >
                  Join a Room
                </button>
              )
              : null}

            {displayInputCode
              ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setLoading(true);
                    checkCode(code).then((c) => {
                      if (!c) {
                        setCan(false);
                      } else {
                        redirect("/room/" + code);
                      }
                      setLoading(false);
                    });
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <motion.input
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      y: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                    }}
                    onChange={handleCode}
                    ref={inputCodeRef}
                    placeholder="Enter Room code"
                    id="code"
                    className="btn"
                  >
                  </motion.input>
                  <motion.button
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      y: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2, ease: "linear" },
                    }}
                    onAnimationComplete={() => inputCodeRef.current.focus()}
                    className="btn"
                    id="enter"
                    type="submit"
                  >
                    {!loading && "Enter!"}
                    {loading && (
                      <img
                        src="/assets/loader.gif"
                        width={30}
                        style={{ display: "inline-block" }}
                      />
                    )}
                  </motion.button>
                  {can ? "" : "Wrong Code"}
                </form>
              )
              : null}
          </div>
        </div>
        <SnowingBG />
      </div>
      <div className="info-div ">
        <motion.div
          ref={aboutRef}
          className={`info-container ${isInView ? "fade-in" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="info-header ">About</h2>
          <p className="info-p ">
            Having a Secret Santa event is always fun, well... only when you
            know the players well. The last thing you'd want to do is give them
            a crappy toaster when their kitchen already has 2. That is why we
            are here today.
          </p>
          <br></br>
          <h2 className="info-subheader ">What it does</h2>
          <ul className="info-ul ">
            <li className="info-li ">
              🌟 Create a cozy virtual room and join with your friends
            </li>
            <li className="info-li ">
              🧑‍🤝‍🧑 Get to know the acquaintances you've greeted as an intern
              for the past 2 months through short interactive questions
            </li>
            <li className="info-li ">
              🎨 Personalize your room, because this room belongs to your unique
              friend group
            </li>
            <li className="info-li ">
              🎁 Be reminded that as Santa, you have a responsibility to
              purchase a gift by the decided deadline
            </li>
            <li className="info-li ">
              💌 Feel the pressure, knowing that your peers have already bought
              their gifts via the presents surrounding the virtual tree
            </li>
            <li className="info-li ">
              🔥 Flame that <span className="highlight">friend</span>{" "}
              that has yet to buy their gift
            </li>
            <li className="info-li ">
              🎉 Deck the halls with unglams of your beloved friends
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
