import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddAndAssignShop = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upozilla, setUpozilla] = useState([]);
  const [thana, setThana] = useState([]);
  const [isDhaka, setIsDhaka] = useState(false);
  const [srs,setSrs] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState("");
  const [selectedUpozilla, setSelectedUpozilla] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [managedBy, setManagedBy] = useState("");

  const getDistrict = (event) => {
    setSelectedDistricts(event.target.value);
  };
  const getRegion = (event) => {
    setIsDhaka(false);
    const region = regions.filter((rg) => rg._id === event.target.value);
    setSelectedRegion(region);
    fetch(`http://localhost:5000/users?role=3&region_id=${region[0]._id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        if(role==="0" || role==="1"){
        
            setSrs(data)
        }else{
            
            setSrs(data?.filter(d=>d.managed_by===userId))
        }
      }).catch(err=>console.log(err));
  };
  const getUpozilla = (event) => {
    setSelectedUpozilla(event.target.value);
  };
  const getThana = (event) => {
    setSelectedThana(event.target.value);
  };
  const handleAddShop = (event) => {
    event.preventDefault();
    const form = event.target;
    const shopName = form.shop_name.value;
    const contactNo = form.contact_no.value;
    const ownerName = form.owner_name.value;
    const address = form.address.value;
    const currentData = new Date();
    const shop = {
      shop_name: shopName,
      contact_no: contactNo,
      address,
      owner_name: ownerName,
      region_id: selectedRegion[0]._id,
      division: selectedRegion[0].division,
      district_id: selectedDistricts,
      thana: selectedThana,
      subdistrict: selectedUpozilla,
      managed_by: managedBy,
      created_at:currentData
    };

    fetch("http://localhost:5000/shop", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(shop),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success("A shop is successfully added");
          form.reset();
        }
      })
      .catch((err) => toast.error("Could not able to add! Try Again"));
  };
  useEffect(() => {
    if (username === null) {
      navigate("/");
    }
    if(role==="2"){
        fetch(`http://localhost:5000/users?role=3`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
            
            setSrs(data?.filter(d=>d.managed_by===userId))
        
      }).catch(err=>console.log(err));
    }
    
    if (role === "0") {
      fetch("http://localhost:5000/region", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRegions(data);
        }).catch(err=>console.log(err));
    } else if (role === "1") {
      fetch(`http://localhost:5000/region?assigned=${userId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRegions(data);
        }).catch(err=>console.log(err));
    } else {
      fetch(`http://localhost:5000/users/${userId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const regionId = data[0]?.region_id;
          if (role === "2") {
            fetch(`http://localhost:5000/region/${regionId}`,{
              method:"GET",
              headers:{
                "content-type":"application/json"
              }
            })
            .then(res=>res.json())
            .then(data=>{
              setSelectedRegion(data);
                setRegions(data);
            }).catch(err=>console.log(err))

            fetch(`http://localhost:5000/users?role=3&region_id=${regionId}`, {
              method: "GET",
              headers: {
                "content-type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setManagedBy(data[0]?._id);
              }).catch(err=>console.log(err));
          } else {
            fetch(`http://localhost:5000/region/${regionId}`, {
              method: "GET",
              headers: {
                "content-type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setSelectedRegion(data);
                setRegions(data);
                setManagedBy(userId);
              }).catch(err=>console.log(err));
          }
        });
    }

    if (selectedRegion.length > 0 && selectedRegion[0].division === "Dhaka") {
      selectedRegion[0].districts.forEach((element) => {
        if (element.label === "Dhaka") {
          setIsDhaka(true);
        }
      });
    } else {
      setIsDhaka(false);
    }
    if (selectedRegion.length > 0) {
      if (isDhaka) {
        setThana(selectedRegion[0].thana);
      }
      setDistricts(selectedRegion[0].districts);
    }
    if (selectedDistricts !== "") {
      fetch(`http://localhost:5000/subdistrict/${selectedDistricts}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setUpozilla(data)).catch(err=>console.log(err));
    }
  }, [
    navigate,
    username,
    selectedRegion,
    isDhaka,
    selectedDistricts,
    role,
    userId,
  ]);
  return (
    <div className="card   p-10 mt-10 lg:mt-20 lg:mx-40 lg:p-20 shadow-2xl bg-base-100 w-full lg:w-3/4  ">
      <form onSubmit={handleAddShop}>
        <p className="text-2xl text-center  font-bold">Add Shop</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Shop Name</span>
          </label>
          <input
            type="text"
            name="shop_name"
            placeholder="Name"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Contact Number</span>
          </label>
          <input
            type="text"
            name="contact_no"
            placeholder="Phone"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Address</span>
          </label>
          <input
            type="text"
            name="address"
            placeholder="Phone"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Owner's Name</span>
          </label>
          <input
            type="text"
            name="owner_name"
            placeholder="Owner's Name"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        {(role === "0" || role === "1") && (
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Region</span>
            </label>
            <select
              onChange={getRegion}
              name="select_region"
              className=" input input-bordered w-full lg:w-1/2 mb-4"
              required
            >
              <option></option>
              {regions.length > 0 &&
                regions.map((rg) => (
                  <option key={rg._id} value={rg._id}>
                    {rg.region_name}
                  </option>
                ))}
            </select>
          </div>
        )}
        {selectedRegion.length > 0 && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">District</span>
              </label>
              <select
                onChange={getDistrict}
                name="district"
                id=""
                className=" input input-bordered w-full lg:w-1/2 mb-4"
                required
              >
                <option></option>
                {districts.length > 0 &&
                  districts.map((d) => (
                    <option key={d._id} value={d.value}>
                      {d.label}
                    </option>
                  ))}
              </select>
            </div>
          </>
        )}
        {isDhaka ? (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Thana</span>
              </label>
              <select
                onChange={getThana}
                className=" input input-bordered w-full lg:w-1/2 mb-4"
              >
                <option></option>
                {thana.length > 0 &&
                  thana.map((dt) => (
                    <option key={dt._id} value={dt.value}>
                      {dt.label}
                    </option>
                  ))}
              </select>
            </div>
          </>
        ) : (
          <>
            {upozilla.length > 0 && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Upozilla</span>
                </label>
                <select
                  onChange={getUpozilla}
                  className=" input input-bordered w-full lg:w-1/2 mb-4"
                >
                  <option></option>
                  {upozilla.length > 0 &&
                    upozilla.map((dt) => (
                      <option key={dt._id} value={dt.value}>
                        {dt.label}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </>
        )}
        <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Assign SR</span>
            </label>
            <select
              onChange={e=>setManagedBy(e.target.value)}
              name="select_region"
              className=" input input-bordered w-full lg:w-1/2 mb-4"
            >
              <option></option>
              {srs.length > 0 &&
                srs.map((sr) => (
                  <option key={sr._id} value={sr._id}>
                    {sr.name}
                  </option>
                ))}
            </select>
          </div>
        <div className="form-control mt-6">
          <input
            type="submit"
            value="Add Shop"
            className="btn btn-primary w-1/2 lg:w-1/4"
          />
        </div>
      </form>
    </div>
  );
};

export default AddAndAssignShop;
