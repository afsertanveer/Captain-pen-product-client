import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { CSVLink } from "react-csv";

const CashCollection = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [due, SetDue] = useState([]);
  const [dueRecovery, setDueRecovery] = useState([]);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const getCashCollectionData = [];
  let shopName;
  let shopAddress;
  let srName;
  let asmName;
  let zoneName;
  let adminName;
  let totalDue;
  let totalCashCollection;
  let count = 1;
  let serial = 1;
  const setExcelDataBundle = () => {
    shops.forEach((sh) => {
      let singleItem = {};
      totalCashCollection = 0.0;
      shopName = sh.shop_name;
      shopAddress = sh.address;
      let srNameId = users.filter((us) => us._id === sh.managed_by)[0]?._id;
      srName = users.filter((us) => us._id === sh.managed_by)[0]?.name;
      let asmNameId = users.filter((us) => us._id === srNameId)[0]?.managed_by;
      let regionId = users.filter((us) => us._id === srNameId)[0]?.region_id;
      zoneName = regions.filter((rg) => rg._id === regionId)[0]?.region_name;
      asmName = users.filter((us) => us._id === asmNameId)[0]?.name;
      let adminId = users.filter((us) => us._id === asmNameId)[0]?.managed_by;
      adminName = users.filter((us) => us._id === adminId)[0]?.name;
      totalDue = due.filter((d) => d.shop_id === sh._id)[0]?.due;
      const recoveries = dueRecovery.filter((dr) => dr.shop_id === sh._id);
      if (recoveries.length > 0) {
        for (let i = 0; i < recoveries.length; i++) {
          singleItem = {};
          singleItem.serialIndex = count;
          singleItem.shopName = shopName;
          singleItem.shopAddress = shopAddress;
          if(role==='3'){
            if(srName===name){
              singleItem.srName = srName;
            }
          }else{
            singleItem.srName = srName;
          }
          
          if(role!=='3'){
            if(role==='2'){
              if(asmName===name){
                singleItem.asmName = asmName;
              }
            }else{
              singleItem.asmName = asmName;
            }
            
          }
          if(role==='0' || role==='1'){
            if(role===1){
              if(adminName===name){
                singleItem.adminName = adminName;
              }
            }else{
              singleItem.adminName = adminName;
            }
          }
          if(role==='0'){
            singleItem.zoneName = zoneName;
          }         
          singleItem.collectedCash = recoveries[i].paying_amount;
          singleItem.totalDue = totalDue;
          totalCashCollection = parseFloat(
            totalCashCollection + parseFloat(recoveries[i].paying_amount)
          );
          singleItem.totalCashCollection = totalCashCollection;
          singleItem.issueDate = recoveries[i].issue_date;
          singleItem.bill_link = recoveries[i].bill_link;
          if(role==='1'){
            if(singleItem.adminName===name){
              getCashCollectionData.push(singleItem);
              count++;
            }
          }else if(role==='2'){
            if(singleItem.asmName===name){
              getCashCollectionData.push(singleItem);
              count++;
            }
          }else if(role==='3'){
            if(singleItem.srName===name){
              getCashCollectionData.push(singleItem);
              count++;
            }

          }else{
            getCashCollectionData.push(singleItem);
            count++;
          }

          
        }
      } else {
        singleItem = {};
        singleItem.serialIndex = count;
        singleItem.shopName = shopName;
        singleItem.shopAddress = shopAddress;
        if(role==='3'){
          if(srName===name){
            singleItem.srName = srName;
          }
        }else{
          singleItem.srName = srName;
        }
        
        if(role!=='3'){
          if(role==='2'){
            if(asmName===name){
              singleItem.asmName = asmName;
            }
          }else{
            singleItem.asmName = asmName;
          }
          
        }
        if(role==='0' || role==='1'){
          if(role===1){
            if(adminName===name){
              singleItem.adminName = adminName;
            }
          }else{
            singleItem.adminName = adminName;
          }
        }
        if(role==='0'){
          singleItem.zoneName = zoneName;
        }
        singleItem.collectedCash = 0;
        singleItem.totalDue = totalDue;
        singleItem.totalCashCollection = totalCashCollection;
        singleItem.issueDate = due.filter(
          (d) => d.shop_id === sh._id
        )[0]?.issue_date;
        singleItem.bill_link = "";
        if(role==='1'){
          if(singleItem.adminName===name){
            getCashCollectionData.push(singleItem);
            count++;
          }
        }else if(role==='2'){
          if(singleItem.asmName===name){
            getCashCollectionData.push(singleItem);
            count++;
          }
        }else if(role==='3'){
          if(singleItem.srName===name){
            getCashCollectionData.push(singleItem);
            count++;
          }

        }else{
          getCashCollectionData.push(singleItem);
          count++;
        }
      }
    });
  };

  setExcelDataBundle();

  useEffect(() => {
    setIsLoading(true);
    if (
      username === undefined ||
      (role === "0" || role === "1" || role === "2" || role === "3") === false
    ) {
      localStorage.clear();
      navigate("/");
    }
    fetch(`http://localhost:5000/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setUsers(data);
        if (data.length > 0) {
          const uName = data.filter((d) => d._id === userId)[0]?.name;
          setFullName(uName);
        }
      });
    fetch(`http://localhost:5000/shop`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setShops(data);
        setIsLoading(false);
      });
    fetch(`http://localhost:5000/due`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        SetDue(data);
        setIsLoading(false);
      });
    fetch(`http://localhost:5000/due-recovery`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDueRecovery(data);
        setIsLoading(false);
      });

    fetch(`http://localhost:5000/region`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRegions(data);
        setIsLoading(false);
      });
  }, [username, navigate, userId, role]);
  return (
    <div>
      <div className="text-center py-4 mx-0 lg:mx-4 bg-green-300 my-8 text-white">
        <p className="text-4xl font-bold mb-4">Cash Collection</p>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Issue Date</th>
              <th>Shop Name</th>
              <th>Shop Address</th>
              <th>Cash Collection</th>
              <th>Due Amount</th>
              <th>Total Cash Collection</th>
              {(role === "0" || role === "1") && <th>Zone Name</th>}
              {role !== "3" && <th>SR Name</th>}
              {(role === "0" || role === "1") && <th>ASM Name</th>}
              {role === "0" && <th>Admin Name</th>}
              <th>Payment Image Links</th>
            </tr>
          </thead>
          <tbody>
            {getCashCollectionData.length > 0 &&
              getCashCollectionData.map((se, idx) => {
                return (
                  role === "1" &&
                  se.adminName === fullName &&
                  se.issueDate !==
                    undefined(
                      <tr key={idx + 1}>
                        <td>{serial++}</td>
                        <td>{se.issueDate}</td>
                        <td>{se.shopName}</td>
                        <td>{se.shopAddress}</td>
                        <td>{se.collectedCash}</td>
                        <td>{se.totalDue}</td>
                        <td>{se.totalCashCollection}</td>
                        {(role === "0" || role === "1") && (
                          <>
                            <td>{se.zoneName}</td>
                          </>
                        )}
                        <td>{se.srName}</td>
                        <td>{se.asmName}</td>
                        {role === "0" && <td>{se.adminName}</td>}
                        <td>
                          {se.bill_link !== "" ? (
                            <Link
                              target="_blank"
                              className="text-xl  font-medium text-green-300 hover:text-white underline"
                              to={`${se.bill_link}`}
                            >{`Click to see`}</Link>
                          ) : (
                            <span className="text-red-400 font-semibold text-xl">Yet to Collect Cash</span>
                          )}
                        </td>
                      </tr>
                    )
                );
              })}
            {role === "0" &&
              getCashCollectionData.length > 0 &&
              getCashCollectionData.map((se, idx) => {
                return (
                  se.issueDate !== undefined && (
                    <tr key={idx}>
                      <td>{serial++}</td>
                      <td>{se.issueDate}</td>
                      <td>{se.shopName}</td>
                      <td>{se.shopAddress}</td>
                      <td>{se.collectedCash}</td>
                      <td>{se.totalDue}</td>
                      <td>{se.totalCashCollection}</td>
                      <td>{se.zoneName}</td>
                      <td>{se.srName}</td>
                      <td>{se.asmName}</td>
                      <td>{se.adminName}</td>
                      <td>
                      {se.bill_link !== "" ? (
                          <Link
                            target="_blank"
                            className="text-xl font-medium text-green-300 hover:text-white underline"
                            to={`${se.bill_link}`}
                          >{`Click to see`}</Link>
                        ) : (
                          <span className="text-red-400 font-semibold text-xl">Yet to Collect Cash</span>
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
            {getCashCollectionData.length > 0 &&
              getCashCollectionData.map((se, idx) => {
                return (
                  role === "2" &&
                  se.asmName === fullName &&
                  se.issueDate !== undefined && (
                    <tr key={se.serialIndex}>
                      <td>{serial++}</td>
                      <td>{se.issueDate}</td>
                      <td>{se.shopName}</td>
                      <td>{se.shopAddress}</td>
                      <td>{se.discount}</td>
                      <td>{se.collectedCash}</td>
                      <td>{se.totalDue}</td>
                      <td>{se.totalCashCollection}</td>
                      {(role === "0" || role === "1") && (
                        <>
                          <td>{se.zoneName}</td>
                        </>
                      )}
                      <td>{se.srName}</td>
                      <td>{se.asmName}</td>
                      {role === "0" && <td>{se.adminName}</td>}
                      <td>
                      {se.bill_link !== "" ? (
                          <Link
                            target="_blank"
                            className="text-xl font-medium text-green-300 hover:text-white underline"
                            to={`${se.bill_link}`}
                          >{`Click to see`}</Link>
                        ) : (
                          <span className="text-red-400 font-semibold text-xl">Yet to Collect Cash</span>
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
            {getCashCollectionData.length > 0 &&
              getCashCollectionData.map((se, idx) => {
                return (
                  role === "3" &&
                  se.srName === fullName &&
                  se.issueDate !== undefined && (
                    <tr key={se.serialIndex}>
                      <td>{serial++}</td>
                      <td>{se.issueDate}</td>
                      <td>{se.shopName}</td>
                      <td>{se.shopAddress}</td>
                      <td>{se.collectedCash}</td>
                      <td>{se.totalDue}</td>
                      <td>{se.totalCashCollection}</td>
                      <td>
                        {se.bill_link !== "" ? (
                          <Link
                            target="_blank"
                            className="text-xl font-medium text-green-300 hover:text-white underline"
                            to={`${se.bill_link}`}
                          >{`Click to see`}</Link>
                        ) : (
                          <span className="text-red-400 font-semibold text-xl">Yet to Collect Cash</span>
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="mt-3  px-0 lg:px-4">
        <CSVLink
          data={getCashCollectionData}
          filename={"cash-collection.csv"}
          className="mt-3 btn btn-secondary"
          target="_blank"
        >
          Download me
        </CSVLink>
      </div>
    </div>
  );
};

export default CashCollection;
