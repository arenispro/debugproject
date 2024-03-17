// JUSTIN 
import React from 'react';
import { ListFormat } from 'typescript';

export const Inventory = ({ inventory }) => {
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
                    {inventory.map(item => (
                        <tr key={item.id}>
                            <td>{item.product_name}</td>
                            <td>{item.product_desc}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
