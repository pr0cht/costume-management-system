import React, { useEffect, useState } from "react";

function AddClientPopup() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [socials, setSocials] = useState("");
  const [occupation, setOccupation] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const resetForm = () => {
    setName("");
    setAddress("");
    setAge("");
    setCellphone("");
    setSocials("");
    setOccupation("");
  };

  const handleAddClient = async (e) => {
    e.preventDefault();

    try {

      const clientData = {
        name,
        address,
        age: parseInt(age, 10) || null,
        cellphone,
        socials,
        occupation
      };

      // send data to main process

      const result = await window.electronAPI.addClient(clientData);
      if (result.success) {
        alert(`Client registered with ID: ${result.lastID}`);
        setShowPopup(false);
        resetForm();
      } else {
        alert(`Failed to register client: ${result.error}`);
      }
    } catch (error) {
      console.error("Error registering client:", error);
      alert("An error occurred while registering the client.");
    }
  }

  return (
    <div>
      <button className="add-client-btn button" onClick={() => setShowPopup(true)}>Register Client</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Register Client</h2>
            <form className="add-client-form form" onSubmit={handleAddClient}>
              <div className="row spacebetween">
                {/* client name */}
                <label>Client Name:</label>
                <input className="client-text-input" type="text" name="clientName" required
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* client address */}
                <label>Address:</label>
                <input className="client-text-input" type="text" name="clientAddress" required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* client age */}
                <label>Age:</label>
                <input className="client-text-input" type="number" name="clientAge" min="1" required
                  value={age}
                  onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* client cellphone num */}
                <label>Contact Number:</label>
                <input className="client-text-input" type="text" name="clientContact" required
                  value={cellphone}
                  onChange={(e) => setCellphone(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* client socials */}
                <label>Socials (Link or Username):</label>
                <input className="client-text-input" type="text" name="clientSocials" required
                  value={socials}
                  onChange={(e) => setSocials(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* client occupation */}
                <label>Occupation:</label>
                <input className="client-text-input" type="text" name="clientOccupation" required
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)} />
              </div>
              
              <button type="submit">Register Client</button>
            </form>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )

}

export default AddClientPopup;