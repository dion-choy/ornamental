
"use client"
import React from 'react'
import { useState } from 'react';

// NOT IN USE
function SignIn(props) {
    const [userN, setuserN] = useState('');
    const [password, setPassword] = useState('');
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: '50vh', left: '50vw', transform: `translate(-50%, -50%)`, zIndex: '101', backgroundColor: '#24223F', padding: '20px', borderRadius: '20px' }}>
                <input className='btn' placeholder="Username" style={{ marginBottom: '10px' }} onChange={(value) => setuserN(value)} />
                <input className='btn' placeholder="password" style={{ marginBottom: '10px' }} onChange={(value) => setPassword(value)} />
                {(ok) ? "" : <div>wrong username or password</div>}
                {(exists) ? "" : <div>user exists</div>}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div className='btn' style={{ width: 'auto', marginRight: '20px' }} onClick={props.login}>Login</div>
                    <div className='btn' style={{ width: 'auto' }} onClick={props.signUp}>Sign up</div>
                </div>
            </div>
            <div style={{ width: '100vw', backdropFilter: 'blur(10px)', height: '100vh', position: 'absolute', top: '0', left: '0', backgroundColor: '#00000055', zIndex: '100' }}>

            </div>
        </>
    )
}

export default SignIn