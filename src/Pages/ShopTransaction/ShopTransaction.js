import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import PayModal from "../PayModal/PayModal";

const ShopTransaction = () => {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [shopTransactions, setShopTransactions] = useState([]);
  const [shops, setShops] = useState([]);
  const [transactionRecovery,setTransactionRecovery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalProps,setModalProps] = useState({});
  // const [curDue,setCurDue] = useState(0)  

  const handleSearchShop = (e) => {
    const searchedShop = e.target.value.toLowerCase();
    if (searchedShop !== "") {
      const prevShops = [...shops];
      console.log("prevshops: ", prevShops);
      const newShopList = prevShops.filter((sh) =>
        sh.shop_name.toLowerCase().includes(searchedShop)
      );
      console.log(newShopList);
      const prevShopTrans = [...shopTransactions];
      let newShopTrans = [];
      prevShopTrans.forEach((item) => {
        const checkItem = newShopList.filter((sh) => sh._id === item.shop_id);
        if (checkItem.length > 0) {
          newShopTrans.push(item);
        }
      });
      setShops(newShopList);
      setShopTransactions(newShopTrans);
    } else {
      setIsLoading(true);
      fetch(`http://localhost:5000/due?seller_id=${userId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setShopTransactions(data);
            setIsLoading(false);
          }
        });
      fetch(`http://localhost:5000/shop?managed_by=${userId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setShops(data);
            setIsLoading(false);
          }
        });
    }
  };
  const dueAmountCalculation = (shopId,dueAmount) =>{
    let due = dueAmount;
    transactionRecovery?.forEach(tr=>{
      if(tr.shop_id===shopId){
        due = ((parseFloat(due)-parseFloat(tr.paying_amount)).toFixed(2)).toString();
        // setCurDue(due)
      }
    })
    return due;
  }
  const makeModalProps = (shopId,sellerId,dueAmount)=>{
    const due = dueAmountCalculation(shopId,dueAmount)
    const modalVar = {
      shopId,sellerId,due
    };
    setModalProps(modalVar);
  }
  useEffect(() => {
    setIsLoading(true);
    if (userId === null || role !== "3") {
      localStorage.clear();
      navigate("/");
    }
    fetch(`http://localhost:5000/due?seller_id=${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setShopTransactions(data);
        }
        
        setIsLoading(false);
      });
    fetch(`http://localhost:5000/shop?managed_by=${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setShops(data);
          setIsLoading(false);
        }
      });
      fetch(`http://localhost:5000/due-recovery?seller_id=${userId}`,{
        method:"GET",
        headers:{
          "content-type":"application/json"
        }
      }).then(res=>res.json())
      .then(data=>setTransactionRecovery(data))
  }, [userId, role, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">Payment History With My Shops</p>
      </div>
      <div className="form-control flex justify-center items-center my-6">
        <input
          type="text"
          onChange={handleSearchShop}
          name=""
          id="searchProduct"
          className="w-1/2 lg:w-[400px] px-5 py-3 text-lg rounded-full  input input-bordered  focus:border-gray-700 outline-none transition"
          placeholder="Search Shop"
        />
      </div>
      {shopTransactions?.length > 0 ? (
        <>
          <div className="overflow-x-auto px-0 lg:px-4">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Due Amount</th>
                  <th>Pay</th>
                </tr>
              </thead>
              <tbody>
                {shopTransactions?.length > 0 &&
                  shopTransactions.map((it) => (
                    <tr key={it._id}>
                      <td>
                        {
                          shops?.filter((sh) => sh._id === it.shop_id)[0]
                            ?.shop_name
                        }
                      </td>
                      <td>{dueAmountCalculation(it.shop_id,it.due)}</td>
                      <td>
                        {dueAmountCalculation(it.shop_id,it.due)==="0.00" ? (
                          <span className="font-bold text-xl text-success">
                            No Due
                          </span>
                        ) : (
                          <>
                            <label
                              onClick={()=>makeModalProps(it.shop_id,it.seller_id,it.due)}
                              htmlFor="my-modal"
                              className="btn btn-outline font-bold w-[80px]"
                            >
                              PAY
                            </label>
                            {
                              modalProps && <PayModal
                              modalProps = {modalProps}
                            ></PayModal>
                            }
                          </>
                        )}
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
      {isLoading && <Loader></Loader>}
    </div>
  );
};

export default ShopTransaction;
