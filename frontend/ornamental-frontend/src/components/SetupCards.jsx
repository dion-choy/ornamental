import React, { useState } from 'react'
import css from "@/styles/name.css";


export function SetupCard(props) {
  const [textValue, setTextValue] = useState("")
  return (
    <div className="card">
      <div className="card-back" style={{ transform: "rotateY(180deg)" }}></div>

      <div className='card-front' style={{ transform: "rotateY(0deg)" }}>
        <p className="circle text-4xl font-bold">{props.cardNum}</p>
        <img className="logo" src="assets/logo.svg" alt="Ornamental" />
        <p className="subtitle">{props.subtitle}</p>
        <img src="assets/candycane.svg" alt="Candy Cane" />

        <input
          className="input-field"
          type="text"
          placeholder={props.placeholder}
          onChange={(e) => { setTextValue(e.target.value) }}
        />

        {!(textValue === "") ? <button className="next-btn" onClick={() => props.sendDataToParent({
          stage: props.index,
          value: textValue
        })}>Next</button>
          : null}

      </div>

    </div>
  )
}

export function ResultCard(props) {
  const [textValue, setTextValue] = useState("")
  return (
    <div className="card">
      <div className="card-back" style={{ transform: "rotateY(180deg)" }}></div>

      <div className='card-front' style={{ transform: "rotateY(0deg)" }}>
        <p className="circle text-4xl font-bold">{props.cardNum}</p>
        <img className="logo" src="assets/logo.svg" alt="Ornamental" />
        <p className="subtitle">{props.subtitle}</p>
        <img src="assets/candycane.svg" alt="Candy Cane" />
        <table className='w-full font-semibold text-2xl'>
          <tbody>
            <tr><td>Room Name: </td><td>{props.groupName}</td></tr>
            <tr><td>Gift Date: </td><td>{props.date}</td></tr>
            <tr><td>Description: </td><td>{props.description}</td></tr>
          </tbody>
        </table>
        {/* <p className="subtitle">{props.groupName}</p>
        <p className="subtitle">{props.date}</p>
        <p className="subtitle">{props.description}</p> */}

        <div className='w-full my-6 flex grow flex-col justify-between'>
          <button className="next-btn" onClick={() => props.sendDataToParent({
          })}>Yep</button>

          <button className="next-btn" onClick={() => props.sendDataToParent({
          })}>Uhh nope</button>
        </div>
        

      </div>

    </div>
  )
}