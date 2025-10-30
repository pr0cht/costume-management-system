import React, { useEffect, useState } from "react";
import AppNotification from "../alerts/Notification";

function AddCostumePopup({ showNotification}) {
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [type, setType] = useState("Cloth");
  const [size, setSize] = useState("m");
  const [gender, setGender] = useState("unisex");
  const [price, setPrice] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [available, setAvailable] = useState(true);
  const [img, setImg] = useState(null);

  const [imgPreview, setImgPreview] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const resetForm = () => {
    setName("");
    setOrigin("");
    setType("Cloth");
    setSize("MEDIUM");
    setGender("Unisex");
    setPrice("");
    setInclusions("");
    setAvailable(true);
    setImg(null);
    setImgPreview(null);
  };

  const handleAddCostume = async (e) => {
    e.preventDefault();

    try {
      let arrayBuffer = null;
      if (img) {
        arrayBuffer = await img.arrayBuffer();
      }

      const costumeData = {
        name,
        origin,
        type,
        size,
        gender,
        price: parseFloat(price) || 0,
        inclusions,
        available,
        img: arrayBuffer,
      };

      // send data to main process

      const result = await window.electronAPI.addCostume(costumeData);
      if (result.success) {
        showNotification(`Costume added with ID: ${result.lastID}`);
        setShowPopup(false);
        resetForm();
      } else {
        showNotification(`Failed to add costume: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding costume:", error);
      showNotification("An error occurred while adding the costume.");
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (imgPreview) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, [imgPreview]);

  return (
    <div>
      <button className="add-costume-btn button" onClick={() => setShowPopup(true)}>Add Costume</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add New Costume</h2>
            <form className="add-costume-form form" onSubmit={handleAddCostume}>
              <div className="row spacebetween">
                {/* costume name */}
                <label>Costume Name:</label>
                <input className="text-input" type="text" name="costumeName" required
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* costume origin */}
                <label>Costume Origin:</label>
                <input className="text-input" type="text" name="costumeOrigin" required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* costume type */}
                <label>Costume Type:</label>
                <select className="select-input" name="costumeType" required
                  value={type}
                  onChange={(e) => setType(e.target.value)}>
                  <option value="Cloth">Cloth</option>
                  <option value="Armor">Armor</option>
                  <option value="Single Item">Single Item</option>
                  <option value="Other">Other</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>
              <div className="row spacebetween">
                {/* costume size */}
                <label>Size:</label>
                <select className="select-input" name="size" required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}>
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
              <div className="row spacebetween">
                {/* costume gender */}
                <label>Gender:</label>
                <select className="select-input" name="gender" required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>
              <div className="row spacebetween">
                {/* costume price */}
                <label>Price:</label>
                <input className="text-input" type="number" name="price" min="0" step="0.01" required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* costume inclusions */}
                <label>Inclusions:</label>
                <input className="text-input" type="text" name="inclusions"
                  value={inclusions}
                  onChange={(e) => setInclusions(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* costume availability */}
                <label>Available:</label>
                <input className="checkbox checkbox-input" type="checkbox" name="available"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)} />
              </div>
              <div className="row spacebetween">
                {/* costume image */}
                <label>Reference Image:</label>
                <input type="file" name="referenceImage" accept="image/*"
                  onChange={handleImageChange} />
              </div>

              {/* image preview */}
              {imgPreview && (
                <div className="row spacebetween">
                  <figure>
                    <figcaption>Image Preview:</figcaption>
                    <img src={imgPreview} alt="Image Preview" style={{ width: '250px', height: '250px', objectFit: 'cover' }} />
                  </figure>
                </div>
              )}
              <div className="form-actions row spacebetween">
                <button type="submit">Add Item</button>
                <button onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}

export default AddCostumePopup;