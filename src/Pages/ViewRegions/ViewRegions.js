import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";
import { toast } from "react-hot-toast";
import Loader from "../../Loader/Loader";

const ViewRegions = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [regions,setRegions] = useState([]);
  const [district, setDistrict] = useState([]);
  const [thana, setThana] = useState([]);
  const [subD, setSubD] = useState([]);
  const [users,setUsers] = useState([]);
  const [admins,setAdmins] = useState([]);
  const [singleRegion,setSingleRegion] = useState({});
  const [isLoading,setIsLoading] = useState(false);
  const  assignAdmin = e =>{
    e.preventDefault();
    const assigned = e.target.sr.value;
    const shop={
      assigned
    }
    fetch(`http://localhost:5000/asiggn-admin-region/${singleRegion._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body:JSON.stringify(shop)
    }).then(res=>res.json())
    .then(data=>{
      if(data.modifiedCount>0){
        toast.success("Admin Added to Region")
        window.location.reload(false);
      }
    }).catch(err=>console.log(err));
  }
  useEffect(() => {
    setIsLoading(true);
    if (username === null || role !== "0") {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/users", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setUsers(data);
        setSrs(data.filter(d=>d.role==='3'));
        setIsLoading(false);
    }).catch(err=>console.log(err));
    fetch("http://localhost:5000/paginated-shops?page=1", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setShops(data.shopdata);
        setPagiNationData(data.paginateData);
        setIsLoading(false);
    }).catch(err=>console.log(err));


    fetch("http://localhost:5000/district", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setDistrict(data)
        setIsLoading(false);
      }).catch(err=>console.log(err));

    fetch("http://localhost:5000/subdistrict", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setSubD(data)
        setIsLoading(false);
      }).catch(err=>console.log(err));

    fetch("http://localhost:5000/thana", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setThana(data)
        setIsLoading(false);
      }).catch(err=>console.log(err));
  }, [username, role, navigate]);
  return (
    <div>
      {
        isLoading && <Loader></Loader>
      }
      <div className="text-center my-6">
        <p className="text-4xl font-bold">All shops</p>
      </div>
      <div className='overflow-x-auto w-full'>
            <table className='mx-auto   w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Contact Number</th>
              <th>Owner Name</th>
              <th>Division</th>
              <th>District</th>
              <th>Upozilla/Thana</th>
              <th>Managed By</th>
            </tr>
          </thead>
          <tbody>
            {shops.length > 0 &&
              shops.map((it) => (
                <tr key={it._id}>
                  <td>{it.shop_name}</td>
                  <td>{it.contact_no}</td>
                  <td>{it.owner_name}</td>
                  <td>{it.division}</td>
                  <td>
                    {district.length > 0 &&
                      district.filter((ds) => ds.value === it.district_id)[0]
                        .label}
                  </td>
                  <td>
                    {
                    it.thana? (thana?.length>0 && thana?.filter(th=>th.value===it.thana)[0]?.label) : (subD?.length>0 && subD?.filter(sub=>sub.value===it.subdistrict)[0].label)
                    
                    }
                  </td>
                  <td>{it.managed_by===''?  <label htmlFor="edit-modal" onClick={()=>setSingleShop(it)} className="ml-4 btn bg-green-900 text-white">
                        Assign SR
                      </label>
                      :
                       users.filter(u=>u._id===it.managed_by)[0]?.name}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
        <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/2 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={assignAdmin}>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Assign SR</span>
            </label>
            <select
              name="sr"
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

export default ViewRegions;
