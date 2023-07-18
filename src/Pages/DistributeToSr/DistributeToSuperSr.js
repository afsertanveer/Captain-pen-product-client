import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DistributeToSuperSr = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [mySr, setMySr] = useState([]);

  const setItems = (event) => {
    event.preventDefault();
    let prevProdlList = [...productList];
    const selectedProduct = document.getElementById("prdouct_name").value;
    const selectedAmount = document.getElementById("amount").value;
    let flag = 0;
    const prod = products;
    const maxAmount = parseInt(
      prod.filter((p) => p.product_name === selectedProduct)[0]?.total_pieces
    );
    prevProdlList.forEach((prod) => {
      if (prod.product_name === selectedProduct) {
        if (
          parseInt(prod.distributed_amount) + parseInt(selectedAmount) <=
          maxAmount
        ) {
          prod.distributed_amount = (
            parseInt(prod.distributed_amount) + parseInt(selectedAmount)
          ).toString();
        } else {
          toast.error("Limit Exceeded");
        }

        flag = 1;
      }
    });
    if (flag === 0) {
      if (selectedAmount <= maxAmount) {
        prevProdlList[prevProdlList.length] = {
          product_name: selectedProduct,
          distributed_amount: selectedAmount,
        };
      } else {
        toast.error("Limit Exceeded");
      }
    }
    setProductList(prevProdlList);
    document.getElementById("prdouct_name").value = "";
    document.getElementById("amount").value = "";
  };
    const handleSubmit = e =>{
        e.preventDefault();
        const selectedUser = e.target.sr.value;
        const currentDate = new Date();
        productList.forEach(p=>{
            const distribution = {
                product_name:p.product_name,
                distributed_amount:p.distributed_amount,
                sender_id:userId,
                reciever_id:selectedUser,
                recieved_date:currentDate
            }
            fetch("http://localhost:5000/distributed-product-to-sr", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(distribution),
      })
        .then((res) => res.json())
        .then((data) => {
            if(data.acknowledged){
                fetch("http://localhost:5000/product-collection", {
              method: "PUT",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(distribution),
            })
              .then((res) => res.json())
              .then((d) => {
                if(d.acknowledged){
                    toast.success("Successfull Distribution");
                    e.target.reset();
                }
              })
            }
        })
        .catch((error) => toast.error(error));
            console.log(distribution);
        })
    }
  useEffect(() => {
    if (username === null || role !== "0") {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/product", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data));
    fetch(`http://localhost:5000/users?managed_by=${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setMySr(data));
  }, [username, role, navigate, userId]);
  return (
    <div className="p-2 lg:p-20">
      <div className="mt-10 mx-4 py-10 lg:mx-auto border  shadow-lg">
        <p className="text-3xl font-bold text-center">Distribute To SR</p>
        <div className="my-20 mx-4 lg:mx-20">
          <form onSubmit={setItems}>
            <select
              name="prdouct_name"
              id="prdouct_name"
              className="input input-bordered w-full lg:w-1/2"
              required
            >
              <option value=""></option>
              {products.length > 0 &&
                products.map((p) => {
                  return (
                    <option key={p._id} value={p.product_name}>
                      {p.product_name}
                    </option>
                  );
                })}
            </select>
            <br />
            <br />
            <input
              type="number"
              name=""
              className="input input-bordered w-full lg:w-1/2 lg:w-1/3 font-extrabold"
              placeholder="Type Amount"
              id="amount"
              required
            />
            <button className="ml-10 btn btn-outline" type="submit">
              Add To List
            </button>
          </form>
        </div>
      </div>
      {productList.length > 0 && (
        <div className="overflow-x-auto px-0 lg:px-4 my-20">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.product_name}</td>
                  <td>{p.distributed_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {
        productList.length>0 && <div className="my-10">
        <form onSubmit={handleSubmit}>
          <select
            name="sr"
            id="sr"
            className="input input-bordered w-full lg:w-1/2"
            required
          >
            <option value=""></option>
            {mySr.length > 0 &&
              mySr.map((ms) => (
                <option key={ms._id} value={ms._id}>
                  {ms.name}
                </option>
              ))}
          </select>
          <br />
          <br />
          <input type="submit" className="btn btn-accent" value="Distribute" />
        </form>
      </div>
      }
    </div>
  );
};

export default DistributeToSuperSr;
