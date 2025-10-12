import React, { useEffect, useState } from 'react';
import AddClientPopup from './popups/addClientPopup';
import EditClientPopup from './popups/editClientPopup';

function Clients() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    setIsLoading(true);
    const result = await window.electronAPI.getClients();
    if (result.success) {
      setClients(result.data);
    } else {
      alert(`Failed to fetch clients data: ${result.error}`)
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="page clients">
      <div className="clients-topbar">
        <AddClientPopup />
        <input
          type="text"
          className="clients-search"
          placeholder="Search clients..."
        />
        <button
          className="clients-filter-btn button"
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
        {isLoading ? (
          <p>Loading clients...</p>
        ) : (
          clients.map((client) => (
            <div className="client-item" key={client.client_ID}>
              <h3 className="client-name">{client.client_Name}</h3>
              <div className="client-details">
                <p><strong>Address:</strong> <span className="client-name">{client.client_Address}</span></p>
                <p><strong>Age:</strong> <span className="client-age">{client.client_Age}</span></p>
                <p><strong>Cellphone:</strong> <span className="client-cellphone">{client.client_Cellphone}</span></p>
                <p><strong>Social Media:</strong> <span className="client-socials">{client.client_Socials}</span></p>
                <p><strong>Occupation:</strong> <span className="client-occupation">{client.client_Occupation}</span></p>
              </div>
              <div className="client-actions">
                <button className="edit-btn button" onClick={() => setEditingClient(client)}>Edit Details</button>
                <button className="payments-btn button">Payments</button>
              </div>
            </div>
          ))
        )}
      </div>
      <EditClientPopup
        key={editingClient?.client_ID || 'new-client-editor'}
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onClientUpdated={fetchClients}
      />
    </div>
  );
}

export default Clients;