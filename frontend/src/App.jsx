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
        <div className="dashboard-alerts">
      <div className="alert">
        <span className="alert-icon">⚠️</span>
        <span>3 costumes due for return today</span><img className="close-alert" src="assets/close.png" />
      </div>
      <div className="alert">
        <span className="alert-icon">📅</span>
        <span>2 events scheduled for tomorrow</span><img className="close-alert" src="assets/close.png" />
      </div>
    </div>
    <div className="dashboard-quick-actions">
      <button className="action-btn">Add New Item</button>
      <button className="action-btn">Create Rental</button>
      <button className="action-btn">Add Client</button>
      <button className="action-btn">Add Event</button>
    </div>
    <div className="dashboard-cards">
      <div className="dashboard-card flex-row">
        <div>
          <h2>Costumes</h2>
          <p>155</p>
        </div>
        <div>
          <h1>Available</h1>
          <p>145</p>   
        </div>
        <div>
          <h1>Currently Rented</h1>
          <p>10</p>
        </div>
      </div>
      <div className="dashboard-card">
        <h2>Revenue This Month</h2>
        <p>₱5,600</p>
        <small className="trend-up">↑ 12% from last month</small>
      </div>
      <div className="dashboard-card">
        <h2>Rents This Month</h2>
        <p>153</p>
      </div>
      <div className="dashboard-card">
        <h2>Payment Status</h2>
        <div className="payment-stats">
          <div>Pending: ₱3,200</div>
          <div>Overdue: ₱1,500</div>
          <div>Paid this week: ₱12,400</div>
        </div>
      </div>
    </div>
    <div className="dashboard-charts">
      <div className="dashboard-chart">
        <Doughnut className="chart" data={doughnutData} options={doughnutOptions} />
      </div>      
      <div className="dashboard-chart">
        <Bar className="chart" data={barData} options={barOptions} />
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
      <div className="dashboard-info-card">
        <h2>Upcoming Events</h2>
        <ul>
          <li>Elsa Dress - Jane Doe</li>
          <li>Iron Man - John Smith</li>
        </ul>
      </div>
      <div className="dashboard-info-card">
        <h2>Recently Added Items</h2>
        <ul>
          <li>Elsa Dress - Jane Doe</li>
          <li>Iron Man - John Smith</li>
        </ul>
      </div>
      <div className="dashboard-info-card">
        <h2>Most Rented This Month</h2>
        <ul>
          <li>Elsa Dress (12 rentals)</li>
          <li>Iron Man Suit (8 rentals)</li>
          <li>Pikachu Costume (6 rentals)</li>
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
          {/* Add more filter options */}
        </div>
      )}
      <div className="costumes-grid">
        <div className="costume-item"> {/* Example costume item */}
          <div className="costume-thumbnail">
            <img src="assets/costumes/tanjiro.jpg" alt="Kamado Tanjiro" />
          </div>
          <p><span className="costume-name">Kamado Tanjiro</span></p>
          <p>Origin: <span className="costume-origin">Demon Slayer</span></p>
          <p>Type: <span className="costume-type">Cloth</span></p>
          <p>Size: <span className="costume-size">Size</span></p>
          <p>Gender: <span className="costume-gender">Male</span></p>
          <p>Price: <span className="costume-price">2000</span></p>
          <p>Status: <span className="costume-status">Available</span></p>
          <div className='costume-actions'>
            <button className="view-btn costume-btn">Edit</button>
            <button className="rent-btn costume-btn">Rent</button>  
          </div>
          
        </div>
        <div className="costume-item"> {/* Example costume item */}
          <div className="costume-thumbnail">
            <img src="assets/costumes/nezuko.jpg" alt="Kamado Nezuko" />
          </div>
          <p><span className="costume-name">Kamado Nezuko</span></p>
          <p>Origin: <span className="costume-origin">Demon Slayer</span></p>
          <p>Type: <span className="costume-type">Cloth</span></p>
          <p>Size: <span className="costume-size">Small</span></p>
          <p>Gender: <span className="costume-gender">Female</span></p>
          <p>Price: <span className="costume-price">2000</span></p>
          <p>Status: <span className="costume-status">Rented</span></p>
          <div className='costume-actions'>
            <button className="view-btn costume-btn">Edit</button>
            <button className="rent-btn costume-btn">Rent</button>  
          </div>
        </div>
        {/* Add */}
      </div>
    </div>
  );
};

function Events() {
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <div className="page events">
      <div className="events-topbar">
        <input
          type="text"
          className="events-search"
          placeholder="Search events..."
        />
        <button
          className="events-filter-btn"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
      </div>
      {filterOpen && (
        <div className="events-filter-popup">
          <h4>Filter Options</h4>
          <div>
            <label>
              <input type="checkbox" /> Upcoming
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> Past Events
            </label>
          </div>
        </div>
      )}
      
      <div className="events-section">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-grid">
          <div className="event-item">
            <h3 className="event-name">Anime Convention 2025</h3>
            <p className="event-datetime">August 15, 2025 - 9:00 AM</p>
            <button className="edit-btn">Edit Event Details</button>
          </div>
          <div className="event-item">
            <h3 className="event-name">Cosplay Competition</h3>
            <p className="event-datetime">August 20, 2025 - 2:00 PM</p>
            <button className="edit-btn">Edit Event Details</button>
          </div>
        </div>
      </div>

      <div className="events-section past-events">
        <h2 className="section-title">Past Events</h2>
        <div className="events-grid">
          <div className="event-item">
            <h3 className="event-name">Summer Anime Fest</h3>
            <p className="event-datetime">July 15, 2025 - 10:00 AM</p>
            <button className="edit-btn">View Details</button>
          </div>
          <div className="event-item">
            <h3 className="event-name">Comic Convention</h3>
            <p className="event-datetime">July 1, 2025 - 1:00 PM</p>
            <button className="edit-btn">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Clients() {
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <div className="page clients">
      <div className="clients-topbar">
        <input
          type="text"
          className="clients-search"
          placeholder="Search clients..."
        />
        <button
          className="clients-filter-btn"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
      </div>
      {filterOpen && (
        <div className="clients-filter-popup">
          <h4>Filter Options</h4>
          <div>
            <label>
              <input type="checkbox" /> Active Clients
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> With Pending Payments
            </label>
          </div>
        </div>
      )}
      
      <div className="clients-grid">
        <div className="client-item">
          <h3 className="client-name">Jane Doe</h3>
          <div className="client-details">
            <p><strong>Address:</strong> 123 Sample Street, Davao City</p>
            <p><strong>Age:</strong> 25</p>
            <p><strong>Cellphone:</strong> +63 912 345 6789</p>
            <p><strong>Social Media:</strong> facebook.com/janedoe</p>
            <p><strong>Occupation:</strong> Student</p>
          </div>
          <div className="client-actions">
            <button className="edit-btn">Edit Details</button>
            <button className="payments-btn">Payments</button>
          </div>
        </div>

        <div className="client-item">
          <h3 className="client-name">John Smith</h3>
          <div className="client-details">
            <p><strong>Address:</strong> 456 Example Ave, Davao City</p>
            <p><strong>Age:</strong> 30</p>
            <p><strong>Cellphone:</strong> +63 923 456 7890</p>
            <p><strong>Social Media:</strong> facebook.com/johnsmith</p>
            <p><strong>Occupation:</strong> Professional</p>
          </div>
          <div className="client-actions">
            <button className="edit-btn">Edit Details</button>
            <button className="payments-btn">Payments</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Payments() {
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <div className="page payments">
      <div className="payments-topbar">
        <input
          type="text"
          className="payments-search"
          placeholder="Search payments..."
        />
        <button
          className="payments-filter-btn"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
      </div>
      {filterOpen && (
        <div className="payments-filter-popup">
          <h4>Filter Options</h4>
          <div>
            <label><input type="checkbox" /> Recent Payments</label>
          </div>
          <div>
            <label><input type="checkbox" /> With Balance</label>
          </div>
        </div>
      )}
      
      <div className="payments-table">
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Payment Amount</th>
              <th>Payment Date</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CLI001</td>
              <td>Jane Doe</td>
              <td>₱2,500</td>
              <td>2025-08-09</td>
              <td>₱500</td>
              <td>
                <button className="edit-payment-btn">Edit Details</button>
              </td>
            </tr>
            <tr>
              <td>CLI002</td>
              <td>John Smith</td>
              <td>₱3,000</td>
              <td>2025-08-08</td>
              <td>₱0</td>
              <td>
                <button className="edit-payment-btn">Edit Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="page settings">
      <h1 className="settings-title">Settings</h1>
      
      <div className="settings-grid">
        {/* Appearance Section */}
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Theme</label>
              <select defaultValue="light">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Accent Color</label>
              <select defaultValue="red">
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Font Size</label>
              <select defaultValue="medium">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="settings-section">
          <h2>System Preferences</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Currency</label>
              <select defaultValue="php">
                <option value="php">Philippine Peso (₱)</option>
                <option value="usd">US Dollar ($)</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Date Format</label>
              <select defaultValue="mmddyyyy">
                <option value="mmddyyyy">MM/DD/YYYY</option>
                <option value="ddmmyyyy">DD/MM/YYYY</option>
                <option value="yyyymmdd">YYYY/MM/DD</option>
              </select>
            </div>
            <div className="setting-item checkbox">
              <label>
                <input type="checkbox" defaultChecked />
                Enable Email Notifications
              </label>
            </div>
            <div className="setting-item checkbox">
              <label>
                <input type="checkbox" defaultChecked />
                Enable SMS Notifications
              </label>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="settings-section">
          <h2>Business Information</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Business Name</label>
              <input type="text" defaultValue="Davao Cosplay Shop" />
            </div>
            <div className="setting-item">
              <label>Contact Number</label>
              <input type="tel" placeholder="+63 XXX XXX XXXX" />
            </div>
            <div className="setting-item">
              <label>Email Address</label>
              <input type="email" placeholder="contact@example.com" />
            </div>
            <div className="setting-item">
              <label>Business Address</label>
              <textarea placeholder="Enter business address"></textarea>
            </div>
          </div>
        </div>

        {/* Rental Settings */}
        <div className="settings-section">
          <h2>Rental Settings</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Default Rental Duration (Days)</label>
              <input type="number" defaultValue="3" min="1" />
            </div>
            <div className="setting-item">
              <label>Late Fee (per day)</label>
              <input type="number" defaultValue="100" min="0" />
            </div>
            <div className="setting-item checkbox">
              <label>
                <input type="checkbox" defaultChecked />
                Require Deposit
              </label>
            </div>
            <div className="setting-item">
              <label>Default Deposit Amount</label>
              <input type="number" defaultValue="1000" min="0" />
            </div>
          </div>
        </div>

        {/* Backup & Security */}
        <div className="settings-section">
          <h2>Backup & Security</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Auto-Backup Frequency</label>
              <select defaultValue="daily">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="setting-item">
              <button className="backup-btn">Backup Now</button>
              <button className="restore-btn">Restore Data</button>
            </div>
            <div className="setting-item">
              <label>Change Password</label>
              <button className="password-btn">Update Password</button>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="settings-section">
          <h2>User Management</h2>
          <div className="settings-content">
            <div className="setting-item">
              <button className="users-btn">Manage Users</button>
            </div>
            <div className="setting-item">
              <button className="roles-btn">Manage Roles</button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-settings">Save Changes</button>
        <button className="reset-settings">Reset to Default</button>
      </div>
    </div>
  );
}

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
        <div className={`sidebar-item${page === 'clients' ? ' active' : ''}`} data-page="clients.html" onClick={() => setPage('clients')}>
          <img src="assets/client.png" alt="Clients" />
          Clients
        </div>
        <div className={`sidebar-item${page === 'payments' ? ' active' : ''}`} data-page="clients.html" onClick={() => setPage('payments')}>
          <img src="assets/payments.png" alt="Payments" />
          Payments
        </div>
        <div className={`sidebar-item${page === 'settings' ? ' active' : ''}`} data-page="clients.html" onClick={() => setPage('settings')}>
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
          {page === 'payments' && <Payments />}
          {page === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
}



export default App;