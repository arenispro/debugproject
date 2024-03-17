//updateInventory.tsx Bobby
// Importing necessary modules and components
//https://www.smashingmagazine.com/2020/03/sortable-tables-react/
import React, { useState, useEffect } from "react";
import "./updateFunction.css"; // Importing CSS file for styling
import { useNavigate } from "react-router-dom";
// Importing useNavigate hook for navigation back to dashboard

// Defining InventoryItem interface to defone sstructure of the table
interface InventoryItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  minimum: number;
  maximum: number;
}
//defining Addnventory function
//basically you input product id and youre allowed to update either quantity minimum or maximum  with one of the three buttons
const UpdateInventory: React.FC = () => {
  //Stating variables for inputs (quantity, minimum, maximum, product_id)
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [minimum, setMinimum] = useState<string>("");
  const [maximum, setMaximum] = useState<string>("");
  const [product_id, setProduct_id] = useState<string>("");

  const navigate = useNavigate(); //navigation hook for going back to dashboard
  //error state for displaying validation errors
  const [error1, setError1] = useState<string>("");
  const [error2, setError2] = useState<string>("");
  const [error3, setError3] = useState<string>("");
  const [error4, setError4] = useState<string>("");

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

  //function to handle quantity update
  const handleQuantity = async () => {
    try {
      //logging inputs to console
      console.log("Quantity: ", quantity);
      console.log("Product Id: ", product_id);
      //making sure inputs are not empty
      if (product_id === "" || quantity === "") {
        setError1("Product Id and quantity needed.");
        return;
      }
      //sending form data to backend server
      const response = await fetch("http://127.0.0.1:5000/updateInventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          product_id,
        }),
      });
      //handling server response
      if (!response.ok) {
        const errorMessage = await response.json();
        //set error message if server response is not ok
        setError1(errorMessage.message);
      } else {
        await fetchInventory(); // Refresh inventory data
      }
    } catch (error) {
      //logging error to console
      console.error("Error:", error);
    }
  };
  //handle to handle price update
  const handlePrice = async () => {
    try {
      //logging inputs to console
      console.log("Price: ", price);
      console.log("Product Id: ", product_id);
      //making sure inputs are not empty
      if (product_id === "" || price === "") {
        setError4("Product Id and price needed.");
        return;
      }
      //sending form data to backend server
      const response = await fetch("http://127.0.0.1:5000/updateInventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price,
          product_id,
        }),
      });
      //handling server response
      if (!response.ok) {
        const errorMessage = await response.json();
        //set error message if server response is not ok
        setError4(errorMessage.message);
      } else {
        await fetchInventory(); // Refresh inventory data
      }
    } catch (error) {
      //logging error to console
      console.error("Error:", error);
    }
  };
  //handle to handle minimum update
  const handleMinimum = async () => {
    try {
      //logging inputs to console
      console.log("Minimum: ", minimum);
      console.log("Product Id: ", product_id);
      //making sure inputs are not empty
      if (product_id === "" || minimum === "") {
        setError2("Product Id and minimum need.");
        return;
      }
      //sending form data to bakcend server
      const response = await fetch("http://127.0.0.1:5000/updateInventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minimum,
          product_id,
        }),
      });
      //handling server response
      if (!response.ok) {
        const errorMessage = await response.json();
        //set error message if server response is not ok
        setError2(errorMessage.message);
      } else {
        await fetchInventory(); // Refresh inventory data
      }
    } catch (error) {
      //logging error to console
      console.error("Error:", error);
    }
  };
  //HANDLE TO UPDATE MAXIMUM
  const handleMaximum = async () => {
    try {
      //logging inputs to console
      console.log("Maximum: ", maximum);
      console.log("Product Id: ", product_id);
      //making sure inputs are not empty
      if (product_id === "" || maximum === "") {
        setError3("Product Id and maximum needed.");
        return;
      }
      //sending form data to bakcend server
      const response = await fetch("http://127.0.0.1:5000/updateInventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maximum,
          product_id,
        }),
      });
      //handling server response
      if (!response.ok) {
        const errorMessage = await response.json();
        //set error message if server response is not ok
        setError3(errorMessage.message);
      } else {
        await fetchInventory(); // Refresh inventory data
      }
    } catch (error) {
      //logging error to console
      console.error("Error:", error);
    }
  };

  //navigting back to dashboard
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

  //JSX for adding a new inventory
  return (
    <div className="updatefunction-table">
      {/* Render update form */}
      <div className="updatefunction-container">
        <h1>Update new Inventory</h1>
        <div className="updatefunction-form">
          <h3>Product ID</h3>
          <input
            type="number"
            value={product_id}
            onChange={(e) => setProduct_id(e.target.value)}
            placeholder="Product Id"
          />
          <div />
          <h3>Quantity</h3>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />
          <button onClick={handleQuantity}>Update Quantity</button>
          {error1 && <div>{error1}</div>}
          <h3>Price</h3>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
          <button onClick={handlePrice}>Update Price</button>
          {error4 && <div>{error4}</div>}
          <h3>Minimum</h3>
          <input
            type="number"
            value={minimum}
            onChange={(e) => setMinimum(e.target.value)}
            placeholder="Minimum"
          />
          <button onClick={handleMinimum}>Update Minimum</button>
          {error2 && <div>{error2}</div>}
          <h3>Maximum</h3>
          <input
            type="number"
            value={maximum}
            onChange={(e) => setMaximum(e.target.value)}
            placeholder="Maximum"
          />
          <button onClick={handleMaximum}>Update Maximum</button>
          {error3 && <div>{error3}</div>}
          <button onClick={goBackToDashboard}>Go back to Dashboard</button>
        </div>
      </div>
      {/* Render inventory table */}
      <div className="display-container">
        <h1>Inventory Table</h1>
        <table>
          <thead>
            <tr>
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

export default UpdateInventory;
//exporting UpdateInventory function
//the tofix is to fix the rounding erorr
//166 times 7.99 get 1326.3400000000001
//
