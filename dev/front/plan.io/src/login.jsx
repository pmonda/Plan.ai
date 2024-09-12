import React, { useState } from 'react';
import './Login.css';
import bannerlogo from '../src/assets/Plan.IO__1_-removebg-preview.png';

const logins = {
  'admin': 'test',
  'pmonda': 'password',
  'kpeddako': '12345',
  'peda': '@!@!'
};

function checkPassword(username, password) {
  if (logins[username] === password) {
    console.log(username + ' logged in');
  } else {
    console.log('Incorrect login');
  }
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    checkPassword(username, password);
  };
  
  const handleRegister = () => {
    
  };

  return (
    <div className="login-container">
      <img className="logo" src={bannerlogo} alt="Logo" />
      <h1>Login</h1>
      <p>Welcome to Plan.io! <br></br> Please log in to continue.</p>
      <input 
        id="user" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username" 
      />
      <input 
        id="pwd" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
      />
      <br/>
      <br/>
      <button onClick={handleLogin}>Login</button>
      <br/>
      <br/>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
