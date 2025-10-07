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

import React from 'react';
export default Clients;