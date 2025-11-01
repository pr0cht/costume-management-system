import React, { useState } from 'react';
import AddClientPopup from './addClientPopup'; 
import AppNotification from '../alerts/Notification';

function DashboardAddClient({ showNotification }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <button className="add-client-btn button" onClick={() => setShowPopup(true)}>Register Client</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <AddClientPopup 
                onClientRegistered={null} 
                onCancel={() => setShowPopup(false)} 
                showNotification={showNotification}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAddClient;