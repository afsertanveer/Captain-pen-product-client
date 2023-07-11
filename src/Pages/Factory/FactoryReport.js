import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";
import moment from "moment/moment";
import { CSVLink } from "react-csv";

const FactoryReport = () => {
  const username = localStorage.getItem("username");
  const permission = localStorage.getItem("permission");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagiNationData, setPagiNationData] = useState({});
  const [excel,setExcel] = useState([]);
  
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
        fetch(
          `http://localhost:5000/paginate-factory-stock?page=${clickedPage}`,{
            method:"GET"
          }
        )
        .then(res=>res.json())
        .then((data) => {
          setUsers(data.data);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
        });
    } else {
      fetch(
        `http://localhost:5000/paginate-factory-stock?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setUsers(data.data);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }
  };
  const setExcelData = stock=>{
    let allData= [];
    stock.forEach(s=>{
        let itemName =  s.item_name;
        let currentStock = s.current_stock;
        let prevStock = s.previous_stock;
        let increaseAmount = s.increase_amount;
        let decreaseAmount = s.decrease_amount;
        let date = moment(s.date_time).toString();
        let username = s.user;
        const singleStock = {
            itemName,currentStock,prevStock,increaseAmount,decreaseAmount,date,username
        }
        allData.push(singleStock);
        setExcel(allData);
    })
  }
  useEffect(() => {
    if (username === null || permission !== "1") {
      localStorage.clear();
      navigate("/");
    }
      fetch(`http://localhost:5000/paginate-factory-stock?page=1`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        setUsers(data.data)
        setExcelData(data.data)
        setPagiNationData(data.paginateData);
        });
    
  }, [username, permission, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold my-10">Factory Stock</p>
      </div>
      <div className="my-3  px-0 lg:px-4 flex justify-between items-center">
        <CSVLink
          data={excel}
          filename={"factory-stock.csv"}
          className="mt-3 btn bg-green-900 text-white "
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

        <div className="flex flex-col lg:flex-row md:flex-row justify-end items-center">
          <label
            // onClick={}
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
      {
        users.length>0 && <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((it) => (
                <tr key={it._id}>
                  <td>{it.item_name}</td>
                  <td>
                    {moment(it.date_time).toString()}
                  </td>
                  <td>
                    {it.current_stock}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      }
      <div className="my-6 pr-0 lg:pr-10">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
    </div>
  );
};

export default FactoryReport;
