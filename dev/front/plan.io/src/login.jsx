import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import bannerlogo from '../src/assets/Plan.IO__1_-removebg-preview.png';

let logins = {
  'admin': 'test',
  'pmonda': 'password',
  'kpeddako': '12345',
  'peda': '@!@!'
};

function checkPassword(username, password) {
  return logins[username] === password;
}



export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();

  const handleLogin = () => {
    if (checkPassword(username, password)) {
      console.log(username + ' logged in');
      navigate('/dashboard'); // Redirect to the dashboard page
    } else {
      console.log('Incorrect login');
      alert('Incorrect username or password');
    }
  };
  
  function registered(username) {
    if (logins.hasOwnProperty(username)) { 
      alert(username + ' is already registered');
    } else {
      navigate('/register', {state: {username: username}});
    }
}

  const handleRegister = () => {
     registered(username);
  };

  useEffect(() => {
    document.title = 'Plan.io- Login'; 
  }, []);

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
      <p>Don't have an account?</p>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
