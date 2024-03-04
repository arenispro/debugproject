import React, { useState } from "react";
import "./Inventory.css";

const Inventory: React.FC = () => {
  const [quantity, setQuantity] = useState<string>("");
  const [minimum, setMinimum] = useState<string>("");
  const [maximum, setMaximum] = useState<string>("");
  const [product_id, setProduct_id] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleInventory = async () => {
    try {
      console.log("Quantity: ", quantity);
      console.log("Minimum: ", minimum);
      console.log("Maximum: ", maximum);
      console.log("Product Id: ", product_id);
      if (
        quantity === "" ||
        minimum === "" ||
        maximum === "" ||
        product_id === ""
      ) {
        setError("Please complete the required boxes.");
        return;
      }
      const response = await fetch("http://127.0.0.1:5000/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          minimum,
          maximum,
          product_id,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="inventory-table">
      <img src="/smart_stock_logo;).png" className="logo" alt="logo" />
      <div className="inventory-container">
        <h1>Inventory</h1>
        <h2>ADD new Inventory</h2>
        <div className="inventory-form">
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />
          <input
            type="text"
            value={minimum}
            onChange={(e) => setMinimum(e.target.value)}
            placeholder="Minimum"
          />
          <input
            type="text"
            value={maximum}
            onChange={(e) => setMaximum(e.target.value)}
            placeholder="Maximum"
          />
          <input
            type="text"
            value={product_id}
            onChange={(e) => setProduct_id(e.target.value)}
            placeholder="Product Id"
          />
          <button onClick={handleInventory}>Submit</button>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
