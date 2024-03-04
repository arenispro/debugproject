// Product.tsx
import React, { useState } from "react";
import "./Product.css";

const Product: React.FC = () => {
  const [barcode, setBarcode] = useState<string>("");
  const [product_name, setProduct_name] = useState<string>("");
  const [product_description, setProduct_description] = useState<string>("");
  const [product_category, setProduct_category] = useState<string>("");
  const [variant_id, setVariant_id] = useState<string>("");

  const [error, setError] = useState<string>("");

  const handleProduct = async () => {
    try {
      console.log("Barcode: ", barcode);
      console.log("Product Name: ", product_name);
      console.log("Product Description: ", product_description);
      console.log("Product Category: ", product_category);
      console.log("Variant Id: ", variant_id);

      if (
        barcode === "" ||
        product_name === "" ||
        product_description === "" ||
        product_category === "" ||
        variant_id === ""
      ) {
        setError("Please complete the required boxes.");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcode,
          product_name,
          product_description,
          product_category,
          variant_id,
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
    <div className="product-table">
      <img src="/smart_stock_logo;).png" className="logo" alt="logo" />
      <div className="product-container">
        <h1>Product</h1>
        <h2>ADD New Product</h2>
        <div className="product-form">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Barcode"
          />
          <input
            type="text"
            value={product_name}
            onChange={(e) => setProduct_name(e.target.value)}
            placeholder="Product Name"
          />
          <input
            type="text"
            value={product_description}
            onChange={(e) => setProduct_description(e.target.value)}
            placeholder="Product Description"
          />
          <input
            type="text"
            value={product_category}
            onChange={(e) => setProduct_category(e.target.value)}
            placeholder="Product Category"
          />
          <input
            type="text"
            value={variant_id}
            onChange={(e) => setVariant_id(e.target.value)}
            placeholder="Variant Id"
          />

          <button onClick={handleProduct}>Submit</button>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Product;
