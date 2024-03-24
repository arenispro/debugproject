// JUSTIN
//import React from 'react';
//import { ListFormat } from 'typescript';

export const Inventory1 = (props: { inventory1: any[] }) => {
  return (
    <div>
      <table border={1}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Description</th>
            <th>Quantity</th>
          </tr>
        </thead>
        {/*<tbody>
                    {props.inventory.map(item => (
                        <tr key={item.id}>
                            <td>{item.product_name}</td>
                            <td>{item.product_desc}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody> This whole thing was the old way of displaying the data But now I am moving on to the new way down below*/}
        <tbody>
          {props.inventory1.map((item) => (
            <tr key={item.inventory_id}>
              <td>{item.productName}</td>
              <td>{item.productDescription}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
