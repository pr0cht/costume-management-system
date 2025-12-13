import React, { useEffect, useState, useMemo } from "react";
import AddClientPopup from "./addClientPopup";
import AppNotification from "../alerts/Notification";

const bufferToURL = (base64String) => {
  if (!base64String) return null;
  return `data:image/jpeg;base64,${base64String}`;
};

const addDaysToDate = (dateString, days) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error calculating date:", e);
    return '';
  }
};

function NewRentalPopup({ initialCostume, onClose, onRentalProcessed, showNotification }) {
  const [view, setView] = useState('selectClient');
  const [allClients, setAllClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [allActiveEvents, setAllActiveEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedClientName, setSelectedClientName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRemarks, setPaymentRemarks] = useState('');

  useEffect(() => {
    if (initialCostume) {
      setIsLoadingClients(true);
      setIsLoadingEvents(true);
      const fetchData = async () => {
        const clientsRes = await window.electronAPI.getClients();
        if (clientsRes.success) {
          setAllClients(clientsRes.data);
        } else {
          console.error("Failed to fetch clients:", clientsRes.error);
        }
        setIsLoadingClients(false);

        const eventsRes = await window.electronAPI.getEventsActive();
        if (eventsRes.success) {
          setAllActiveEvents(eventsRes.data);
        } else {
          console.error("Failed to fetch active events:", eventsRes.error);
        }
        setIsLoadingEvents(false);
      };
      fetchData();
    } else {
      setView('selectClient');
      setSelectedClientId('');
      setSelectedClientName('');
      setClientSearchTerm('');
      setSelectedEventId('');
      setReturnDate('');
    }
  }, [initialCostume]);

  const filteredClients = useMemo(() => {
    if (!clientSearchTerm) {
      return [];
    }
    return allClients.filter(client =>
      client.client_Name.toLowerCase().includes(clientSearchTerm.toLowerCase())
    );
  }, [clientSearchTerm, allClients]);

  const handleClientSelect = (client) => {
    setSelectedClientId(client.client_ID);
    setSelectedClientName(client.client_Name);
    setClientSearchTerm('');
  };

  const handleEventSelect = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);

    if (eventId) {
      const selectedEvent = allActiveEvents.find(event => event.event_ID.toString() === eventId);
      if (selectedEvent) {
        const calculatedReturnDate = addDaysToDate(selectedEvent.event_Date, 3);
        setReturnDate(calculatedReturnDate);
      }
    } else {
      setReturnDate('');
    }
  };

  const handleProcessRental = async (e) => {
    e.preventDefault();
    if (!selectedClientId || !returnDate) {
      showNotification("Please select a client and a return date.");
      return;
    }

    const rentalData = {
      clientId: selectedClientId,
      costumeIds: [initialCostume.costume_ID],
      eventId: selectedEventId || null,
      rentalDate: new Date().toISOString().split('T')[0],
      returnDate: returnDate,
      paymentAmount: parseFloat(paymentAmount) || 0,
      paymentRemarks: paymentRemarks || 'Initial Rental Payment',
    };

    const res = await window.electronAPI.processRental(rentalData);
    if (res.success) {
      showNotification(`Rental processed successfully! Transaction ID: ${res.transactionId}`);
      onRentalProcessed();
      onClose();
    } else {
      showNotification(`Failed to process rental: ${res.error}`);
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
                  <div className="client-search-container">
                    {/* display selected client or show search input */}
                    {selectedClientId ? (
                      <div className="selected-client-display">
                        <p>Selected Client: <strong>{selectedClientName}</strong></p>
                        <button type="button" onClick={() => { setSelectedClientId(''); setSelectedClientName(''); }}>Change</button>
                      </div>
                    ) : (
                      <>
                        <label>Search Client Name:</label>
                        <input
                          type="text"
                          value={clientSearchTerm}
                          onChange={(e) => setClientSearchTerm(e.target.value)}
                          placeholder="Start typing client name..."
                          required={!selectedClientId}
                        />
                        {/* display search results */}
                        {filteredClients.length > 0 && (
                          <ul className="client-search-results">
                            {filteredClients.map(client => (
                              <li key={client.client_ID} onClick={() => handleClientSelect(client)}>
                                {client.client_Name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <AddClientPopup 
                    onClientRegistered={async () => {
                      const clientsResult = await window.electronAPI.getClients();
                      if (clientsResult.success) setAllClients(clientsResult.data);
                      setView('selectClient'); 
                    }}
                    onCancel={() => setView('selectClient')}
                    showNotification={showNotification}
                  />
                )
              )}
            </div>
            <div className="rental-section costume-selection-section">
              <h3>Costume Details</h3>
              <div className="selected-costume-display">
                <div className="row spacebetween">
                  <img className="costume-thumbnail" src={bufferToURL(initialCostume.costume_Image)} alt={initialCostume.costume_Name} />
                  <div>
                    <p><strong>Name:</strong> {initialCostume.costume_Name}</p>
                    <p><strong>Origin:</strong> {initialCostume.costume_Origin}</p>
                    <p><strong>Size:</strong> {initialCostume.costume_Size}</p>
                    <p><strong>Rental Fee:</strong> ${initialCostume.costume_Price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rental-details-section row spacebetween">
            <div className="col">
              <label>Associate with Event (Optional):</label>
              {isLoadingEvents ? <p>Loading events...</p> : (
                <select value={selectedEventId} onChange={handleEventSelect}>
                  <option value="">None</option>
                  {allActiveEvents.map(event => (
                    <option key={event.event_ID} value={event.event_ID}>
                      {event.event_Name} ({event.event_Date})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="col">
              <label>Return Date:</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
            </div>
          </div>
          <div className="payment-section row spacebetween">
            <div className="col">
              <label>Payment Amount:</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder={`Max: ${initialCostume.costume_Price.toFixed(2)}`}
              />
            </div>
            <div className="col">
              <label>Payment Remarks:</label>
              <input
                type="text"
                value={paymentRemarks}
                onChange={(e) => setPaymentRemarks(e.target.value)}
                placeholder="Downpayment, Full Payment, etc."
              />
            </div>
          </div>
          <div className="form-actions row spacebetween">
            <button type="submit">Process Rental</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRentalPopup;