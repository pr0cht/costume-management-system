import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import AddCostumePopup from './popups/addCostumePopup';

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

const Dashboard = (
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
      <AddCostumePopup />
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


export default Dashboard;