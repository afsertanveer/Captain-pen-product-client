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
  const [selectedLayer,setSelectedLayer] = useState([]);
  const handleItemChange = event =>{ 
    const sItem = event.target.value;
    setSelectedItem(sItem);
    setSelectedLayer([]);
  }
  const handleItemLayer = event =>{
    const seletcedItemLayer = event.target.value;
    const selectedLayerArray = [...selectedLayer,seletcedItemLayer];
    setSelectedLayer(selectedLayerArray);

    
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
      layers:selectedLayer,
      unit_price:unitPrice,
      total_pieces:totalPieces
    };
    console.log(product);
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
                toast.success("New Product is added");
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
    <div className="p-4">
      <form onSubmit={handleAddProduct}>
        <div className="form-control mb-3">
          <label htmlFor="product_name" className="mb-2 text-xl font-bold">Product Name</label>
          <input type="text" name="product_name" id="product_name" placeholder="Product Name" className=" input input-bordered w-1/2 mr-2" required />
        </div>
        <div className="form-control mb-3">
          <label htmlFor="product_name" className="mb-2 text-xl font-bold">Product Code</label>
          <input type="text" name="product_code" id="product_code" placeholder="Product Code" className=" input input-bordered w-1/2 mr-2" required />
        </div>
        <div className="form-control">
            <label htmlFor="item_dropdown">Item Name</label>
            <select onChange={handleItemChange} name="item_dropdown" id="item_dropdown" className=" input input-bordered w-1/2 mr-2" >
                <option value={null} defaultChecked>----Select Item ------</option>
                {
                   item.length>0 && item.map(it=><option  key={it._id} value={it._id}>{it.name}</option>)
                }
            </select>
        </div>
        <div className="my-4 flex">
        {
          itemLayers.length>0 && itemLayers[0].layers.length>0 && itemLayers[0].layers.map((itemLayer,index)=>{
            return <select onChange={handleItemLayer} key={index} className=" input input-bordered w-1/2 mr-5">
              <option value={null} defaultChecked>----Select Item ------</option>
              {
                
                itemLayer.length>0 && itemLayer.map((layer,idx)=><option key={idx} value={layer}>{layer}</option>
                 )
              }
            </select>
            
          })
        }
        </div>
        <div className="form-control mb-3">
          <label htmlFor="product_name" className="mb-2 text-xl font-bold">Unit Price</label>
          <input type="text" name="unit_price" id="unit_price" placeholder="Unit Price" className=" input input-bordered w-1/2 mr-2" required />
        </div>
        <div className="form-control mb-3">
          <label htmlFor="product_name" className="mb-2 text-xl font-bold">Total Pieces</label>
          <input type="text" name="total_pieces" id="total_pieces" placeholder="Number of Products" className=" input input-bordered w-1/2 mr-2" required />
        </div>

        <input type="submit" className="btn btn-outline" value="Add Product" />
      </form>
    </div>
  );
};

export default AddProduct;
