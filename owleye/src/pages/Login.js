import {useState} from 'react';
import '../css/signin.css';
function Login() {

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [status,setStatus] = useState("");

  const login = (event) =>{
    event.preventDefault();

    fetch('http://localhost:5000/api/login', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        user_password: password
      })
    })
    .then((response) => response.json())
    .then((result) => {
      setStatus(result);
    });
  }

  return (
    <div className="text-center">
    <form className="form-signin" onSubmit={login}>

    <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>

    <input className="form-control" id="username" placeholder='Email address' type="email" onChange={(e)=>setUsername(e.target.value)} required autoFocus/>
    
    <input id="password" className = "form-control" type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} required />
    
    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    <p>Need an account? <a href="/register">Sign up!</a></p>
    <label>{status}</label>

     

    </form>
    </div>
  );
}

export default Login;
