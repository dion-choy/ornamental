import React from 'react';
import { useRouter } from 'next/navigation';

function ReturnButton() {
  const router = useRouter();

  return (
    <button className='bg-white h-50px w-50px rounded-full' 
      onClick={() => { router.replace("/") }}>
      <img src="/assets/back_arrow.svg" 
        style={{ filter: "invert(10%) sepia(33%) saturate(1198%) hue-rotate(205deg) brightness(98%) contrast(90%)" }} 
        alt="Back" />
    </button>
  );
}

export default ReturnButton;