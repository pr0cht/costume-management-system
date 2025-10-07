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

import React from 'react';
export default Payments;