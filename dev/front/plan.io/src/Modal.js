// src/Modal.js
import React from 'react';
import './Modal.css'; // Add your CSS for the modal here

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to logout?</h2>
        <button onClick={onConfirm} className="modal-confirm-button">Yes</button>
        <button onClick={onClose} className="modal-cancel-button">No</button>
      </div>
    </div>
  );
};

export default Modal;
