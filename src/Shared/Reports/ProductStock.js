import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import Pagination from "../Pagination/Pagination";
import { exportToCSV, fileName } from "../../utils/exportCSV";

const ProductStock = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [products,setProducts] = useState([]);
  // const [allProducts,setAllProducts] = useState([]);
  const [totalProduct,setTotalProduct] = useState(0);
  const [totalCost,setTotalCost] = useState(0);
  const [filteredProduct,setFilteredProduct] = useState(null);
  const [filteredCategory,setFilteredCategory] = useState(null);
  const [filteredSecondaryCategory,setFilteredSecondaryCategory] = useState(null);
  let serial = 1 ;
  let excelData =[];
  // let allExcelData = [];
  const productExcelData = [];
  const setExcelDataBundle = (allProducts) => {
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
    return productExcelData;
  }
  const [pagiNationData, setPagiNationData] = useState({});
  const [open,setOpen] = useState(true);
  excelData = setExcelDataBundle(products);
  excelData = excelData.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.productName=== current.productName)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  // allExcelData = setExcelDataBundle(allProducts);
  // allExcelData = allExcelData.reduce((accumulator, current) => {
  //   if (!accumulator.find((item) => item.productName=== current.productName)) {
  //     accumulator.push(current);
  //   }
  //   return accumulator;
  // }, []);
  const filterData = (e) => {
    e.preventDefault();
    let url =`http://localhost:5000/product?`;
    if(filteredProduct!==null){
      url = url+`&product_name=${filteredProduct}`;
    }
    if(filteredCategory!==null){
      url = url+`&category=${filteredCategory}`;
    }
    if(filteredSecondaryCategory!==null){
      url = url+`&secondary_category=${filteredSecondaryCategory}`;
    }
   
    fetch(url,{
       method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        let totNum= 0;
        let piecesNum= 0;
        setProducts(data)
        excelData = setExcelDataBundle(products);
        setFilteredProduct(null);
        setOpen(false);
        if(data.length>0){
          for(let i=0;i<data.length;i++){
              piecesNum =piecesNum + parseInt(data[i].total_pieces);
               totNum = totNum + (parseInt(data[i].total_pieces)* parseInt(data[i].unit_price))
          }
      }
      setTotalProduct(piecesNum);
        setTotalCost(totNum);
      });
      e.target.reset();
      document.getElementById('my-modal').checked = false;
  };
  const clearFilter = () => {
    window.location.reload(false);
  };
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
      
      fetch(
        `http://localhost:5000/paginate-product?page=${clickedPage}`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data) => {
        setProducts(data.data)
        excelData = setExcelDataBundle(products);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
        setProducts([]);
      });
    } else {
      fetch(
        `http://localhost:5000/paginate-product?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setProducts(data.data)
        excelData = setExcelDataBundle(products);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
        setProducts([]);
      });
    }
  };
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
        if(data.length>0){
        const productData = data;
        let tot= 0;
        let pieces = 0;
        if(data.length>0){
            for(let i=0;i<productData.length;i++){
                pieces =pieces + parseInt(productData[i]?.total_pieces);
                 tot = tot + (parseInt(productData[i]?.total_pieces)* parseInt(productData[i]?.unit_price))
            }
        }
        setTotalProduct(pieces);
        setTotalCost(tot);
        setIsLoading(false);
        }
      });
    fetch(`http://localhost:5000/paginate-product`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
        setPagiNationData(data.paginateData);
        setIsLoading(false);
      });
    // fetch(`http://localhost:5000/all-product-d`, {
    //   method: "GET",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((data) => setAllProducts(data));
  }, [username, navigate, role]);
  return (
    <div>
      <div className="text-center py-4 mx-0 lg:mx-4 bg-green-300 my-8 text-white">
        <p className="text-4xl font-bold mb-4">Product Stock</p>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="my-3  px-0 lg:px-4 flex justify-between items-center">
      <div>
      <button
         onClick={(e) => exportToCSV(excelData, fileName)}
          className="mt-3 ml-4 btn bg-green-900 text-white"          
        >
          Download
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
        </button>
        {/* <button
         onClick={(e) => exportToCSV(allExcelData, fileName)}
          className="mt-3 ml-4 btn bg-green-900 text-white"          
        >
          All Download
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
        </button> */}
      </div>

        <div className="flex flex-col lg:flex-row md:flex-row justify-end items-center">
          <label
            onClick={clearFilter}
            className="btn bg-red-600 text-white mr-2 mb-2 md:mb-0 lg:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filter
          </label>
          <label htmlFor="my-modal" className="btn bg-green-900 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
            Filters
          </label>
        </div>
      </div>
      <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
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
            excelData.length>0 && excelData.map(p=>{
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
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-11/12 max-w-5xl ">
          <h3 className="font-bold text-lg ">Filters</h3>
          <form onSubmit={filterData} className="my-4" id="filter-form">
            <label htmlFor="">Select Product</label>
            <br />
            <select
              id="select_shop"
              className="input input-bordered w-full lg:w-1/2"
              placeholder="Select Shop"
              onChange={(e) => setFilteredProduct(e.target.value===''? null : e.target.value)}
            >
              <option value={null}></option>
              {products.length > 0 &&
                products.map((sh) => (
                  <option key={sh._id} value={sh.product_name}>
                    {sh.product_name}
                  </option>
                ))}
            </select>
            <br />
            <label htmlFor="">Select Category</label>
            <br />
            <select
              id="select_category"
              className="input input-bordered w-full lg:w-1/2"
              placeholder="Select Shop"
              onChange={(e) => setFilteredCategory(e.target.value===''? null : e.target.value)}
            >
              <option value={null}></option>
              {products.length > 0 &&
                [...new Set(products.map(p=>p.category))].filter(x=>x!=='').map(sh => (
                    
                    <option key={sh}  value={sh}>
                    {sh}
                  </option>
                ))}
            </select>
            <br />
            <label htmlFor="">Select Secondary Category</label>
            <br />
            <select
              id="select_shop"
              className="input input-bordered w-full lg:w-1/2"
              placeholder="Select Shop"
              onChange={(e) => setFilteredSecondaryCategory(e.target.value===''? null : e.target.value)}
            >
              <option value={null}></option>
              {products.length > 0 &&
                [...new Set(products.map(p=>p.secondary_category))].filter(x=>x!=='').map(sh => (
                    
                    <option key={sh}  value={sh}>
                    {sh}
                  </option>
                ))}
            </select>
            <br />
            <br />
            <div  htmlFor="my-modal" className="mx-4 my-4 flex justify-end">
              <input
                type="submit"
                className="btn bg-green-900 text-white mr-2"
                value="Filter"
              />

              <label htmlFor="my-modal" className="btn bg-red-900">
                Close
              </label>
            </div>
          </form>
        </div>
      </div>
      <div className="my-6 pr-0 lg:pr-10">
        {pagiNationData && open && excelData.length>0 && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
      </div>
    </div>
  );
};

export default ProductStock;
