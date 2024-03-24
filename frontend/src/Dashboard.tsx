import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Inventory1 } from "./components/inventory1";

import FetchInventoryData from "./components/FetchInventoryData";
import ShowLowStock from "./components/showLowStock";
import "./Dashboard.css";
// JUSTIN
interface InventoryItem1 {
  inventory_id: number;
  productName: string;
  productDescription: number;
  quantity: number;
  role: string;
}

const Dashboard: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [permission, setPermission] = useState<string>(""); //For Roles
  const [inventoryItems1, setinventoryItems1] = useState<InventoryItem1[]>([]);
  const [quantity, setQuantity] = useState<number[]>([]);

  useEffect(() => {
    //https://flask.palletsprojects.com/en/3.0.x/patterns/javascript/
    /*
    The new implementation requires me to comment this whole part out to check
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
        setPermission(data[0].roles);
        console.log(data);
        setInventory(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
      */
    dashboardData();
  }, []); //This empty array is so that it only first this function once on the initial render and avoid an infinity loop

  //New Implementation of Dashboard
  const dashboardData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/fetch_inventory");
      if (!response.ok) {
        throw new Error("Failed to fetch inventory data");
      }
      const data = await response.json();

      const mappedInventory = data.map(
        (eachData: {
          inventory_id: number;
          product_name: string;
          product_description: string;
          quantity: number;
          roles: string;
        }) => {
          const item = {
            inventory_id: eachData.inventory_id,
            productName: eachData.product_name,
            productDescription: eachData.product_description,
            quantity: eachData.quantity,
            roles: eachData.roles, //The role was missing and got me stuck for hours trying to debugg
          };
          return item;
        }
      );

      console.log("Inventory Data:", data); // Log fetched data
      console.log("Mapped inventory data: ", mappedInventory);
      setPermission(data[0].roles);
      setinventoryItems1(mappedInventory);
      setQuantity(data.map((inv: { quantity: any }) => inv.quantity));
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };
  // JUSTIN

  // SURAIYA

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/"); // Redirect to login page if not logged in
    }
  }, [navigate]);

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

  const handleFilter = () => {
    navigate("/filter_page");
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        //localStorage.clear();
        localStorage.removeItem("isLoggedIn");
        navigate("/");
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // New Area to try to implement the Order Features
  //Attempting to create a handler for the order button here
  const handleOrder = (event: any) => {
    //const quantityList = inventory[0].quantity
    //Trying to map now that I added the type to the useState for inventory
    //setQuantity(inventory.map(inv => inv.quantity))

    /*
    ----------------------     PLAN     -------------------------------
    The serious work to be done here would be to check that the product actually exist
    handle the case where it does not exist on our table
    then find that particular product
    then alter its quantity by adding or removing the entered quantity from the existing quantity
    */
    event.preventDefault();
    const location = retreiveProduct(orderProduct) - 1;
    const alteredQuantity = [...quantity];
    alteredQuantity[location] = alteredQuantity[location] + +orderQuantity; // This extra (+ ..)was needed
    //or else, It was concatenating source: https://stackoverflow.com/questions/46442292/typescript-array-sum-instead-concatenation
    setQuantity(alteredQuantity);
    //console.log('Order button clicked', quantity)
    console.log("Altered Quantity from Submit", alteredQuantity);
    //alert(`Button clicked ${inventory[0]}`);
  };

  //handle the changes in the inputs for orders
  //handle the product name change
  const [orderProduct, setOrderProduct] = useState<string>("product name");
  const handleProductChange = (event: any) => {
    //console.log(event.target.value)
    setOrderProduct(event.target.value);
  };

  //handle the product name change
  const [orderQuantity, setOrderQuantity] = useState<number>(0);
  const handleQuantityChange = (event: any) => {
    //console.log(event.target.value)
    setOrderQuantity(event.target.value);
  };

  //Handle the Buy and Sell Clicks
  const handleBuy = (event: any) => {
    event.preventDefault();
    //retreiveProduct(orderProduct)
    if (retreiveProduct(orderProduct) === -1) {
      alert("That item does not exist in our inventory");
    } else {
      console.log("Order to buy ", orderQuantity, "Pieces of ", orderProduct);
      const location = retreiveProduct(orderProduct) - 1;
      const alteredInventoryItems = [...inventoryItems1];
      alteredInventoryItems[location].quantity =
        alteredInventoryItems[location].quantity + +orderQuantity;
      setinventoryItems1(alteredInventoryItems);
    }
  };

  const handleSell = (event: any) => {
    event.preventDefault();
    if (retreiveProduct(orderProduct) === -1) {
      alert("That item does not exist in our inventory");
    } else {
      console.log(
        "Attempting to sell ",
        orderQuantity,
        " pieces of ",
        orderProduct
      );
      const location = retreiveProduct(orderProduct) - 1;
      const alteredInventoryItems = [...inventoryItems1];
      alteredInventoryItems[location].quantity =
        alteredInventoryItems[location].quantity - +orderQuantity;
      setinventoryItems1(alteredInventoryItems);
    }
  };
  //Given a product Name and Assuming it exists, the following function should be able to return its index
  const retreiveProduct = (name: string) => {
    let index = -1; //if the item is not in the table this function would return -1
    for (var i = 0; i < inventoryItems1.length; i++) {
      if (name === inventoryItems1[i].productName) {
        console.log(
          "Match found: ",
          name,
          "at location",
          inventoryItems1[i].inventory_id
        );
        index = inventoryItems1[i].inventory_id;
        return index;
      }
    }
    return index;
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
            <button
              onClick={handleDeleteProductClick}
              disabled={permission === "worker"}
            >
              Delete Product
            </button>
          </li>
          <li>
            <button onClick={handleAddCategoryClick}>Add Category</button>
          </li>
          <li>
            <button
              onClick={handleDeleteCategoryClick}
              disabled={permission === "worker"}
            >
              Delete Category
            </button>
          </li>
          <li>
            <button
              onClick={handleAddInventoryClick}
              disabled={permission === "worker"}
            >
              Add Inventory
            </button>
          </li>
          <li>
            <button
              onClick={handleUpdateInventoryClick}
              disabled={permission === "worker" || permission === "manager"}
            >
              Update Inventory
            </button>
          </li>
          <li>
            <button
              onClick={handleDeleteInventoryClick}
              disabled={permission === "worker" || permission === "manager"}
            >
              Delete Inventory
            </button>
          </li>
          <li>
            <button onClick={handleAddVariantClick}>Add Variant</button>
          </li>
          <li>
            <button
              onClick={handleDeleteVariantClick}
              disabled={permission === "worker"}
            >
              Delete Variant
            </button>
          </li>
          <li>
            <button onClick={handleFilter}>Filter</button>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
            {error && <div className="error-message">{error}</div>}
          </li>
        </ul>
      </div>
      <div className="inventory">
        <h1>Welcome to the Dashboard</h1>

        <div className="dashboard-section">
          <div className="section-content">
            <FetchInventoryData />
          </div>
          <Inventory1 inventory1={inventoryItems1}></Inventory1>
          <form onSubmit={handleOrder}>
            <input value={orderProduct} onChange={handleProductChange}></input>
            <input
              value={orderQuantity}
              onChange={handleQuantityChange}
            ></input>
            <button onClick={handleBuy}>Buy</button>
            <button onClick={handleSell}>Sell</button>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="dashboard-section">
          <div className="section-content">
            <ShowLowStock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
