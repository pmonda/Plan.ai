  import React, { useState, useEffect, useCallback} from 'react';
  import './Dash.css'; // Import the updated CSS file
  import quotesDB from './quotesDB'; // Import the quotes
  import Modal from './Modal'; // Import the existing Modal component for logout
  import SettingsModal from './SettingsModal'; // Import the new Settings Modal
  import ProfileModal from './ProfileModal';
  import { useLocation } from 'react-router-dom';
  import pdfToText from 'react-pdftotext'

  export default function Dashboard() {
    const location = useLocation();
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const username = location.state.username; //this is an email type
    const [isModalOpen, setIsModalOpen] = useState(false); // State for logout modal
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // State for settings modal
    const [uploadedText, setUploadedText] = useState("Please Upload a PDF to begin"); // State for uploaded text 
    const [extractedText, setExtractedText] = useState("");

    // Pomodoro Timer States
    const [workTime, setWorkTime] = useState(1500); // 1500 seconds = 25 minutes
    const [breakTime, setBreakTime] = useState(300); // 300 seconds = 5 minutes
    const [timeLeft, setTimeLeft] = useState(workTime);
    const [breakTimeLeft, setBreakTimeLeft] = useState(breakTime);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreakRunning, setIsBreakRunning] = useState(false); // State for break timer
    const [recentTimers, setRecentTimers] = useState([]); // To track recent timers
    const [startTime, setStartTime] = useState(null); // To store the start time

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [description, setDescription] = useState('');
    const [estimatedTime, setestimatedTime] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState("😊"); // Default emoji
    const emojis = [
      "😊", "📅", "📚", "💻", "🚀", "🎨", "🏋️‍♀️", "🧘‍♂️"
    ];
    const [isEditing, setIsEditing] = useState(false); // State to check if editing
    const [editIndex, setEditIndex] = useState(null); // Track which task is being edited

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State for profile modal
    const [isExportDisabled, setIsExportDisabled] = useState(false); // State to disable export button

    useEffect(() => {
      document.title = 'Plan.io- Dashboard'; 
    }, []);

    const getDayOfWeek = () => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = new Date().getDay();
      return daysOfWeek[currentDay];
    };

    const clearTextAndFile = () => {
      // Clear the uploaded text
      setUploadedText("Please Upload a PDF to begin");
    
      // Clear the file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) {
        fileInput.value = ""; // Reset the file input field
      }
    };

    const handleAddTask = () => {
      if (newTask.trim() && description.trim() && dueDate.trim() && estimatedTime.trim()) {
        setTasks([
          ...tasks,
          {
            task: newTask,
            description: description, // Add description to the task
            dueDate: dueDate,         // Add dueDate to the task
            completed: false,
            estimatedTime: estimatedTime,
            emoji: selectedEmoji
          }
        ]);
        resetTaskInput();
      }
    };

    const addTasks = (newTasks) => {
      // Use the spread operator to append new tasks to the existing task list
      setTasks((prevTasks) => [...prevTasks, ...newTasks]);
    };
    // Add a function to extract due dates using regex


    const extractBulletPoints = (text) => {
      // Regex pattern to match bullet points (e.g., "- item" or "* item")
      const bulletPattern = /(\n[-*]\s+.*(?:\n|$))/g;
    
      const bulletMatches = [...text.matchAll(bulletPattern)];
    
      // Return the extracted bullet points or null if none found
      const bulletPoints = bulletMatches.map(match => match[0].trim());
      return bulletPoints.length > 0 ? bulletPoints : null;
    };

    const extractDueDates = (text) => {
  // Regex pattern to match dates in formats like "March 12, 2024" or "12/03/2024"
      const datePattern = /(\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{2,4})/gi;

      const matches = [...text.matchAll(datePattern)];

      const dueDates = matches.map(match => {
        return match[0].trim(); // Extract the matched date string
      });

  return dueDates.length > 0 ? dueDates : null; // Return dates or null if none found
};

