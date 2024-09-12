import { useState } from 'react';
import './Login.css'

const logins = {
  'admin': 'test',
  'pmonda': 'password'
};

function checkPassword(username, password) {
  if(logins[username] === password) {
    console.log(username + ' logged in');
  }
    
}
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
  <div>
    <h1>Login</h1>
    <input id="user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username"></input>
    <br/>
    <input id="pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password"></input>
    <br/>
    <button onClick={checkPassword(username, password)}>Login</button>
  </div>);
}