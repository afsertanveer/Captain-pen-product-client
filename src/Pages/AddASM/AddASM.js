import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddASM = () => {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [managedBy, setManagedBy] = useState("");
  const [usernameError, setUsernameError] = useState(" ");
  useEffect(() => {
    if (username === null || (role !== "0" && role !== "1")) {
      localStorage.clear();
      navigate("/");
    }
    if (role === "0") {
      fetch("http://localhost:5000/region", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) =>{
         fetch("http://localhost:5000/users?role=2",{
          method: "GET",
          headers: {
          "content-type": "application/json",
        },          
         }).then(res=>res.json())
         .then(userData=>{
          if(userData.length>0){
            const result = data.filter(rg => !userData.some(user => rg._id === user.region_id));
            setRegions(result)
          }else{
            
          setRegions(data)
          }
         }).catch(err=>console.log(err))
        }).catch(err=>console.log(err));
    } else {
      fetch(`http://localhost:5000/region?assigned=${userId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("http://localhost:5000/users?role=2",{
          method: "GET",
          headers: {
          "content-type": "application/json",
        },          
         }).then(res=>res.json())
         .then(userData=>{
          if(userData.length>0){
            const result = data.filter(rg => !userData.some(user => rg._id === user.region_id));
            setRegions(result)
          }else{
            
          setRegions(data)
          }
         })
        }).catch(err=>console.log(err))
    }
  }, [username, role, navigate, userId]);
  const setPassword = (event) => {
    const getUsername = event.target.value;
    fetch(`http://localhost:5000/users?username=${getUsername}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setUsernameError(
            "Change the username! The current one is already in the list"
          );
        }
      });
    if (getUsername.length < 11 || getUsername.length > 11) {
      setUsernameError("Phone number length needs to be 11 digit");
    } else {
      document.getElementById("password").value = getUsername;
      setUsernameError("");
    }
  };

  const getRegion = (event) => {
    const regionId = event.target.value;
    fetch(`http://localhost:5000/region/${regionId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setManagedBy(data[0]?.assigned);
      });
  };

  const AddASM = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const username = form.username.value;
    const password = form.password.value;
    const assigned = "0";
    let currentData = new Date();
    const created_at = currentData.toISOString().split("T")[0];
    const role = "2";
    const selected_region = form.select_region.value;
    if (managedBy === "") {
      toast.error("Admmin is not assigned to the Region");
    } else {
      const user = {
        username,
        password,
        name,
        role,
        assigned,
        created_at,
        region_id: selected_region,
        managed_by: managedBy,
      };
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
            toast.success('An ASM is successfully addded');
            window.location.reload(false);
        }
    })
    .catch(err=>toast.error("Duplicate username found"))
    form.reset();
    }
 
  };
  return (
    <div className="card   p-10 mt-10 lg:mx-40 lg:p-20 shadow-2xl bg-base-100">
      <form onSubmit={AddASM}>
        <p className="text-2xl text-center  font-bold">Add ASM</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Name</span>
          </label>
          <input
            name="name"
            type="text"
            placeholder="Name"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Username</span>
          </label>
          <input
            name="username"
            type="text"
            onChange={setPassword}
            placeholder="username"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
          {usernameError === "" ? (
            <span className="text-sm font-bold text-success">
              Username Found
            </span>
          ) : (
            <span className="text-sm font-bold text-error">
              {usernameError}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Password</span>
          </label>
          <input
            name="password"
            id="password"
            type="text"
            placeholder="password"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Assign Region</span>
          </label>
          <select
            name="select_region"
            onChange={getRegion}
            className=" input input-bordered w-full lg:w-1/2 mb-4"
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
        <div className="form-control mt-6">
          <button className="btn btn-primary w-1/2 lg:w-1/4">Add ASM</button>
        </div>
      </form>
    </div>
  );
};

export default AddASM;
