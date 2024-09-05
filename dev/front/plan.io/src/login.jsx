import { useState } from 'react';
import './Login.css'

function checkPassword(password) {
  if (password === "test") {
    console.log("Login successful");
  }
    
}
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
  <div>
    Login
    <br/>
    <input id="user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username"></input>
    <br/>
    <input id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password"></input>
    <br/>
    <button onClick={checkPassword(password)}>Login</button>
  </div>);
}