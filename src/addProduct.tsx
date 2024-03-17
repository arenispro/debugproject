// addProduct.tsx Bobby
//changelog i added the table and decided to add another two tables so user can know what the values for category and variant means
//i decided to comment out 3 columns for the product table because it wasnt needed
//when adding variant and category table made it toggable with buttons//https://www.smashingmagazine.com/2020/03/sortable-tables-react/
// Importing necessary modules and components
import React, { useState, useEffect } from "react";
import "./addFunction.css"; // Importing CSS file for styling
import { useNavigate } from "react-router-dom";
// Importing useNavigate hook for navigation back to dashboard

// Defining product interface to defone sstructure of the table
interface ProductItem {
  product_id: number;
  barcode: string;
  product_name: string;
  product_description: string;
  //product_category: number;
  category_name: string;
  //variant_id: number;
  //variant_name: string;
  variant_value: string;
}
//defining AddVariant function
interface VariantItem {
  variant_id: number;
  variant_name: string;
  variant_value: string;
}

// Defining CategoryItem interface to defone sstructure of the table
interface CategoryItem {
  category_id: number;
  category_name: string;
  category_description: string;
}

//defining AddProduct function
const AddProduct: React.FC = () => {
  //Stating variables for inputs (barcode, name, description, category, variant)
  const [barcode, setBarcode] = useState<string>("");
  const [product_name, setProduct_name] = useState<string>("");
  const [product_description, setProduct_description] = useState<string>("");
  const [product_category, setProduct_category] = useState<string>("");
  const [variant_id, setVariant_id] = useState<string>("");
  //navigation hook for going back to dashboard
  const navigate = useNavigate();
  //error state for displaying validation errors
  const [error, setError] = useState<string>("");

  // Define product state to hold product data
  const [product, setProduct] = useState<ProductItem[]>([]);
  // Define variant state to hold variant data
  const [variant, setVariant] = useState<VariantItem[]>([]);
  // Define category state to hold inventory data
  const [category, setCategory] = useState<CategoryItem[]>([]);
  //making buttons to toggle table if not needed
  const [showVariantTable, setShowVariantTable] = useState(false);
  const [showCategoryTable, setShowCategoryTable] = useState(false);

  //sorting the table based on column name clicked
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  //this is to prevent all tables being sorted at once
  const [sortBy1, setSortBy1] = useState<string | null>(null);
  const [sortDirection1, setSortDirection1] = useState<"asc" | "desc">("asc");
  const [sortBy2, setSortBy2] = useState<string | null>(null);
  const [sortDirection2, setSortDirection2] = useState<"asc" | "desc">("asc");

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
        product_description: item.product_description,
        //product_category: item.product_category,
        category_name: item.category_name,
        //variant_id: item.variant_id,
        //variant_name: item.variant_name,
        variant_value: item.variant_value,
      }));

      console.log("Product Data:", data); // Log fetched data
      setProduct(productItems); // Update inventory state with fetched data
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

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

  // Fetch variant data when component mounts
  useEffect(() => {
    fetchVariant();
  }, []);

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

  //function to handle submission of product
  const handleProduct = async () => {
    try {
      //logging inputs to console
      console.log("Barcode: ", barcode);
      console.log("Product Name: ", product_name);
      console.log("Product Description: ", product_description);
      console.log("Product Category: ", product_category);
      console.log("Variant Id: ", variant_id);
      //making sure inputs are not empty
      if (
        barcode === "" ||
        product_name === "" ||
        product_description === "" ||
        product_category === "" ||
        variant_id === ""
      ) {
        //displaying error message if empty inputs
        setError("Please complete the required boxes.");
        return;
      }
      //sending form data to bakcend server
      const response = await fetch("http://127.0.0.1:5000/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcode,
          product_name,
          product_description,
          product_category,
          variant_id,
        }),
      });
      //handling server response
      if (!response.ok) {
        const errorMessage = await response.json();
        //set error message if server response is not ok
        setError(errorMessage.message);
      } else {
        await fetchProduct(); // Refresh product data
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
  const sortedProduct = [...product].sort((a, b) => {
    if (sortBy) {
      //if sortby has a value
      const aValue = a[sortBy as keyof ProductItem];
      const bValue = b[sortBy as keyof ProductItem];
      //compares a and b items anr return -1  ascendingd or 1 descendingd
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });
  //the toggles  if ascending or descending
  const handleSort1 = (columnName1: string) => {
    if (sortBy1 === columnName1) {
      setSortDirection1(sortDirection1 === "asc" ? "desc" : "asc");
    } else {
      setSortBy1(columnName1);
      setSortDirection1("asc");
    }
  };
  //table 2
  const sortedVariant = [...variant].sort((a, b) => {
    if (sortBy1) {
      //if sortby has a value
      const aValue = a[sortBy1 as keyof VariantItem];
      const bValue = b[sortBy1 as keyof VariantItem];
      //compares a and b items anr return -1  ascendingd or 1 descendingd
      if (aValue < bValue) return sortDirection1 === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection1 === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  //the toggles  if ascending or descending
  const handleSort2 = (columnName2: string) => {
    if (sortBy2 === columnName2) {
      setSortDirection2(sortDirection2 === "asc" ? "desc" : "asc");
    } else {
      setSortBy2(columnName2);
      setSortDirection2("asc");
    }
  };
  //table 3
  const sortedCategory = [...category].sort((a, b) => {
    if (sortBy2) {
      //if sortby has a value
      const aValue = a[sortBy2 as keyof CategoryItem];
      const bValue = b[sortBy2 as keyof CategoryItem];
      //compares a and b items anr return -1  ascendingd or 1 descendingd
      if (aValue < bValue) return sortDirection2 === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection2 === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  //JSX for adding a new product
  return (
    <div className="addfunction-table">
      {/* Render add product form */}
      <div className="addfunction-container">
        <h1>ADD New Product</h1>
        <div className="addfunction-form">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Barcode"
          />
          <input
            type="text"
            value={product_name}
            onChange={(e) => setProduct_name(e.target.value)}
            placeholder="Product Name"
          />
          <input
            type="text"
            value={product_description}
            onChange={(e) => setProduct_description(e.target.value)}
            placeholder="Product Description"
          />
          <input
            type="number"
            value={product_category}
            onChange={(e) => setProduct_category(e.target.value)}
            placeholder="Product Category"
          />
          <input
            type="number"
            value={variant_id}
            onChange={(e) => setVariant_id(e.target.value)}
            placeholder="Variant Id"
          />
          <button onClick={handleProduct}>Submit</button>
          <button onClick={goBackToDashboard}>Go back to Dashboard</button>
          {error && <div>{error}</div>}

          {/* Toggle buttons for variant and category tables */}
          <div>
            <button onClick={() => setShowVariantTable(!showVariantTable)}>
              {showVariantTable ? "Hide Variant Table" : "Show Variant Table"}
            </button>
            <button onClick={() => setShowCategoryTable(!showCategoryTable)}>
              {showCategoryTable
                ? "Hide Category Table"
                : "Show Category Table"}
            </button>
          </div>
        </div>
      </div>
      {/* Render product table */}
      <div className="display-container">
        <h1>Product Table</h1>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("product_id")}>Product ID</th>
              <th onClick={() => handleSort("barcode")}>Barcode</th>
              <th onClick={() => handleSort("product_name")}>Product Name</th>
              <th onClick={() => handleSort("product_description")}>
                Product Description
              </th>
              <th onClick={() => handleSort("category_name")}>CAtegory Name</th>
              <th onClick={() => handleSort("variant_value")}>Variant Value</th>
            </tr>
          </thead>
          <tbody>
            {sortedProduct.map((item, index) => (
              <tr key={index}>
                <td>{item.product_id}</td>
                <td>{item.barcode}</td>
                <td>{item.product_name}</td>
                <td>{item.product_description}</td>
                {/*<td>{item.product_category}</td>*/}
                <td>{item.category_name}</td>
                {/*<td>{item.variant_id}</td>*/}
                {/*<td>{item.variant_name}</td>*/}
                <td>{item.variant_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render variant table if showVariantTable is true */}
      {showVariantTable && (
        <div className="display-container">
          <h1>Variant Table</h1>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort1("variant_id")}>Variant Id</th>
                <th onClick={() => handleSort1("variant_name")}>
                  Variant Name
                </th>
                <th onClick={() => handleSort1("variant_value")}>
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
      )}
      {/* Render category table if showCategoryTable is true */}
      {showCategoryTable && (
        <div className="display-container">
          <h1>Category Table</h1>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort2("category_id")}>Category Id</th>
                <th onClick={() => handleSort2("category_name")}>
                  Category Name
                </th>
                <th onClick={() => handleSort2("category_description")}>
                  {" "}
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
      )}
    </div>
  );
};

export default AddProduct;
//exporting AddProduct function
