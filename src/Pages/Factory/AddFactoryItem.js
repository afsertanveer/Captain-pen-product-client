import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";

const AddFactoryItem = () => {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");
  const permission = localStorage.getItem("permission");
  const navigate = useNavigate();
  const [units,setUnits] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const addItem = async (e) => {
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
        current_amount:initialAmount,
        added_by:userId,
        created_at:currentData,
    }
    console.log(item);
    await fetch(`http://localhost:5000/factory-item`,{
        method:"POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then((res) => res.json())
      .then(( data ) => {
          toast.success("Item Added Successfully");
      
      form.reset();
    }).catch(err=>{
      toast.error("This unit already exists! Please check the list")
    })
    
  };
  useEffect(() => {
    if (username === null || permission !== "1") {
      localStorage.clear();
      navigate("/");
    }
    setIsLoading(true);
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
        {
            isLoading && <Loader></Loader>
        }
      <div className="w-full lg:w-1/2 py-10 mt-10 bg-white flex flex-col mx-auto  px-4 border border-white rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">
          Add Factory Item
        </h1>
        <div className="px-4 lg:px-20">
          <form onSubmit={addItem}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Item Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="item_name"
                id="item_name"
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
                placeholder="Description"
              ></textarea>
            </div>
            <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Unit</span>
          </label>
          <select name="unit" id="unit" className=" input input-bordered w-full lg:w-1/2 mb-4">
            {
                units.length>0 && units.map(u=><option key ={u._id} value={u.unit}>{u.unit}</option>)
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
                defaultValue={0}
                placeholder="Initial Amount"
                required
              />
            </div>
            <div className="form-control mt-4">
              <input
                type="submit"
                value="Add Item"
                className="btn w-[150px]"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFactoryItem;