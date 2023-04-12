import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AvailableProductSr = () => {
  const [products, setProducts] = useState([]);
  const [sentStock, setSentStock] = useState([]);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "0" || role === "1") {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/group-by-products-sr", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data = data.filter((d) => d._id.reciever_id === userId);
        setProducts(data);
      });
    fetch("http://localhost:5000/group-by-products-sender-shop", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const sStock = data?.filter((d) => d._id.sender_id === userId);
          setSentStock(sStock);
        }
      });
  }, [userId, navigate, role]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">My Available Products</p>
      </div>
      {products.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Distributable Amount</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 &&
                  products.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it._id.product_name}</td>
                      <td>
                        {(
                          parseInt(it.count) -
                          parseInt(
                            sentStock?.filter(
                              (ss) =>
                                ss._id.product_name === it._id.product_name
                            )[0]?.count
                          )
                        ).toString() === "NaN"
                          ? it.count
                          : (
                              parseInt(it.count) -
                              parseInt(
                                sentStock?.filter(
                                  (ss) =>
                                    ss._id.product_name === it._id.product_name
                                )[0]?.count
                              )
                            ).toString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-extrabold text-red-600 mt-10 text-center text-5xl">
            No Distribution yet
          </h2>
        </>
      )}
    </div>
  );
};

export default AvailableProductSr;
