import React, { useState } from "react";

function AddCostumePopup() {
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [type, setType] = useState("cloth");
  const [size, setSize] = useState("m");
  const [gender, setGender] = useState("unisex");
  const [price, setPrice] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [available, setAvailable] = useState(true);
  const [img, setImg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageBuffer = null;
    if (img) {
      const arrayBuffer = await img.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    const costumeData = {
      name,
      origin,
      type,
      size,
      gender,
      price: parseFloat(price),
      inclusions,
      available,
      img: imageBuffer,
    };

    const result = await window.electronAPI.addCostume(costumeData);
    if (result.success) {
      alert("Costume added with ID:", result.lastID);
    } else {
      alert("Failed to add costume");
    }    
  }

  const [showPopup, setShowPopup] = useState(false);
  return (
    <div>
      <button className="add-costume-btn button" onClick={() => setShowPopup(true)}>Add Costume</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add New Costume</h2>
              <form className="add-costume-form" onsubmit="{handleSubmit}">
                <div className="row spacebetween">
                  <label>Costume Name:</label>
                  <input className="costume-text-input" type="text" name="costumeName" required />
                </div>
                <div className="row spacebetween">
                  <label>Costume Origin:</label>
                  <input className="costume-text-input" type="text" name="costumeOrigin" required />
                </div>
                <div className="row spacebetween">
                  <label>Costume Type:</label>
                  <select className="costume-select-input" name="costumeType" required>
                    <option value="cloth">Cloth</option>
                    <option value="armor">Armor</option>
                    <option value="singleItem">Single Item</option>
                    <option value="other">Other</option>
                    <option value="none">Not Applicable</option>
                  </select>
                </div>
                <div className="row spacebetween">
                  <label>Size:</label>
                  <select className="costume-select-input" name="size" required>
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                    <option value="xxl">XXL</option>
                    <option value="oneSize">One Size Fits All</option>
                    <option value="none">Not Applicable</option>
                  </select>
                </div>
                <div className="row spacebetween">
                  <label>Gender:</label>
                  <select className="costume-select-input" name="gender" required>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                    <option value="none">Not Applicable</option>
                  </select>
                </div>
                <div className="row spacebetween">
                  <label>Price:</label>
                  <input className="costume-text-input" type="number" name="price" min="0" step="0.01" required />
                </div>
                <div className="row spacebetween">
                  <label>Inclusions:</label>
                  <input className="costume-text-input" type="text" name="inclusions" />
                </div>
                <div className="row spacebetween">
                  <label>Available:</label>
                  <input type="checkbox" name="available" />
                </div>
                <div className="row spacebetween">
                  <label>Reference Image:</label>
                  <input type="file" name="referenceImage" accept="image/*" />
                </div>
                <div className="row spacebetween">
                  <figure>
                    <figcaption>Image Preview:</figcaption>
                    <img src="#" alt="Image Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </figure>
                </div>
                <button type="submit">Add Item</button>
              </form>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCostumePopup;