import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";
import moment from "moment/moment";
import { exportToCSV, fileName } from "../../utils/exportCSV";
import { toast } from "react-hot-toast";

const FactoryReport = () => {
  const username = localStorage.getItem("username");
  const permission = localStorage.getItem("permission");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stock,setStock] = useState([]);
  const [singleStock,setSingleStock] = useState({});
  const [pagiNationData, setPagiNationData] = useState({});
  const [excel,setExcel] = useState([]);  
  console.log(stock);
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
        fetch(
          `http://localhost:5000/paginate-factory-stock?page=${clickedPage}`,{
            method:"GET"
          }
        )
        .then(res=>res.json())
        .then((data) => {
          setUsers(data.data);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
        });
    } else {
      fetch(
        `http://localhost:5000/paginate-factory-stock?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setUsers(data.data);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }
  };
  const setExcelData = stock=>{
    let allData= [];
    stock.forEach(s=>{
        let itemName =  s.item_name;
        let currentStock = s.current_stock;
        let prevStock = s.previous_stock;
        let increaseAmount = s.increase_amount;
        let decreaseAmount = s.decrease_amount;
        let date = moment(s.date_time).toString();
        let username = s.user;
        const singleStock = {
            itemName,currentStock,prevStock,increaseAmount,decreaseAmount,date,username
        }
        allData.push(singleStock);
        setExcel(allData);
    })
  }
  const recover = e =>{
    e.preventDefault();
    const increased = parseInt(e.target.increase.value);
    const decreased = parseInt(e.target.decrease.value);
    if(increased===0 && decreased===0){
      toast.error("No value on the fields! Recovery cancelled");
      return ;
    }
    let updatedStock ={

    };
    updatedStock.previous_stock =parseInt(singleStock.previous_stock);
    if(increased>0 && decreased===0){
      updatedStock.current_stock =  updatedStock.previous_stock+ increased;
      updatedStock.increase_amount = increased;
      updatedStock.decrease_amount = 0;
    }
    else if(decreased>0 && increased===0){
      updatedStock.current_stock =  updatedStock.previous_stock - decreased;
      updatedStock.decrease_amount = decreased;
      updatedStock.increase_amount = 0;
    }
    else{
      toast.error("You cannot increase and decrase at the same time");
    }
    if(updatedStock.current_stock>=0){ 
      console.log(updatedStock,singleStock);
      fetch(`http://localhost:5000/factory-item?item_name=${singleStock.item_name}`,{
        method:"GET"
      }).then(res=>res.json())
      .then(data=>{
        if(data.length>0){
          const id = data[0]._id;
          fetch(`http://localhost:5000/factory-item-stock/${id}`,{
            method:"PUT",
            headers:{
              "content-type":"application/json"
            },
            body:JSON.stringify(updatedStock)
          }).then(res=>res.json())
          .then(factoryItemData=>{
            if(factoryItemData.modifiedCount>0){
              fetch(`http://localhost:5000/edit-factory-stock/${singleStock._id}`,{
                method:"PUT",
                headers:{
                  "content-type":"application/json"
                },
                body:JSON.stringify(updatedStock)
              }).then(res=>res.json())
              .then(stockData=>{
                if (stockData.acknowledged) {
                  toast.success("Stock Updated Successfully");
                  window.location.reload(false);
                }
              }).catch(err=>console.log(err))
            }
          }).catch(err=>console.log(err));
        }else{
          toast.error("Cannot decrease amount to less than zero")
          window.location.reload(false);
        }
      })
      .catch(err=>console.log(err))
    }else{
      toast.error("With this amount Stock gets expired. Check agian!")
    }
  }
  useEffect(() => {
    if (username === null || permission !== "1") {
      localStorage.clear();
      navigate("/");
    }
      fetch(`http://localhost:5000/factory-stock`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>setStock(data));
      fetch(`http://localhost:5000/paginate-factory-stock?page=1`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        setUsers(data.data)
        setExcelData(data.data)
        setPagiNationData(data.paginateData);
        });
    
  }, [username, permission, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold my-10">Factory Stock</p>
      </div>
      <div className="my-3  px-0 lg:px-4 flex justify-between items-center">
      <div>
      <button
         onClick={(e) => exportToCSV(excel, fileName)}
          className="mt-3 ml-4 btn bg-green-900 text-white"          
        >
          Download
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-2 w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* <button
         onClick={(e) => exportToCSV(stock, fileName)}
          className="mt-3 ml-4 btn bg-green-900 text-white"          
        >
          All Download
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-2 w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button> */}
      </div>
        <div className="flex flex-col lg:flex-row md:flex-row justify-end items-center">
          <label
            // onClick={}
            className="btn bg-red-600 text-white mr-2 mb-2 md:mb-0 lg:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filter
          </label>
          <label htmlFor="my-modal" className="btn bg-green-900 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
            Filters
          </label>
        </div>
      </div>
      {
        users.length>0 && <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Date & Time</th>              
              <th>Current Stock</th>
              <th>Previous Stock</th>
              <th>Increase Amount</th>
              <th>Decrease Amount</th>
              <th>Done By</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((it) => (
                <tr key={it._id}>
                  <td>{it.item_name}</td>
                  <td>
                    {moment(it.date_time).toString()}
                  </td>                  
                  <td>
                    {it.current_stock}
                  </td>
                  <td>{it.previous_stock}</td>
                  <td>{it.increase_amount===0? "-" : it.increase_amount}</td>
                  <td>{it.decrease_amount===0? "-" : it.decrease_amount}</td>
                  <td>{it.user}</td>
                  <td>{it.increase_amount>0? (it.previous_stock + '(Previous Stock) + ' + it.increase_amount + '(Increased Amount) = '  + it.current_stock +'(Current Stock)') :
                    (it.previous_stock + ' (Previous Stock) - ' + it.decrease_amount + ' (Decreased Amount)= ' + it.current_stock +'(Current Stock)')
                  }</td>
                  <td> 
                    {
                      role==="0"? 
                      <label htmlFor="edit-modal" onClick={()=>setSingleStock(it)} className="ml-4 btn bg-green-900 text-white">
                        Recover
                        </label> 
                      : 
                      moment.duration(moment().diff(it.date_time)).asHours()<30?
                      <label htmlFor="edit-modal" onClick={()=>setSingleStock(it)} className="ml-4 btn bg-green-900 text-white">
                        Recover
                        </label>
                        :
                        <h2 className="text-2xl font-semibold">N/A</h2>
                    }
                    </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      }
      <div className="my-6 pr-0 lg:pr-10">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
        <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/2 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={recover}>
          <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Increase Amount</span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="number"
                name="increase"
                id="increase"
                min={0}
                defaultValue={0}
                placeholder="Increase Amount"
                required
              />
      </div>
      <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Decrease Amount</span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="number"
                name="decrease"
                id="decrease"
                min={0}
                defaultValue={0}
                placeholder="Decrease Amount"
                required
              />
      </div>
            <div className="form-control mt-4">
            <div className="flex justify-between">
                <input
                  type="submit"
                  value="Edit Item"
                  className="btn w-[150px]"
                />
                
              <label htmlFor="edit-modal" className="btn bg-red-600 ">
              Close
              </label>
              </div>
            </div>
          </form>
         
        </div>
      </div>
    </div>
  );
};

export default FactoryReport;
