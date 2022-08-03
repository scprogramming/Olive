import {useState} from 'react';
import '../css/style.css';
function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [firstName,setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status,setStatus] = useState("");

  const login = (event) =>{
    event.preventDefault();

    fetch('http://localhost:5000/api/registration', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        user_password: password,
        confirm_password:confirmPassword,
        first_name: firstName,
        last_name: lastName
      })
    })
    .then((response) => response.json())
    .then((result) => {
      setStatus(result);
    });
  }

  return (
  <div>
    <form onSubmit={login}>

    <div className="centerForm">
      <h1>Register</h1>

      <input className = "stackedInput" placeholder='Email address' type="email" onChange={(e)=>setEmail(e.target.value)} required autoFocus/>
      <input className = "stackedInput" type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} required />
      <input className = "stackedInput" type="password" placeholder='Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value)} required />
      <input className = "stackedInput" type="text" placeholder="First name" onChange={(e)=>setFirstName(e.target.value)}/>
      <input className = "stackedInput" type="text" placeholder="Last name" onChange={(e)=>setLastName(e.target.value)}/>

      <button type="submit">Register</button>
      <label>{status}</label>
    </div>
    </form>
  </div>
  );
}

export default Login;
