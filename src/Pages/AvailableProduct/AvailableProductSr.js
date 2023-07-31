import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";

const AvailableProductSr = () => {
  const [products, setProducts] = useState([]);
  const [sentStock, setSentStock] = useState([]);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (role === "0" || role === "1" || userId===undefined) {
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
        setIsLoading(false);
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
          setIsLoading(false);
        }
      });
  }, [userId, navigate, role]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">My Available Products</p>
      </div>
      {isLoading && <Loader></Loader>}
      {products.length > 0 ? (
        <>
          <div className="overflow-x-auto px-0 lg:px-4">
            <table className="table table-zebra w-full">
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
