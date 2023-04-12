import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../Loader/Loader';

const ShopTransaction = () => {
    const userId = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const [shopTransactions,setShopTransactions] = useState([]);
    const [shops,setShops] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

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
      }, [userId, role, navigate]);
    return (
        <div>
        <div className="text-center">
          <p className="text-4xl font-bold mb-4">My Distribution</p>
        </div>
        {isLoading && <Loader></Loader>}
        {
          shopTransactions?.length>0 ? <>
              <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Due Amount</th>
                <th>Action</th>
                
              </tr>
            </thead>
            <tbody>
              {shopTransactions?.length > 0 &&
                shopTransactions.map((it) => (
                  <tr key={it._id}>
                    <td>{shops?.filter(sh=>sh._id === it.shop_id)[0]?.shop_name}</td>
                    <td>{it.due}</td>
                    <td><Link className='btn btn-outline'>Pay Due</Link></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
          </>
          :
          <>
              <h2 className="font-extrabold text-red-600 mt-10 text-center text-5xl">No Distribution yet</h2>
          </>
        }
      </div>
    );
};

export default ShopTransaction;