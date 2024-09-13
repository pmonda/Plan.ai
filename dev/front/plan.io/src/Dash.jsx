import React from 'react';
import './Dash.css'; // Import the updated CSS file

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Plan.io</h1>
        <p>Your central hub for managing academic tasks.</p>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </nav>
      <main className="dashboard-main">
        <section className="dashboard-section">
          <h2>Recent Activity</h2>
          <p>Here you can see your latest activities and updates.</p>
        </section>
        <section className="dashboard-section">
          <h2>Upcoming Deadlines</h2>
          <p>Keep track of your upcoming deadlines and important dates.</p>
        </section>
      </main>
    </div>
  );
}
