import React, { useState, useEffect, useRef } from 'react';
import './Dash.css'; // Import the updated CSS file
import quotesDB from './quotesDB'; // Import the quotes
import Modal from './Modal'; // Import the existing Modal component for logout
import SettingsModal from './SettingsModal'; // Import the new Settings Modal
import ProfileModal from './ProfileModal';
import { useLocation } from 'react-router-dom';
import { Howl } from 'howler';

export default function Dashboard(props) {
  const sound = new Howl({
    src: ['level-completed-90734.mp3', 'level-completed-90734.ogg'],
    html5: true,
  });

  const location = useLocation();
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const username = location.state.username;
  const streak = 10;
  const [isModalOpen, setIsModalOpen] = useState(false); // State for logout modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // State for settings modal
  const [isLightMode, setIsLightMode] = useState(true); // State for light/dark mode
  const fileInputRef = useRef(null);
  const [uploadedText, setUploadedText] = useState("Please Upload a PDF to begin"); // State for uploaded text
  const [uploading, setUploading] = useState(false); 
  const [progress, setProgress] = useState(0); 
  const [fileName, setFileName] = useState(""); 

  // Pomodoro Timer States
  const [workTime, setWorkTime] = useState(1500); // 1500 seconds = 25 minutes
  const [breakTime, setBreakTime] = useState(300); // 300 seconds = 5 minutes
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [breakTimeLeft, setBreakTimeLeft] = useState(breakTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreakRunning, setIsBreakRunning] = useState(false); // State for break timer
  const [recentTimers, setRecentTimers] = useState([]); // To track recent timers
  const [startTime, setStartTime] = useState(null); // To store the start time
  const audioRef = useRef(null); // Ref for the audio element

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😊"); // Default emoji
  const emojis = [
    "😊", "📅", "📚", "💻", "🚀", "🎨", "🏋️‍♀️", "🧘‍♂️"
  ];
  const [isEditing, setIsEditing] = useState(false); // State to check if editing
  const [editIndex, setEditIndex] = useState(null); // Track which task is being edited

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State for profile modal

  useEffect(() => {
    document.title = 'Plan.io- Dashboard'; 
  }, []);

  const getDayOfWeek = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = new Date().getDay();
    return daysOfWeek[currentDay];
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { task: newTask, completed: false, emoji: selectedEmoji }]);
      resetTaskInput();
    }
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setNewTask(taskToEdit.task);
    setSelectedEmoji(taskToEdit.emoji);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleUpdateTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editIndex] = { ...updatedTasks[editIndex], task: newTask, emoji: selectedEmoji };
    setTasks(updatedTasks);
    resetTaskInput();
  };

  const resetTaskInput = () => {
    setNewTask("");
    setSelectedEmoji("😊");
    setIsEditing(false);
    setEditIndex(null);
  };

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
    if (!file) return;
  
    setUploading(true);      // Set loading state to true
    setFileName(file.name);   // Set the file name in state
  
    const reader = new FileReader();
  
    // Track progress of file upload
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 100);
        setProgress(percentLoaded);  // Update the progress
      }
    };
  
    reader.onload = async () => {
      const arrayBuffer = reader.result;
  
      try {
        const extractedText = await window.pythonApi.extractPdfText(arrayBuffer);
        setUploadedText(extractedText || "No text extracted.");
      } catch (error) {
        console.error("Error processing file:", error);
        setUploadedText("Error extracting text.");
      } finally {
        setUploading(false);  // Loading completed
      }
    };
  
    reader.onerror = () => {
      console.error("File reading error.");
      setUploadedText("Error reading file.");
      setUploading(false);  // Error, stop loading
    };
  
    reader.readAsArrayBuffer(file);
  };

  const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);

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
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  // Open and close settings modal
  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const closeProfileClick = () => {
    setIsProfileModalOpen(false);
  };

  // Pomodoro Timer Logic
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft == 0 && isBreakRunning) {
      setIsRunning(false);
      //audioRef.current.play(); // Play sound when the timer reaches zero
      alert("Work session completed! Time for a break."); // Alert when work timer is complete
    }

    return () => clearInterval(timer); // Cleanup timer
}, [isRunning, timeLeft]);

  // Break Timer Logic
  useEffect(() => {
    let breakTimer = null;
    if (isBreakRunning && breakTimeLeft > 0) {
      breakTimer = setInterval(() => {
        setBreakTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (breakTimeLeft == 0 && isBreakRunning) {
      alert("Break session completed! Time to get back to work.");
      setIsBreakRunning(false);
      //audioRef.current.play(); // Play sound when the break timer reaches zero
    }

    return () => clearInterval(breakTimer); // Cleanup break timer
  }, [isBreakRunning, breakTimeLeft]);

  const startTimer = () => {
    if (!isRunning && !isBreakRunning) { // Only start if both timers are not running
      setIsRunning(true);
      setTimeLeft(workTime); // Reset to the custom work time when starting a new timer
      setStartTime(new Date()); // Store the start time
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      const endTime = new Date();
      recordTimer(endTime); // Pass the end time to the recordTimer function
    }
    setIsRunning(false);
    setTimeLeft(workTime);
  };

  const startBreak = () => {
    if (!isBreakRunning && !isRunning) { // Only start if break timer is not running and work timer is stopped
      setIsBreakRunning(true);
      setBreakTimeLeft(breakTime); // Reset to the custom break time when starting a new break
      setStartTime(new Date()); // Store the break start time
    }
  };

  const stopBreak = () => {
    if (isBreakRunning) {
      const endTime = new Date();
      recordTimer(endTime); // Record the break session
    }
    setBreakTimeLeft(breakTime); // Reset to 5 minutes when stopping the break
    setIsBreakRunning(false);
  };

  const clearAllTimers = () => {
    setRecentTimers([]); // Set recent timers to an empty array
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Record the timer session with actual duration
  const recordTimer = (endTime) => {
    const duration = Math.floor((endTime - startTime) / 1000 / 60); // Calculate duration in minutes
    const timerType = isBreakRunning ? "break" : "work"; // Determine if it's a work or break session
    setRecentTimers((prevTimers) => [
      ...prevTimers,
      {
        startTime: startTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        duration: `${duration} minutes`,
        type: timerType, // Record the type of session
      },
    ]);
  };

  const updateTimers = (newWorkTime, newBreakTime) => {
    setWorkTime(newWorkTime);
    setBreakTime(newBreakTime);
    setTimeLeft(newWorkTime); // Update the displayed work time
    setBreakTimeLeft(newBreakTime); // Update the displayed break time
  };

  return (
    <div className={`dashboard-container ${isLightMode ? 'light-mode' : 'dark-mode'}`}>
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
          <li><a onClick={handleProfileClick}>Profile</a></li> {/* Profile link */}
          <li><a onClick={handleSettingsClick}>Settings</a></li> {/* Trigger settings modal */}
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </aside>

      {/* Main content */}
      <div className="dashboard-content">
        {/* Dashboard sections */}
        <div className="dashboard-sections">
          {/* Current Streak */}
          <section className="dashboard-section current-streak-section">            
            <h2>Current Streak🔥</h2>      
            &nbsp;      
            &nbsp;           
            &nbsp;
            <div className="current-streak">
              <div className="streak-number">{streak}</div> 
            </div>
          </section>

          {/* Pomodoro Timer Section */}
          <section className="dashboard-section break-section">
            <h2>Pomodoro Timer⏳</h2>
            <div className="pomodoro-timer">
              <div className="timer-display">{formatTime(timeLeft)}</div>
              <div className="timer-controls">
                <button onClick={startTimer} disabled={isRunning || isBreakRunning}>Start</button>                
                &nbsp;
                <button onClick={stopTimer} disabled={!isRunning}>Stop</button>
              </div>
            </div>
          </section>

          {/* Break Timer Section */}
          <section className="dashboard-section break-section">
            <h2>Take a Break☕</h2>
            <div className="break-timer">
              <div className="timer-display">{formatTime(breakTimeLeft)}</div>
              <div className="timer-controls">
                <button onClick={startBreak} disabled={isBreakRunning || isRunning}>Start</button>
                &nbsp;
                <button onClick={stopBreak} disabled={!isBreakRunning}>Stop</button>
              </div>
            </div>
          </section>
        </div>

        <section className="dashboard-section recent-timers-section">
                <h2>Recent Timers 📊</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration (mins)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTimers.map((timer, index) => (
                            <tr key={index}>
                                <td>{timer.type === "work" ? "⏳" : "☕"}</td>
                                <td>{timer.startTime}</td>
                                <td>{timer.endTime}</td>
                                <td>{timer.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                &nbsp;
                <button onClick={clearAllTimers} className="clear-all-button">Clear All</button>
            </section>

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
            
            <select onChange={(e) => setSelectedEmoji(e.target.value)} value={selectedEmoji}>
              {emojis.map((emoji, index) => (
                <option key={index} value={emoji}>{emoji}</option>
              ))}
            </select>
            
            <button onClick={isEditing ? handleUpdateTask : handleAddTask}>
              {isEditing ? "Update Task" : "Add Task"}
            </button>
            &nbsp;

            <table>
              <thead>
                <tr>
                  <th>Emoji</th>
                  <th>Task</th>
                  <th>Completed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((task, index) => (
                  <tr key={index} className={task.completed ? "completed-task" : ""}>
                    <td className="emoji-column">{task.emoji}</td>
                    <td>{task.task}</td>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleTaskToggle(index)}
                      />
                    </td>
                    <td className="actions-column">
                      <button onClick={() => handleEditTask(index)}>Modify&nbsp;</button>                
                      <button 
                        onClick={() => handleDeleteTask(index)} 
                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-section pdf-text-section">
          <h2>Extracted Text</h2>
          <div className="pdf-text-display">
            {uploadedText}
          </div>
        </section>
      </div>
      
      {/* Logout Modal */}
      <Modal isOpen={isModalOpen} onClose={cancelLogout} onConfirm={confirmLogout} />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={closeSettingsModal} 
        workTime={workTime} 
        breakTime={breakTime} 
        updateTimers={updateTimers} 
      />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={closeProfileClick} 
        username={username} 
      />
    </div>
  );
}
