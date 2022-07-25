import './App.css';
import {useState} from 'react';

function App() {

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
    <form onSubmit={login}>
      <label>Username: </label>
      <input type="text" onChange={(e)=>setUsername(e.target.value)}/>
      <label>Password: </label>
      <input type="password" onChange={(e)=>setPassword(e.target.value)}/>
      <label>{status}</label>
      <input type="submit" value="Login"/>

    </form>
  );
}

export default App;
