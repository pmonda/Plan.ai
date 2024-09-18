import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logins from './login';

const Register = () =>
{
    const location = useLocation();

    const handleChange = (event) => {
        setNewPassword(event.target.value);
    };

    function createAccount() {
        logins[location.state.username] = newPassword;
    }

    const [newPassword, setNewPassword] = useState('');

    return (
        <div>
            <h2>Register</h2>
            This is the registration page!
            Please create a password
            <input value={newPassword} onChange={handleChange} type="text"></input>'
            <button onClick={createAccount}>Register!</button>
        </div>
    );
}

export default Register;