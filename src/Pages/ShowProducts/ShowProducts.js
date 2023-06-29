import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "0" && role !== "1") {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/product-collection", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [navigate,role]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">All Products</p>
      </div>
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Product Code</th>
              <th>Item Name</th>
              <th>Unit Price</th>
              <th>
                Number of<br></br>Products
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 &&
              products.map((it) => (
                <tr key={it._id}>
                  <td>{it.product_name}</td>
                  <td>{it.product_code}</td>
                  <td>{it.itemDetails.length>0? it.itemDetails[0].name : ""}</td>
                  <td>{it.unit_price}</td>
                  <td>{it.total_pieces}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowProducts;
