//Delete Variant.tsx Nick
/*
DeleteVariant component asks the user to input a variant ID.
The related variant will be deleted from database.
*/
/*Bobby created formatting css the dashboard navigate button and the display table for live update on user input into mysql database 
  added a ordering function that allows sorting by clicking on column name*/
//https://www.smashingmagazine.com/2020/03/sortable-tables-react/
import React, { useState, useEffect } from "react";
import "./deleteFunction.css";
import { useNavigate } from "react-router-dom";

// Defining VariantItem interface to defone sstructure of the table
interface VariantItem {
  variant_id: number;
  variant_name: string;
  variant_value: string;
}

const DeleteVariant: React.FC = () => {
  const [variant_id, setVariant_id] = useState<string>("");

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Define variant state to hold variant data
  const [variant, setVariant] = useState<VariantItem[]>([]);

  //sorting the table based on column name clicked
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch variant data when component mounts
  useEffect(() => {
    fetchVariant();
  }, []);

  // Function to fetch variant data from MySQL
  const fetchVariant = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/variant");
      if (!response.ok) {
        throw new Error("Failed to fetch variant data");
      }
      const data = await response.json();

      // Map fetched data to variantItem interface
      const variantItems: VariantItem[] = data.variant.map((item: any) => ({
        variant_id: item.variant_id,
        variant_name: item.variant_name,
        variant_value: item.variant_value,
      }));

      console.log("variant Data:", data); // Log fetched data
      setVariant(variantItems); // Update variant state with fetched data
    } catch (error) {
      console.error("Error fetching variant:", error);
    }
  };

  const handleDeletevariant = async () => {
    try {
      console.log("variant Id:", variant_id);

      if (variant_id === "") {
        setError("Please complete the required boxes.");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/deleteVariant", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant_id,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      } else {
        await fetchVariant(); // Refresh inventory data
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
    if (sortBy === columnName) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnName);
      setSortDirection("asc");
    }
  };
  //if not toggled the table will first appear as it is from the mysql database
  //copying original table and sorting from largest to smallest or smallet to largest
  const sortedVariant = [...variant].sort((a, b) => {
    if (sortBy) {
      //if sortby has a value
      const aValue = a[sortBy as keyof VariantItem];
      const bValue = b[sortBy as keyof VariantItem];
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
        <h1>Delete Variant</h1>
        <div className="deletefunction-form">
          <input
            type="number"
            value={variant_id}
            onChange={(e) => setVariant_id(e.target.value)}
            placeholder="Please enter variant ID"
          />

          <button onClick={handleDeletevariant}>Submit</button>
          <button onClick={goBackToDashboard}>Go back to Dashboard</button>
          {error && <div>{error}</div>}
        </div>
      </div>
      {/* Render variant table */}
      <div className="display-container">
        <div className="section-content">
          <h1>Variant Table</h1>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("variant_id")}>Variant Id</th>
                <th onClick={() => handleSort("variant_name")}>Variant Name</th>
                <th onClick={() => handleSort("variant_value")}>
                  Variant Value
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVariant.map((item, index) => (
                <tr key={index}>
                  <td>{item.variant_id}</td>
                  <td>{item.variant_name}</td>
                  <td>{item.variant_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeleteVariant;
