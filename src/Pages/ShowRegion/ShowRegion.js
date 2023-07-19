import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import Pagination from "../../Shared/Pagination/Pagination";
import { exportToCSV, fileName } from "../../utils/exportCSV";


const ShowRegion = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [pagiNationData, setPagiNationData] = useState({});
  const [allRegion,setAllRegion] = useState([]);
  const excelData =[];
  let allRegionData =[];

  const setExcelDataBundle = (zones) =>{
    zones.forEach(rg=>{
      const singleData= {};
      singleData.name = rg.region_name;
      singleData.division = rg.division;
      singleData.createdDate = rg.created_date.split("T")[0];
      let count =0;
      rg.districts.forEach(dist=>{
        if(count===0){
          singleData.district = dist.label;
          count++;
        }
        else{
          singleData.district= singleData.district +" " + dist.label;
        }
      })
      count=0;
      if(rg.hasOwnProperty('thana')===true){
        rg.thana.forEach(dist=>{
          if(count===0){
            singleData.thana = dist.label;
            count++;
          }
          else{
            singleData.thana= singleData.thana +" " + dist.label;
          }
        })
  
      }
      users.forEach(us=>{
        if(us._id===rg.assigned){
          singleData.assigned_to = us.name;
        }
      })
      excelData.push(singleData);
    })
    return excelData
  }
  allRegionData = setExcelDataBundle(allRegion);
  const all = allRegionData.reduce((accumulator, current) => {
    if (!accumulator.find((item) => item.name=== current.name)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
      
      fetch(
        `http://localhost:5000/paginate-region?page=${clickedPage}`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data) => {
        setRegions(data.data)
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
        setRegions([]);
      });
    } else {
      fetch(
        `http://localhost:5000/paginate-region?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setRegions(data.data)
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
        setRegions([]);
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    if (username === null || (role !== "0" && role !== "1")) {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/paginate-region", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRegions(data.data);
        setPagiNationData(data.paginateData);
        setIsLoading(false);
      });
    fetch("http://localhost:5000/region", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllRegion(data);
        setIsLoading(false);
      });

    fetch("http://localhost:5000/users", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setIsLoading(false);
      });
  }, [username, role, navigate]);
  return (
    <div>
      <div className="text-center py-4 mx-0 lg:mx-4 bg-green-400 my-8 text-white">
        <p className="text-4xl font-bold mb-4">Zone Report</p>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="my-3  px-0 lg:px-4 flex gap-4 items-center">
        <button
         onClick={(e) => exportToCSV(all, fileName)}
          className="mt-3 btn bg-green-900 text-white"          
        >
          All  Download
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

      </div>
      <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Division</th>
              <th>Districts</th>
              <th>Assigned To</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {regions.length > 0 &&
              regions.map((it) => (
                <tr key={it._id}>
                  <td>{it.region_name}</td>
                  <td>{it.division}</td>
                  <td>
                    {it.districts.length > 0 &&
                      it.districts.map((dis, idx) => (
                        <span key={idx} className="mr-2">
                          {dis.label}
                        </span>
                      ))}
                  </td>
                  <td>
                    {it?.assigned === "" ? (
                      <>
                        <Link to={`/assign-admin/${it._id}`}>
                          <button className="btn btn-primary  mr-2">
                            Assign Admin
                          </button>
                        </Link>
                      </>
                    ) : (
                      users.length > 0 &&
                      users?.filter((us) => us._id === it.assigned)[0].name
                    )}
                  </td>
                  <td>{it.created_date.split("T")[0]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="my-6 pr-0 lg:pr-10">
        {pagiNationData&& excelData.length>0 && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
      </div>      
    </div>
  );
};

export default ShowRegion;
