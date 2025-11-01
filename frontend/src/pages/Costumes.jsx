import React, { use, useEffect, useState } from 'react';
import AddCostumePopup from './popups/addCostumePopup';
import EditCostumePopup from './popups/editCostumePopup';
import NewRentalPopup from './popups/newRentalPopup';
import AppNotification from './alerts/Notification';

const bufferToURL = (base64String) => {
  if (!base64String) {
    return null;
  }
  return `data:image/png;base64,${base64String}`;
}

function Costumes({ showNotification, setPage }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [costumes, setCostumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCostume, setEditingCostume] = useState(null);
  const [rentingCostume, setRentingCostume] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [filterSize, setFilterSize] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sort, setSort] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchCostumes = async () => {
    setIsLoading(true);
    const filters = {
      searchTerm,
      available: showAvailableOnly,
      size: filterSize,
      gender: filterGender,
      type: filterType,
      sort,
      sortOrder,
    };

    console.log("Sending filters to backend:", filters);

    const result = await window.electronAPI.getCostumes(filters);
    if (result.success) {
      setCostumes(result.data);
    } else {
      showNotification(`Failed to fetch costumes: ${result.error}`);
    }
    setIsLoading(false);
  }


  useEffect(() => {
    setIsLoading(true);

    const handler = setTimeout(() => {
      fetchCostumes();
    }, 500)

    return () => {
      clearTimeout(handler);
    }
  },
    [searchTerm, showAvailableOnly, filterSize, filterGender, filterType, sort, sortOrder])

  return (
    <div className="page costumes">
      <div className="costumes-topbar">
        <AddCostumePopup  showNotification={showNotification} onCostumeAdded={fetchCostumes}/>
        <input
          type="text"
          className="costumes-search"
          value={searchTerm}
          placeholder="Search costumes..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="costumes-filter-btn button"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
        <button
          className="view-history-btn button"
          onClick={() => setPage('rents')}
        >
          View Rent History
        </button>
      </div>
      {filterOpen && (
        <div className="costumes-filter-popup">
          <h4>Filter Options</h4>
          <div>
            <label>Filter by Size: </label>
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
            >
              <option value="">All</option>
              <option value="XSMALL">XS</option>
              <option value="SMALL">S</option>
              <option value="MEDIUM">M</option>
              <option value="LARGE">L</option>
              <option value="XLARGE">XL</option>
              <option value="XXLARGE">XXL</option>
              <option value="One Size">One Size Fits All</option>
              <option value="Not Applicable">Not Applicable</option>
            </select>
          </div>
          <div>
            <label>Filter by Gender: </label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
            <div>
              <label>Filter by Type: </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All</option>
                <option value="Cloth">Cloth</option>
                <option value="Armor">Armor</option>
                <option value="Single Item">Single Item</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>
                <input type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)} /> Available
              </label>
            </div>
            <div>
              <label>Sort by: </label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="availability">Availability</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="costumes-grid">
        {costumes.map((costume) => {
              const isRented = !costume.costume_Available;
              
              return (
            <div 
                className={`costume-item ${isRented ? 'is-rented' : ''}`} 
                key={costume.costume_ID}
              >
              <div className="costume-thumbnail small">
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
                <button 
                  className="edit-btn button" 
                  onClick={isRented ? null : () => setEditingCostume(costume)}
                  disabled={isRented}
                >
                    Edit
                </button>
                <button className="rent-btn button" 
                  onClick={isRented ? null : () => setRentingCostume(costume)}
                  disabled={isRented}
                >
                    Rent
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <EditCostumePopup
        costume={editingCostume}
        onClose={() => setEditingCostume(null)}
        onCostumeUpdated={fetchCostumes}
        showNotification={showNotification}
      />
      {rentingCostume && (
        <NewRentalPopup
          initialCostume={rentingCostume}
          onClose={() => setRentingCostume(null)}
          onRentalProcessed={fetchCostumes}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};

export default Costumes;
