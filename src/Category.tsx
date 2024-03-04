import React, { useState } from "react";
import "./Category.css";

const Category: React.FC = () => {
  const [category_name, setCategory_name] = useState<string>("");
  const [category_description, setCategory_description] = useState<string>("");

  const [error, setError] = useState<string>("");
  const handleCategory = async () => {
    try {
      console.log("Category Name: ", category_name);
      console.log("Category Description: ", category_description);

      if (category_name === "" || category_description === "") {
        setError("Please complete the required boxes.");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_name,
          category_description,
        }),
      });

      if (response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="category-table">
      <img src="/smart_stock_logo;).png" className="logo" alt="logo" />
      <div className="category-container">
        <h1>Category</h1>
        <h2>ADD New Category</h2>
        <div className="category-form">
          <input
            type="text"
            placeholder="Category Name"
            value={category_name}
            onChange={(e) => setCategory_name(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category Description"
            value={category_description}
            onChange={(e) => setCategory_description(e.target.value)}
          />
          <button onClick={handleCategory}>Add Category</button>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Category;
