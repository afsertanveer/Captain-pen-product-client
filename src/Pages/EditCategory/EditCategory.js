import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";

const EditCategory = () => {
  
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  useEffect(()=>{
      if(username===null || role!=='0' ){
          localStorage.clear();
    navigate('/');   
      }
  },[username,role,navigate])
  const layeritem = useLoaderData();
  const layeritemId = layeritem[0]?._id;
  const id = layeritem[0]?.item_id;
  let layers = [[]];
  layers = layeritem[0]?.layers;
  const [item,setItem] = useState([]);
  const [newLayer,setNewLayer] = useState(layers);
  const layerNew = [...newLayer];
  
  const updateCategory = idx =>{
    const newCategory = document.getElementById(`layer${idx}`).value;
    layerNew[idx].push(newCategory);
    document.getElementById(`layer${idx}`).value='';
    setNewLayer(layerNew);
  }
  const updateLayer = ()=>{
    const updatedLayer = {
        item_id:id,
        layers:newLayer
    };
    console.log(updatedLayer);
    fetch(`http://localhost:5000/item-layers/${layeritemId}`,{
        method:"PUT",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(updatedLayer)
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.modifiedCount>0){
            toast.success('Changes are successfull and saved');
        }
    })
  }
  const handleDeleteLayer = (i,j) =>{
    if(i===0 & j===0){
      layerNew[i].shift();
      setNewLayer(layerNew);
    }
    else{
      layerNew[i].splice(j,j);
      setNewLayer(layerNew);
    }
  }
  useEffect(()=>{
    fetch(`http://localhost:5000/items/${id}`,{
        method:"GET",
        headers:{
            "content-type":"application/json"
        }
    })
    .then(res=>res.json())
    .then(data=>setItem(data))
  },[id])
 
  return (
    <div className="px-10">
      <h2 className="my-10 px-20 text-4xl text-center font-semibold">
        Edit Existing Category for {item.length>0 && item[0].name}{layers.length}
      </h2>
      {
        newLayer?.map((layer,idx)=><div key={idx} >
            <input 
            type="text"
            id={`layer${idx}`}
            placeholder="Category Name"
            className=" input input-bordered w-full lg:w-1/2 mr-2"
            />
            <button onClick={()=>updateCategory(idx)} className="btn btn-primary w-1/2 lg:w-1/4">Update</button>
            <div key={idx} className="p-3 flex  justify-start items-center flex-wrap gap-3">
            {
                layer?.map((lyr,indx)=>{
                    return <div key={indx} className="border border-black bg-orange-200 p-3 mr-3">
                <span  className="mr-2 text-xl  text-slate-700">{lyr}</span>
                <button onClick={()=>handleDeleteLayer(idx,indx)}   className="rounded-xl px-4 py-1 bg-slate-500 ">X</button>
            </div>
                })
            }
            </div>
        </div>)
      }
      <button onClick={updateLayer} className="mr-4 btn bg-green-900">Submit</button>
      
    </div>
  );
};

export default EditCategory;
