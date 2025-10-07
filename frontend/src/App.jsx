// filepath: frontend/src/App.jsx
import React from 'react';
import Dashboard from './pages/Dashboard';
import Costumes from './pages/Costumes';
import Events from './pages/Events';
import Clients from './pages/Clients';
import Payments from './pages/Payments';
import Settings from './pages/Settings';

// Main App Component -----------------------------------------------------------------------------------

function App() {
  const [page, setPage] = React.useState('dashboard');

  return (
    <div className="main">
      <div className="sidebar">
        <img className="logo" src="assets/dcs_logo.png" alt="Davao Cosplay Shop" />
        <div className={`sidebar-item${page === 'dashboard' ? ' active' : ''}`} onClick={() => setPage('dashboard')} >
          <img src="assets/dashboard.png" alt="Dashboard" />
          Dashboard
        </div>
        <div className={`sidebar-item${page === 'costumes' ? ' active' : ''}`} onClick={() => setPage('costumes')}>
          <img src="assets/costumes.png" alt="Costumes" />
          Costumes
        </div>
        <div className={`sidebar-item${page === 'events' ? ' active' : ''}`} onClick={() => setPage('events')}>
          <img src="assets/event.png" alt="Events" />
          Events
        </div>
        <div className={`sidebar-item${page === 'clients' ? ' active' : ''}`} onClick={() => setPage('clients')}>
          <img src="assets/client.png" alt="Clients" />
          Clients
        </div>
        <div className={`sidebar-item${page === 'payments' ? ' active' : ''}`} onClick={() => setPage('payments')}>
          <img src="assets/payments.png" alt="Payments" />
          Payments
        </div>
        <div className={`sidebar-item${page === 'settings' ? ' active' : ''}`} onClick={() => setPage('settings')}>
          <img src="assets/setting.png" alt="Settings" />
          Settings
        </div>
      </div>
      <div className="content">
        <div className="content-container">
          {page === 'dashboard' && Dashboard}
          {page === 'costumes' && <Costumes />}
          {page === 'events' && <Events />}
          {page === 'clients' && <Clients />}
          {page === 'payments' && <Payments />}
          {page === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  )
}

export default App