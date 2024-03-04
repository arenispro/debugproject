//Delete Product.tsx
import React, { useState } from "react";
import "./DeleteProduct.css";

const DeleteProduct: React.FC = () => {
  const [prodcut_id, setProduct_id] = useState<string>("");

  const [error, setError] = useState<string>("");

  const handleDeleteProduct = async () => {
    try {
      console.log("prodcut Id: ", prodcut_id);

      if (prodcut_id === "") {
        setError("Please complete the required boxes.");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/deleteproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prodcut_id,
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
    <div className="delete-product-table">
      <img src="/smart_stock_logo;).png" className="logo" alt="logo" />
      <div className="delete-product-container">
        <h1>Delete Product</h1>
        <div className="delete-product-form">
          <input
            type="text"
            value={prodcut_id}
            onChange={(e) => setProduct_id(e.target.value)}
            placeholder="prodcut ID"
          />

          <button onClick={handleDeleteProduct}>Submit</button>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
