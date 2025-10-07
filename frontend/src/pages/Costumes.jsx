function Costumes() {
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <div className="page costumes">
      <div className="costumes-topbar">
        <input
          type="text"
          className="costumes-search"
          placeholder="Search costumes..."
        />
        <button 
          className="costumes-filter-btn"
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
        <div className="costume-item"> {/* Example costume item */}
          <div className="costume-thumbnail">
            <img src="assets/costumes/tanjiro.jpg" alt="Kamado Tanjiro" />
          </div>
          <p><span className="costume-name">Kamado Tanjiro</span></p>
          <p>Origin: <span className="costume-origin">Demon Slayer</span></p>
          <p>Type: <span className="costume-type">Cloth</span></p>
          <p>Size: <span className="costume-size">Size</span></p>
          <p>Gender: <span className="costume-gender">Male</span></p>
          <p>Price: <span className="costume-price">2000</span></p>
          <p>Status: <span className="costume-status">Available</span></p>
          <div className='costume-actions'>
            <button className="view-btn costume-btn">Edit</button>
            <button className="rent-btn costume-btn">Rent</button>  
          </div>
          
        </div>
        <div className="costume-item"> {/* Example costume item */}
          <div className="costume-thumbnail">
            <img src="assets/costumes/nezuko.jpg" alt="Kamado Nezuko" />
          </div>
          <p><span className="costume-name">Kamado Nezuko</span></p>
          <p>Origin: <span className="costume-origin">Demon Slayer</span></p>
          <p>Type: <span className="costume-type">Cloth</span></p>
          <p>Size: <span className="costume-size">Small</span></p>
          <p>Gender: <span className="costume-gender">Female</span></p>
          <p>Price: <span className="costume-price">2000</span></p>
          <p>Status: <span className="costume-status">Rented</span></p>
          <div className='costume-actions'>
            <button className="view-btn costume-btn">Edit</button>
            <button className="rent-btn costume-btn">Rent</button>  
          </div>
        </div>
        {/* Add */}
      </div>
    </div>
  );
};

import React from 'react';
export default Costumes;
