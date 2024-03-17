//addCategory.tsx Bobby
// Importing necessary modules and components

//https://www.smashingmagazine.com/2020/03/sortable-tables-react/
import React, { useState, useEffect } from "react";
import "./addFunction.css"; // Importing CSS file for styling
import { useNavigate } from "react-router-dom";
// Importing useNavigate hook for navigation back to dashboard

// Defining CategoryItem interface to defone sstructure of the table
interface CategoryItem {
  category_id: number;
  category_name: string;
  category_description: string;
}

//defining AddCategory function
const AddCategory: React.FC = () => {
  //Stating variables for inputs (name, description)
  const [category_name, setCategory_name] = useState<string>("");
  const [category_description, setCategory_description] = useState<string>("");

  //navigation hook for going back to dashboard
  const navigate = useNavigate();
  //error state for displaying validation errors
  const [error, setError] = useState<string>("");

  // Define category state to hold inventory data
  const [category, setCategory] = useState<CategoryItem[]>([]);

  //sorting the table based on column name clicked
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch category data when component mounts
  useEffect(() => {
    fetchCategory();
  }, []);

  // Function to fetch Category data from MySQL
  const fetchCategory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/category");
      if (!response.ok) {
        throw new Error("Failed to fetch category data");
      }
      const data = await response.json();

      // Map fetched data to CategoryItem interface
      const categoryItems: CategoryItem[] = data.category.map((item: any) => ({
        category_id: item.category_id,
        category_name: item.category_name,
        category_description: item.category_description,
      }));

      console.log("Category Data:", data); // Log fetched data
      setCategory(categoryItems); // Update category state with fetched data
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  //function to handle submission of category
  const handleCategory = async () => {
    try {
      //logging inputs to console
      console.log("Category Name: ", category_name);
      console.log("Category Description: ", category_description);
      //making sure inputs are not empty
      if (category_name === "" || category_description === "") {
        //displaying error message if empty inputs
        setError("Please complete the required boxes.");
        return;
      }
      //sending form data to bakcend server
      const response = await fetch("http://127.0.0.1:5000/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_name,
          category_description,
        }),
      });
      //handling server response
      if (!response.ok) {
        const errorMessage = await response.json();
        //set error message if server response is not ok
        setError(errorMessage.message);
      } else {
        await fetchCategory(); // Refresh category data
      }
    } catch (error) {
      //logging error to console
      console.error("Error:", error);
    }
  };
  //navigate back to dashboard
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
  const sortedCategory = [...category].sort((a, b) => {
    if (sortBy) {
      //if sortby has a value
      const aValue = a[sortBy as keyof CategoryItem];
      const bValue = b[sortBy as keyof CategoryItem];
      //compares a and b items anr return -1  ascendingd or 1 descendingd
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  //JSX for adding a new category
  return (
    <div className="addfunction-table">
      {/* Render add inventory form */}
      <div className="addfunction-container">
        <h1>ADD New Category</h1>
        <div className="addfunction-form">
          <input
            type="text"
            value={category_name}
            onChange={(e) => setCategory_name(e.target.value)}
            placeholder="Category Name"
          />
          <input
            type="text"
            value={category_description}
            onChange={(e) => setCategory_description(e.target.value)}
            placeholder="Category Description"
          />
          <button onClick={handleCategory}>Add Category</button>
          <button onClick={goBackToDashboard}>Go back to Dashboard</button>
          {error && <div>{error}</div>}
        </div>
      </div>
      {/* Render category table */}
      <div className="display-container">
        <h1>Category Table</h1>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("category_id")}>Category Id</th>
              <th onClick={() => handleSort("category_name")}>Category Name</th>
              <th onClick={() => handleSort("category_description")}>
                Category Description
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCategory.map((item, index) => (
              <tr key={index}>
                <td>{item.category_id}</td>
                <td>{item.category_name}</td>
                <td>{item.category_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddCategory;
//exporting AddCategory function
