import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logins from './login';
import axios from 'axios';

const registerUrl = 'https://6ie4pgz8v8.execute-api.us-east-1.amazonaws.com/prod/register';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();
    setMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key': 'skaeJmnPpI32jT0zy4BqS4ePv60qzb9c8NyjZt63'
      }
    }
    const requestBody = {
      username: username,
      password: password,
      passwordConfirm: passwordConfirm
    }
    if(password != passwordConfirm) {
      setMessage('Passwords do not match');
      return;
    }
    axios.post(registerUrl, requestBody, requestConfig).then(response => {
      setMessage('Registeration Successful');
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
      <form onSubmit={submitHandler}>
        <h5>Register</h5>
        Username: <input type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br/>
        Password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br/>
        Re-Enter Password: <input type="password" value={passwordConfirm} onChange={event => setPasswordConfirm(event.target.value)}></input>
        <input type="submit" value="Register" />
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  )
}

export default Register;