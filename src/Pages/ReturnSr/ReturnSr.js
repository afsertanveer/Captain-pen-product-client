import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";

const ReturnSR = () => {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sumProducts, setSumProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSR = (e) => {
    const searchedSR = e.target.value.toLowerCase();
    let newProds = [];
    fetch(`http://localhost:5000/distribution-details-sr?sender_id=${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const newProd = [...new Set(data.map((item) => item.product_name))];
        const distinctReciever = [
          ...new Set(data.map((item) => item.reciever_id)),
        ];
        let totProd = [];
        let count = 0;
        distinctReciever.forEach((dr) => {
          newProd.forEach((item) => {
            const singleProd = {};
            singleProd.sender_id = userId;
            singleProd.reciever_id = dr;
            singleProd.product_name = item;
            count = 0;
            data.forEach((dt) => {
              if (dt.product_name === item && dt.reciever_id === dr) {
                count = count + parseInt(dt.distributed_amount);
              }
            });
            singleProd.count = count;
            if (count > 0) {
              totProd.push(singleProd);
            }
          });
        });
        if (searchedSR !== "") {
          const sr = users?.filter(
            (us) =>
              us.name.toLowerCase().includes(searchedSR) &&
              us.managed_by === userId
          );
          totProd.forEach((tt) => {
            sr.forEach((s) => {
              if (s._id === tt.reciever_id) {
                const sProd = tt;
                newProds.push(sProd);
              }
            });
          });
        } else {
          newProds = [...totProd];
        }
        setProducts(newProds);
        setIsLoading(false);
      });
  };
  const getBackProduct = (productName, recieverId, prodCount) => {
    const currentDate = new Date();
    const returnStock = {
      product_name: productName,
      distributed_amount: -prodCount,
      sender_id: userId,
      reciever_id: recieverId,
      recieved_date: currentDate,
    };
    fetch("http://localhost:5000/distributed-product-to-sr", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(returnStock),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload(false);
      })
      .catch((error) => toast.error(error));
  };
  useEffect(() => {
    setIsLoading(true);
    if (userId === null || role !== "2") {
      localStorage.clear();
      setIsLoading(false);
      navigate("/");
    }
    fetch(`http://localhost:5000/distribution-details-sr?sender_id=${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const newProd = [...new Set(data.map((item) => item.product_name))];
        const distinctReciever = [
          ...new Set(data.map((item) => item.reciever_id)),
        ];
        let totProd = [];
        let count = 0;
        distinctReciever.forEach((dr) => {
          newProd.forEach((item) => {
            const singleProd = {};
            singleProd.sender_id = userId;
            singleProd.reciever_id = dr;
            singleProd.product_name = item;
            count = 0;
            data.forEach((dt) => {
              if (dt.product_name === item && dt.reciever_id === dr) {
                count = count + parseInt(dt.distributed_amount);
              }
            });
            singleProd.count = count;
            if (count > 0) {
              totProd.push(singleProd);
            }
          });
        });

        setProducts(totProd);
        setIsLoading(false);
      });

    fetch("http://localhost:5000/users", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
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
        setSumProducts(data);
        setIsLoading(false);
      });
  }, [userId, role, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">Return from MY SR</p>
      </div>
      <div className="form-control flex justify-center items-center my-6">
        <input
          type="text"
          onChange={handleSearchSR}
          name="searched_sr"
          id="searched_sr"
          className="w-1/2 lg:w-[400px] px-5 py-3 text-lg rounded-full  input input-bordered  focus:border-gray-700 outline-none transition"
          placeholder="Search SR"
        />
      </div>
      <div>
        {products.length > 0 ? (
          <>
            <div className="overflow-x-auto px-0 lg:px-4">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Remaining Amount</th>
                    <th>Reciever</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 &&
                    products.map((it, idx) => (
                      (isNaN(
                        parseInt(it.count) -
                          parseInt(
                            sumProducts?.filter(
                              (sp) =>
                                sp._id.product_name === it.product_name &&
                                sp._id.sender_id === it.reciever_id
                            )[0]?.count
                          )
                      ) === false
                        ? parseInt(it.count) -
                          parseInt(
                            sumProducts?.filter(
                              (sp) =>
                                sp._id.product_name === it.product_name &&
                                sp._id.sender_id === it.reciever_id
                            )[0]?.count
                          )
                        : it.count)!==0 &&
                      <tr key={idx}>
                        <td>{it.product_name}</td>
                        <td>
                          {isNaN(
                            parseInt(it.count) -
                              parseInt(
                                sumProducts?.filter(
                                  (sp) =>
                                    sp._id.product_name === it.product_name &&
                                    sp._id.sender_id === it.reciever_id
                                )[0]?.count
                              )
                          ) === false
                            ? parseInt(it.count) -
                              parseInt(
                                sumProducts?.filter(
                                  (sp) =>
                                    sp._id.product_name === it.product_name &&
                                    sp._id.sender_id === it.reciever_id
                                )[0]?.count
                              )
                            : it.count}
                        </td>
                        <td>
                          {
                            users?.filter((us) => us._id === it.reciever_id)[0]
                              ?.name
                          }
                        </td>
                        <td>
                          {
                            (isNaN(
                              parseInt(it.count) -
                                parseInt(
                                  sumProducts?.filter(
                                    (sp) =>
                                      sp._id.product_name === it.product_name &&
                                      sp._id.sender_id === it.reciever_id
                                  )[0]?.count
                                )
                            ) === false
                              ? parseInt(it.count) -
                                parseInt(
                                  sumProducts?.filter(
                                    (sp) =>
                                      sp._id.product_name === it.product_name &&
                                      sp._id.sender_id === it.reciever_id
                                  )[0]?.count
                                )
                              : it.count)===0? <span className="text-success font-bold">No return Available</span> : <button
                              onClick={() =>
                                getBackProduct(
                                  it.product_name,
                                  it.reciever_id,
                                  isNaN(
                                    parseInt(it.count) -
                                      parseInt(
                                        sumProducts?.filter(
                                          (sp) =>
                                            sp._id.product_name === it.product_name &&
                                            sp._id.sender_id === it.reciever_id
                                        )[0]?.count
                                      )
                                  ) === false
                                    ? parseInt(it.count) -
                                      parseInt(
                                        sumProducts?.filter(
                                          (sp) =>
                                            sp._id.product_name === it.product_name &&
                                            sp._id.sender_id === it.reciever_id
                                        )[0]?.count
                                      )
                                    : it.count
                                )
                              }
                              className="btn btn-outline"
                            >
                              Get Back
                            </button>
                          }
                          
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

      {isLoading && <Loader></Loader>}
    </div>
  );
};

export default ReturnSR;
