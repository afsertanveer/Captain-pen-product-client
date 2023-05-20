import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Link, useNavigate } from "react-router-dom";

const ShowRegion = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const [users, setUsers] = useState([]);

  const excelData =[];
  regions.forEach(rg=>{
    const singleData= {};
    singleData.name = rg.region_name;
    singleData.division = rg.division;
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
    // if(typeof(rg.thana)!=='undefined'){
    //   rg.thana(th=>{
    //     singleData.thana = singleData.thana + " " + th.label;
    //   })
    // }else{
    //   singleData.thana="";
    // }
    users.forEach(us=>{
      if(us._id===rg.assigned){
        singleData.assigned_to = us.name;
      }
    })
    excelData.push(singleData);
  })
  useEffect(() => {
    if (username === null || (role !== "0" && role !== "1")) {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/region", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setRegions(data));

    fetch("http://localhost:5000/users", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [username, role, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">All Regions</p>
      </div>
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Division</th>
              <th>Districts</th>
              <th>Assigned To</th>
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
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <CSVLink
        data={excelData}
        filename={"region.csv"}
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
  );
};

export default ShowRegion;
