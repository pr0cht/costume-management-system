import React, { useState } from 'react';
import AddClientPopup from './addClientPopup'; 

function DashboardAddClient() {
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAddClient;