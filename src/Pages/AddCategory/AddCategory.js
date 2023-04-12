import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";

const AddCategory = () => {
  
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  useEffect(()=>{
      if(username===null){
          localStorage.clear();
    navigate('/');   
      }
  })
  const item = useLoaderData();
  const item_id = item[0]._id;
  const [categories,setCategories] = useState([[]]);
  const [count,setCount] = useState(0);
  const handleAddCategory = event =>{
    
    console.log('ekhane count: ',count);
    const categoryName = document.getElementById('category').value;
    let newCategories=[[]];
    let singleArray=[];
    for(let i=0;i<categories.length;i++){
            if(categories[i].length>0){
                singleArray = [...categories[i]];
            newCategories[i] = [...singleArray];
        
            }
        console.log(newCategories);
    }
    
    newCategories[count]=[...singleArray,categoryName];
    if(count>0){
      const lenCut = newCategories[count-1].length;
      if(newCategories[count].length>lenCut){
        newCategories[count].splice(0,lenCut)
      }
    }
    // console.log(newCategories);
    setCategories(newCategories);
    document.getElementById('category').value='';
    toast.success(`${categoryName} is added to layer`)
    
  }
  const addNewCategory = getCount =>{
    setCount(prev => prev + 1)
    console.log(count);
    toast.success("New Sub Category Input Started")
  }
  const submitData = ()=>{
    const itemLayers ={
      item_id,
      layers:categories
    }
    fetch('http://localhost:5000/item-layers',{
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(itemLayers)
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.acknowledged){
        toast.success("Successfully Added all the layers");
      }
    })
  }
  const handleLayerItem = item =>{
    console.log(item);
    const newCategories =[...categories]
    for(let i=0;i<newCategories.length;i++){
      for(let j=0;j<newCategories[i].length;j++){
        if(newCategories[i][j]===item){
          if(i===0 && j===0){
            categories[i].shift();
          }
          console.log(`i value: ${i} j value ${j} `);
          newCategories[i].splice(j,j);
          break;
        }
      }
    }
    console.log(newCategories);
    setCategories(newCategories);
    console.log("hi");
  }
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
            className=" input input-bordered w-1/2"
          />
        </div>
        <button onClick={handleAddCategory} className="btn btn-primary w-1/2 lg:w-1/4">Add </button> <br></br>
        <button onClick={addNewCategory} className="btn btn-primary w-1/2 lg:w-1/4">Add New Category</button><br></br>
        <button onClick={submitData} className="btn btn-primary w-1/2 lg:w-1/4">Submit Data</button><br></br>
        {
          categories.length>0 && categories.map((allCategories,indx)=><div key={indx} className="p-5">
            {categories.length>1 && <p key={indx} className="text-3xl text-red-600 font-extrabold">Layer{indx+1}: </p>}
            <div className="p-3 flex  justify-start items-center flex-wrap gap-3">
            {allCategories.length>0 && allCategories.map((category,_idx)=>{
            return <div key={_idx} className="border border-black bg-orange-200 p-3 mr-3">
                <span  className="mr-2 text-xl  text-slate-700">{category}</span>
                <button  onClick={()=>handleLayerItem(category)} className="rounded-xl px-4 py-1 bg-slate-500 ">X</button>
            </div>            
          })}
            </div>
          <br />
          </div>
          )
        }
      
    </div>
  );
};

export default AddCategory;
