import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";
import { toast } from "react-hot-toast";
import { imageHostKey } from "../../utils/imgHostKey";

const ShowUsers = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagiNationData, setPagiNationData] = useState({});
  const [singleUser,setSingleUser] = useState({});  
  const [clicked,setClicked] = useState(false); 

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
  
  const addCV= e =>{
    e.preventDefault();
    let image1,image2,formData,formData2
    let newCV =[];
    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
    if(clicked){
     image1 = e.target.first_image.files[0];
     image2 = e.target.second_image.files[0];
     formData = new FormData();
     formData.append("image", image1);    
     formData2 = new FormData();
    formData2.append("image", image2);
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imgData) => {
            if(imgData.success){
                console.log(imgData.data.url);
                const cv = {
                    img:imgData.data.url
                }
                 newCV.push(cv);
                 fetch(url, {
                  method: "POST",
                  body: formData2,
                })
                  .then((res) => res.json())
                  .then((imgData) => {
                      if(imgData.success){
                          console.log(imgData.data.url);
                          const cv = {
                              img:imgData.data.url
                          }
                           newCV.push(cv);
                           const user ={
                            cv:newCV
                        }
                        fetch(`http://localhost:5000/users-cv/${singleUser._id}`,{
                            method:"PUT",
                            headers:{
                                "content-type":"application/json"
                            },
                            body:JSON.stringify(user)
                        })
                        .then(res=>res.json())
                        .then(data=>{
                            if(data.modifiedCount>0){
                                toast.success('CV Added Successfully');
                                window.location.reload(false);
                            }
                        })
                        .catch(err=>toast.error(err))
                      }
                  })
            }
        })    
    }else{
      image1 = e.target.first_image.files[0];
      formData = new FormData();
      formData.append("image", image1);   
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imgData) => {
            if(imgData.success){
                console.log(imgData.data.url);
                const cv = {
                    img:imgData.data.url
                }
                 newCV.push(cv);
                 
                const user ={
                  cv:newCV
                     }
                fetch(`http://localhost:5000/users-cv/${singleUser._id}`,{
                    method:"PUT",
                    headers:{
                        "content-type":"application/json"
                    },
                    body:JSON.stringify(user)
                })
                .then(res=>res.json())
                .then(data=>{
                    if(data.modifiedCount>0){
                        toast.success('CV Added Successfully');
                        window.location.reload(false);
                    }
                })
                .catch(err=>toast.error(err))
                      }
        }) 
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
                    <div className="flex flex-col justify-center items-center">
                    {it.cv?.length>0?   
                     
                     it.cv.map((cvImage,idx)=><Link className="text-lg underline text-green-600 hover:bg-red-200" key={idx} target="_blank" to={`${cvImage.img}`}>Image{idx}</Link>
                    )
                    
                   :<p className="font-semibold">Yet to be Added</p> }
                    </div>
                    
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
            <span className="label-text font-bold">First Page </span>
          </label>
          <input
            name="first_image"
            id="first_image"
            type="file"
            className="input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        {
          !clicked && <div className="flex items-center gap-2 my-3">
          <label htmlFor="" className="label mt-4">For another Image Click</label>
          <button className=" rounded-lg btn bg-green-900 text-white w-10 " onClick={()=>setClicked(!clicked)}> +</button>
        </div>
        }
        {
          clicked && <div className="form-control">
          <label className="label mt-4">
            <span className="label-text font-bold">Second Page </span>
          </label>
          <input
            name="second_image"
            id="second_image"
            type="file"
            className="input input-bordered w-full lg:w-1/2"
            required
            
          />
        </div>
        }
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
