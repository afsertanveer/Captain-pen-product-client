import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';

const ShowItems = () => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [singleItem,setSingleItem] = useState({});
  const editItem = e =>{
    e.preventDefault();
    const itemName = e.target.item_name.value;
    const updateItem = {
      item_name:itemName
    }
    fetch(`http://localhost:5000/item/${singleItem._id}`,{
      method:"PUT",
      headers: {
        "content-type": "application/json",
      },
      body:JSON.stringify(updateItem)
    }).then(res=>res.json())
    .then(data=>{
      if(data.modifiedCount>0){
        toast.success("Successfully Edited the Item");
        window.location.reload(false);
      }
    }).catch(err=>console.log(err))
    document.getElementById('edit-modal').checked = false;
  }
  useEffect(()=>{
      if(username===null|| (role!=='0' && role!=='1')){
          localStorage.clear();
    navigate('/');   
      }
      fetch("http://localhost:5000/items", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setItems(data));
  },[username,role,navigate])
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">All Items</p>
      </div>
      <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 &&
              items.map((it) => (
                <tr key={it._id}>
                  <td>{it.name}</td>
                  <td>
                  <Link to={`/add-category/${it._id}`}>  <button className="btn btn-primary mr-2">Add Category</button></Link>
                  <Link to={`/view-category/${it._id}`}>  <button className="btn btn-primary mr-2">View Category</button></Link>
                  <label htmlFor="edit-modal" onClick={()=>setSingleItem(it)} className="btn bg-[#1b5e20] text-white">Edit Item</label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/3 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={editItem}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Item </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="item_name"
                id="item_name"
                defaultValue={singleItem.name}
                placeholder="Item Name"
                required
              />
            </div>
            <div className="form-control mt-4">
            <div className="flex justify-between">
                <input
                  type="submit"
                  value="Edit"
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

export default ShowItems;
