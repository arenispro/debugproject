import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Category, Variant, Product } from "./Interface";
import { useNavigate } from "react-router-dom";

const FilterPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const handleCategoryChange = (categoryID: number) => {
    setSelectedCategory(selectedCategory === categoryID ? null : categoryID);
  };

  const handleVariantChange = (variantID: number) => {
    setSelectedVariant(selectedVariant === variantID ? null : variantID);
  };

  useEffect(() => {
    fetchCategoriesAndVariants();
  }, []);

  const fetchCategoriesAndVariants = () => {
    fetch("http://127.0.0.1:5000/filter_page", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        const parsedCategories: Category[] = data.categories.map(
          (category: any) => ({
            categoryID: category[0],
            categoryName: category[1],
            categoryDescription: category[2],
          })
        );
        setCategories(parsedCategories);

        const parsedVariants: Variant[] = data.variants.map((variant: any) => ({
          variantID: variant[0],
          variantName: variant[1],
          variantDescription: variant[2],
        }));
        setVariants(parsedVariants);
      })
      .catch((error) => {
        console.error("Error fetching categories and variants:", error);
      });
  };

  const fetchProducts = () => {
    let url = "http://127.0.0.1:5000/filter_products";
    if (selectedCategory !== null) {
      url += `?category=${selectedCategory}`;
    }
    if (selectedVariant !== null) {
      url += `${selectedCategory ? "&" : "?"}variant=${selectedVariant}`;
    }

    fetch(url, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json() as Promise<any[]>;
      })
      .then((data) => {
        console.log("Fetched products:", data);
        const products: Product[] = data.map((item) => ({
          productID: item[0],
          barcode: item[1],
          productName: item[2],
          productDescription: item[3],
          productCategory: item[4],
          variantID: item[5],
        }));
        console.log("Mapped products:", products);
        setProducts(products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedVariant]);

  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>
        <button onClick={goBackToDashboard}>Go back to Dashboard</button>
      </h1>
      <h1>Filter Products</h1>
      <div>
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.categoryID}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategory === category.categoryID}
                  onChange={() => handleCategoryChange(category.categoryID)}
                />
                {category.categoryName}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Variants</h2>
        <ul>
          {variants.map((variant) => (
            <li key={variant.variantID}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedVariant === variant.variantID}
                  onChange={() => handleVariantChange(variant.variantID)}
                />
                {variant.variantDescription}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.productID}>{product.productName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterPage;
