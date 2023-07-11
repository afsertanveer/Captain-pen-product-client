import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";
import DeactivateButton from "../../Components/Common/DeactivateButton";
import PopUpModal from "../../Components/Common/PopUpModal";
import { toast } from "react-hot-toast";

const ShowUnit = () => {
  const username = localStorage.getItem("username");
  const permission = localStorage.getItem("permission");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [singleUnit,setSingleUnit] = useState({})
  const [pagiNationData, setPagiNationData] = useState({});
  
  const editUnit = (e) =>{
    e.preventDefault();
    const form = e.target;
    const name = form.unit_name.value;
    const descr = form.description.value;
    const active = "1";
    const singUnit = {
      unit:name,
      description:descr,active
    }
    fetch(`http://localhost:5000/edit-unit/${singleUnit._id}`,{
      method:"PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body:JSON.stringify(singUnit)
    }).then(res=>res.json())
    .then(data=>{
      if(data.modifiedCount>0){
        toast.success("Successfully Edited the unit");
        window.location.reload(false);
      }
    }).catch(err=>console.log(err))
    document.getElementById('edit-modal').checked = false;
  }

  const deactivateUnit = id =>{
    console.log(id);
    fetch(`http://localhost:5000/unit/${id}`,{
      method:"PUT",
      headers: {
          "Content-Type": "application/json",
      },
      
    }).then(res=>res.json())
    .then(data=>{
      console.log(data);
      if(data.modifiedCount>0){
        toast.success("Successfully disable the unit");
        window.location.reload(false);
      }
    }).catch(err=>console.log(err))
    document.getElementById('my-modal-1').checked = false;
  }
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
        fetch(
          `http://localhost:5000/paginate-unit?page=${clickedPage}`,{
            method:"GET"
          }
        )
        .then(res=>res.json())
        .then((data) => {
          setUsers(data.data);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
        });
    } else {
      fetch(
        `http://localhost:5000/paginate-unit?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setUsers(data.data);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }
  };
  useEffect(() => {
    if (username === null || permission !== "1") {
      localStorage.clear();
      navigate("/");
    }
      fetch(`http://localhost:5000/paginate-unit?page=1`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        setUsers(data.data)
        setPagiNationData(data.paginateData);
        });
    
  }, [username, permission, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">All Units</p>
      </div>
      {
        users.length>0 && <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((it) => (
                <tr key={it._id}>
                  <td>{it.unit}</td>
                  <td>
                    {it.description}
                  </td>
                  <td>
                    <div className="flex gap-1 lg:gap-4 ">
                    <label
                    className="btn bg-[#1b5e20] text-white"
                    htmlFor="edit-modal"
                    onClick={() => setSingleUnit(it)}
                  >
                    Edit
                  </label>
                        <DeactivateButton setter={setSingleUnit} value={it._id}></DeactivateButton>
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
        <div className="modal-box  w-1/2 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={editUnit}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Unit Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="unit_name"
                id="unit_name"
                defaultValue={singleUnit.unit}
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
                defaultValue={singleUnit.description}
                placeholder="Description"
              ></textarea>
            </div>
            <div className="form-control mt-4 ">
              <div className="flex justify-between">
                <input
                  type="submit"
                  value="Edit Unit"
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
      <PopUpModal remove={deactivateUnit} modalData={singleUnit} ></PopUpModal>
      <div className="my-6 pr-0 lg:pr-10">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
    </div>
  );
};

export default ShowUnit;
