//addVariant.tsx Bobby
// Importing necessary modules and components
//https://www.smashingmagazine.com/2020/03/sortable-tables-react/
import React, { useState, useEffect } from "react";
import "./addFunction.css"; // Importing CSS file for styling
import { useNavigate } from "react-router-dom";
// Importing useNavigate hook for navigation back to dashboard

// Defining VariantItem interface to defone sstructure of the table
interface VariantItem {
  variant_id: number;
  variant_name: string;
  variant_value: string;
}

//defining AddVariant function
const AddVariant: React.FC = () => {
  //Stating variables for inputs (name, value)
  const [variant_name, setVariant_name] = useState<string>("");
  const [variant_value, setVariant_value] = useState<string>("");
  //navigation hook for going back to dashboard
  const navigate = useNavigate();
  //error state for displaying validation errors
  const [error, setError] = useState<string>("");

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
  //function to handle submission of product
  const handleVariant = async () => {
    try {
      //logging inputs to console
      console.log("Variant Name: ", variant_name);
      console.log("Variant Value: ", variant_value);
      //making sure inputs are not empty
      if (variant_name === "" || variant_value === "") {
        //displaying error message if empty inputs
        setError("Please complete the required boxes.");
        return;
      }
      //sending form data to bakcend server
      const response = await fetch("http://127.0.0.1:5000/addVariant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant_name,
          variant_value,
        }),
      });
      //handling server response
      if (!response.ok) {
        const errorMessage = await response.json();
        //set error message if server response is not ok
        setError(errorMessage.message);
      } else {
        await fetchVariant(); // Refresh inventory data
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

  //JSX for adding a new variant
  return (
    <div className="addfunction-table">
      {/* Render add inventory form */}
      <div className="addfunction-container">
        <h1>ADD new variant</h1>
        <div className="addfunction-form">
          <input
            type="text"
            value={variant_name}
            onChange={(e) => setVariant_name(e.target.value)}
            placeholder="Variant Name"
          />
          <input
            type="text"
            value={variant_value}
            onChange={(e) => setVariant_value(e.target.value)}
            placeholder="Variant Value"
          />
          <button onClick={handleVariant}>Submit</button>
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

export default AddVariant;
//exporting AddVariant function
