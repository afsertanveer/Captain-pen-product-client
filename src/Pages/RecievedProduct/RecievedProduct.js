import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from "../../Loader/Loader";

const RecievedProduct = () => {
  const [products, setProducts] = useState([]);
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if((role==='0' || role ==='1') || role===null ){
        localStorage.clear();
        navigate('/');
      }
    
      if(role==='2'){
        fetch("http://localhost:5000/distribution-details-asm", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        data = data.filter(d=> d.reciever_id===userId)
        setProducts(data)
        setIsLoading(false);
      })
      .catch(setIsLoading(false));
      
      }else{
        fetch("http://localhost:5000/distribution-details-sr", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        data = data.filter(d=> d.reciever_id===userId)
        setProducts(data)
        setIsLoading(false);
      })
      .catch(setIsLoading(false));
      }

  }, [userId,navigate,role]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">My Recieved Products</p>
      </div>
      {isLoading && <Loader></Loader>}
      {
        !isLoading ? <>
            <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Recieved Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 &&
              products.map((it,idx) => (
                <tr key={idx}>
                  <td>{it.product_name}</td>
                  <td>{it.distributed_amount}</td>
                  <td>{it.recieved_date.split('T')[0]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
        </>
        :
        <>
            <h2 className="font-extrabold text-red-600 mt-10 text-center text-5xl">Nothing Recieved yet</h2>
        </>
      }
    </div>
  );
};

export default RecievedProduct;
