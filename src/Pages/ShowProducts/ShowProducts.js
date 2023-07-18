import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import DeactivateButton from "../../Components/Common/DeactivateButton";
import PopUpModal from "../../Components/Common/PopUpModal";
import { toast } from "react-hot-toast";

const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState([]);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const deactivateProduct = id =>{
    fetch(`http://localhost:5000/product-collection/${id}`,{
      method:"PUT",
      headers: {
          "Content-Type": "application/json",
      },
      
    }).then(res=>res.json())
    .then(data=>{
      console.log(data);
      if(data.modifiedCount>0){
        toast.success("Successfully disable the Product");
        window.location.reload(false);
      }
    }).catch(err=>console.log(err))
    document.getElementById('my-modal-1').checked = false;
      
  }
  const editProduct  = e =>{
    e.preventDefault();
    const form = e.target;
    const name = form.product.value;
    const code = form.code.value;
    const price = form.price.value;
    const tot = form.tot.value;
    const product = {
      product_name:name,
      product_code:code,
      unit_price:price,
      total_pieces:tot
    }
    fetch(`http://localhost:5000/edit-product/${singleProduct._id}`,{
      method:"PUT",
      headers: {
        "content-type": "application/json",
      },
      body:JSON.stringify(product)
    }).then(res=>res.json())
    .then(data=>{
      if(data.modifiedCount>0){
        toast.success("Successfully Edited the Product");
        window.location.reload(false);
      }
    }).catch(err=>console.log(err))
    document.getElementById('edit-modal').checked = false;
  }
  useEffect(() => {
    if (role !== "0" && role !== "1") {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/product-collection", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [navigate,role]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">All Products</p>
      </div>
      <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Product Code</th>
              <th>Item Name</th>
              <th>Unit Price</th>
              <th>
                Number of<br></br>Products
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 &&
              products.map((it) => (
                <tr key={it._id}>
                  <td>{it.product_name}</td>
                  <td>{it.product_code}</td>
                  <td>{it.itemDetails.length>0? it.itemDetails[0].name : ""}</td>
                  <td>{it.unit_price}</td>
                  <td>{it.total_pieces}</td>
                  <td>
                  <label
                    className="btn bg-[#1b5e20] text-white mr-2 w-[100px]"
                    htmlFor="edit-modal"
                    onClick={() => setSingleProduct(it)}
                  >
                    Edit
                  </label>
                        <DeactivateButton  setter={setSingleProduct} value={it._id}></DeactivateButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-1/3 max-w-5xl ">
          <h3 className="font-bold text-lg text-center ">EDIT</h3>
          <form onSubmit={editProduct}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Product </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="product"
                id="product"
                defaultValue={singleProduct.product_name}
                placeholder="Product Name"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Product Code</span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="code"
                id="code"
                defaultValue={singleProduct.product_code}
                placeholder="Product Code"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Unit Price </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="number"
                name="price"
                id="price"
                min={1}
                defaultValue={singleProduct.unit_price}
                placeholder="Per Unit Price"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Total Pieces </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="number"
                name="tot"
                id="tot"
                min={1}
                defaultValue={singleProduct.total_pieces}
                placeholder="Total Pieces"
                required
              />
            </div>
            <div className="form-control mt-4">
            <div className="flex justify-between">
                <input
                  type="submit"
                  value="Edit"
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
      <PopUpModal remove={deactivateProduct} modalData={singleProduct}></PopUpModal>
    </div>
  );
};

export default ShowProducts;
