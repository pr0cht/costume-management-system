import React, { useEffect, useState, useCallback } from 'react';
import AddClientPopup from './popups/addClientPopup';
import EditClientPopup from './popups/editClientPopup';
import AddChargePopup from './popups/addChargePopup';

function Clients({ showNotification }) { // Accept showNotification prop
  const [filterOpen, setFilterOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const [chargingClient, setChargingClient] = useState(null);
  
  // --- Filter/Search State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [hasBalance, setHasBalance] = useState(false); // New state for filtering

  // Function to fetch data from backend (memoized for use in callbacks)
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    const filters = {
      searchTerm: searchTerm,
      hasBalance: hasBalance, // Pass the filter state
    };

    // ✅ NOTE: Calling the updated handler 'getClientsSummary'
    const result = await window.electronAPI.getClients(filters); 
    if (result.success) {
      setClients(result.data);
    } else {
      showNotification(`Failed to fetch clients data: ${result.error}`, 'error');
    }
    setIsLoading(false);
  }, [searchTerm, hasBalance, showNotification]);

  // Debouncing Effect for Search/Filter
  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      fetchClients();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, hasBalance, fetchClients]); // Dependencies including fetchClients (due to useCallback)

  const handleEdit = (client) => {
    setEditingClient(client);
  };
  
  const handleCharge = (client) => {
    setChargingClient(client);
  };

  return (
    <div className="page clients">
      <div className="clients-topbar">
        <AddClientPopup 
          onClientRegistered={fetchClients} // Refresh list after adding
          showNotification={showNotification}
        />
        <input
          type="text"
          className="clients-search"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="clients-filter-btn button"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
      </div>
      
      {/* --- Filter Options --- */}
      {filterOpen && (
        <div className="clients-filter-popup">
          <h4>Filter Options</h4>
          <div className="filter-options-group">
            <label>
              <input 
                type="checkbox" 
                checked={hasBalance}
                onChange={() => setHasBalance(!hasBalance)} // Update filter state
              /> Only Clients with Balance Due
            </label>
          </div>
        </div>
      )}

      <div className="clients-grid">
        {isLoading ? (
          <p>Loading clients...</p>
        ) : (
          clients.map((client) => (
            <div className="client-item" key={client.client_ID}>
              <h3 className="client-name">{client.client_Name}</h3>
              <div className="client-details">
                <p><strong>Address:</strong> <span>{client.client_Address}</span></p>
                <p><strong>Age:</strong> <span>{client.client_Age}</span></p>
                <p><strong>Cellphone:</strong> <span>{client.client_Cellphone}</span></p>
                <p><strong>Social Media:</strong> <span>{client.client_Socials}</span></p>
                <p><strong>Occupation:</strong> <span>{client.client_Occupation}</span></p>
              </div>
              
              {/* ✅ FINANCIAL STATUS DISPLAY */}
              <div className="client-financial-status" 
                   style={{ marginTop: '10px', padding: '5px', borderTop: '1px solid #eee' }}>
                <p style={{ color: client.total_balance_due > 0 ? '#E64848' : '#28a745', fontWeight: 'bold' }}>
                  Balance Due: ₱{client.total_balance_due ? client.total_balance_due.toFixed(2) : '0.00'}
                </p>
                <p style={{ color: client.rented_count > 0 && client.total_balance_due <= 0 ? 'blue' : '#333' }}>
                  Items Out: {client.rented_count || 0}
                </p>
              </div>

              <div className="client-actions">
                <button className="edit-btn button" onClick={() => handleEdit(client)}>Edit Details</button>
                <button className="payments-btn button" onClick={() => console.log('Go to payments page')}>Payments</button>
                <button className="charge-btn button" onClick={() => handleCharge(client)}>Charge</button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <EditClientPopup
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onClientUpdated={fetchClients}
      />
      {chargingClient && (
        <AddChargePopup
            client={chargingClient}
            onClose={() => setChargingClient(null)}
            onChargeAdded={fetchClients} 
        />
      )}
    </div>
  );
}

export default Clients;