import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";

const AddSecondaryCategory = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const layerIdx = parseInt(localStorage.getItem('itemIndex'));
  const item = useLoaderData();
  const itemId = item[0]._id;
  const [itemLayerData, setItemLayerData] = useState([]);
  useEffect(() => {
    if (username === null) {
      localStorage.clear();
      navigate("/");
    }
    fetch(`http://localhost:5000/item-layers/${itemId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {        
        if (data.length > 0) {
          setItemLayerData(data);
        }
      });
  }, [navigate, username, item,itemId]);
  let newCategories;
  const submitData = () => {
    const categoryName = document.getElementById("category").value;
    document.getElementById("category").value = "";
      newCategories = itemLayerData[0].layers;
      if(newCategories[1][layerIdx][0]===0){
              
        newCategories[1][layerIdx]=[categoryName]
      
    }
    else{
        newCategories[1][layerIdx].push(categoryName)
    }      
      fetch(`http://localhost:5000/item-layers/${itemLayerData[0]._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newCategories),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            toast.success("Added to the current Categories");
            navigate('/show-items')
          }
        });
    
  };
  return (
    <div className="px-10">
      <h2 className="my-10 px-20 text-4xl text-center font-semibold">
        Add Category for {item[0].layers[0][layerIdx]}
      </h2>
      <div className="form-control">
        <input
          type="text"
          id="category"
          name="category"
          placeholder="Category Name"
          className=" input input-bordered border-black border-3 w-1/2 mb-3"
          required
        />
      </div>
      <br />
      <button
        onClick={submitData}
        className="btn bg-green-900 mb-3 w-1/2 lg:w-1/4"
      >
        Submit Data
      </button>
      <br></br>
    </div>
  );
};

export default AddSecondaryCategory;

