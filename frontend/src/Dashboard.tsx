import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Inventory } from "./components/inventory";
import "./Dashboard.css";

// JUSTIN
const Dashboard: React.FC = () => {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    //https://flask.palletsprojects.com/en/3.0.x/patterns/javascript/
    fetch("http://127.0.0.1:5000/dashboard")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        //Fetch returns a promise that we are using then() on
        return res.json();
      })
      .then((data) => {
        //If the response contains JSON, it can be used with a then() callback chain
        console.log(data);
        setInventory(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []); //This empty array is so that it only first this function once on the initial render and avoid an infinity loop
  // JUSTIN

  // SURAIYA

  const navigate = useNavigate();

  // Navigating the sidebar
  const handleAddProductClick = () => {
    navigate("/addProduct");
  };
  const handleDeleteProductClick = () => {
    navigate("/deleteProduct");
  };
  const handleAddCategoryClick = () => {
    navigate("/addCategory");
  };
  const handleDeleteCategoryClick = () => {
    navigate("/deleteCategory");
  };

  const handleAddInventoryClick = () => {
    navigate("/addInventory");
  };
  const handleUpdateInventoryClick = () => {
    navigate("/updateInventory");
  };
  const handleDeleteInventoryClick = () => {
    navigate("/deleteInventory");
  };

  const handleAddVariantClick = () => {
    navigate("/addVariant");
  };

  const handleDeleteVariantClick = () => {
    navigate("/deleteVariant");
  };
  const handleShowLowStockClick = () => {
    navigate("/showLowStock");
  };

  /*
    Logout is supposed to logout and user should not be able to access the dashboard
    before logging in again, but it's not working very well. (I don't think I'm creating 
    a cookie. Have to look into it.)
    This might help;)
    https://stackoverflow.com/questions/32640090/python-flask-keeping-track-of-user-sessions-how-to-get-session-cookie-id
  */
  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.clear();
        navigate("/");
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    //placeholder just so button brings you to dashboard page
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li>
            <button onClick={handleAddProductClick}>Add Product</button>
          </li>
          <li>
            <button onClick={handleDeleteProductClick}>Delete Product</button>
          </li>
          <li>
            <button onClick={handleAddCategoryClick}>Add Category</button>
          </li>
          <li>
            <button onClick={handleDeleteCategoryClick}>Delete Category</button>
          </li>
          <li>
            <button onClick={handleAddInventoryClick}>Add Inventory</button>
          </li>
          <li>
            <button onClick={handleUpdateInventoryClick}>
              Update Inventory
            </button>
          </li>
          <li>
            <button onClick={handleDeleteInventoryClick}>
              Delete Inventory
            </button>
          </li>
          <li>
            <button onClick={handleAddVariantClick}>Add Variant</button>
          </li>
          <li>
            <button onClick={handleDeleteVariantClick}>Delete Variant</button>
          </li>
          <li>
            <button onClick={handleShowLowStockClick}>Show Low Stock</button>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
            {error && <div className="error-message">{error}</div>}
          </li>
        </ul>
      </div>
      <div className="inventory">
        <h1>Welcome to the Dashboard</h1>
        <Inventory inventory={inventory}></Inventory>
      </div>
    </div>
  );
};

export default Dashboard;
