import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";

const AddCategory = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const item = useLoaderData();
  const itemId = item[0]._id;
  const [itemLayerData, setItemLayerData] = useState([]);
  // let newCategories = [...Array(3)].map(e=>e=[0])
  let newCategories =[[]];
  useEffect(() => {
    if (username === null) {
      localStorage.clear();
      navigate("/");
    }
    fetch(`http://localhost:5000/item-layers?item_id=${itemId}`, {
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
    
  }, [navigate, username, itemId]);
  const submitData = () => {
    const categoryName = document.getElementById("category").value;
    document.getElementById("category").value = "";
    let itemLayers = {

    } 
    if(itemLayerData.length>0){      
      newCategories=itemLayerData[0].layers;
      newCategories[0].push(categoryName);
      newCategories[1][itemLayerData[0].layers[0].length-1]=[0];
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
    }else{
      newCategories[0]=[categoryName]
      newCategories[1]=[[0]];
      itemLayers = {
        item_id:itemId,
        layers: newCategories,
      };
      
      fetch("http://localhost:5000/item-layers", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(itemLayers),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success("Successfully Added all the layers");
          navigate('/show-items')
        }
      });
    }
  };
  return (
    <div className="px-10">
      <h2 className="my-10 px-20 text-4xl text-center font-semibold">
        Add Category for {item[0].name}
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

export default AddCategory;

