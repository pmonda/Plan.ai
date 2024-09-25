import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { setUserSession } from './service/AuthService';
import axios from 'axios';
import bannerlogo from '../src/assets/Plan.IO__1_-removebg-preview.png';


//TODO: remove
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
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

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


  const loginUrl = 'https://6ie4pgz8v8.execute-api.us-east-1.amazonaws.com/prod/login';

  const submitHandler = (event) => {
    event.preventDefault();
    if (username.trim() === '' || password.trim() == '') {
      setErrorMessage('Both the username and password are required');
      return;
    }
    setErrorMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key': 'skaeJmnPpI32jT0zy4BqS4ePv60qzb9c8NyjZt63'
      }
    }

    const requestBody = {
      username: username,
      password: password
    }

    axios.post(loginUrl, requestBody, requestConfig).then((response) => {
          setUserSession(response.data.user, response.data.token);
          navigate('/dashboard'); // Redirect to the dashboard page
    }).catch((error) => {
      console.log(error);
      if (error.response.status === 401 || error.response.status === 403) {
        setErrorMessage(error.response.data.message);
      } 
      else {
        setErrorMessage('A server error occurred. Please try again later.');
      }
    })
  }
  return (
    <div>
      <form onSubmit={submitHandler}>
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
          <br/>
          <input type="submit" value="Login"></input>
          <p>Don't have an account?</p>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
