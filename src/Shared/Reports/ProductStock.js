import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { CSVLink } from "react-csv";

const ProductStock = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [products,setProducts] = useState([]);
  const [totalProduct,setTotalProduct] = useState(0);
  const [totalCost,setTotalCost] = useState(0);
  let serial = 1 ;
  const productExcelData = [];
  const setExcelDataBundle = () => {
    const allProducts = products;
    for(let i=0;i<allProducts.length;i++){
        const singleItem = {};
        singleItem.productName = allProducts[i].product_name;
        singleItem.category = allProducts[i].category;
        singleItem.totalPieces = allProducts[i].total_pieces;
        if(allProducts[i].secondary_category!==""){
            singleItem.category = singleItem.category + ` => ${allProducts[i].secondary_category}`
        }
        if(role==='0'){
            singleItem.unitCost = allProducts[i].unit_price;
        }
        productExcelData.push(singleItem);
    }
  }
  setExcelDataBundle();

  useEffect(() => {
    setIsLoading(true);
    if (
      username === undefined ||
      (role === "0" || role === "1" ) === false
    ) {
      localStorage.clear();
      navigate("/");
    }
   
    fetch(`http://localhost:5000/product`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        let tot= 0;
        let pieces = 0;
        if(data.length>0){
            for(let i=0;i<data.length;i++){
                pieces =pieces + parseInt(data[i].total_pieces);
                 tot = tot + (parseInt(data[i].total_pieces)* parseInt(data[i].unit_price))
            }
        }
        setTotalProduct(pieces);
        setTotalCost(tot);
        setIsLoading(false);
      });
  }, [username, navigate, role]);
  return (
    <div>
      <div className="text-center py-4 mx-0 lg:mx-4 bg-green-300 my-8 text-white">
        <p className="text-4xl font-bold mb-4">Product Stock</p>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Total Pieces</th>
              {role==='0' && <th>Unit Cost</th>}
            </tr>
          </thead>
          <tbody>
          {
            productExcelData.length>0 && productExcelData.map(p=>{
                return <tr key={serial}>
                    <td>{serial++}</td>
                    <td>{p.productName}</td>
                    <td>{p.category}</td>
                    <td>{p.totalPieces}</td>
                    {role==='0' && <td>{p.unitCost}</td>}
                </tr>
            })
          }
          </tbody>
        </table>
      </div>
      {role==='0' && <div className="mt-3  px-0 lg:px-4 flex justify-around items-center">
          <span className="text-xl font-semibold text-red-500">{`Total Products=> ${totalProduct}`}</span>
          <span className="text-xl font-semibold text-red-500">{`Total Cost=> ${totalCost}`}</span>
      </div>}
      <div className="mt-3  px-0 lg:px-4">
        <CSVLink
          data={productExcelData}
          filename={"product-stock.csv"}
          className="mt-3 btn bg-green-900"
          target="_blank"
        >
           Download{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-2 w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </CSVLink>
      </div>
    </div>
  );
};

export default ProductStock;
