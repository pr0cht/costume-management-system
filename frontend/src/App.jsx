// filepath: frontend/src/App.jsx
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const barData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Revenue',
      data: [1200, 1500, 1100, 1800],
      backgroundColor: 'rgba(126, 0, 27, 0.5)',
    },
    {
      label: 'Rents',
      data: [30, 45, 28, 50],
      backgroundColor: 'rgba(230, 72, 72, 0.5)',
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Monthly Revenue & Rents' },
  },
};

const doughnutData = {
  labels: ['Available', 'Rented'],
  datasets: [
    {
      label: 'Costumes',
      data: [120, 35],
      backgroundColor: ['#E64848', '#7E001B'],
      borderWidth: 1,
    },
  ],
};

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: true, text: 'Costume Availability' },
  },
};

const dashboard = (
  <div className="page dashboard">
    <h1>Dashboard</h1>
    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h2>Total Costumes</h2>
        <p>155</p>
      </div>
      <div className="dashboard-card">
        <h2>Available</h2>
        <p>120</p>
      </div>
      <div className="dashboard-card">
        <h2>Rented</h2>
        <p>35</p>
      </div>
      <div className="dashboard-card">
        <h2>Revenue (This Month)</h2>
        <p>₱5,600</p>
      </div>
      <div className="dashboard-card">
        <h2>Rents (This Month)</h2>
        <p>153</p>
      </div>
    </div>
    <div className="dashboard-charts">
      <div className="dashboard-chart">
        <Bar className="chart" data={barData} options={barOptions} />
      </div>
      <div className="dashboard-chart">
        <Doughnut className="chart" data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
    <div className="dashboard-info-cards">
      <div className="dashboard-info-card">
        <h2>Costume Rent History</h2>
        <ul>
          <li>2025-08-09: Elsa Dress rented by Jane Doe</li>
          <li>2025-08-08: Iron Man rented by John Smith</li>
          <li>2025-08-07: Pikachu rented by Alice Lee</li>
        </ul>
      </div>
      <div className="dashboard-info-card">
        <h2>Recently Added Clients</h2>
        <ul>
          <li>Jane Doe</li>
          <li>John Smith</li>
          <li>Alice Lee</li>
        </ul>
      </div>
      <div className="dashboard-info-card">
        <h2>MTO Items In Progress</h2>
        <ul>
          <li>Custom Witch Hat for Mark</li>
          <li>Samurai Armor for Ken</li>
        </ul>
      </div>
      <div className="dashboard-info-card">
        <h2>Currently Rented Costumes</h2>
        <ul>
          <li>Elsa Dress - Jane Doe</li>
          <li>Iron Man - John Smith</li>
        </ul>
      </div>
    </div>
  </div>
);

const Costumes = () => {
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <div className="page costumes">
      <div className="costumes-topbar">
        <input
          type="text"
          className="costumes-search"
          placeholder="Search costumes..."
        />
        <button
          className="costumes-filter-btn"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
      </div>
      {filterOpen && (
        <div className="costumes-filter-popup">
          <h4>Filter Options</h4>
          <div>
            <label>
              <input type="checkbox" /> Available
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> Rented
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> By Category
            </label>
          </div>
          {/* Add more filter options as needed */}
        </div>
      )}
      <h1>Costumes</h1>
      {/* Costume list goes here */}
    </div>
  );
};

function Events() {
  return (
    <div className="page events">
      <div className="events-topbar">
        <h1>Events</h1>
        {/* Add search/filter bar here if needed */}
      </div>
      {/* Events list or content goes here */}
    </div>
  );
}

function Clients() {
  return (
    <div className="page clients">
      <div className="clients-topbar">
        <h1>Clients</h1>
        {/* Add search/filter bar here if needed */}
      </div>
      {/* Clients list or content goes here */}
    </div>
  );
}

var payments = <h1>Payments</h1>;
var settings = <h1>Settings</h1>;

function App() {
  const [page, setPage] = React.useState('dashboard');

  return (
    <div className="main">
      <div className="sidebar">
        <img className="logo" src="assets/dcs_logo.png" alt="Davao Cosplay Shop" />
        <div className="sidebar-item" data-page="dashboard.html" onClick={() => setPage('dashboard')}>
          <img src="assets/dashboard.png" alt="Dashboard" />
          Dashboard
        </div>
        <div className="sidebar-item" data-page="costumes.html" onClick={() => setPage('costumes')}>
          <img src="assets/costumes.png" alt="Costumes" />
          Costumes
        </div>
        <div className="sidebar-item" data-page="events.html" onClick={() => setPage('events')}>
          <img src="assets/event.png" alt="Events" />
          Events
        </div>
        <div className="sidebar-item" data-page="clients.html" onClick={() => setPage('clients')}>
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
        <div className="content-container">
          {page === 'dashboard' && dashboard}
          {page === 'costumes' && <Costumes />}
          {page === 'events' && <Events />}
          {page === 'clients' && <Clients />}
          {page === 'payments' && payments}
          {page === 'settings' && settings}
        </div>
      </div>
    </div>
  );
}

export default App;