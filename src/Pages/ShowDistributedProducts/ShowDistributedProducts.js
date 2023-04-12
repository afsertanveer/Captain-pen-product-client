import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from "../../Loader/Loader";

const ShowDistributedProducts = () => {
  const [products, setProducts] = useState([]);
  const role = localStorage.getItem('role');
  const id = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    if((role!=='0' && role !=='1' && role!=='2') || role ===null ){
      localStorage.clear();
      navigate('/');
    }
    if(role==='2'){
      fetch("http://localhost:5000/distribution-details-sr", {
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
            setIsLoading(false);
        }
      });
    }else{
      fetch("http://localhost:5000/distributed-product", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        if(data.length>0){
          if(role!=='0'){
            const currentArray = data.filter(d=>d.sender_id===id);
            setProducts(currentArray);
          }else{
            setProducts(data);
          }
          setIsLoading(false);
        }
      });
    }
  }, [id,role,navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">My Distribution</p>
      </div>
      {isLoading && <Loader></Loader>}
      {
        products?.length>0 ? <>
            <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
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

export default ShowDistributedProducts;
