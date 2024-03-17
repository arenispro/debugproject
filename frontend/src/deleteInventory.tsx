//Delete Inventory.tsx Nick
/*
DeleteInventory component asks the user to input an inventory ID.
The related inventory will be deleted from database.
*/
/*Bobby created formatting css the dashboard navigate button and the display table for live update on user input into mysql database 
  added a ordering function that allows sorting by clicking on column name*/
//https://www.smashingmagazine.com/2020/03/sortable-tables-react/
import React, { useState, useEffect } from "react";
import "./deleteFunction.css";
import { useNavigate } from "react-router-dom";

// Defining InventoryItem interface to defone sstructure of the table
interface InventoryItem {
  inventory_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  minimum: number;
  maximum: number;
}

const DeleteInventory: React.FC = () => {
  const [inventory_id, setInventory_id] = useState<string>("");
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  // Define inventory state to hold inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  //sorting the table based on column name clicked
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch inventory data when component mounts
  useEffect(() => {
    fetchInventory();
  }, []);

  // Function to fetch inventory data from MySQL
  const fetchInventory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/inventory");
      if (!response.ok) {
        throw new Error("Failed to fetch inventory data");
      }
      const data = await response.json();

      // Map fetched data to InventoryItem interface
      const inventoryItems: InventoryItem[] = data.inventory.map(
        (item: any) => ({
          inventory_id: item.inventory_id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          minimum: item.minimum,
          maximum: item.maximum,
        })
      );

      console.log("Inventory Data:", data); // Log fetched data
      setInventory(inventoryItems); // Update inventory state with fetched data
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleDeleteInventory = async () => {
    try {
      console.log("inventory Id:", inventory_id);

      if (inventory_id === "") {
        setError("Please complete the required boxes.");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/deleteInventory", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory_id,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      } else {
        await fetchInventory(); // Refresh inventory data
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  //the toggles  if ascending or descending
  const handleSort = (columnName: string) => {
    //handling the total_price column
    if (columnName === "total_price") {
      // If sorting by "Total Price"
      const newDirection =
        sortBy === columnName && sortDirection === "asc" ? "desc" : "asc";
      setSortBy(columnName);
      setSortDirection(newDirection);
    } else {
      if (sortBy === columnName) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(columnName);
        setSortDirection("asc");
      }
    }
  };
  //if not toggled the table will first appear as it is from the mysql database
  //copying original table and sorting from largest to smallest or smallet to largest
  const sortedInventory = [...inventory].sort((a, b) => {
    if (sortBy === "total_price") {
      const totalA = a.quantity * a.price;
      const totalB = b.quantity * b.price;
      return sortDirection === "asc" ? totalA - totalB : totalB - totalA;
    } else if (sortBy) {
      //if sortby has a value
      const aValue = a[sortBy as keyof InventoryItem];
      const bValue = b[sortBy as keyof InventoryItem];
      //compares a and b items anr return -1  ascendingd or 1 descendingd
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  return (
    <div className="deletefunction-table">
      <div className="deletefunction-container">
        <h1>Delete Inventory</h1>
        <div className="deletefunction-form">
          <input
            type="number"
            value={inventory_id}
            onChange={(e) => setInventory_id(e.target.value)}
            placeholder="Please enter inventory ID"
          />

          <button onClick={handleDeleteInventory}>Submit</button>
          <button onClick={goBackToDashboard}>Go back to Dashboard</button>
          {error && <div>{error}</div>}
        </div>
      </div>
      {/* Render inventory table */}
      <div className="display-container">
        <h1>Inventory Table</h1>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("inventory_id")}>Inventory ID</th>
              <th onClick={() => handleSort("product_id")}>Product ID</th>
              <th onClick={() => handleSort("product_name")}>Product Name</th>
              <th onClick={() => handleSort("quantity")}>Quantity</th>
              <th onClick={() => handleSort("price")}>$Price$</th>
              <th onClick={() => handleSort("minimum")}>Minimum</th>
              <th onClick={() => handleSort("maximum")}>Maximum</th>
              <th onClick={() => handleSort("total_price")}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {sortedInventory.map((item, index) => (
              <tr key={index}>
                <td>{item.inventory_id}</td>
                <td>{item.product_id}</td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.minimum}</td>
                <td>{item.maximum}</td>
                <td>{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteInventory;
//exporting UpdateInventory function
//the tofix is to fix the rounding erorr
//166 times 7.99 get 1326.3400000000001
//
