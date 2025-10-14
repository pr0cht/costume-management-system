import React, { use, useEffect, useState } from "react";

function EditEventPopup({ event, onClose, onEventUpdated }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const resetForm = () => {
    setName("");
    setDate("");
    setLocation("");
  }

  useEffect(() => {
    if (event) {
      setName(event.event_Name || "");
      setDate(event.event_Date || "");
      setLocation(event.event_Location || "");
    }

    return () => {
      resetForm();
    }
  }, [event]);

  const handleEditEvent = async (e) => {
    e.preventDefault();

    try {
      const updatedEventData = {
        id: event.event_ID,
        name,
        date,
        location
      };

      // send data to main process

      const result = await window.electronAPI.editEvent(updatedEventData);
      if (result.success) {
        onEventUpdated();
        onClose();
      } else {
        alert(`Failed to edit event details: ${result.error}`);
      }
    } catch (error) {
      console.error("Error editing event details:", error);
      alert("An error occurred while editing event details.");
    }
  }

  if (!event) {
    return null;
  }

  return (
    <div>
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Edit Event Details: {event.event_Name}</h2>
          <form className="edit-event-form form" onSubmit={handleEditEvent}>
            <div className="row spacebetween">
              {/* event name */}
              <label>Event Name:</label>
              <input className="event-text-input" type="text" name="eventName" required
                value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="row spacebetween">
              {/* event date */}
              <label>Date:</label>
              <input className="event-text-input" type="date" name="eventDate" required
                value={date}
                onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="row spacebetween">
              {/* event location */}
              <label>Location:</label>
              <input className="event-text-input" type="text" name="eventLocation" required
                value={location}
                onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="form-actions">
              <button type="submit">Update Details</button>
              <button type="button" onClick={onClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditEventPopup;