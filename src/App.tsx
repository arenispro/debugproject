import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";
import Registration from "./Registration";
import AddProduct from "./addProduct"; // Import the Product component
import AddCategory from "./addCategory"; // Import the Category component
import AddInventory from "./addInventory"; // Import the Inventory component
import AddVariant from "./addVariant"; // Import the Variant component
import UpdateInventory from "./updateInventory"; // Import the Inventory component
import DeleteProduct from "./deleteProduct";
import DeleteVariant from "./deleteVariant";
import DeleteInventory from "./deleteInventory";
import DeleteCategory from "./deleteCategory";
import ShowLowStock from "./showLowStock"; //Import ShowLowStock component
//import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/deleteProduct" element={<DeleteProduct />} />
        <Route path="/addCategory" element={<AddCategory />} />
        <Route path="/deleteCategory" element={<DeleteCategory />} />
        <Route path="/addInventory" element={<AddInventory />} />
        <Route path="/updateInventory" element={<UpdateInventory />} />
        <Route path="/deleteInventory" element={<DeleteInventory />} />
        <Route path="/addVariant" element={<AddVariant />} />
        <Route path="/deleteVariant" element={<DeleteVariant />} />
        <Route path="/showLowStock" element={<ShowLowStock />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Router>
  );
};

export default App;
