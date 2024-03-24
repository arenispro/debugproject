//addInventory.tsx Bobby

//added another table for product so user can know which product_id to use
// Importing necessary modules and components
//https://www.smashingmagazine.com/2020/03/sortable-tables-react/

import React, { useState, useEffect } from "react";
import "./addFunction.css"; // Importing CSS file for styling
import { useNavigate } from "react-router-dom";
// Importing useNavigate hook for navigation back to dashboard

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

// Defining product interface to defone sstructure of the table
interface ProductItem {
  product_id: number;
  barcode: string;
  product_name: string;
}
//defining Addnventory function
const AddInventory: React.FC = () => {
  //Stating variables for inputs (quantity, minimum, maximum, product_id)
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [minimum, setMinimum] = useState<string>("");
  const [maximum, setMaximum] = useState<string>("");
  const [product_id, setProduct_id] = useState<string>("");
  const navigate = useNavigate(); //navigation hook for going back to dashboard
  //error state for displaying validation errors
  const [error, setError] = useState<string>("");

  // Define inventory state to hold inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  // Define product state to hold product data
  const [product, setProduct] = useState<ProductItem[]>([]);

  //making a toggle button to toggle product table
  const [showProductTable, setShowProductTable] = useState(false);
  // Fetch inventory data when component mounts

  //sorting the table based on column name clicked
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortBy1, setSortBy1] = useState<string | null>(null);
  const [sortDirection1, setSortDirection1] = useState<"asc" | "desc">("asc");

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
  // Fetch product data when component mounts
  useEffect(() => {
    fetchProduct();
  }, []);

  // Function to fetch product data from MySQL
  const fetchProduct = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/product");
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }
      const data = await response.json();

      // Map fetched data to ProductItem interface
      const productItems: ProductItem[] = data.product.map((item: any) => ({
        product_id: item.product_id,
        barcode: item.barcode,
        product_name: item.product_name,
      }));

      console.log("Product Data:", data); // Log fetched data
      setProduct(productItems); // Update inventory state with fetched data
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  //function to handle submission of product
  const handleInventory = async () => {
    try {
      //logging inputs to console
      console.log("Quantity: ", quantity);
      console.log("Price: ", price);
      console.log("Minimum: ", minimum);
      console.log("Maximum: ", maximum);
      console.log("Product Id: ", product_id);
      //making sure inputs are not empty
      if (
        quantity === "" ||
        price === "" ||
        minimum === "" ||
        maximum === "" ||
        product_id === ""
      ) {
        setError("Please complete the required boxes.");
        return;
      }
      //sending form data to bakcend server
      const response = await fetch("http://127.0.0.1:5000/addInventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          price,
          minimum,
          maximum,
          product_id,
        }),
      });
      //handling server response
      if (!response.ok) {
        const errorMessage = await response.json();
        //set error message if server response is not ok
        setError(errorMessage.message);
      } else {
        await fetchInventory(); // Refresh inventory data
      }
    } catch (error) {
      //logging error to console
      console.error("Error:", error);
    }
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
  //the toggles  if ascending or descending making its o it does sort both tablees at once
  const handleSort1 = (columnName1: string) => {
    if (sortBy1 === columnName1) {
      setSortDirection1(sortDirection1 === "asc" ? "desc" : "asc");
    } else {
      setSortBy1(columnName1);
      setSortDirection1("asc");
    }
  };
  const sortedProduct = [...product].sort((a, b) => {
    if (sortBy1) {
      //if sortby has a value
      const aValue = a[sortBy1 as keyof ProductItem];
      const bValue = b[sortBy1 as keyof ProductItem];
      //compares a and b items anr return -1  ascendingd or 1 descendingd
      if (aValue < bValue) return sortDirection1 === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection1 === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  //navigting back to dashboard
  const goBackToDashboard = () => {
    navigate("/dashboard");
  };
  //JSX for adding a new inventory
  return (
    <div className="addfunction-table">
      {/* Render add inventory form */}
      <div className="addfunction-container">
        <h1>ADD new Inventory</h1>
        <div className="addfunction-form">
          <input
            type="number"
            value={product_id}
            onChange={(e) => setProduct_id(e.target.value)}
            placeholder="Product Id"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
          <input
            type="number"
            value={minimum}
            onChange={(e) => setMinimum(e.target.value)}
            placeholder="Minimum"
          />
          <input
            type="number"
            value={maximum}
            onChange={(e) => setMaximum(e.target.value)}
            placeholder="Maximum"
          />
          <button onClick={handleInventory}>Submit</button>
          <button onClick={goBackToDashboard}>Go back to Dashboard</button>
          {error && <div>{error}</div>}

          {/* Toggle buttons for Product and category tables */}
          <div>
            <button onClick={() => setShowProductTable(!showProductTable)}>
              {showProductTable ? "Hide Product Table" : "Show Product Table"}
            </button>
          </div>
        </div>
      </div>
      {/* Render inventory table */}
      <div className="display-container">
        <div className="section-content">
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
      {/* Render Product table if showProductTable is true */}
      {showProductTable && (
        <div className="display-container">
          <div className="section-content">
            <h1>Product Table</h1>
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort1("product_id")}>Product ID</th>
                  <th onClick={() => handleSort1("barcode")}>Barcode</th>
                  <th onClick={() => handleSort1("product_name")}>
                    Product Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProduct.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product_id}</td>
                    <td>{item.barcode}</td>
                    <td>{item.product_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInventory;
//exporting AddInventory function

//exporting UpdateInventory function
//the tofix is to fix the rounding erorr
//166 times 7.99 get 1326.3400000000001
//
