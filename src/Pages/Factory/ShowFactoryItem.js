import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";
import DeactivateButton from "../../Components/Common/DeactivateButton";
import PopUpModal from "../../Components/Common/PopUpModal";
import { toast } from "react-hot-toast";
import Loader from "../../Loader/Loader";

const ShowFactoryItem = () => {
  const username = localStorage.getItem("username");
  const permission = localStorage.getItem("permission");
  const navigate = useNavigate();
  const [factoryItems,setFactoryItems] = useState([]);
  const [units,setUnits] = useState([]);
  const [singleItem,setSingleItem] = useState({})
  const [pagiNationData, setPagiNationData] = useState({});
  const [isLoading,setIsLoading] = useState(false);
  
  const editItem = (e) =>{
    e.preventDefault();
    const form = e.target;
    const name = form.item_name.value;
    const descr = form.description.value;
    const unitName = form.unit.value;
    const initialAmount = form.initial_amount.value;
    let currentData = new Date();
    const active = "1";
    const item ={
        item_name:name,
        description:descr,active,
        unit_name:unitName,
        initial_amount:initialAmount,
        created_at:currentData,
    }
    fetch(`http://localhost:5000/edit-factory-item/${singleItem._id}`,{
      method:"PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body:JSON.stringify(item)
    }).then(res=>res.json())
    .then(data=>{
      if(data.modifiedCount>0){
        toast.success("Successfully Edited the Item");
        window.location.reload(false);
      }
    }).catch(err=>console.log(err))
    document.getElementById('edit-modal').checked = false;
  }

  const deactivateUnit = id =>{
    fetch(`http://localhost:5000/factory-item/${id}`,{
      method:"PUT",
      headers: {
          "Content-Type": "application/json",
      },
      
    }).then(res=>res.json())
    .then(data=>{
      console.log(data);
      if(data.modifiedCount>0){
        toast.success("Successfully disable the unit");
        window.location.reload(false);
      }
    }).catch(err=>console.log(err))
    document.getElementById('my-modal-1').checked = false;
  }
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
        fetch(
          `http://localhost:5000/paginate-factory-item?page=${clickedPage}`,{
            method:"GET"
          }
        )
        .then(res=>res.json())
        .then((data) => {
          setFactoryItems(data.data);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
        });
    } else {
      fetch(
        `http://localhost:5000/paginate-factory-item?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setFactoryItems(data.data);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }
  };
  const increaseitem = (e)=>{
    e.preventDefault();
    const increaseAmount = e.target.amount.value;
    const decreaseAmount = 0;
    const item_name = singleItem.item_name;
    const previousStock = singleItem.current_amount;
    const currentStock = (parseInt(previousStock) + parseInt(increaseAmount)).toString();
    const time= new Date();
    const factoryStock= {
      item_name,
      increase_amount:increaseAmount,
      decrease_amount:decreaseAmount,
      previous_stock:previousStock,
      current_stock:currentStock,
      user:username,
      date_time:time
    }
    console.log(singleItem._id);
    fetch(`http://localhost:5000/factory-item-stock/${singleItem._id}`,{
      method:"PUT",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(factoryStock)
    }).then(res=>res.json())
    .then(data=>{
      if(data.modifiedCount>0){
        fetch("http://localhost:5000/factory-stock",{
          method:"POST",
          headers:{
            "content-type":"application/json"
          },
          body:JSON.stringify(factoryStock)
        }).then(res=>res.json())
        .then(stockData=>{
          if (stockData.acknowledged) {
            toast.success("Stock Updated Successfully");
            window.location.reload(false);
          }
        }).catch(err=>console.log(err))
      }
    }).catch(err=>console.log(err));
  }
  const decreaseitem = (e)=>{
    e.preventDefault();
    const decreaseAmount = e.target.amount.value;
    const increaseAmount = 0;
    const item_name = singleItem.item_name;
    const previousStock = singleItem.current_amount;
    const currentStock = (parseInt(previousStock) - parseInt(decreaseAmount)).toString();
    const time= new Date();
    console.log(currentStock);
    if(parseInt(currentStock)>=0){
      const factoryStock= {
        item_name,
        increase_amount:increaseAmount,
        decrease_amount:decreaseAmount,
        previous_stock:previousStock,
        current_stock:currentStock,
        user:username,
        date_time:time
      }
      console.log(singleItem._id);
      fetch(`http://localhost:5000/factory-item-stock/${singleItem._id}`,{
        method:"PUT",
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify(factoryStock)
      }).then(res=>res.json())
      .then(data=>{
        if(data.modifiedCount>0){
          fetch("http://localhost:5000/factory-stock",{
            method:"POST",
            headers:{
              "content-type":"application/json"
            },
            body:JSON.stringify(factoryStock)
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
  }
  useEffect(() => {
    if (username === null || permission !== "1") {
      localStorage.clear();
      navigate("/");
    }
    
    setIsLoading(true);
      fetch(`http://localhost:5000/paginate-factory-item?page=1`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        setFactoryItems(data.data)
        setPagiNationData(data.paginateData);
        });
        fetch("http://localhost:5000/unit",{
            method:"GET",
        }).then(res=>res.json())
        .then(data=>{
            setIsLoading(false);
            setUnits(data)
        })
        .catch(err=>console.log(err))
    
  }, [username, permission, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold my-10">All Factory Items</p>
      </div>
      {
        isLoading && <Loader></Loader>
      }
      {
        factoryItems.length>0 && <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Unit</th>
              <th>Initial Amount</th>
              <th>Current Amount</th>
              <th>Date</th>
              <th>Increment Decrement</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {factoryItems.length > 0 &&
              factoryItems.map((it) => (
                <tr key={it._id}>
                  <td>{it.item_name}</td>
                  <td>
                    {it.description}
                  </td>
                  <td>{it.unit_name}</td>
                  <td>{it.initial_amount}</td>
                  <td>{it.current_amount}</td>
                  <td>{it.created_at.split("T")[0]}</td>
                  <td>
                    <label className="btn bg-[#1b5e20] text-whiten mr-2" onClick={()=>setSingleItem(it)} htmlFor="increase-modal">+</label>
                    <label className="btn bg-[#1b5e20] text-white" onClick={()=>setSingleItem(it)} htmlFor="decrease-modal">-</label>
                  </td>
                  <td>
                    <div className="flex gap-1 lg:gap-4 ">
                    <label
                    className="btn bg-[#1b5e20] text-white"
                    htmlFor="edit-modal"
                    onClick={() => setSingleItem(it)}
                  >
                    Edit
                  </label>
                        <DeactivateButton setter={setSingleItem} value={it._id}></DeactivateButton>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      }
      <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/2 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={editItem}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Item Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="item_name"
                id="item_name"
                defaultValue={singleItem.item_name}
                placeholder="Item Name"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Description </span>
              </label>
              <textarea
                className="textarea textarea-info  border-black"
                name="description"
                id="description"
                defaultValue={singleItem.description}
                placeholder="Description"
              ></textarea>
            </div>
            <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Unit</span>
          </label>
          <select name="unit" id="unit"  className=" input input-bordered w-full lg:w-1/2 mb-4">
            {
                units.length>0 && units.map(u=>
                  <option 
                  key ={u._id} 
                  value={u.unit}
                  selected={u.unit===singleItem.unit_name}
                  >{u.unit}
                  </option>
                    
              )
            }
          </select>
        </div>
        <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Initial Amount</span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="initial_amount"
                id="initial_amount"
                defaultValue={singleItem.initial_amount}
                placeholder="Initial Amount"
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
      <input type="checkbox" id="increase-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/2 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={increaseitem}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Amount</span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="number"
                name="amount"
                id="amount"
                min={1}
                placeholder="Amount"
                required
              />
            </div>
            <div className="form-control mt-4">
            <div className="flex justify-between">
                <input
                  type="submit"
                  value="Increase"
                  className="btn w-[150px]"
                />
                
              <label htmlFor="increase-modal" className="btn bg-red-600 ">
              Close
              </label>
              </div>
            </div>
          </form>
         
        </div>
      </div>
      <input type="checkbox" id="decrease-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/2 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={decreaseitem}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Amount </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="number"
                name="amount"
                id="amount"
                min={1}
                placeholder="Amount"
                required
              />
            </div>
            <div className="form-control mt-4">
            <div className="flex justify-between">
                <input
                  type="submit"
                  value="Decrease"
                  className="btn w-[150px]"
                />
                
              <label htmlFor="decrease-modal" className="btn bg-red-600 ">
              Close
              </label>
              </div>
            </div>
          </form>
         
        </div>
      </div>
      <PopUpModal remove={deactivateUnit} modalData={singleItem} ></PopUpModal>
      <div className="my-6 pr-0 lg:pr-10">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
    </div>
  );
};

export default ShowFactoryItem;
