import React, { useState, useEffect, useRef } from 'react';
import './Dash.css'; // Import the updated CSS file
import quotesDB from './quotesDB'; // Import the quotes
import Modal from './Modal'; // Import the Modal component
import { useLocation } from 'react-router-dom';

export default function Dashboard(props) {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const username = location.state.username; // Replace this with dynamic username in the future
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  const getDayOfWeek = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = new Date().getDay();
    return daysOfWeek[currentDay];
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { task: newTask, completed: false }]);
      setNewTask("");
    }
  };

  useEffect(() => {
    document.title = 'Plan.io- Dashboard'; 
  }, []);

  const handleTaskToggle = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Uploaded: ${file.name}`);
      // Add further logic here to process the uploaded PDF
    }
  };

  useEffect(() => {
    const randomQuote = quotesDB[Math.floor(Math.random() * quotesDB.length)];
    setQuote(randomQuote.quote);
    setAuthor(randomQuote.author);
  }, []);


  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    setIsModalOpen(false);
    // Redirect to login page or perform logout action here
    window.location.href = '/'; // Redirect to login page
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h3>&lt;Plan.io&gt;</h3>
        <p>
          Hello, <strong>{username}</strong>! <br /><br />Let's make this <strong>{getDayOfWeek()}</strong> productive.
        </p>
        <p className="motivational-quote">
          "{quote}" <br />– {author}
        </p>
        <div className="upload-section">
          <button className="upload-button" onClick={handleUploadClick}>Upload PDF</button>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </aside>

      {/* Main content */}
      <div className="dashboard-content">
        {/* Dashboard sections */}
        <div className="dashboard-sections">
          {/* Current Streak */}
          <section className="dashboard-section current-streak-section">
            <h2>Current Streak</h2>
            <div className="current-streak">
              <div className="streak-number">45</div> {/* Example number, replace with dynamic value */}
              <div className="streak-label">days</div>
            </div>
          </section>

          {/* Recent Study Sessions */}
          <section className="dashboard-section recent-study-sessions">
            <h2>Recent Study Sessions</h2>
            <div className="charts">
              <div className="chart-placeholder">Chart 1</div>
              <div className="chart-placeholder">Chart 2</div>
            </div>
          </section>
        </div>

        {/* Task List */}
        <section className="dashboard-section">
          <h2>Task List</h2>
          <div className="task-list">
            <input
              type="text"
              placeholder="New task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
            <ul>
              {tasks.map((task, index) => (
                <li key={index} className={task.completed ? "completed-task" : ""}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(index)}
                  />
                  <span className="task-text">{task.task}</span>
                  <button onClick={() => handleDeleteTask(index)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <Modal isOpen={isModalOpen} onClose={cancelLogout} onConfirm={confirmLogout} />

    </div>
  );
}
