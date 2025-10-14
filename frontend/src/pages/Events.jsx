import React, { useEffect, useState } from 'react';
import EditEventPopup from './popups/editEventPopup';
import AddEventPopup from './popups/addEventPopup';

function Events() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchActiveEvents = async () => {
    setIsLoading(true);
    const result = await window.electronAPI.getEventsActive();
    if (result.success) {
      setActiveEvents(result.data);
    } else {
      alert(`Failed to fetch events data: ${result.error}`)
    }
    setIsLoading(false);
  }

  const fetchPastEvents = async () => {
    setIsLoading(true);
    const result = await window.electronAPI.getEventsPast();
    if (result.success) {
      setPastEvents(result.data);
    } else {
      alert(`Failed to fetch events data: ${result.error}`)
    }
    setIsLoading(false);
  }


  useEffect(() => {
    fetchActiveEvents();
    fetchPastEvents();
  }, []);


  return (
    <div className="page events">
      <div className="events-topbar">
        <AddEventPopup />
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
          {isLoading ? (
            <p>Loading events...</p>
          ) : (
            activeEvents.map((event) =>
              <div className="event-item" key={event.event_ID}>
                <h3 className="event-name">{event.event_Name}</h3>
                <p className="event-datetime">{event.event_Date}</p>
                <p className="event-location">{event.event_Location}</p>
                <button className="edit-btn button" onClick={() => setEditingEvent(event)}>Edit Details</button>
              </div>
            )
          )}
        </div>
      </div>

      <div className="events-section past-events">
        <h2 className="section-title">Past Events</h2>
        <div className="events-grid">
          {isLoading ? (
            <p>Loading events...</p>
          ) : (
            pastEvents.map((event) =>
              <div className="event-item" key={event.event_ID}>
                <h3 className="event-name">{event.event_Name}</h3>
                <p className="event-datetime">{event.event_Date}</p>
                <p className="event-location">{event.event_Location}</p>
                <button className="edit-btn button" onClick={() => setEditingEvent(event)}>Edit Details</button>
              </div>
            )
          )}
        </div>
        <EditEventPopup
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventUpdated={() => {
            fetchActiveEvents();
            fetchPastEvents();
          }
          }
        />
      </div>
    </div>
  );
}

export default Events;