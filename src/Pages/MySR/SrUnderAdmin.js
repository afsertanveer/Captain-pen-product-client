import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import { imageHostKey } from "../../utils/imgHostKey";

const SrUnderAdmin = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(false);
  const [singleUser,setSingleUser] = useState({});
  const [clicked,setClicked] = useState(false);
  const addCV= e =>{
    e.preventDefault();
    if(clicked){
      
    }
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
  useEffect(() => {
    setLoading(true);
    if (username === null || role !== "1") {
      localStorage.clear();
      navigate("/");
    }

    fetch(`http://localhost:5000/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        if(data.length>0){
            let asms =[];
            asms=data.filter(d=>d.managed_by===userId);
            const srs= [];
            for(let i=0;i<asms.length;i++){
                for(let j=0;j<data.length;j++){
                    if(asms[i]._id===data[j].managed_by){
                        srs.push(data[j]);
                    }
                }
            }
            setUsers(srs);
            setLoading(false);
        }
      });
  }, [username, role, navigate,userId]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">MY SR</p>
      </div>
      {
        users.length>0 && <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
              <th>Add CV</th>
              <th>Show CV</th>
            </tr>
          </thead>
          {loading && <Loader></Loader>}
          <tbody>
            {users.length > 0 &&
              users.map((it) => (
                <tr key={it._id}>
                  <td>{it.name}</td>                  
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
      }
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

export default SrUnderAdmin;
