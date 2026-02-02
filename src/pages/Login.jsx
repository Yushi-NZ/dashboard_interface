import React, { useState } from 'react';
import supabase from '../helper/supabaseClient';
import {Link, useNavigate} from "react-router-dom";

function Login() {

  const navigate = useNavigate();
    const  [email, setEmail] = useState("");
    const  [password, setPassword] = useState("");
    const  [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        const {data,error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if(error){
            setMessage(error.message);
            return;
        }

        if (data){
            navigate("/dashboard");
            return null;
        }
        setEmail();
        setPassword();
    };

  return (
    <div>
        <h2>Login</h2>
        <br></br>
        {message &&<span>{message}</span>}
      <form onSubmit={handleSubmit}>
        <input 
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email" 
        placeholder='Email' 
        required/>
        <input 
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password" 
        placeholder='Password'
        required/>
        <button type='sumbit'>Log In</button>
      </form>
      <span>Not registered yet?</span> <Link to="/register">Register Now.</Link>
    </div>
  )
}

export default Login
