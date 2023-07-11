import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from "../../Loader/Loader";

const ShowShopDistribution = () => {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const role = localStorage.getItem('role');
  const id = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    if(role!=='3' || role ===null ){
      localStorage.clear();
      navigate('/');
    }
      fetch("http://localhost:5000/distributed-product-to-shop", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        if(data.length>0){
            const currentArray = data.filter(d=>d.sender_id===id);
            setProducts(currentArray);
        }
        setIsLoading(false);
      });

      fetch('http://localhost:5000/shop',{
        method:"GET",
        headers:{
            "content-type":"application/json"
        }
      })
      .then(res=>res.json())
      .then(data=>setShops(data))
      
  }, [id,role,navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">My Distribution</p>
      </div>
      {isLoading && <Loader></Loader>}
      {
        products?.length>0 ? <>
            <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Product Name</th>
              <th>Distributed Amount</th>
              {role==='0' && <th>Reciever</th>}
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 &&
              products.map((it) => (
                <tr key={it._id}>
                  <td>{shops?.filter(sh=>sh._id === it.reciever_id)[0]?.shop_name}</td>
                  <td>{it.product_name}</td>
                  <td>{it.distributed_amount}</td>
                  {role==='0' && <td>{it.userDetails[0].name}</td>}
                  <td>{it.recieved_date.split('T')[0]}</td>
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

export default ShowShopDistribution;
