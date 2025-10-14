import React, { use, useEffect, useState } from "react";

function EditCostumePopup({ costume, onClose, onCostumeUpdated }) {
    const [name, setName] = useState("");
    const [origin, setOrigin] = useState("");
    const [type, setType] = useState("Cloth");
    const [size, setSize] = useState("m");
    const [gender, setGender] = useState("unisex");
    const [price, setPrice] = useState("");
    const [inclusions, setInclusions] = useState("");
    const [available, setAvailable] = useState(true);
    const [newImg, setNewImg] = useState(null);

    const [imgPreview, setImgPreview] = useState(null);

    const resetForm = () => {
        setName("");
        setOrigin("");
        setType("Cloth");
        setSize("m");
        setGender("unisex");
        setPrice("");
        setInclusions("");
        setAvailable(true);
        setNewImg(null);
        setImgPreview(null);
    };

    useEffect(() => {
        if (costume) {
            setName(costume.costume_Name || "");
            setOrigin(costume.costume_Origin || "");
            setType(costume.costume_Type || "Cloth");
            setSize(costume.costume_Size || "MEDIUM");
            setGender(costume.costume_Gender || "Unisex");
            setPrice(costume.costume_Price ? costume.costume_Price.toString() : "");
            setInclusions(costume.costume_Inclusion || "");
            setAvailable(costume.costume_Available === 1);
            setNewImg(null);

            if (costume.costume_Image) {
                setImgPreview(`data:image/jpeg;base64,${costume.costume_Image}`);
            } else {
                setImgPreview(null);
            }
        }

        return () => {
            resetForm();
        }
    }, [costume]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImg(file);
            if (imgPreview && imgPreview.startsWith('blob:')) {
                URL.revokeObjectURL(imgPreview);
            }
            setImgPreview(URL.createObjectURL(file));
        }
    };

    const handleEditCostume = async (e) => {
        e.preventDefault();

        try {
            let arrayBuffer = null;
            if (newImg) {
                arrayBuffer = await newImg.arrayBuffer();
            }

            const updatedCostumeData = {
                id: costume.costume_ID,
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

            const result = await window.electronAPI.editCostume(updatedCostumeData);
            if (result.success) {
                onCostumeUpdated();
                onClose();
            } else {
                alert(`Failed to edit costume: ${result.error}`);
            }
        } catch (error) {
            console.error("Error editing costume:", error);
            alert("An error occurred while editing the costume.");
        }
    }

    if (!costume) {
        return null;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit {costume.costume_Name}</h2>
                <form className="edit-costume-form form" onSubmit={handleEditCostume}>
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
                        <select className="costume-select-input" name="size" required
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
                        <select className="costume-select-input" name="gender" required
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
                    <div className="form-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCostumePopup;