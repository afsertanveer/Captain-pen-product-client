import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { CSVLink } from "react-csv";

const SalesReport = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [sales, SetSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [fullName, setFullName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegions] = useState([]);
  const salesExcel = [];
  let unitPrice;
  let serial=1;
  const setExcelDataBundle = () => {
    sales.forEach((s) => {
      const singleItem = {};
      let flag = 0;
      singleItem.productName = [];
      singleItem.distributedAmount = [];
      singleItem.unitPrice = [];
      let managedBy;
      let admin;
      for (let i = 0; i < salesExcel.length; i++) {
        if (s.transaction_id === salesExcel[i].transactionId) {
          salesExcel[i].productName.push(s.product_name);
          salesExcel[i].distributedAmount.push(s.distributed_amount);
          salesExcel[i].unitPrice.push(s.price_per_unit);
          salesExcel[i].salesDescription = `${
            salesExcel[i].salesDescription
          }  \n   ${s.product_name} ${s.distributed_amount}*${
            s.price_per_unit
          } = ${
            parseFloat(s.price_per_unit) * parseFloat(s.distributed_amount)
          } `;
          salesExcel[i].totalPrice =
            parseFloat(salesExcel[i].totalPrice) +
            parseFloat(s.price_per_unit) * parseFloat(s.distributed_amount);
          unitPrice = products.filter(
            (p) => p.product_name === s.product_name
          )[0]?.unit_price;
          if(role==='0'){
            salesExcel[i].costDescription = `${
              salesExcel[i].costDescription
            } \n ${s.product_name}  ${s.distributed_amount}*${unitPrice}= ${
              parseFloat(unitPrice) * parseFloat(s.distributed_amount)
            }  `;
          }
          flag = 1;
        }
      }
      if (flag === 0) {
        singleItem.serialIndex = (parseInt(s.transaction_id)+1);
        singleItem.productName.push(s.product_name);
        singleItem.distributedAmount.push(s.distributed_amount);
        singleItem.unitPrice.push(s.price_per_unit);
        singleItem.transactionId = s.transaction_id;
        const seller = users.filter((u) => u._id === s.sender_id)[0];
        singleItem.srName = seller?.name;
        singleItem.shopName = shops.filter(
          (u) => u._id === s.reciever_id
        )[0]?.shop_name;
        singleItem.shopAddress = shops.filter(
          (u) => u._id === s.reciever_id
        )[0]?.address;
        singleItem.date = s.recieved_date;
        if(role==='0' || role==='1'){
          singleItem.zoneName = region.filter(
            (rg) => rg._id === seller?.region_id
          )[0]?.region_name;
          users.forEach((u) => {
            if (u._id === s.sender_id) {
              managedBy = u.managed_by;
            }
          });
        }
        if(role==='0' || role==='1'){
          singleItem.asmName = users.filter((u) => u._id === managedBy)[0]?.name;
        users.forEach((u) => {
          if (u._id === managedBy) {
            admin = u.managed_by;
          }
        });
        }
        if(role==='0' || role==='1'){
          singleItem.adminName = users.filter((u) => u._id === admin)[0]?.name;
        }
        singleItem.discount = transactions.filter(
          (t) => t.transaction_id === s.transaction_id
        )[0]?.discount;
        singleItem.due = transactions.filter(
          (t) => t.transaction_id === s.transaction_id
        )[0]?.due;
        singleItem.cashCollection = "";
        transactions.forEach((tr) => {
          if (tr.transaction_id === s.transaction_id) {
            singleItem.cashCollection =
              parseFloat(tr.total_bill) - parseFloat(tr.due);
          }
        });
        singleItem.totalPrice =
          parseFloat(s.price_per_unit) * parseFloat(s.distributed_amount);
        singleItem.salesDescription = `${s.product_name}  ${
          s.distributed_amount
        }*${s.price_per_unit}= ${
          parseFloat(s.price_per_unit) * parseFloat(s.distributed_amount)
        }  `;
        unitPrice = products.filter((p) => p.product_name === s.product_name)[0]
          ?.unit_price;
        if(role==='0'){
          singleItem.costDescription = `${s.product_name}  ${
            s.distributed_amount
          }*${unitPrice}= ${
            parseFloat(unitPrice) * parseFloat(s.distributed_amount)
          }  `;
        }
        if(role==='1'){
          if(singleItem.adminName===name){
            salesExcel.push(singleItem);
          }
        }else if(role==='2'){
          if(singleItem.asmName===name){
            salesExcel.push(singleItem);
            
          }
        }else if(role==='3'){
          if(singleItem.srName===name){
            salesExcel.push(singleItem);
            
          }

        }else{
          salesExcel.push(singleItem);
          
        }
      }
      flag = 0;
    });
  };

  setExcelDataBundle();

  useEffect(() => {
    setIsLoading(true);
    if (username === undefined || (role==='0' || role==='1' || role==='2' || role==='3' )===false) {
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
    fetch(`http://localhost:5000/product`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
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
    fetch(`http://localhost:5000/transaction`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setIsLoading(false);
      });

    fetch("http://localhost:5000/distributed-product-to-shop", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        SetSales(data);
      });
  }, [username, navigate, userId, role]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">Sales</p>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Date</th>
              <th>Shop Name</th>
              <th>Shop Address</th>
              <th>Sales Description</th>
              <th>Discount</th>
              <th>Total Price</th>
              <th>Cash Collection</th>
              <th>Due Amount</th>
              {role === "0" && <th>Cost Description</th>}
              {(role === "0" || role === "1") && <th>Zone Name</th>}
              {role !== "3" && <th>SR Name</th>}
              {(role === "0" || role === "1") && <th>ASM Name</th>}
              {role === "0" && <th>Admin Name</th>}
              <th>Bill Image Links</th>
            </tr>
          </thead>
          <tbody>
            {salesExcel.length > 0 &&
              salesExcel.map((se) => {
                return role === "1" && se.adminName === fullName && (
                  <tr key={se.serialIndex}>
                    <td>{serial++}</td>
                    <td>{se.date.split('T')[0]}</td>
                    <td>{se.shopName}</td>
                    <td>{se.shopAddress}</td>
                    <td>
                      {se.salesDescription.split("\n").length > 0
                        ? se.salesDescription.split("\n").map((i, key) => {
                            return <div key={key}>{i}</div>;
                          })
                        : se.salesDescription}
                    </td>
                    <td>{se.discount}</td>
                    <td>{se.totalPrice}</td>
                    <td>{se.cashCollection}</td>
                    <td>{se.due}</td>
                    {role === "0" && (
                      <>
                        <td>
                          {se.costDescription.split("\n").length > 0
                            ? se.costDescription.split("\n").map((i, key) => {
                                return <div key={key}>{i}</div>;
                              })
                            : se.costDescription}
                        </td>
                      </>
                    )}
                    {(role === "0" || role === "1") && (
                      <>
                        <td>{se.zoneName}</td>
                      </>
                    )}
                    <td>{se.srName}</td>
                    <td>{se.asmName}</td>
                    {role === "0" && <td>{se.adminName}</td>}
                    <td>{transactions.filter(tr=>tr.transaction_id===(se.serialIndex-1))[0]?.bill_img?.map((b,idx)=>{
                      return <div key={idx}><Link target="_blank" className="text-xl font-medium text-green-300 hover:text-white underline" to={`${b}`}>{`Image -${idx+1}`}</Link></div>
                    })}</td>
                  </tr>
                );
              })}
              {
                role==='0' && salesExcel.length>0 && salesExcel.map((se)=>{
                 return <tr key={se.serialIndex}>
                    <td>{serial++}</td>
                    <td>{se.date.split('T')[0]}</td>
                    <td>{se.shopName}</td>
                    <td>{se.shopAddress}</td>
                    <td>
                      {se.salesDescription.split("\n").length > 0
                        ? se.salesDescription.split("\n").map((i, key) => {
                            return <div key={key}>{i}</div>;
                          })
                        : se.salesDescription}
                    </td>
                    <td>{se.discount}</td>
                    <td>{se.totalPrice}</td>
                    <td>{se.cashCollection}</td>
                    <td>{se.due}</td>
                      <>
                        <td>
                          {se.costDescription.split("\n").length > 0
                            ? se.costDescription.split("\n").map((i, key) => {
                                return <div key={key}>{i}</div>;
                              })
                            : se.costDescription}
                        </td>
                      </>
                    <td>{se.zoneName}</td>
                    <td>{se.srName}</td>
                    <td>{se.asmName}</td>
                    <td>{se.adminName}</td>
                    <td>{transactions.filter(tr=>tr.transaction_id===(se.serialIndex-1))[0]?.bill_img?.map((b,idx)=>{
                      return <div key={idx}><Link target="_blank" className="text-xl font-medium text-green-300 hover:text-white underline" to={`${b}`}>{`Image -${idx+1}`}</Link></div>
                    })}</td>
                  </tr>
                })
              }
              {salesExcel.length > 0 &&
              salesExcel.map((se) => {
                return role === "2" && se.asmName === fullName && (
                  <tr key={serial++}>
                    <td>{se.serialIndex}</td>
                    <td>{se.date.split('T')[0]}</td>
                    <td>{se.shopName}</td>
                    <td>{se.shopAddress}</td>
                    <td>
                      {se.salesDescription.split("\n").length > 0
                        ? se.salesDescription.split("\n").map((i, key) => {
                            return <div key={key}>{i}</div>;
                          })
                        : se.salesDescription}
                    </td>
                    <td>{se.discount}</td>
                    <td>{se.totalPrice}</td>
                    <td>{se.cashCollection}</td>
                    <td>{se.due}</td>
                     
                    {role === "0" && (
                      <>
                        <td>
                          {se.costDescription.split("\n").length > 0
                            ? se.costDescription.split("\n").map((i, key) => {
                                return <div key={key}>{i}</div>;
                              })
                            : se.costDescription}
                        </td>
                      </>
                    )}
                    {(role === "0" || role === "1") && (
                      <>
                        <td>{se.zoneName}</td>
                      </>
                    )}
                    <td>{se.srName}</td>
                    <td>{se.asmName}</td>
                    {role === "0" && <td>{se.adminName}</td>}
                    <td>{transactions.filter(tr=>tr.transaction_id===(se.serialIndex-1))[0]?.bill_img?.map((b,idx)=>{
                      return <div key={idx}><Link target="_blank" className="text-xl font-medium text-green-300 hover:text-white underline" to={`${b}`}>{`Image -${idx+1}`}</Link></div>
                    })}</td>
                  </tr>
                );
              })}
              {salesExcel.length > 0 &&
              salesExcel.slice(0).reverse().map((se) => {
                return role === "3" && se.srName === fullName && (
                  <tr key={serial++}>
                    <td>{se.serialIndex}</td>
                    <td>{se.date.split('T')[0]}</td>
                    <td>{se.shopName}</td>
                    <td>{se.shopAddress}</td>
                    <td>
                      {se.salesDescription.split("\n").length > 0
                        ? se.salesDescription.split("\n").map((i, key) => {
                            return <div key={key}>{i}</div>;
                          })
                        : se.salesDescription}
                    </td>
                    <td>{se.discount}</td>
                    <td>{se.totalPrice}</td>
                    <td>{se.cashCollection}</td>
                    <td>{se.due}</td>
                    <td>{transactions.filter(tr=>tr.transaction_id===(se.serialIndex-1))[0]?.bill_img?.map((b,idx)=>{
                      return <div key={idx}><Link target="_blank" className="text-xl font-medium text-green-300 hover:text-white underline" to={`${b}`}>{`Image -${idx+1}`}</Link></div>
                    })}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="mt-3  px-0 lg:px-4"> 
      <CSVLink
        data={salesExcel}
        filename={"sales.csv"}
        className="mt-3 btn btn-secondary"
        target="_blank"
      >
        Download me
      </CSVLink>
      </div>
    </div>
  );
};

export default SalesReport;
