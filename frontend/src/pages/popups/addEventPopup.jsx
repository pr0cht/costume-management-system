import React, { useEffect, useState } from "react";

function AddEventPopup() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const resetForm = () => {
    setEventName("");
    setEventDate("");
    setEventLocation("");
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        name: eventName,
        date: eventDate,
        location: eventLocation,
      };

      // send data to main process
      const result = await window.electronAPI.addEvent(eventData);
      if (result.success) {
        alert(`Event added with ID: ${result.lastID}`);
        setShowPopup(false);
        resetForm();
      } else {
        alert(`Failed to add event: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("An error occurred while adding the event.");
    }
  }

  return (
    <div>
      <button className="action-btn button" onClick={() => setShowPopup(true)}>Add Event</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add New Event</h2>
            <form className="add-event-form form" onSubmit={handleAddEvent}>
              <div className="row spacebetween">
                <label>Event Name:</label>
                <input className="text-input" type="text" name="eventName" required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)} />
              </div>
              <div className="row spacebetween">
                <label>Date:</label>
                <input className="text-input" type="date" name="eventDate" required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)} />
              </div>
              <div className="row spacebetween">
                <label>Location:</label>
                <input className="etext-input" type="text" name="eventLocation" required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)} />
              </div>
              <div className="form-actions  row spacebetween">
                <button type="submit">Add Event</button>
                <button onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddEventPopup;