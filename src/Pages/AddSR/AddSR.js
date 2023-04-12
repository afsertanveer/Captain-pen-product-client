import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddSR = () => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [regions,setRegions] = useState([]);
  const [singleRegion,setSingleRegion] = useState('');
  const [managedBy,setManagedBy] = useState('');
  useEffect(()=>{
      if(username===null || (role!=="0" && role!=="1" && role!=="2")){
          localStorage.clear();
    navigate('/');   
    }
    if(role==='0'){
      fetch('http://localhost:5000/region',{
        method:"GET",
        headers:{
          "content-type":"application/json"
        }
      })
      .then(res=>res.json())
      .then(data=>setRegions(data))
    }else if(role==='1'){
      fetch(`http://localhost:5000/region?assigned=${userId}`,{
        method:"GET",
        headers:{
          "content-type":"application/json"
        }
      })
      .then(res=>res.json())
      .then(data=>{
        setRegions(data)
      })
    }else{
      fetch(`http://localhost:5000/users/${userId}`,{
        method:"GET",
        headers:{
          "content-type":"application/json"
        }
      })
      .then(res=>res.json())
      .then(data=>{
        setManagedBy(userId);
        setSingleRegion(data[0]?.region_id)
      })
    }
  },[username,role,navigate,userId])

  const getRegion = event =>{
    const regionId = event.target.value;
    setSingleRegion(regionId);
      fetch(`http://localhost:5000/users?region_id=${regionId}`,{
      method:"GET",
      headers:{
        "content-type":"application/json"
      }
      })
      .then(res=>res.json())
      .then(data=>{
        setManagedBy(data[0]?._id);
      })
  }
    const setPassword = event =>{
        const getUsername = event.target.value;
        document.getElementById('password').value = getUsername;
    }
    const addAdmin = event =>{
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const username = form.username.value;
        const password = form.password.value;
        const assigned = "0";
        let currentData = new Date()
        const created_at= currentData.toISOString().split('T')[0];
        const role ="3"; 
        
        const user ={
            username,password,name,role,assigned,created_at,
            region_id:singleRegion,
            managed_by:managedBy
        }

        fetch('http://localhost:5000/addAdmin',{
            method:"POST",
            headers:{
                "content-type" :"application/json"
            },
            body:JSON.stringify(user)
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.acknowledged){
                toast.success('A sales represantative is successfully addded');
            }
        })
        .catch(err=>toast.error("Duplicate username found"))
        form.reset();
    }
    return (
        <div className="card   p-10 mt-10 lg:ml-40 lg:p-20 shadow-2xl bg-base-100">
        <form onSubmit={addAdmin}>
          <p className="text-2xl text-center  font-bold">Add Saler Representative</p>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Name</span>
            </label>
            <input
              name='name'
              type="text"
              placeholder="Name"
              className=" input input-bordered w-1/2"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Username</span>
            </label>
            <input
              name='username'
              type="text"
              onChange={setPassword}
              placeholder="username"
              className=" input input-bordered w-1/2"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Password</span>
            </label>
            <input
              name='password'
              id='password'
              type="text"
              placeholder="password"
              className=" input input-bordered w-1/2"
              required
            />
          </div>
         {
          (localStorage.getItem('role')==='0' || localStorage.getItem('role')==='1') && <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Assign Region</span>
          </label>
          <select
            name='select_region'
            onChange={getRegion}
            className=" input input-bordered w-1/2 mb-4"
            required
          >
            <option></option>
            {regions.length > 0 &&
              regions.map((region) => (
                <option key={region._id} value={region._id}>
                  {region.region_name}
                </option>
              ))}
          </select>
        </div>
         }
          <div className="form-control mt-6">
            <button className="btn btn-primary w-1/2 lg:w-1/4">Add SR</button>
          </div>
        </form>
      </div>
    );
};

export default AddSR;