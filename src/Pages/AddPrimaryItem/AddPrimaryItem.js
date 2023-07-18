import React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AddPrimaryItem = () => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  useEffect(()=>{
    if(username===null || role!=='0'){
      localStorage.clear();
      navigate('/');   
  }
  },[navigate,role,username])
    const addItem =  event =>{
        event.preventDefault();
        const name = event.target.name.value;
        const item = {
            name
        }
        fetch('http://localhost:5000/items',{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(item)
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.acknowledged){
                toast.success("New Primary Item is added");
                navigate('/show-items')
            }
        })
    }
    return (
        <div className="card p-10 m-10 lg:p-20 shadow-2xl bg-base-100">
        <form onSubmit={addItem}>
          <p className="text-2xl text-center  font-bold">Add Primary Item</p>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Item name</span>
            </label>
            <input
              name='name'
              type="text"
              placeholder="Name"
              className=" input input-bordered w-full lg:w-1/2"
              required
            />
          </div>         
          <div className="form-control mt-6">
            <button className="btn btn-primary w-1/2 lg:w-1/4">Add Item</button>
          </div>
        </form>
      </div>
    );
};

export default AddPrimaryItem;