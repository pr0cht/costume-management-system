import React, { useState } from "react";

function AddClientPopup({ onClientRegistered, onCancel }) {
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

    if (!name || !address || !age || !cellphone) {
      alert("Please fill in all required client fields.");
      return;
    }

    try {
      const clientData = {
        name,
        address,
        age: parseInt(age, 10) || null,
        cellphone,
        socials,
        occupation
      };

      const result = await window.electronAPI.addClient(clientData);

      if (result.success) {
        alert(`Client registered with ID: ${result.lastID}`);
        resetForm();

        if (onClientRegistered) {
          onClientRegistered();
        } else {
          setShowPopup(false);
        }
      } else {
        alert(`Failed to register client: ${result.error}`);
      }
    } catch (error) {
      console.error("Error registering client:", error);
      alert("An error occurred while registering the client.");
    }
  }

  const RawInputStructure = (
    <>
      <div className="row spacebetween">
        <label>Client Name:</label>
        <input className="text-input" type="text" name="clientName" required
          value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="row spacebetween">
        <label>Address:</label>
        <input className="text-input" type="text" name="clientAddress" required
          value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="row spacebetween">
        <label>Age:</label>
        <input className="text-input" type="number" name="clientAge" min="1" required
          value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div className="row spacebetween">
        <label>Contact Number:</label>
        <input className="text-input" type="text" name="clientContact" required
          value={cellphone} onChange={(e) => setCellphone(e.target.value)} />
      </div>
      <div className="row spacebetween">
        <label>Socials (Link or Username):</label>
        <input className="text-input" type="text" name="clientSocials" required
          value={socials} onChange={(e) => setSocials(e.target.value)} />
      </div>
      <div className="row spacebetween">
        <label>Occupation:</label>
        <input className="text-input" type="text" name="clientOccupation" required
          value={occupation} onChange={(e) => setOccupation(e.target.value)} />
      </div>
    </>
  );

  return (
    onClientRegistered ? (
      <div>
        <button className="add-client-btn button" onClick={() => setShowPopup(true)}>Register Client</button>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Register Client</h2>
              <form className="add-client-form form" onSubmit={handleAddClient}>

                {RawInputStructure}

                <div className="form-actions row spacebetween">
                  <button type="submit">Register Client</button>
                  <button type="button" onClick={() => setShowPopup(false)}>Close</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    ) : (
      <form className="add-client-form form" onSubmit={handleAddClient}>
        <h3 style={{ marginTop: 0 }}>Register New Client</h3>

        {RawInputStructure}

        <div className="form-actions row spacebetween">
          <button type="submit">Register Client</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    )
  );
}

export default AddClientPopup;