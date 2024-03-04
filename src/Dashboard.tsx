import React, { useState } from "react";
import "./Dashboard.css";
import Product from "./Product"; // Import the Product component
import Category from "./Category"; // Import the Category component
import Inventory from "./Inventory"; // Import the Inventory component
import Variant from "./Variant"; // Import the Variant component

import DeleteProduct from "./DeleteProduct"; // Import the Delete Product component

const Dashboard: React.FC = () => {
  const [isProductTableOpen, setIsProductTableOpen] = useState(false);
  const toggleProductTable = () => {
    setIsProductTableOpen(!isProductTableOpen);
  };

  const [isDeleteProductTableOpen, setIsDeleteProductTableOpen] =
    useState(false);
  const toggleDeleteProductTable = () => {
    setIsDeleteProductTableOpen(!isDeleteProductTableOpen);
  };

  const [isCategoryTableOpen, setIsCategoryTableOpen] = useState(false);
  const toggleCategoryTable = () => {
    setIsCategoryTableOpen(!isCategoryTableOpen);
  };

  const [isInventoryTableOpen, setIsInventoryTableOpen] = useState(false);
  const toggleInventoryTable = () => {
    setIsInventoryTableOpen(!isInventoryTableOpen);
  };

  const [isVariantTableOpen, setIsVariantTableOpen] = useState(false);
  const toggleVariantTable = () => {
    setIsVariantTableOpen(!isVariantTableOpen);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li>
            <button onClick={toggleProductTable}>Add Product</button>
          </li>
          <li>
            <button onClick={toggleDeleteProductTable}>Delete Product</button>
          </li>

          <li>
            <a href="#">Get all Product</a>
          </li>
          <li>
            <a href="#">Manage</a>
          </li>
          <li>
            <button onClick={toggleCategoryTable}>Add Category</button>
          </li>
          <li>
            <a href="#">Delete Category</a>
          </li>
          <li>
            <a href="#">Get all Category</a>
          </li>
          <li>
            <button onClick={toggleInventoryTable}>Add Inventory</button>
          </li>
          <li>
            <a href="#">Delete Inventory</a>
          </li>
          <li>
            <a href="#">Get all Inventory</a>
          </li>
          <li>
            <button onClick={toggleVariantTable}>Add Variant</button>
          </li>
          <li>
            <a href="#">Delete Variant</a>
          </li>
          <li>
            <a href="#">Get all Variant</a>
          </li>
        </ul>
      </div>
      <div className="inventory"></div>

      {isDeleteProductTableOpen && (
        <div className="delete-product-table-popup">
          <DeleteProduct /> {/* Render the Delete Products component */}
          <button onClick={toggleDeleteProductTable}>Close</button>
        </div>
      )}

      {isProductTableOpen && (
        <div className="product-table-popup">
          <Product /> {/* Render the Products component */}
          <button onClick={toggleProductTable}>Close</button>
        </div>
      )}
      {isCategoryTableOpen && (
        <div className="category-table-popup">
          <Category /> {/* Render the Categories component */}
          <button onClick={toggleCategoryTable}>Close</button>
        </div>
      )}
      {isInventoryTableOpen && (
        <div className="inventory-table-popup">
          <Inventory /> {/* Render the Inventories component */}
          <button onClick={toggleInventoryTable}>Close</button>
        </div>
      )}
      {isVariantTableOpen && (
        <div className="variant-table-popup">
          <Variant /> {/* Render the Variants component */}
          <button onClick={toggleVariantTable}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
