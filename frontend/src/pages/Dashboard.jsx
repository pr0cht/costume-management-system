import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import AddCostumePopup from './popups/addCostumePopup';
import AddEventPopup from './popups/addEventPopup';
import DashboardAddClient from './popups/dashboardAddClientPopup';
import React, { useState, useEffect, useCallback } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const barOptions = { /* ... */ };
const doughnutOptions = { /* ... */ };

function Dashboard({ showNotification }) {
  const [stats, setStats] = useState({ total: 0, available: 0, rented: 0, totalBalanceDue: 0 });
  const [lists, setLists] = useState({ returnsDueCount: 0, upcomingEventsList: [], recentRentals: [], recentClients: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    let newStats = {};
    let newLists = {};

    try {
      const statsResult = await window.electronAPI.getGeneralStats();
      if (statsResult.success) {
        newStats = statsResult.data;
      }

      const clientsResult = await window.electronAPI.getRecentClients();
      if (clientsResult.success) {
        newLists.recentClients = clientsResult.data;
      }

      const listsResult = await window.electronAPI.getDashboardLists();
      if (listsResult.success) {
        newLists = { ...newLists, ...listsResult.data };
      }

      setStats(prevStats => ({
        ...prevStats,
        ...newStats
      }));
      setLists(prevLists => ({
        ...prevLists,
        ...newLists
      }));


    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      showNotification("Failed to load dashboard data.", 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const doughnutData = {
    labels: ['Available', 'Rented'],
    datasets: [
      {
        label: 'Costumes',
        data: [stats.available, stats.rented],
        backgroundColor: ['#28a745', '#7E001B'],
        borderWidth: 1,
      },
    ],
  };

  const formatCurrency = (value) => `₱${parseFloat(value || 0).toFixed(2)}`;
  const today = new Date().toISOString().split('T')[0];

  const barDataDynamic = {
    labels: ['Last 4 Weeks'],
    datasets: [
      { label: 'Revenue', data: [1200, 1500, 1100, 1800], backgroundColor: 'rgba(126, 0, 27, 0.5)' },
      { label: 'Rents', data: [30, 45, 28, 50], backgroundColor: 'rgba(230, 72, 72, 0.5)' },
    ],
  };


  return (
    <div className="page dashboard">

      {/* --- ALERTS --- */}
      <div className="dashboard-alerts">
        {lists.returnsDueCount > 0 && (
          <div className="alert">
            <span className="alert-icon">⚠️</span>
            <span>**{lists.returnsDueCount}** costumes due for return today/overdue</span>
            <img className="close-alert" src="assets/close.png" />
          </div>
        )}
        {lists.upcomingEventsList.length > 0 && (
          <div className="alert" style={{ borderLeftColor: 'darkorange', color: 'darkorange' }}>
            <span className="alert-icon">📅</span>
            <span>{lists.upcomingEventsList.length} events scheduled soon (e.g., {lists.upcomingEventsList[0].event_Name} on {lists.upcomingEventsList[0].event_Date})</span>
            <img className="close-alert" src="assets/close.png" />
          </div>
        )}
        {/* Show balance alert only if a non-zero balance is due */}
        {stats.totalBalanceDue > 0 && (
          <div className="alert" style={{ borderLeftColor: 'red', color: 'red' }}>
            <span className="alert-icon">💸</span>
            <span>Outstanding Payments Total: {formatCurrency(stats.totalBalanceDue)}</span>
            <img className="close-alert" src="assets/close.png" />
          </div>
        )}
      </div>

      <div className="dashboard-quick-actions">
        <AddCostumePopup showNotification={showNotification} onCostumeAdded={fetchDashboardData} />
        <DashboardAddClient showNotification={showNotification} onClientRegistered={fetchDashboardData} />
        <AddEventPopup showNotification={showNotification} onEventAdded={fetchDashboardData} />
      </div>

      {isLoading ? <p>Loading Dashboard...</p> : (
        <>
          <div className="dashboard-cards">
            {/* --- CARD 1: COSTUME STATS --- */}
            <div className="dashboard-card flex-row">
              <div>
                <h2>Costumes</h2>
                <p>{stats.total}</p>
              </div>
              <div>
                <h1>Available</h1>
                <p>{stats.available}</p>
              </div>
              <div>
                <h1>Currently Rented</h1>
                <p>{stats.rented}</p>
              </div>
            </div>

            {/* --- CARD 2: REVENUE THIS MONTH (Static Sample) --- */}
            <div className="dashboard-card">
              <h2>Outstanding Balance</h2>
              <p>{formatCurrency(stats.totalBalanceDue)}</p>
              <small className={stats.totalBalanceDue > 0 ? "trend-down" : "trend-up"}>
                {stats.totalBalanceDue > 0 ? "Clients owe money" : "All clear"}
              </small>
            </div>

            {/* --- CARD 3: RENTS THIS MONTH (Static Sample) --- */}
            <div className="dashboard-card">
              <h2>Total Clients</h2>
              <p>{stats.totalClients}</p>
              <small>Updated {today}</small>
            </div>

            {/* --- CARD 4: PAYMENT STATUS (Static Sample) --- */}
            <div className="dashboard-card">
              <h2>Total Revenue (Sample)</h2>
              <p>{formatCurrency(12400)}</p>
              <small className="trend-up">↑ Paid this week</small>
            </div>
          </div>

          <div className="dashboard-charts">
            <div className="dashboard-chart">
              <Doughnut className="chart" data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="dashboard-chart">
              <Bar className="chart" data={barDataDynamic} options={barOptions} />
            </div>
          </div>

          <div className="dashboard-info-cards">
            {/* --- INFO CARD 1: RECENT RENTALS --- */}
            <div className="dashboard-info-card">
              <h2>Costume Rent History</h2>
              <ul>
                {lists.recentRentals.length > 0 ? (
                  lists.recentRentals.map((r, index) => (
                    <li key={index}>
                      {r.rentDate}: {r.costume_Name} rented by {r.client_Name}
                    </li>
                  ))
                ) : <li>No recent rentals.</li>}
              </ul>
            </div>

            {/* --- INFO CARD 2: RECENTLY ADDED CLIENTS --- */}
            <div className="dashboard-info-card">
              <h2>Recently Added Clients</h2>
              <ul>
                {lists.recentClients.length > 0 ? (
                  lists.recentClients.map((c, index) => (
                    <li key={index}>{c.client_Name}</li>
                  ))
                ) : <li>None recently added.</li>}
              </ul>
            </div>

            {/* --- INFO CARD 3: UPCOMING EVENTS LIST --- */}
            <div className="dashboard-info-card">
              <h2>Upcoming Events</h2>
              <ul>
                {lists.upcomingEventsList.length > 0 ? (
                  lists.upcomingEventsList.map((e, index) => (
                    <li key={index}>{e.event_Name} on {e.event_Date}</li>
                  ))
                ) : <li>No upcoming events scheduled.</li>}
              </ul>
            </div>

            {/* --- INFO CARD 4: MTO Items In Progress (STATIC) --- */}
            <div className="dashboard-info-card">
              <h2>Currently Rented Costumes</h2>
              {/* Reusing recent rentals as a proxy for currently rented items for now */}
              <ul>
                {lists.recentRentals.slice(0, 3).map((r, index) => (
                  <li key={index}>{r.costume_Name} - {r.client_Name}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;