import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
const registerUrl = 'https://6ie4pgz8v8.execute-api.us-east-1.amazonaws.com/prod/register';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();
    setMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY
      }
    }
    const requestBody = {
      username: username,
      password: password,
      passwordConfirm: passwordConfirm
    }
    if(password !== passwordConfirm) {
      setMessage('Passwords do not match');
      return;
    }

    axios.post(registerUrl, requestBody, requestConfig).then(response => {
      setMessage('Registeration Successful, please login');
      navigate('/');
    }).catch(error => {
      
      if (error.response.status === 401) {
        setMessage(error.response.data.message);
      } else {
        setMessage('sorry....the backend server is down!! please try again later');
      }
    })
  }

  return (
    <div>
      <form id="login-register-container" onSubmit={submitHandler}>
        <h1>Register</h1>
        <p>Welcome to Plan.io!</p><p>Sign up to get started!</p>
        <input placeholder='username' type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br/>
        <input placeholder='password' type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br/>
        <input placeholder='re-enter password' type="password" value={passwordConfirm} onChange={event => setPasswordConfirm(event.target.value)}></input>
        <input type="submit" value="Register" />
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  )
}

export default Register;