import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { setUserSession } from './service/AuthService';
import bannerlogo from '../src/assets/Plan.IO__1_-removebg-preview.png';
import axios from 'axios'

//TODO: remove
let logins = {
};


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  
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
    if (username.trim() === '' || password.trim() === '') {
      setErrorMessage('Both the username and password are required');
      return;
    }
    setErrorMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY
      }
    }

    const requestBody = {
      username: username,
      password: password
    }

    axios.post(loginUrl, requestBody, requestConfig).then((response) => {
          setUserSession(response.data.user, response.data.token);
          navigate('/dashboard', {
            state : {
              username : username
            }
          }); // Redirect to the dashboard page
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
      <form id="login-register-container" onSubmit={submitHandler}>
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
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button onClick={handleRegister}>Register</button>                
          &nbsp;
      </form>
    </div>
  );
}
