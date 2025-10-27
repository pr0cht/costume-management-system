import React, { use, useEffect, useState } from "react";

function EditClientPopup({ client, onClose, onClientUpdated }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [socials, setSocials] = useState("");
  const [occupation, setOccupation] = useState("");

  const resetForm = () => {
    setName("");
    setAddress("");
    setAge("");
    setCellphone("");
    setSocials("");
    setOccupation("");
  };

  useEffect(() => {
    if (client) {
      setName(client.client_Name || "");
      setAddress(client.client_Address || "");
      setAge(client.client_Age || "");
      setCellphone(client.client_Cellphone || "");
      setSocials(client.client_Socials || "");
      setOccupation(client.client_Occupation || "");
    }

    return () => {
      resetForm();
    };
  }, [client]);

  const handleEditClient = async (e) => {
    e.preventDefault();

    try {
      const updatedClientData = {
        id: client.client_ID,
        name,
        address,
        age: parseInt(age, 10) || null,
        cellphone,
        socials,
        occupation,
      };

      // send data to main process

      const result = await window.electronAPI.editClient(updatedClientData);
      if (result.success) {
        onClientUpdated();
        onClose();
      } else {
        alert(`Failed to edit client details: ${result.error}`);
      }
    } catch (error) {
      console.error("Error editing client details:", error);
      alert("An error occurred while editing client details.");
    }
  }

  if (!client) {
    return null;
  }

  return (
    <div>
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Edit Client Details: {client.client_Name}</h2>
          <form className="edit-client-form form" onSubmit={handleEditClient}>
            <div className="row spacebetween">
              {/* client name */}
              <label>Client Name:</label>
              <input className="text-input" type="text" name="clientName" required
                value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="row spacebetween">
              {/* client address */}
              <label>Address:</label>
              <input className="text-input" type="text" name="clientAddress" required
                value={address}
                onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="row spacebetween">
              {/* client age */}
              <label>Age:</label>
              <input className="text-input" type="number" name="clientAge" min="1" required
                value={age}
                onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="row spacebetween">
              {/* client cellphone num */}
              <label>Contact Number:</label>
              <input className="text-input" type="text" name="clientContact" required
                value={cellphone}
                onChange={(e) => setCellphone(e.target.value)} />
            </div>
            <div className="row spacebetween">
              {/* client socials */}
              <label>Socials (Link or Username):</label>
              <input className="text-input" type="text" name="clientSocials" required
                value={socials}
                onChange={(e) => setSocials(e.target.value)} />
            </div>
            <div className="row spacebetween">
              {/* client occupation */}
              <label>Occupation:</label>
              <input className="text-input" type="text" name="clientOccupation" required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)} />
            </div>
            <div className="form-actions  row spacebetween">
              <button type="submit">Update Details</button>
              <button type="button" onClick={onClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditClientPopup;