import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";
import { toast } from "react-hot-toast";
import axios from "axios";

const ShowUsers = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagiNationData, setPagiNationData] = useState({});
  const [singleUser,setSingleUser] = useState({});  

  const setRole = role=>{
    if(role!=="-1"){
      fetch(
        `http://localhost:5000/users?role=${role}`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data) => {
        setUsers(data);
        setPagiNationData({});
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }else{
      fetch(`http://localhost:5000/paginated-users?page=1`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        setUsers(data.userData)
        setPagiNationData(data.paginateData);
        }).catch(err=>console.log(err))
    }
  }
  
  const addCV= async(e) =>{
    e.preventDefault();
    let images,formData    
     formData = new FormData();
     images = e.target.images.files
     console.log(images);
     if(images.length>2){
      toast.error('Cannot Upload more than two photo');
     }else{
      for(let i=0 ; i<images.length;i++){
        console.log('h');
        const singleImg = images[i];
        formData.append('files',singleImg)
      }
      console.log(formData);
     }

     const result =await axios.put(`http://localhost:5000/users-cv/${singleUser._id}`,formData)
      if(result.data.modifiedCount>0){
        toast.success("CV added");
        window.location.reload(false);
      }
   
           
}

  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
        fetch(
          `http://localhost:5000/paginated-users?page=${clickedPage}`,{
            method:"GET"
          }
        )
        .then(res=>res.json())
        .then((data) => {
          setUsers(data.userData);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
        });
    } else {
      fetch(
        `http://localhost:5000/paginated-users?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setUsers(data.userData);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }
  };
  useEffect(() => {
    if (username === null || role !== "0") {
      localStorage.clear();
      navigate("/");
    }
      fetch(`http://localhost:5000/paginated-users?page=1`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        setUsers(data.userData)
        setPagiNationData(data.paginateData);
        }).catch(err=>console.log(err))
    
  }, [username, role, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mt-10">All Users</p>
      </div>
      <div className="flex justify-center">
      <div className="w-full lg:w-1/2 px-10 py-10  ">   
          <select name="unit" id="unit" className="input input-bordered w-full lg:w-1/2 mb-2 border-black font-extrabold" onChange={e=>setRole(e.target.value)}>
            <option value={"-1"}>Select Role</option>
            <option value={"1"}>Admin</option>
            <option value={"2"}>ASM</option>
            <option value={"3"}>SR</option>
          </select>
        </div>
      </div>
      <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Add CV</th>
              <th>Show CV</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((it) => (
                  it.role!=="0" && <tr key={it._id}>
                  <td>{it.name}</td>
                  <td>
                    {it.role === "0"
                      ? "superadmin"
                      : it.role === "1"
                      ? "Admin"
                      : it.role === "2"
                      ? "ASM"
                      : "SR"}
                  </td>
                  <td>{it.created_at}</td>
                  <td>{it.cv?.length>0?  
                   <p className="font-semibold">Already Added</p>
                  :
                  <label htmlFor="edit-modal" onClick={()=>setSingleUser(it)} className="ml-4 btn bg-green-900 text-white">
                        Add CV
                        </label>
                  } </td>
                  <td>
                      {it.cv?.length > 0 ? (
                        <Link
                          className="text-lg underline text-green-600 hover:bg-red-200"
                          target="_blank"
                          to={`/show-cv/${it._id}`}
                        >
                          View CV
                        </Link>
                      ) : (
                        <p className="font-semibold">Yet to be Added</p>
                      )}
                    </td>
                </tr>                
              ))}
          </tbody>
        </table>
      </div>
      <div className="my-6 pr-0 lg:pr-10">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
        <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-5/6 lg:w-1/2 max-w-5xl ">
          <form onSubmit={addCV}>
        <p className="text-2xl text-center  font-bold">Add CV</p>
        <div className="form-control">
          <label className="label mt-4">
            <span className="label-text font-bold">Upload Images (Max 2) </span>
          </label>
          <input
            name="images"
            id="images"
            type="file"
            className="input input-bordered w-full lg:w-1/2"
            multiple
            required
          />
        </div>
        <div className="form-control mt-4">
            <div className="flex justify-between">
                <input
                  type="submit"
                  value="ADD CV"
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

export default ShowUsers;
