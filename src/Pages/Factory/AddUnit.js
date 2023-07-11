import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddUnit = () => {
  const username = localStorage.getItem("username");
  const permission = localStorage.getItem("permission");
  const navigate = useNavigate();
  const addUnit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.unit_name.value;
    const descr = form.description.value;
    const active = "1";
    const unit ={
        unit:name,
        description:descr,active
    }
    // console.log(subject,file);
    await fetch(`http://localhost:5000/unit`,{
        method:"POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(unit),
    })
      .then((res) => res.json())
      .then(( data ) => {
      toast.success("Unit Added Successfully");
      form.reset();
    }).catch(err=>{
      toast.error("This unit already exists! Please check the list")
    })
  };
  useEffect(() => {
    if (username === null || permission !== "1") {
      localStorage.clear();
      navigate("/");
    }
    
  }, [username, permission, navigate]);
  return (
    <div>
      <div className="w-full lg:w-1/2 py-10 mt-10 bg-white flex flex-col mx-auto  px-4 border border-white rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">
          Add Unit
        </h1>
        <div className="px-4 lg:px-20">
          <form onSubmit={addUnit}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Unit Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="unit_name"
                id="unit_name"
                placeholder="Unit Name"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Description </span>
              </label>
              <textarea
                className="textarea textarea-info  border-black"
                name="description"
                id="description"
                placeholder="Description"
              ></textarea>
            </div>
            <div className="form-control mt-4">
              <input
                type="submit"
                value="Add Unit"
                className="btn w-[150px]"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUnit;