import React, { useEffect, useState } from "react";

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

  const [imgPreview, setImgPreview] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const resetForm = () => {
    setName("");
    setOrigin("");
    setType("cloth");
    setSize("m");
    setGender("unisex");
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
        alert(`Costume added with ID: ${result.lastID}`);
        setShowPopup(false);
        resetForm();
      } else {
        alert(`Failed to add costume: ${result.error}`);
      }
    } catch (error) {
      console.error("Error adding costume:", error);
      alert("An error occurred while adding the costume.");
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
                <input className="costume-text-input" type="text" name="costumeName" required
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* costume origin */}
                <label>Costume Origin:</label>
                <input className="costume-text-input" type="text" name="costumeOrigin" required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* costume type */}
                <label>Costume Type:</label>
                <select className="costume-select-input" name="costumeType" required
                  value={type}
                  onChange={(e) => setType(e.target.value)}>
                  <option value="cloth">Cloth</option>
                  <option value="armor">Armor</option>
                  <option value="singleItem">Single Item</option>
                  <option value="other">Other</option>
                  <option value="none">Not Applicable</option>
                </select>
              </div>
              <div className="row spacebetween">
                {/* costume size */}
                <label>Size:</label>
                <select className="costume-select-input" name="size" required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}>
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
                {/* costume gender */}
                <label>Gender:</label>
                <select className="costume-select-input" name="gender" required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                  <option value="none">Not Applicable</option>
                </select>
              </div>
              <div className="row spacebetween">
                {/* costume price */}
                <label>Price:</label>
                <input className="costume-text-input" type="number" name="price" min="0" step="0.01" required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* costume inclusions */}
                <label>Inclusions:</label>
                <input className="costume-text-input" type="text" name="inclusions"
                  value={inclusions}
                  onChange={(e) => setInclusions(e.target.value)} />
              </div>
              <div className="row spacebetween">
                {/* costume availability */}
                <label>Available:</label>
                <input className="checkbox" type="checkbox" name="available"
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
                    <img src={imgPreview} alt="Image Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </figure>
                </div>
              )}
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