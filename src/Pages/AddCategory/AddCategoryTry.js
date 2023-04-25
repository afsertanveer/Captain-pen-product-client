import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router-dom";

const AddCategoryTry = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  useEffect(() => {
    if (username === null) {
      localStorage.clear();
      navigate("/");
    }
  });
  const item = useLoaderData();
  const item_id = item[0]._id;
  const [categories, setCategories] = useState([[]]);
  const [count, setCount] = useState(0);
  const [rowIterator, setRowIterator] = useState(0);
  const [thirdLayer,setThirdLayer] = useState(0);
  const [columnIterator, setColumnIterator] = useState(0);
  let newCategories = [[]];
  const handleAddInnerCategory = event =>{
    const categoryName = document.getElementById("category").value;
    console.log("eshe porechi");
    newCategories = categories;
    if (rowIterator !== 0) {
      newCategories[rowIterator] =[];
      newCategories[rowIterator][columnIterator] = [];
    }
    console.table(newCategories);
    console.log(
      `Row Iterator: ${rowIterator} and Column Iterator: ${columnIterator}`
    );
    console.log(newCategories[rowIterator][columnIterator])
    newCategories[rowIterator][columnIterator][thirdLayer] = categoryName;
    // console.log(newCategories);
    setCategories(newCategories);
    setThirdLayer(thirdLayer + 1);
    console.table(categories);
    document.getElementById("category").value = "";
    toast.success(`${categoryName} is added to layer`);

  }
  const handleInnerCaregoryDone = event =>{
    setColumnIterator(columnIterator+1)
    setThirdLayer(0);
  }
  const handleAddCategory = (event) => {
    const categoryName = document.getElementById("category").value;

    console.table(newCategories);
    newCategories=categories
    console.log(
      `Row Iterator: ${rowIterator} and Column Iterator: ${columnIterator}`
    );
    newCategories[rowIterator][columnIterator] = categoryName;
    // console.log(newCategories);
    setCategories(newCategories);
    setColumnIterator(columnIterator + 1);
    console.table(newCategories);
    document.getElementById("category").value = "";
    toast.success(`${categoryName} is added to layer`);
  };
  const addNewCategory = (getCount) => {
    setRowIterator(rowIterator + 1);
    setColumnIterator(0);
  };
  const submitData = () => {
    const itemLayers = {
      item_id,
      layers: categories,
    };
    console.log(itemLayers);
    // fetch('http://localhost:5000/item-layers',{
    //   method:"POST",
    //   headers:{
    //     "content-type":"application/json"
    //   },
    //   body:JSON.stringify(itemLayers)
    // })
    // .then(res=>res.json())
    // .then(data=>{
    //   if(data.acknowledged){
    //     toast.success("Successfully Added all the layers");
    //   }
    // })
  };
  const handleLayerItem = (item) => {
    console.log(item);
    const newCategories = [...categories];
    for (let i = 0; i < newCategories.length; i++) {
      for (let j = 0; j < newCategories[i].length; j++) {
        if (newCategories[i][j] === item) {
          if (i === 0 && j === 0) {
            categories[i].shift();
          }
          console.log(`i value: ${i} j value ${j} `);
          newCategories[i].splice(j, j);
          break;
        }
      }
    }
    console.log(newCategories);
    setCategories(newCategories);
    console.log("hi");
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
        />
      </div>
      {rowIterator===0? <>
        <button
        onClick={handleAddCategory}
        className="btn btn-outline mb-3 w-1/2 lg:w-1/4"
      >
        Add
      </button>{" "}
      <br></br>
      </> : <>
        <button
        onClick={handleAddInnerCategory}
        className="btn btn-outline mb-3 w-1/2 lg:w-1/4"
      >
        Add InnerCategory
      </button>{" "}
      <br></br>
      
        <button
        onClick={handleInnerCaregoryDone}
        className="btn btn-outline mb-3 w-1/2 lg:w-1/4"
      >
        Next
      </button>{" "}
      <br></br>
      
      </> }
      <button
        onClick={addNewCategory}
        className="btn btn-outline mb-3 mb w-1/2 lg:w-1/4"
      >
        Add New Category
      </button>
     <br />
      <button onClick={submitData} className="btn btn-secondary mb-3 w-1/2 lg:w-1/4">
        Submit Data
      </button>
      <br></br>
      {categories.length > 0 &&
        categories.map((allCategories, indx) => (
          <div key={indx} className="p-5">
            {categories.length > 1 && (
              <p key={indx} className="text-3xl text-red-600 font-extrabold">
                Layer{indx + 1}:{" "}
              </p>
            )}
            <div className="p-3 flex  justify-start items-center flex-wrap gap-3">
              {allCategories.length > 0 &&
                allCategories.map((category, _idx) => {
                  return (
                    <div
                      key={_idx}
                      className="border border-black bg-orange-200 p-3 mr-3"
                    >
                      <span className="mr-2 text-xl  text-slate-700">
                        {category}
                      </span>
                      <button
                        onClick={() => handleLayerItem(category)}
                        className="rounded-xl px-4 py-1 bg-slate-500 "
                      >
                        X
                      </button>
                    </div>
                  );
                })}
            </div>
            <br />
          </div>
        ))}
    </div>
  );
};

export default AddCategoryTry;
