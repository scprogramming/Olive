import {useState} from 'react';
import '../css/registration.css';
function Login() {

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [firstname,setFirstName] = useState("");
  const [status,setStatus] = useState("");

  const login = (event) =>{
    event.preventDefault();

    fetch('http://localhost:5000/api/registration', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        user_password: password,
        first_name: firstname
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

    <h1 className="h3 mb-3 font-weight-normal">Register</h1>

    <div class = "form-group">
        <input className="form-control" id="username" placeholder='Email address' type="email" onChange={(e)=>setUsername(e.target.value)} required autoFocus/>
    </div>

    <div class = "form-group">
        <input id="password" className = "form-control" type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} required />
        <input id="password" className = "form-control" type="password" placeholder='Confirm Password' required />
        <input id="firstname" className = "form-control" type="text" placeholder="First name" onChange={(e)=>setFirstName(e.target.value)}/>
    </div>

    <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
    <label>{status}</label>

     

    </form>
    </div>
  );
}

export default Login;
