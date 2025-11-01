// filepath: frontend/src/App.jsx
import React, { useState} from 'react';
import Dashboard from './pages/Dashboard';
import Costumes from './pages/Costumes';
import Rents from './pages/Rents';
import Events from './pages/Events';
import Clients from './pages/Clients';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import AppNotification from './pages/alerts/Notification';

// Main App Component -----------------------------------------------------------------------------------

function App() {
  const [page, setPage] = React.useState('dashboard');

  const [notification, setNotification] = useState({ message: null, type: 'success' });
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
      setNotification({ message: null, type: 'success' });
  };

  const renderPage = () => {
  const pageProps = { showNotification, closeNotification, setPage };

  switch (page) {
    case 'dashboard':
      return <Dashboard {...pageProps} />; 
    case 'costumes':
      return <Costumes {...pageProps} />;
    case 'rents':
      return <Rents {...pageProps} />;
    case 'events':
      return <Events {...pageProps} />;
    case 'clients':
      return <Clients {...pageProps} />;
    case 'payments':
      return <Payments {...pageProps} />;
    case 'settings':
      return <Settings {...pageProps} />;
    default:
      return <Dashboard {...pageProps} />;
  }
};

  return (
    <div className="main">
      <div className="sidebar">
        <img className="logo" src="assets/dcs_logo.png" alt="Davao Cosplay Shop" />
        <div className={`sidebar-item${page === 'dashboard' ? ' active' : ''}`} onClick={() => setPage('dashboard')} >
          <img src="assets/dashboard.png" alt="Dashboard" /> Dashboard
        </div>
        <div className={`sidebar-item${page === 'costumes' ? ' active' : ''}`} onClick={() => setPage('costumes')}>
          <img src="assets/costumes.png" alt="Costumes" /> Costumes
        </div>
        <div className={`sidebar-item${page === 'events' ? ' active' : ''}`} onClick={() => setPage('events')}>
          <img src="assets/event.png" alt="Events" /> Events
        </div>
        <div className={`sidebar-item${page === 'clients' ? ' active' : ''}`} onClick={() => setPage('clients')}>
          <img src="assets/client.png" alt="Clients" /> Clients
        </div>
        <div className={`sidebar-item${page === 'payments' ? ' active' : ''}`} onClick={() => setPage('payments')}>
          <img src="assets/payments.png" alt="Payments" /> Payments
        </div>
        <div className={`sidebar-item${page === 'settings' ? ' active' : ''}`} onClick={() => setPage('settings')}>
          <img src="assets/setting.png" alt="Settings" /> Settings
        </div>
      </div>
      
      <div className="content">
        <div className="content-container">
          {renderPage()}
        </div>
      </div>

      <AppNotification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
}

export default App