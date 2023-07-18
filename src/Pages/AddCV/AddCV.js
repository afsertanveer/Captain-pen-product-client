import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCV = () => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");
    const navigate = useNavigate();
  
    const imageHostKey = "ebd4060c9b00b8b0232d789d6ffbf217";

    const handleAddCV= e =>{
        e.preventDefault();
        const image1 = e.target.first_image.files[0];
        const image2 = e.target.second_image.files[0];
        const formData = new FormData();
        formData.append("image", image1);
        let newCV =[];
        const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
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
                }
            })
        const formData2 = new FormData();
        formData2.append("image", image2);
        console.log(formData);
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
                    fetch(`http://localhost:5000/users-cv/${userId}`,{
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
                            navigate('/home');
                        }
                    })
                    .catch(err=>toast.error(err))
                }
            })

    }

    useEffect(()=>{
        if(username===null || role!=='3'){
            localStorage.clear();
            navigate('/');
        }
    },[username,role,navigate])
  return (
    <div className="p-4 lg:p-10">
      <form onSubmit={handleAddCV}>
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
        <div className="form-control">
          <label className="label mt-4">
            <span className="label-text font-bold">Second Page(If needed) </span>
          </label>
          <input
            name="second_image"
            id="second_image"
            type="file"
            className="input input-bordered w-full lg:w-1/2"
            
          />
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary w-1/2 lg:w-1/4">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddCV;
