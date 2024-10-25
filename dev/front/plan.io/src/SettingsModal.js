import React, { useState } from 'react';
import './SettingsModal.css'; // Import the CSS for modal styles

export default function SettingsModal({ isOpen, onClose, isLightMode, toggleTheme, workTime, breakTime, updateTimers }) {
  const [customWorkTime, setCustomWorkTime] = useState(workTime / 60); // Convert seconds to minutes
  const [customBreakTime, setCustomBreakTime] = useState(breakTime / 60); // Convert seconds to minutes

  if (!isOpen) return null;

  const handleSaveChanges = () => {
    const newWorkTime = customWorkTime * 60; // Convert back to seconds
    const newBreakTime = customBreakTime * 60; // Convert back to seconds
    updateTimers(newWorkTime, newBreakTime);
    onClose(); // Close the modal after saving changes
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal-content">
        <h2>Settings</h2>
        <div className="settings-form">
          <label>
            Work Timer (minutes): &nbsp;
            <input
              type="number"
              className="work-timer-input"
              value={customWorkTime}
              onChange={(e) => setCustomWorkTime(e.target.value)}
              min="1"
              placeholder="25"
            />
          </label>
          <br />
          <label>
            Break Timer (minutes): &nbsp;
            <input
              type="number"
              className="break-timer-input"
              value={customBreakTime}
              onChange={(e) => setCustomBreakTime(e.target.value)}
              min="1"
              placeholder="5"
            />
          </label>
          <br />
          <label>
            Notification Preferences: &nbsp;
            <select>
              <option>Email</option>
              <option>SMS</option>
            </select>
          </label>
          <div className="settings-modal-buttons">
            <button onClick={onClose}>Close</button>&nbsp;
            <button onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