const extractTasks = () => {
  const stepPattern = /step\s+(\d+):?\s*([^.\n]+) - ([^.\n]+)/gi;
  const matches = [...uploadedText.matchAll(stepPattern)];

  // Extract due dates and bullet points, ensuring default values if they are null or undefined
  const dueDates = extractDueDates(uploadedText) || [];
  const bulletPoints = extractBulletPoints(uploadedText) || [];
  
  if (dueDates.length === 0) {
    console.error("No due dates found in the uploaded text.");
  }

  // Set the final due date from the last due date if available
  const finalDueDate = dueDates.length > 0 ? new Date(dueDates[dueDates.length - 1]) : new Date(); 

  // Calculate task interval only if there are steps and a final due date
  const totalSteps = matches.length;
  const daysUntilFinalDue = Math.floor((finalDueDate - new Date()) / (1000 * 60 * 60 * 24));
  const taskDaysInterval = totalSteps > 0 ? Math.floor(daysUntilFinalDue / totalSteps) : 0;

  const extractedTasks = matches.map((match, index) => {
    const title = match[2]
      .replace(/<\/?b>/gi, '') // Remove <b> tags
      .replace(/\*\*$/, '') // Remove trailing **
      .trim();

    const stepNumber = match[1].trim();
    const formattedTitle = `Step ${stepNumber}: ${title}`;
    const estimatedTime = match[3] || "No estimated time found";

    // Calculate due date for each task
    const taskDueDate = new Date(finalDueDate);
    taskDueDate.setDate(taskDueDate.getDate() - (taskDaysInterval * (totalSteps - index - 1)));
    const dueDateFormatted = taskDueDate.toISOString().split('T')[0];

    // Associate bullet points as task descriptions if available
    const description = (bulletPoints && bulletPoints.length > index ? bulletPoints[index] : "No description found")
      .replace(/<\/?b>/gi, '') // Remove <b> tags
      .replace(/\*\*$/, '') // Remove trailing **
      .trim();

    return {
      task: formattedTitle,
      description: description,
      dueDate: dueDateFormatted,
      estimatedTime: estimatedTime,
      emoji: '📥',
      completed: false,
    };
  });

  if (extractedTasks.length) {
    addTasks(extractedTasks); // Add extracted tasks to the task list
    setIsExportDisabled(true);
    console.log(extractedTasks); // Log the tasks to verify
  } else {
    console.log("No tasks extracted.");
  }
};

    
    const handleEditTask = (index) => {
      const taskToEdit = tasks[index];
      setNewTask(taskToEdit.task);
      setDescription(taskToEdit.description); // Set the description for editing
      setDueDate(taskToEdit.dueDate);         // Set the due date for editing
      setSelectedEmoji(taskToEdit.emoji);
      setestimatedTime(taskToEdit.estimatedTime);
      setIsEditing(true);
      setEditIndex(index);
    };


    const handleUpdateTask = () => {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = {
        ...updatedTasks[editIndex],
        task: newTask,
        description: description, // Update description
        dueDate: dueDate,         // Update dueDate
        emoji: selectedEmoji,
        estimatedTime: estimatedTime
      };
      setTasks(updatedTasks);
      resetTaskInput();
    };

    const resetTaskInput = () => {
      setNewTask("");
      setDescription(""); // Reset description
      setDueDate("");     // Reset dueDate
      setSelectedEmoji("😊");
      setestimatedTime("");
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
      window.location.href = '/#';
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

  const handleTimerComplete = useCallback(() => {
  const completedSession = workTime / 60;
  addTimeToChart(completedSession);

  alert("Work session completed! Timer reset.");

  setIsRunning(false);
  setTimeLeft(workTime);
  }, [workTime, addTimeToChart]); // List dependencies used inside the function
  
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
  
    return () => clearInterval(timer); // Cleanup timer
  }, [isRunning, timeLeft, handleTimerComplete]);
    // Break Timer Logic
    useEffect(() => {
      let breakTimer = null;
      if (isBreakRunning && breakTimeLeft > 0) {
        breakTimer = setInterval(() => {
          setBreakTimeLeft(prevTime => prevTime - 1);
        }, 1000);
      } else if (breakTimeLeft === 0 && isBreakRunning) {
        alert("Break session completed! Time to get back to work.");
        setIsBreakRunning(false);
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

    const addTimeToChart = (completedMinutes) => {
      setRecentTimers((prevTimers) => [
        ...prevTimers,
        {
          startTime: startTime.toLocaleTimeString(),
          endTime: new Date().toLocaleTimeString(),
          duration: `${completedMinutes} minutes`,
          type: 'work', // Specify that it was a work session
        },
      ]);
    
      // If you're using a chart library, you can update the chart here
      console.log(`Added ${completedMinutes} minutes to the chart.`);
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
    const handleEstimatedTimeClick = (estimatedTime) => {
      const minutes = parseInt(estimatedTime, 10); // Convert the estimated time to an integer
      if (!isNaN(minutes)) {
        setWorkTime(minutes * 60); // Set the work time in seconds
        setTimeLeft(minutes * 60); // Set the timer display in seconds
      }
    };
    

function extractTextFromPDF(event) {
  setIsExportDisabled(false);
  const file = event.target.files[0];

  // Check if a file is selected
  if (!file) {
      console.error("No file selected.");
      return;
  }

  // Log the file details for debugging
  console.log(`Selected file: ${file.name}, File size: ${file.size} bytes`);

  // Convert 5 MB to bytes
  const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

  // Check if the file size exceeds 5 MB
  if (file.size > maxSizeInBytes) {
      setUploadedText("Error: File size exceeds 5 MB. Please upload a smaller PDF.");
      console.error("File size exceeds 5 MB.");
      return;
  }

  // Log that the file is within acceptable size
  console.log("File size is within the acceptable range.");

  // Proceed with text extraction
  pdfToText(file)
      .then(async (text) => {
          console.log("Extracted text from PDF:", text.substring(0, 1000), "...");

          // Store the extracted text in the global variable
          setExtractedText(text);
          // Set the extracted text for display
          setUploadedText(text);
      })
      .catch(error => {
          console.error("Failed to extract text from PDF:", error);
          setUploadedText("Failed to extract text from PDF. Please wait 2-3 mins and try again.");
      });
}

async function processTextWithNLP() {
  setUploadedText("Processing PDF. Please give our systems time to fully process your assignment!")
  try {
    console.log("Processing with extracted text:", extractedText);
    const response = await fetch('http://localhost:3000/process-text', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: extractedText }) 
      });

      if (!response.ok) {
          throw new Error('Failed to process text');
      }

      const result = await response.json();
      console.log("NLP Processing Result:", result);

      // Set the modified text to be displayed
      setUploadedText(result.modifiedText + " \nGood luck!");
  } catch (error) {
      console.error("Error processing text with NLP:", error);
      setUploadedText("Error processing text with NLP. Please wait 2-3 mins and try again.");
  }
}
    return (
      <div className={`dashboard-container`}>
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
            <p>Upload a File Here: </p>
            <input type="file" id="file-input" className="file-input" accept="application/pdf" onChange={extractTextFromPDF}/>
  
          </div>
          <ul>
            <li><div onClick={handleProfileClick}>Profile</div></li> {/* Profile link */}
            <li><div onClick={handleSettingsClick}>Settings</div></li> {/* Trigger settings modal */}
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </aside>

        {/* Main content */}
        <div className="dashboard-content">
          {/* Dashboard sections */}
          <div className="dashboard-sections">

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
                  <h2>Session Timers 📊</h2>
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

              <input
                    type="number"
                    placeholder="Estimated Time (in minutes)"
                    value={estimatedTime}
                    onChange={(e) => setestimatedTime(e.target.value)} // Fix typo: setestimatedTime -> setEstimatedTime
                  />
              
              <input
                type="text"
                placeholder="Task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              
              <input
                type="date"
                placeholder="Due date..."
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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
                    <th>Description</th> {/* New Description column */}
                    <th>Due Date</th>     {/* New Due Date column */}
                    <th>Completed</th>
                    <th>Time (min)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.map((task, index) => (
                    <tr key={index} className={task.completed ? "completed-task" : ""}>
                      <td className="emoji-column">{task.emoji}</td>
                      <td>{task.task}</td>
                      <td>{task.description}</td> {/* Display task description */}
                      <td>{task.dueDate}</td>     {/* Display task due date */}
                      <td className="checkbox-column">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskToggle(index)}
                        />
                      </td>

                      <td 
                        style={{ color: 'blue', cursor: 'pointer' }} 
                        onClick={() => handleEstimatedTimeClick(task.estimatedTime)}
                      >
                        {task.estimatedTime} 
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
            <h2>Assignment Guide</h2>
            
            {/* Use div instead of pre, and add dangerouslySetInnerHTML for HTML rendering */}
            <div 
              className="uploaded-text-display" 
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} 
              dangerouslySetInnerHTML={{ __html: uploadedText }} 
            />
            &nbsp;
            <button 
              onClick={() => processTextWithNLP()} 
              className="process-text-button"
            >
              Run Analysis
            </button>
            &nbsp;
            <button 
              onClick={() => clearTextAndFile()} 
              className="clear-text-button"
            >
              Clear Text/File
            </button>
            &nbsp;
            <button 
              onClick={extractTasks} 
              className="export-tasks-button"
              disabled={isExportDisabled} // Disable the button based on the state
              style={{ backgroundColor: isExportDisabled ? '#d3d3d3' : '' }} // Change button color when disabled
            >
              Export Tasks
            </button>
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
