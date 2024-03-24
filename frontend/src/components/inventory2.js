// JUSTIN
import React from "react";
//import { ListFormat } from 'typescript';
import "./inventory.css";

export const Inventory2 = ({ inventory2 }) => {
  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Product</th>
            <th>Description</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventory2.map((item) => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.product_description}</td>
              <td className={getQuantityColor(item.quantity)}>
                {item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Suraiya
const getQuantityColor = (quantity) => {
  if (quantity < 100) {
    return "low-stock";
  } else if (quantity > 1000) {
    return "high-stock";
  } else {
    return "";
  }
};
