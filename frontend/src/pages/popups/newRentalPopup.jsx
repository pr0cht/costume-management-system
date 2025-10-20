import React, { useEffect, useState } from "react";
import AddClientPopup from "./addClientPopup";

const bufferToURL = (base64String) => {
  if (!base64String) return null;
  return `data:image/jpeg;base64,${base64String}`;
};

function NewRentalPopup({ initialCostume, onClose, onRentalProcessed }) {
  const [view, setView] = useState('selectClient');
  const [allClients, setAllClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  
  const [selectedClientId, setSelectedClientId] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    if (initialCostume) {
      setIsLoadingClients(true);
      const fetchClientsData = async () => {
        const res = await window.electronAPI.getClients();
        if (res.success) {
          setAllClients(res.data);
        } else {
          console.error("Failed to fetch clients:", res.error);
        }
        setIsLoadingClients(false);
      };
      fetchClientsData();
    } else {
      setView('selectClient');
      setSelectedClientId('');
      setReturnDate('');
    }
  }, [initialCostume]);

const handleProcessRental = async (e) => {
    e.preventDefault();
    if (!selectedClientId || !returnDate) {
      alert("Please select a client and a return date.");
      return;
    }

    const rentalData = {
      clientId: selectedClientId,
      costumeIds: [initialCostume.costume_ID], 
      rentalDate: new Date().toISOString().split('T')[0],
      returnDate: returnDate,
    };

    const res = await window.electronAPI.processRental(rentalData);
    if (res.success) {
      alert(`Rental processed successfully! Transaction ID: ${res.transactionId}`); // Use res.transactionId
      onRentalProcessed();
      onClose();
    } else {
      alert(`Failed to process rental: ${res.error}`);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content large">
        <h2>Rent Out: {initialCostume.costume_Name}</h2>
        <form onSubmit={handleProcessRental}>
          <div className="rental-form-layout">
            <div className="rental-section client-section">
              <h3>Client Information</h3>
              <div className="view-toggle-buttons">
                <button type="button" onClick={() => setView('selectClient')} className={view === 'selectClient' ? 'active' : ''}>Select Existing Client</button>
                <button type="button" onClick={() => setView('addClient')} className={view === 'addClient' ? 'active' : ''}>Add New Client</button>
              </div>

              {isLoadingClients ? <p>Loading clients...</p> : (
                view === 'selectClient' ? (
                  <div>
                    <label>Select a Client:</label>
                    <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} required>
                      <option value="" disabled>-- Choose a client --</option>
                      {allClients.map(client => (
                        <option key={client.client_ID} value={client.client_ID}>{client.client_Name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <AddClientPopup onClientAdded={async () => {
                    const clientsResult = await window.electronAPI.getClients();
                    if (clientsResult.success) setAllClients(clientsResult.data);
                    setView('selectClient'); 
                  }} />
                )
              )}
            </div>

            <div className="rental-section costume-selection-section">
              <h3>Costume Details</h3>
              <div className="selected-costume-display">
                <img className="costume-thumbnail"src={bufferToURL(initialCostume.costume_Image)} alt={initialCostume.costume_Name} />
                <p><strong>Name:</strong> {initialCostume.costume_Name}</p>
                <p><strong>Origin:</strong> {initialCostume.costume_Origin}</p>
                <p><strong>Size:</strong> {initialCostume.costume_Size}</p>
                <p><strong>Rental Fee:</strong> ${initialCostume.costume_Price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="rental-details-section">
            <label>Return Date:</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
          </div>

          <div className="form-actions">
            <button type="submit">Process Rental</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRentalPopup;