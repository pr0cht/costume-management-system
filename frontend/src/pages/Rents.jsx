import React, { useState, useEffect } from 'react';
import ConfirmationModal from './alerts/ConfirmationModal'; // Reusing your modal

function Rents() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [rents, setRents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter/Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('rentDate');
  const [sortOrder, setSortOrder] = useState('DESC');
  
  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rentToReturn, setRentToReturn] = useState(null);

  // --- Data Fetching ---
  const fetchRents = async () => {
    setIsLoading(true);
    const filters = {
      searchTerm,
      sort,
      sortOrder,
    };
    
    // NOTE: This will call your new handler
    const result = await window.electronAPI.getRentsHistory(filters); 
    if (result.success) {
      setRents(result.data);
    } else {
      alert(`Failed to fetch rent history: ${result.error}`);
    }
    setIsLoading(false);
  };

  // Debouncing Effect for Filters
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      fetchRents();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, sort, sortOrder]);

  // --- Action Handlers ---
  const handleSetReturned = (rent) => {
    setRentToReturn(rent);
    setShowConfirmModal(true);
  };

  const handleConfirmReturn = async () => {
    setShowConfirmModal(false);
    if (!rentToReturn) return;
    
    try {
      const data = {
        rentId: rentToReturn.rent_ID,
        costumeId: rentToReturn.costume_ID,
        transactionId: rentToReturn.transaction_ID,
      };

      const result = await window.electronAPI.setCostumeReturned(data);

      if (result.success) {
        alert(`${rentToReturn.costume_Name} marked as returned.`);
        fetchRents(); // Refresh the list
      } else {
        alert(`Failed to mark return: ${result.error}`);
      }
    } catch (error) {
      console.error('Return process failed:', error);
      alert('An unexpected error occurred.');
    }
    setRentToReturn(null);
  };
  
  // Function to determine if balance is fully paid (for display)
  const isFullyPaid = (rent) => {
    // Fully paid if the remaining balance is zero or less
    return rent.balance <= 0; 
  };


  return (
    <div className="page rents">
      <div className="rents-topbar">
        <input
          type="text"
          className="rents-search"
          placeholder="Search client or costume..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="rents-filter-btn button"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
      </div>
      
      {/* --- Filter Options --- */}
      {filterOpen && (
        <div className="rents-filter-popup">
          <h4>Filter Options</h4>
          <div className="filter-options-group">
            <label>Sort by: </label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rentDate">Rent Date</option>
              <option value="returnDate">Return Date</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="DESC">Latest First</option>
              <option value="ASC">Oldest First</option>
            </select>
          </div>
        </div>
      )}
      
      {/* --- Rents Table --- */}
      <div className="rents-table">
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Costume</th>
              <th>Rented On</th>
              <th>Due / Returned On</th>
              <th>Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7">Loading rent history...</td></tr>
            ) : rents.length === 0 ? (
              <tr><td colSpan="7">No rentals found.</td></tr>
            ) : (
              rents.map((rent) => (
                <tr 
                  key={rent.rent_ID} 
                  // Highlight overdue or unreturned items
                  className={!rent.costume_Returned && new Date(rent.returnDate) < new Date() ? 'overdue' : ''}
                >
                  <td>{rent.client_Name}</td>
                  <td>{rent.costume_Name} (₱{rent.costume_Fee.toFixed(2)})</td>
                  <td>{rent.rentDate}</td>
                  <td style={{ color: rent.costume_Returned ? '#333' : '#E64848' }}>
                    {rent.costume_Returned ? rent.returnDate : `${rent.returnDate} (Due)`}
                  </td>
                  <td>{rent.costume_Returned ? 'Returned' : 'Out'}</td>
                  <td style={{ color: isFullyPaid(rent) ? '#28a745' : '#E64848' }}>
                    {isFullyPaid(rent) ? 'Fully Paid' : `₱${rent.balance.toFixed(2)} Due`}
                  </td>
                  <td>
                    {!rent.costume_Returned && (
                      <button 
                        className="return-btn button" 
                        onClick={() => handleSetReturned(rent)}
                      >
                        Set as Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Confirmation Modal --- */}
      {showConfirmModal && rentToReturn && (
        <ConfirmationModal
          message={`Confirm return of ${rentToReturn.costume_Name}. The costume will be marked available.`}
          onConfirm={handleConfirmReturn}
          onCancel={() => { setShowConfirmModal(false); setRentToReturn(null); }}
        />
      )}
    </div>
  );
}

export default Rents;