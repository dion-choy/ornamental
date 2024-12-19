import React from 'react'
import { redirect } from 'next/navigation'
function ReturnButton() {
  return (
    <button className='bg-white h-50px w-50px rounded-full' 
    onClick={()=> {redirect("/")}}>
        <img src="/assets/back_arrow.svg" 
        style={{filter: "invert(10%) sepia(33%) saturate(1198%) hue-rotate(205deg) brightness(98%) contrast(90%);"}}/>
    </button>
  )
}

export default ReturnButton