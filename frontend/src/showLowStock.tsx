//ShowLowStock.tsx Nick
//ShowLowStock component allows users to view the low stock product information in ascending order
// Import necessary modules and components
import React, { useState, useEffect } from "react";
import "./showLowStock.css"; // Importing CSS file for styling
import { useNavigate } from "react-router-dom";
// Import useNavigate hook for navigation back to dashboard

// Define LowStock interface
interface LowStock {
  product_id: number;
  inventory_quantity: number;
  product_name: string;
  product_barcode: string;
  category_name: string;
  variant_value: string;
}

//defining ShowLowStock function
const ShowLowStock: React.FC = () => {
  //navigation hook for going back to dashboard
  const navigate = useNavigate();

  // Define category state to hold inventory data
  const [lowstock, setLowstock] = useState<LowStock[]>([]);

  //sort the table with ascending or descending order
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch category data when component mounts
  useEffect(() => {
    fetchLowStock();
  }, []);

  // Function to fetch LowStock data from MySQL
  const fetchLowStock = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/showLowStock");
      if (!response.ok) {
        throw new Error("Failed to fetch LowStock data");
      }
      const data = await response.json();

      // Map fetched data to LowStock interface
      const LowStocks: LowStock[] = data.lowstock.map((item: any) => ({
        product_id: item.product_id,
        inventory_quantity: item.inventory_quantity,
        product_barcode: item.product_barcode,
        product_name: item.product_name,
        category_name: item.category_name,
        variant_value: item.variant_value,
      }));

      console.log("Lowstock Data:", data); // Log fetched data
      setLowstock(LowStocks); // Update category state with fetched data
    } catch (error) {
      console.error("Error fetching lowstock:", error);
    }
  };

  //once table head is toggled, the column is sorted in ascending or descending order
  const handleSort = (columnName: string) => {
    if (sortBy === columnName) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnName);
      setSortDirection("asc");
    }
  };

  //create a sorted list of low stock
  const sortedLowStock = [...lowstock].sort((stockA, stockB) => {
    if (sortBy) {
      //if sortby has a value
      const aValue = stockA[sortBy as keyof LowStock];
      const bValue = stockB[sortBy as keyof LowStock];
      //compare the values of stock A & B, return -1 for ascending or 1 for descending
      //otherwise return 0
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  //navigate back to dashboard
  const goBackToDashboard = () => {
    navigate("/dashboard");
  };
  //create a table for low stock products
  //when click on the table head, the table is sorted based on the toggled column
  return (
    <div className="lowstock-container">
      <h1>Low Stock Table</h1>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("product_id")}>Product ID</th>
            <th onClick={() => handleSort("inventory_quantity")}>Quantity</th>
            <th onClick={() => handleSort("product_name")}>Product Name</th>
            <th onClick={() => handleSort("product_barcode")}>
              Product Barcode
            </th>
            <th onClick={() => handleSort("category_name")}>Category Name</th>
            <th onClick={() => handleSort("variant_value")}>Variant Value</th>
          </tr>
        </thead>
        <tbody>
          {sortedLowStock.map((item, index) => (
            <tr key={index}>
              <td>{item.product_id}</td>
              <td>
                {typeof item.inventory_quantity == "number"
                  ? item.inventory_quantity
                  : "0"}
              </td>
              <td>{item.product_name}</td>
              <td>{item.product_barcode}</td>
              <td>{item.category_name}</td>
              <td>{item.variant_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={goBackToDashboard}>Go back to Dashboard</button>
    </div>
  );
};

export default ShowLowStock;
//exporting ShowLowStock function
