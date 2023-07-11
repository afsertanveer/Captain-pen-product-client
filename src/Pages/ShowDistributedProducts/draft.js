import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from "../../Loader/Loader";
import Pagination from "../../Shared/Pagination/Pagination";

const ShowDistributedProducts = () => {
  const [products, setProducts] = useState([]);
  const [users,setUsers] = useState([]);
  const role = localStorage.getItem('role');
  const id = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false);
  const [pagiNationData,setPagiNationData] = useState({})
  
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
      
      if(role==='2'){
        fetch(`http://localhost:5000/paginate-distribution-details-sr/${clickedPage}?sender_id=${id}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) =>{
          console.log(data);
          if(data.data.length>0){
            console.log(data);
              const currentArray = data.data.filter(d=>d.sender_id===id);
              setProducts(currentArray);
              setPagiNationData(data.paginateData);
              setIsLoading(false);
          }
        });
      }else{
        fetch(`http://localhost:5000/paginate-distributed-product?page=${clickedPage}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) =>{
          if(data.data.length>0){
            if(role!=='0'){
              const currentArray = data.data.filter(d=>d.sender_id===id);
              setProducts(currentArray);
              setPagiNationData(data.paginateData);
            }else{
              setProducts(data.data);
              setPagiNationData(data.paginateData);
            }
            setIsLoading(false);
          }
        });
      }
    } else {
      if(role==='2'){
        fetch(`http://localhost:5000/paginate-distribution-details-sr/${clickedPage}?sender_id=${id}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) =>{
          if(data.data.length>0){
              const currentArray = data.data.filter(d=>d.sender_id===id);
              setProducts(currentArray);
              setPagiNationData(data.paginateData);
              setIsLoading(false);
          }
        });
      }else{
        fetch("http://localhost:5000/paginate-distributed-product", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) =>{
          if(data.data.length>0){
            if(role!=='0'){
              const currentArray = data.data.filter(d=>d.sender_id===id);
              setProducts(currentArray);
              setPagiNationData(data.paginateData);
            }else{
              setProducts(data.data);
              setPagiNationData(data.paginateData);
            }
            setIsLoading(false);
          }
        });
      }
    }
  };
  useEffect(() => {
    setIsLoading(true);
    if((role!=='0' && role !=='1' && role!=='2') || role ===null ){
      localStorage.clear();
      navigate('/');
    }
    if(role==='2'){
      fetch(`http://localhost:5000/paginate-distribution-details-sr/1/sender_id=${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        
        console.log(data);
        if(data.length>0){
          const currentArray = data.filter(d=>d.sender_id===id);
          setProducts(currentArray);
            setPagiNationData(data.paginateData);
            setIsLoading(false);
        }
      });
    }else{
      fetch("http://localhost:5000/paginate-distributed-product", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        if(data.data.length>0){
          if(role!=='0'){
            const currentArray = data.data.filter(d=>d.sender_id===id);
            setProducts(currentArray);
            setPagiNationData(data.paginateData);
          }else{
            setProducts(data.data);
            setPagiNationData(data.paginateData);
          }
          setIsLoading(false);
        }
      });
    }
    fetch("http://localhost:5000/users", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(res=>res.json())
    .then(data=>{
      setUsers(data)
      setIsLoading(false);
    })
  }, [id,role,navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">My Distribution{products.length}</p>
      </div>
      {isLoading && <Loader></Loader>}
      {
        products?.length>0 ? <>
            <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Distributed Amount</th>
              {role==='0' && <th>Reciever</th>}
              {role==='2' && <th>Reciever</th>}
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {products?.length > 0 &&
              products.map((it) => (
                <tr key={it._id}>
                  <td>{it.product_name}</td>
                  <td>{it.distributed_amount}</td>
                  {role==='0' && <td>{it.userDetails[0]?.name}</td>}
                  {role==='2' && <td>{users?.filter(us=>us._id===it.reciever_id)[0]?.name}</td>}
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
      <div className="my-6 pr-0 lg:pr-10">
        {pagiNationData&& products.length>0 && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
      </div>
    </div>
  );
  
};

export default ShowDistributedProducts;
