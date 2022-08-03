import {useState} from 'react';
import '../css/style.css';
import {useNavigate} from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [status,setStatus] = useState("");

  const redirect = (event) => {
    navigate("/register");
  }

  const login = (event) =>{
    event.preventDefault();

    fetch('http://localhost:5000/api/login', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        user_password: password
      })
    })
    .then((response) => response.json())
    .then((result) => {
      setStatus(result);
    });
  }

  return (
      <form onSubmit={login}>

      <div className="loginForm">
        <h1>Please sign in</h1>
        <input className='loginInputs' placeholder='Email address' type="email" onChange={(e)=>setEmail(e.target.value)} required autoFocus/>
        <input className='loginInputs' type="password"  placeholder='Password' onChange={(e)=>setPassword(e.target.value)} required />

        <button type="submit">Sign in</button>
        <button type="button" onClick={redirect}>Sign up</button>
        <label>{status}</label>    
      </div>
      </form>
  );
}

export default Login;
