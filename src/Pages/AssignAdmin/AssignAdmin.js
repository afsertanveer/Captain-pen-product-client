import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AssignAdmin = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const region = useLoaderData();
  
  const handleAssignAdmin = event =>{
    event.preventDefault();
    const selectedAdmin = event.target.select_admin.value;
    const newRegion ={
        assign:selectedAdmin
    }
    fetch(`http://localhost:5000/region/${region[0]._id}`,{
        method:"PUT",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(newRegion)
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.modifiedCount>0){
            toast.success('Admin assignment succesfull');
        }
    })
    .catch(err=>toast.error('Try Again! Assignment Failed'));
    event.target.reset();
    navigate('/viewregion');

  }
  useEffect(() => {
    if (username === null || role !== "0") {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/users-admin", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setAdminUsers(data));
  }, [username, navigate, role]);
  return (
    <div className="p-4">
      <form onSubmit={handleAssignAdmin}>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Assign to Admin</span>
          </label>
          <select
            name='select_admin'
            className=" input input-bordered w-full lg:w-1/2 mb-4"
            required
          >
            <option></option>
            {adminUsers.length > 0 &&
              adminUsers.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-control pt-4">
            <input type="submit" value="Assign" className="btn btn-outline w-24" />
        </div>
      </form>
    </div>
  );
};

export default AssignAdmin;
