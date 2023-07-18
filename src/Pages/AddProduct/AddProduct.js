import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  useEffect(()=>{
      if(username===null){
          localStorage.clear();
    navigate('/');   
      }
  })
  const [item, setItem] = useState([]);
  const [selectedItem,setSelectedItem] = useState(null);
  const [itemLayers,setItemLayers] = useState([]);
  const [category,setCategory] = useState('');
  const [secondaryCategory,setSecondaryCategory] = useState('');
  const [index,setIndex] = useState(-1);
  const handleItemChange = event =>{ 
    const sItem = event.target.value;
    setSelectedItem(sItem);
  }
  const handleItemLayer = event =>{
    const seletcedItemLayer = parseInt(event.target.value);
    console.log(seletcedItemLayer);
    setCategory(itemLayers[0].layers[0].filter((layer,idx)=>idx===seletcedItemLayer)[0]);
    setIndex(seletcedItemLayer);

    
  }
  const handleAddProduct =  event =>{
    event.preventDefault();
    const form = event.target;
    const productName = form.product_name.value;
    const productCode = form.product_code.value;
    const unitPrice = form.unit_price.value;
    const totalPieces = form.total_pieces.value;
    const product ={
      product_name:productName,
      product_code:productCode,
      item_id:selectedItem,
      category,
      secondary_category:secondaryCategory,
      unit_price:unitPrice,
      total_pieces:totalPieces,
      active:"1"
    };
    fetch('http://localhost:5000/products',{
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(product)
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.acknowledged){
        fetch('http://localhost:5000/core-products',{
          method:"POST",
          headers:{
            "content-type":"application/json"
          },
          body:JSON.stringify(product)
        })
        .then(res=>res.json())
        .then(corePro=>{
          if(corePro.acknowledged){
            toast.success("New Product is added");
            navigate('/show-product')
          }
        })
      }
    })
    .catch(err=>toast.error(`${err}`))
  }
  useEffect(() => {
    fetch("http://localhost:5000/items", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setItem(data));


    fetch(`http://localhost:5000/item-layers?item_id=${selectedItem}`,{
      method:"GET",
      headers:{
        "content-type":"application/json"
      }
    })
    .then(res=>res.json())
    .then(data=>setItemLayers(data))
    
  },[selectedItem]);
  return (
    <div className=" px-20 ">
      <div className="mt-20">
        <h1 className="font-extrabold text-4xl text-center">Add Product</h1>
      </div>
      <div className=" flex justify-center items-center my-5 lg:my-15">
      <form className="w-full lg:w-1/2 " onSubmit={handleAddProduct}>
        <div className="form-control mb-3">
          <label htmlFor="product_name" className="mb-2 text-xl font-bold">Product Name</label>
          <input type="text" name="product_name" id="product_name" placeholder="Product Name" className=" input input-bordered w-full lg:w-1/2 mr-2" required />
        </div>
        <div className="form-control mb-3">
          <label htmlFor="product_name" className="mb-2 text-xl font-bold">Product Code</label>
          <input type="text" name="product_code" id="product_code" placeholder="Product Code" className=" input input-bordered w-full lg:w-1/2 mr-2" required />
        </div>
        <div className="form-control">
            <label htmlFor="item_dropdown">Item Name</label>
            <select onChange={handleItemChange} name="item_dropdown" id="item_dropdown" className=" input input-bordered w-full lg:w-1/2 mr-2" >
                <option value={null} defaultChecked>----Select Item ------</option>
                {
                   item.length>0 && item.map(it=><option  key={it._id} value={it._id}>{it.name}</option>)
                }
            </select>
        </div>
        <div className="my-4 flex">
        <select onChange={handleItemLayer}  className=" input input-bordered w-full lg:w-1/2 mr-5">
        <option value={null} defaultChecked>----Select Category ------</option>
        {
          itemLayers.length>0 && itemLayers[0].layers.length>0 && itemLayers[0].layers[0].map((layer,idx)=>{
            return <option key={idx} value={idx}>{layer}</option>
          })
        }
        </select>
        {
          index!==-1 && itemLayers[0].layers[1][index][0]!==0 && <select onChange={(e)=>setSecondaryCategory(e.target.value)}  className=" input input-bordered w-full lg:w-1/2 mr-5">
          <option value={null} defaultChecked>----Select Secondary Category ------</option>
          {
            itemLayers.length>0 && itemLayers[0].layers.length>0  && itemLayers[0].layers[1][index].map((layer,idx)=>{
              return <option key={idx} value={layer!==0? layer: ''}>{layer!==0? layer: ''}</option>
            })
          }
          </select>
        }
        </div>
        <div className="form-control mb-3">
          <label htmlFor="product_name" className="mb-2 text-xl font-bold">Unit Price</label>
          <input type="number" name="unit_price" id="unit_price" placeholder="Unit Price" className=" input input-bordered w-full lg:w-1/2 mr-2" required />
        </div>
        <div className="form-control mb-3">
          <label htmlFor="product_name" className="mb-2 text-xl font-bold">Total Pieces</label>
          <input type="number" name="total_pieces" id="total_pieces" placeholder="Number of Products" className=" input input-bordered w-full lg:w-1/2 mr-2" required />
        </div>

        <input type="submit" className="btn btn-outline" value="Add Product" />
      </form>
      </div>
    </div>
  );
};

export default AddProduct;
