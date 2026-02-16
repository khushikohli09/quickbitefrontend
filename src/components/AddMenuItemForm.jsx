// src/components/AddMenuItemForm.jsx
import React, { useState, useEffect } from "react";
import "../styles/AddMenuItemForm.css";

const AddMenuItemForm = ({ restaurantId, editItem, onMenuItemAdded, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  // Populate form if editing
  useEffect(() => {
    if (editItem) {
      setName(editItem.name || "");
      setDescription(editItem.description || "");
      setPrice(editItem.price || "");
      setImage(editItem.image || "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
    }
  }, [editItem]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Please provide name and price");
      return;
    }

    // Prepare item data to send to parent
    const itemData = {
      restaurantId,
      name,
      description,
      price: parseFloat(price),
      image,
      id: editItem?.id, // for edit mode
    };

    onMenuItemAdded(itemData);

    // Clear form
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-menu-item-form">
      <h3>{editItem ? "Edit Menu Item" : "Add New Menu Item"}</h3>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <div className="form-buttons">
        <button type="submit">
          {editItem ? "Update Item" : "Add Item"}
        </button>
        {editItem && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddMenuItemForm;
