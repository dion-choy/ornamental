'use client'
import {addPlayer, checkPlayer,checkPlayerId, createUser} from "@/components/api/api";
import { useCookies } from 'next-client-cookies';
import React, { useState, useEffect } from 'react'
import { BSON, EJSON, ObjectId } from 'bson';
import css from "@/styles/Home.css";
export default  function Auth(props){

  const cookies = useCookies();
  const [isLoggedIn, setLog]=useState(false);
  const [ok, setOk]=useState(true);
  const [exists, setExists]=useState(true);
  const [userN, setuserN]=useState('');
  const [password, setPassword]=useState('');

  const userid= cookies.get('userId')
  useEffect(()=>{
    console.log("hello")
    if (userid === undefined){setLog(false)}else{checkPlayerId(userid,props.code).then(res=>{
      if (res===false){
        setLog(false)
      }else{
        setLog(true)
      }
    })}
  },[])
  async function login(){
    console.log(props.code)
    let res=await checkPlayer(userN,password,props.code)
    if (res===false){
      setOk(false);
    }else{
      setOk(true);
      console.log(res)
      res=EJSON.parse(res)
      cookies.set('userId', EJSON.stringify(res._id))
      setLog(true);
    }
  }
  async function signUp(){
    let res=await checkPlayer(userN,password,props.code)
    if (res===false){
      setExists(true);
      console.log(props.code)
      let res=EJSON.parse(await createUser(password,userN))
      console.log(res)
      addPlayer(EJSON.stringify(res.insertedId),props.code)
      cookies.set('userId', EJSON.stringify(res.insertedId))
      setLog(true);
    }else{
      setExists(false);

    }
  }
  function handleUsername(e){setuserN(e.target.value);}
  function handlePassword(e){setPassword(e.target.value);}
  return (<>
    {(isLoggedIn)?"":
      <>
      <div style={{display:'flex',flexDirection:'column',position:'absolute',top:'50vh',left:'50vw',transform: `translate(-50%, -50%)`,zIndex:'101',backgroundColor:'#24223F', padding:'20px', borderRadius:'20px'}}>
      <input className='btn' placeholder="Username" style={{marginBottom:'10px'}} onChange={handleUsername}/>
      <input className='btn' placeholder="password" type="password" style={{marginBottom:'10px'}} onChange={handlePassword}/>
      {(ok)?"":<div>wrong username or password</div>}
      {(exists)?"":<div>user exists</div>}
      <div style={{display:'flex',flexDirection:'row'}}>
      <div className='btn' style={{width:'auto', marginRight:'20px'}} onClick={login}>Login</div>
      <div className='btn' style={{width:'auto'}} onClick={signUp}>Sign up</div>
      </div>
      </div>
      <div style={{width:'100vw',backdropFilter:'blur(10px)', height:'100vh', position:'absolute', top:'0', left:'0', backgroundColor:'#00000055', zIndex:'100'}}>

      </div>
      </>
    }
    </>)
}
