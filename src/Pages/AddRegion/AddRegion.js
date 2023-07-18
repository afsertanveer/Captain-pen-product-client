import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddRegion = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(0);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [dhakaThana, setDhakaThana] = useState([]);
  const [selectedDhakaThana,setSelectedDhakaThana] = useState([]);
  const [admin,setAdmin] = useState('');
  const [isDhaka,setIsDhaka] = useState(false);
  
  const handleAddRegion = (event) => {
    event.preventDefault();
    const form = event.target;
    const regionName = form.region_name.value;
    const curDate = new Date();
    let divName;
     division.forEach(div=>{
      if(div.value===selectedDivision){
         divName= div.label
      }
    })
    let region = {
      region_name:regionName,
      division:divName,
      districts:selectedDistricts,
      assigned:admin,       
      created_date:curDate
    }
    if(isDhaka){
      region.thana = selectedDhakaThana
    }
    fetch('http://localhost:5000/region',{
            method:"POST",
            headers:{
                "content-type" :"application/json"
            },
            body:JSON.stringify(region)
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.acknowledged){
                toast.success('A Region is added');
                navigate('/viewregion');
            }
        })
        .catch(err=>toast.error("Duplicate Region found"))
        form.reset();
  };
  useEffect(() => {
    if(selectedDivision==='3'){
      selectedDistricts.forEach(sd=>{
        if(sd.label==='Dhaka'){
          setIsDhaka(true);
          return;
        }
      })
    }
    if (username === null || role !== "0") {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/divisions", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDivision(data);
      }).catch(err=>console.log(err));
      if(selectedDivision!==0){
        fetch(`http://localhost:5000/district/${selectedDivision}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => setDistrict(data)).catch(err=>console.log(err));
      }
       //admin who are not assigned any region yet
    fetch("http://localhost:5000/users-admin", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setAdminUsers(data)).catch(err=>console.log(err));

    fetch("http://localhost:5000/thana", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setDhakaThana(data)).catch(err=>console.log(err));
  }, [selectedDivision, navigate, username, role,selectedDistricts]);

  const getDivision = (event) => {
    setSelectedDivision([]);
    const selectedDiv = event.target.value;
    setSelectedDivision(selectedDiv);
  };
  const getAdmin = (event) => {
    setAdmin(event.target.value)
  };

  return (
    <div className="card   p-10 mt-10 lg:mx-40 lg:p-20 shadow-2xl bg-base-100">
      <form onSubmit={handleAddRegion}>
        <p className="text-2xl text-center  font-bold">Add Region</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Region Name</span>
          </label>
          <input
            type="text"
            name="region_name"
            placeholder="Region Name"
            className=" input input-bordered w-full lg:w-1/2"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Division</span>
          </label>
          <select
            onChange={getDivision}
            className=" input input-bordered w-full lg:w-1/2 mb-4"
            required
          >
            <option></option>
            {division.length > 0 &&
              division.map((bivag) => (
                <option key={bivag._id} value={bivag.value}>
                  {bivag.label}
                </option>
              ))}
          </select>
        </div>
        {selectedDivision.length > 0 && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">District</span>
              </label>
              <ReactSelect
                isMulti
                onChange={(choice) => setSelectedDistricts(choice)}
                options={district}
                className="basic-multi-select w-1/2"
              ></ReactSelect>
            </div>
          </>
        )}
        {selectedDivision === "3" &&  isDhaka && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Thana</span>
                </label>
                <ReactSelect
                isMulti
                onChange={(choice) => setSelectedDhakaThana(choice)}
                options={dhakaThana}
                className="basic-multi-select w-1/2"
              ></ReactSelect>
              </div>
            </>
          )}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Assign to Admin</span>
          </label>
          <select
            onChange={getAdmin}
            className=" input input-bordered w-full lg:w-1/2 mb-4"
            
          >
            <option></option>
            {division.length > 0 &&
              adminUsers.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.name}
                </option>
              ))}
              <option value={userId}>SuperAdmin</option>
          </select>
        </div>
        <div className="form-control mt-6">
          <input
            type="submit"
            value="Add Region"
            className="btn btn-primary w-1/2 lg:w-1/4"
          />
        </div>
      </form>
    </div>
  );
};

export default AddRegion;
