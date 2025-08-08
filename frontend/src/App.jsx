// filepath: frontend/src/App.jsx
import React from 'react';

function App() {
  return (
    <div className="main">
      <div className="sidebar">
        <img className="logo" src="assets/dcs_logo.png" alt="Davao Cosplay Shop" />
        <div className="sidebar-item" data-page="dashboard.html">
          <img src="assets/dashboard.png" alt="Dashboard" />
          Dashboard
        </div>
        <div className="sidebar-item" data-page="costumes.html">
          <img src="assets/costumes.png" alt="Costumes" />
          Costumes
        </div>
        <div className="sidebar-item" data-page="events.html">
          <img src="assets/event.png" alt="Events" />
          Events
        </div>
        <div className="sidebar-item" data-page="clients.html">
          <img src="assets/client.png" alt="Clients" />
          Clients
        </div>
        <div className="sidebar-item" data-page="payments.html">
          <img src="assets/payments.png" alt="Payments" />
          Payments
        </div>
        <div className="sidebar-item" data-page="settings.html">
          <img src="assets/setting.png" alt="Settings" />
          Settings
        </div>
      </div>
      <div className="content">
        <div className="content-container"></div>
      </div>
    </div>
  );
}

export default App;