function Events() {
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <div className="page events">
      <div className="events-topbar">
        <input
          type="text"
          className="events-search"
          placeholder="Search events..."
        />
        <button
          className="events-filter-btn button"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
      </div>
      {filterOpen && (
        <div className="events-filter-popup">
          <h4>Filter Options</h4>
          <div>
            <label>
              <input type="checkbox" /> Upcoming
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" /> Past Events
            </label>
          </div>
        </div>
      )}
      
      <div className="events-section">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-grid">
          <div className="event-item">
            <h3 className="event-name">Anime Convention 2025</h3>
            <p className="event-datetime">August 15, 2025 - 9:00 AM</p>
            <button className="edit-btn button">Edit Event Details</button>
          </div>
          <div className="event-item">
            <h3 className="event-name">Cosplay Competition</h3>
            <p className="event-datetime">August 20, 2025 - 2:00 PM</p>
            <button className="edit-btn button">Edit Event Details</button>
          </div>
        </div>
      </div>

      <div className="events-section past-events">
        <h2 className="section-title">Past Events</h2>
        <div className="events-grid">
          <div className="event-item">
            <h3 className="event-name">Summer Anime Fest</h3>
            <p className="event-datetime">July 15, 2025 - 10:00 AM</p>
            <button className="edit-btn button">View Details</button>
          </div>
          <div className="event-item">
            <h3 className="event-name">Comic Convention</h3>
            <p className="event-datetime">July 1, 2025 - 1:00 PM</p>
            <button className="edit-btn button">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
export default Events;