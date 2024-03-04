import React, { useState } from "react";
import "./Variant.css";

const Variant: React.FC = () => {
  const [variant_name, setVariant_name] = useState<string>("");
  const [variant_value, setVariant_value] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleVariant = async () => {
    try {
      console.log("Variant Name: ", variant_name);
      console.log("Variant Value: ", variant_value);

      if (variant_name === "" || variant_value === "") {
        setError("Please complete the required boxes.");
        return;
      }
      const response = await fetch("http://127.0.0.1:5000/variant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant_name,
          variant_value,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="variant-table">
      <img src="/smart_stock_logo;).png" className="logo" alt="logo" />
      <div className="variant-container">
        <h1>Variant</h1>
        <h2>ADD new variant</h2>
        <div className="variant-form">
          <input
            type="text"
            placeholder="Variant Name"
            value={variant_name}
            onChange={(e) => setVariant_name(e.target.value)}
          />
          <input
            type="text"
            placeholder="Variant Value"
            value={variant_value}
            onChange={(e) => setVariant_value(e.target.value)}
          />
          <button onClick={handleVariant}>Submit</button>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Variant;
