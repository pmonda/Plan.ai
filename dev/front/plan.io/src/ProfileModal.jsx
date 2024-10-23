import React, { useState } from 'react';
import './ProfileModal.css'; // Add your CSS styles
import { useLocation } from 'react-router-dom';

const ProfileModal = ({ isOpen, onClose }) => {
  const [setEmail] = useState("");
  const [passwordResetQuestion, setPasswordResetQuestion] = useState("");
  const [passwordResetAnswer, setPasswordResetAnswer] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const location = useLocation();
  const email = location.state.email;
  const dob = location.state.date_of_birth;
  // Validation function for email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return re.test(email);
  };

  const handleSave = () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    // Handle save logic here (e.g., send data to backend)
    console.log({
      email,
      passwordResetQuestion,
      passwordResetAnswer,
      dateOfBirth,
      timeZone,
    });

    alert("Profile updated successfully!");
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>User Profile</h2>
        
        <label>
          Email:
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </label>
        
        <label>
          Password Reset Question:
          <select 
            value={passwordResetQuestion} 
            onChange={(e) => setPasswordResetQuestion(e.target.value)} 
            required
          >
            <option value="">Select a question</option>
            <option value="What is your first pet's name?">What is your first pet's name?</option>
            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
            <option value="What is the name of your favorite book?">What is the name of your favorite book?</option>
            <option value="What city were you born in?">What city were you born in?</option>
          </select>
        </label>
        
        <label>
          Answer:
          <input 
            type="text" 
            value={passwordResetAnswer} 
            onChange={(e) => setPasswordResetAnswer(e.target.value)} 
            required
          />
        </label>
        
        <label>
          Date of Birth:
          <input 
            type="date" 
            value={dateOfBirth} 
            onChange={(e) => setDateOfBirth(e.target.value)} 
            required
          />
        </label>
        
        <label>
          Time Zone:
          <select 
            value={timeZone} 
            onChange={(e) => setTimeZone(e.target.value)} 
            required
          >
            <option value="">Select Time Zone</option>
            <option value="UTC-12:00">UTC-12:00 (Baker Island)</option>
            <option value="UTC-11:00">UTC-11:00 (American Samoa)</option>
            <option value="UTC-10:00">UTC-10:00 (Hawaii)</option>
            <option value="UTC-09:00">UTC-09:00 (Alaska)</option>
            <option value="UTC-08:00">UTC-08:00 (Pacific Time)</option>
            <option value="UTC-07:00">UTC-07:00 (Mountain Time)</option>
            <option value="UTC-06:00">UTC-06:00 (Central Time)</option>
            <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
            <option value="UTC-04:00">UTC-04:00 (Atlantic Time)</option>
            <option value="UTC-03:00">UTC-03:00 (Buenos Aires)</option>
            <option value="UTC-02:00">UTC-02:00 (South Georgia)</option>
            <option value="UTC-01:00">UTC-01:00 (Azores)</option>
            <option value="UTC+00:00">UTC+00:00 (London)</option>
            <option value="UTC+01:00">UTC+01:00 (Berlin)</option>
            <option value="UTC+02:00">UTC+02:00 (Cairo)</option>
            <option value="UTC+03:00">UTC+03:00 (Moscow)</option>
            <option value="UTC+04:00">UTC+04:00 (Dubai)</option>
            <option value="UTC+05:00">UTC+05:00 (Islamabad)</option>
            <option value="UTC+06:00">UTC+06:00 (Almaty)</option>
            <option value="UTC+07:00">UTC+07:00 (Bangkok)</option>
            <option value="UTC+08:00">UTC+08:00 (Beijing)</option>
            <option value="UTC+09:00">UTC+09:00 (Tokyo)</option>
            <option value="UTC+10:00">UTC+10:00 (Sydney)</option>
            <option value="UTC+11:00">UTC+11:00 (Magadan)</option>
            <option value="UTC+12:00">UTC+12:00 (Fiji)</option>
          </select>
        </label>

        <div className="modal-actions">
            <button onClick={onClose}>Cancel</button>
            &nbsp;
            <button onClick={handleSave}>Save</button>               
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
