import React, { useState, useEffect, useRef } from 'react'; 
import './Dash.css'; // Import the updated CSS file

const quotesDB = [
  { quote: "Success is not final; failure is not fatal: It is the courage to continue that counts.", author: "Winston S. Churchill" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
  { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "Hard work beats talent when talent doesn’t work hard.", author: "Tim Notke" },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { quote: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { quote: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats" },
  { quote: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { quote: "Don’t let yesterday take up too much of today.", author: "Will Rogers" },
  { quote: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn" },
  { quote: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { quote: "If you're going through hell, keep going.", author: "Winston S. Churchill" },
  { quote: "I never dreamed about success, I worked for it.", author: "Estee Lauder" },
  { quote: "Don't limit your challenges. Challenge your limits.", author: "Unknown" },
  { quote: "The harder the battle, the sweeter the victory.", author: "Les Brown" },
  { quote: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Failure will never overtake me if my determination to succeed is strong enough.", author: "Og Mandino" }
];


export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const username = "Kushal"; // Replace this with dynamic username in the future

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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h3>&lt;Plan.io&gt;</h3>
        <p>
          Hello, <strong>{username}</strong>! <br /><br />Let's make this {getDayOfWeek()} productive.
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
          <li><a href="/logout">Logout</a></li>
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
    </div>
  );
}