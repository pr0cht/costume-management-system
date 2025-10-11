import React, { useEffect, useState } from 'react';
import AddCostumePopup from './popups/addCostumePopup';
import EditCostumePopup from './popups/editCostumePopup';

const bufferToURL = (base64String) => {
  if (!base64String) {
    return null;
  }
  return `data:image/png;base64,${base64String}`;
}

function Costumes() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [costumes, setCostumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCostume, setEditingCostume] = useState(null);

  const fetchCostumes = async () => {
    setIsLoading(true);
    const result = await window.electronAPI.getCostumes();
    if (result.success) {
      setCostumes(result.data);
    } else {
      alert(`Failed to fetch costumes: ${result.error}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCostumes();
  }, []);

  return (
    <div className="page costumes">
      <div className="costumes-topbar">
        <AddCostumePopup />
        <input
          type="text"
          className="costumes-search"
          placeholder="Search costumes..."
        />
        <button
          className="costumes-filter-btn button"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
      </div>
      {filterOpen && (
        <div className="costumes-filter-popup">
          <h4>Filter Options</h4>
          <div>
            <label>
              <input type="checkbox" /> Available
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> Rented
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> By Category
            </label>
          </div>
          {/* Add more filter options */}
        </div>
      )}
      <div className="costumes-grid">
        {isLoading ? (
          <p>Loading costumes...</p>
        ) : (
          costumes.map((costume) => (
            <div className="costume-item" key={costume.costume_ID}>
              <div className="costume-thumbnail">
                <img src={bufferToURL(costume.costume_Image)} alt={costume.costume_Name} />
              </div>
              <p><span className="costume-name">{costume.costume_Name}</span></p>
              <p>Origin: <span className="costume-origin">{costume.costume_Origin}</span></p>
              <p>Type: <span className="costume-type">{costume.costume_Type}</span></p>
              <p>Size: <span className="costume-size">{costume.costume_Size}</span></p>
              <p>Gender: <span className="costume-gender">{costume.costume_Gender}</span></p>
              <p>Price: <span className="costume-price">{costume.costume_Price.toFixed(2)}</span></p>
              <p>Status: <span className="costume-status">{costume.costume_Available ? 'Available' : 'Rented'}</span></p>
              <div className='costume-actions'>
                <button className="edit-btn button" onClick={() => setEditingCostume(costume)}>Edit</button>
                <button className="rent-btn button">Rent</button>
              </div>
            </div>
          ))
        )}
      </div>
      <EditCostumePopup
        costume={editingCostume}
        onClose={() => setEditingCostume(null)}
        onCostumeUpdated={fetchCostumes}
      />
    </div>
  );
};

export default Costumes;
