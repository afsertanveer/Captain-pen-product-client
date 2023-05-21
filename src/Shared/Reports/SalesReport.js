import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { CSVLink } from "react-csv";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const SalesReport = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [asmUsers, setAsmUsers] = useState([]);
  const [sRUsers, setSRUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState([]);
  const [filteredShop, setFilteredShop] = useState(null);
  const [filteredZone, setFilteredZone] = useState(null);
  const [filteredAdmin, setFilteredAdmin] = useState(null);
  const [filteredASM, setFilteredASM] = useState(null);
  const [filteredSR, setFilteredSR] = useState(null);
  let salesExcel = [];
  const [showCalendar, setShowCalendar] = useState(false);
  const [state, setState] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  let serial = 1;
  const setExcelBundleData = (salesData) => {
    let excelData = [];
    salesData.forEach((s) => {
      const singleItem = {};
      let flag = 0;
      singleItem.productName = [];
      singleItem.distributedAmount = [];
      singleItem.unitPrice = [];
      for (let i = 0; i < excelData.length; i++) {
        if (
          s.transactionDetails.transaction_id === excelData[i].transactionId
        ) {
          excelData[i].productName.push(s.product_name);
          excelData[i].distributedAmount.push(s.distributed_amount);
          excelData[i].unitPrice.push(s.price_per_unit);
          excelData[i].salesDescription = `${
            excelData[i].salesDescription
          }  \n   ${s.product_name} ${s.distributed_amount}*${
            s.price_per_unit
          } = ${
            parseFloat(s.price_per_unit) * parseFloat(s.distributed_amount)
          } `;
          excelData[i].totalPrice =
            parseFloat(excelData[i].totalPrice) +
            parseFloat(s.price_per_unit) * parseFloat(s.distributed_amount);

          if (role === "0") {
            excelData[i].costDescription = `${
              excelData[i].costDescription
            } \n ${s.product_name}  ${s.distributed_amount}*${
              s.productDetails.unit_price
            }= ${
              parseFloat(s.productDetails.unit_price) *
              parseFloat(s.distributed_amount)
            }  `;
          }
          flag = 1;
        }
      }
      if (flag === 0) {
        singleItem.serialIndex =
          parseInt(s.transactionDetails.transaction_id) + 1;
        singleItem.productName.push(s.product_name);
        singleItem.distributedAmount.push(s.distributed_amount);
        singleItem.unitPrice.push(s.price_per_unit);
        singleItem.transactionId = s.transactionDetails.transaction_id;
        singleItem.srName = s.userDetails.name;
        singleItem.shopName = s.shopDetails.shop_name;
        singleItem.shopAddress = s.shopDetails.address;
        singleItem.date = s.recieved_date;
        if (role === "0" || role === "1") {
          singleItem.zoneName = s.userDetails.zone.region_name;
        }
        if (role === "0" || role === "1" || role === "2") {
          singleItem.asmName = s.userDetails.asm.name;
        }
        if (role === "0" || role === "1") {
          singleItem.adminName = s.userDetails.asm.admin.name;
        }
        singleItem.discount = s.transactionDetails.discount;
        singleItem.due = s.transactionDetails.due;
        singleItem.cashCollection =
          parseFloat(s.transactionDetails.total_bill) -
          parseFloat(s.transactionDetails.due);
        singleItem.totalPrice =
          parseFloat(s.price_per_unit) * parseFloat(s.distributed_amount);
        singleItem.salesDescription = `${s.product_name}  ${
          s.distributed_amount
        }*${s.price_per_unit}= ${
          parseFloat(s.price_per_unit) * parseFloat(s.distributed_amount)
        }  `;
        if (role === "0") {
          singleItem.costDescription = `${s.product_name}  ${
            s.distributed_amount
          }*${s.productDetails.unit_price}= ${
            parseFloat(s.productDetails.unit_price) *
            parseFloat(s.distributed_amount)
          }  `;
        }
        if (role === "1") {
          if (singleItem.adminName === name) {
            excelData.push(singleItem);
          }
        } else if (role === "2") {
          if (singleItem.asmName === name) {
            console.log("Dhuke");
            excelData.push(singleItem);
          }
        } else if (role === "3") {
          if (singleItem.srName === name) {
            excelData.push(singleItem);
          }
        } else {
          excelData.push(singleItem);
        }
      }
      flag = 0;
    });
    return excelData;
  };
  salesExcel = setExcelBundleData(sales);
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  const onChangeDate = (item) => {
    if(isNaN(Date.parse(item.selection.endDate))===true){
      item.selection.endDate = item.selection.startDate;
    }
    setState([item.selection]);
  };

  const forDate = () => {
    setShowCalendar(true);
  };
  const setCalendar = () => {
    setShowCalendar(false);
    if (state[0].startDate !== null && state[0].endDate !== null) {
      document.getElementById("date_range_show").value =
        convert(state[0].startDate) === convert(state[0].endDate)
          ? `${convert(state[0].startDate)}`
          : `${convert(state[0].startDate)} - ${convert(state[0].endDate)}`;
    }
  };
  const clearInput = () => {
    document.getElementById("date_range_show").value = "";
    setState([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
  };
  const clearFilter = () => {
    window.location.reload(false);
  };
  const filterData = (e) => {
    e.preventDefault();
    
    const selectedDate = state;
    if(isNaN(Date.parse(selectedDate[0].startDate))===true){
      selectedDate[0].startDate = null;
    }else{
      selectedDate[0].startDate = convert(selectedDate[0].startDate)
    }

    if(isNaN(Date.parse(selectedDate[0].endDate))===true){
      selectedDate[0].endDate = null;
    }else{
      selectedDate[0].endDate = convert(selectedDate[0].endDate)
    }
    setState(selectedDate);
   
    fetch(`http://localhost:5000/sales?shopName=${filteredShop}&adminName=${filteredAdmin}&asmName=${filteredASM}&zoneName=${filteredZone}&srName=${filteredSR}&startDate=${ state[0].startDate}&endDate=${state[0].endDate}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setSales(data)
        salesExcel = setExcelBundleData(sales);
        setFilteredASM(null);
        setFilteredAdmin(null);
        setFilteredSR(null);
        setFilteredShop(null);
        setFilteredZone(null);
        setState([
          {
            startDate: null,
            endDate: null,
            key: "selection",
          },
        ]);
      });
      e.target.reset();
      document.getElementById('my-modal').checked = false;
  };


  useEffect(() => {
    setIsLoading(true);
    if (
      username === undefined ||
      (role === "0" || role === "1" || role === "2" || role === "3") === false
    ) {
      localStorage.clear();
      navigate("/");
    }
    if (role === "0") {
      fetch("http://localhost:5000/users", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setAdminUsers(data.filter((d) => d.role === "1"));
            setAsmUsers(data.filter((d) => d.role === "2"));
            setSRUsers(data.filter((d) => d.role === "3"));
          }
          setIsLoading(false);
        });
    } else if (role === "1") {
      fetch("http://localhost:5000/users", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const asm = data.filter((d) => d.managed_by === userId);
            setAsmUsers(asm);
            let sr = [];
            for (let i = 0; i < asm.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (asm[i]._id === data[j].managed_by) {
                  sr.push(data[j]);
                }
              }
            }
            setSRUsers(sr);
          }
          setIsLoading(false);
        });
    } else {
      fetch("http://localhost:5000/users", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setSRUsers(data.filter((d) => d.managed_by === userId));
          }
          setIsLoading(false);
        });
    }
    fetch("http://localhost:5000/shop", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (role === "0") {
          setShops(data);
        } else if (role === "1") {
          fetch(`http://localhost:5000/region?assigned=${userId}`, {
            method: "GET",
          })
            .then((res) => res.json())
            .then((regionData) => {
              let shopData = [];
              for (let i = 0; i < regionData.length; i++) {
                for (let j = 0; j < data.length; j++) {
                  if (regionData[i]._id === data[j].region_id) {
                    shopData.push(data[j]);
                    setShops(shopData);
                  }
                }
              }
            });
        } else if (role === "2") {
          if (data.length > 0) {
            fetch(`http://localhost:5000/users/${userId}`, {
              method: "GET",
            })
              .then((res) => res.json())
              .then((userData) => {
                setShops(
                  data.filter((d) => d.region_id === userData[0]?.region_id)
                );
              });
          }
        } else {
          setShops(data.filter((d) => d.managed_by === userId));
        }
        setIsLoading(false);
      });

    fetch("http://localhost:5000/region", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (role === "0") {
          setRegion(data);
        } else {
          setRegion(data.filter((d) => d.assigned === userId));
        }

        setIsLoading(false);
      });

    fetch("http://localhost:5000/sales", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setSales(data);
        setIsLoading(false);
      });
  }, [username, navigate, userId, role]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">Sales</p>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="my-3  px-0 lg:px-4 flex justify-between items-center">
        <CSVLink
          data={salesExcel}
          filename={"sales.csv"}
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
      <div className="overflow-x-scroll px-0 lg:px-4 mb-3">
        <table className="table overflow-x-scroll table-zebra ">
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
                return (
                  role === "1" && (
                    <tr key={se.serialIndex}>
                      <td>{serial++}</td>
                      <td>{se.date.split("T")[0]}</td>
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
                      <td>
                        {sales
                          .filter(
                            (tr) =>
                              tr.transactionDetails?.transaction_id ===
                              se.serialIndex - 1
                          )[0]
                          ?.transactionDetails.bill_img?.map((b, idx) => {
                            return (
                              <div key={idx}>
                                <Link
                                  target="_blank"
                                  className="text-xl font-medium text-green-300 hover:text-white underline"
                                  to={`${b}`}
                                >{`Image -${idx + 1}`}</Link>
                              </div>
                            );
                          })}
                      </td>
                    </tr>
                  )
                );
              })}
            {role === "0" &&
              salesExcel.length > 0 &&
              salesExcel.map((se) => {
                return (
                  <tr key={se.serialIndex}>
                    <td>{serial++}</td>
                    <td>{se.date?.split("T")[0]}</td>
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
                    <td>
                      {sales
                        .filter(
                          (tr) =>
                            tr.transactionDetails.transaction_id ===
                            se.serialIndex - 1
                        )[0]
                        ?.transactionDetails.bill_img?.map((b, idx) => {
                          return (
                            <div key={idx}>
                              <Link
                                target="_blank"
                                className="text-xl font-medium text-green-300 hover:text-white underline"
                                to={`${b}`}
                              >{`Image -${idx + 1}`}</Link>
                            </div>
                          );
                        })}
                    </td>
                  </tr>
                );
              })}
            {salesExcel.length > 0 &&
              salesExcel.map((se) => {
                return (
                  role === "2" && (
                    <tr key={serial++}>
                      <td>{se.serialIndex}</td>
                      <td>{se.date.split("T")[0]}</td>
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
                      <td>{se.srName}</td>
                      <td>
                        {sales
                          .filter(
                            (tr) =>
                              tr.transactionDetails?.transaction_id ===
                              se.serialIndex - 1
                          )[0]
                          ?.transactionDetails.bill_img?.map((b, idx) => {
                            return (
                              <div key={idx}>
                                <Link
                                  target="_blank"
                                  className="text-xl font-medium text-green-300 hover:text-white underline"
                                  to={`${b}`}
                                >{`Image -${idx + 1}`}</Link>
                              </div>
                            );
                          })}
                      </td>
                    </tr>
                  )
                );
              })}
            {salesExcel.length > 0 &&
              salesExcel
                .slice(0)
                .reverse()
                .map((se) => {
                  return (
                    role === "3" && (
                      <tr key={serial++}>
                        <td>{se.serialIndex}</td>
                        <td>{se.date.split("T")[0]}</td>
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
                        <td>
                          {sales
                            .filter(
                              (tr) =>
                                tr.transactionDetails?.transaction_id ===
                                se.serialIndex - 1
                            )[0]
                            ?.transactionDetails.bill_img?.map((b, idx) => {
                              return (
                                <div key={idx}>
                                  <Link
                                    target="_blank"
                                    className="text-xl font-medium text-green-300 hover:text-white underline"
                                    to={`${b}`}
                                  >{`Image -${idx + 1}`}</Link>
                                </div>
                              );
                            })}
                        </td>
                      </tr>
                    )
                  );
                })}
          </tbody>
        </table>
      </div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-11/12 max-w-5xl ">
          <h3 className="font-bold text-lg ">Filters</h3>
          <form onSubmit={filterData} className="my-4" id="filter-form">
            <label htmlFor="">Select Shop</label>
            <br />
            <select
              id="select_shop"
              className="input input-bordered w-full lg:w-1/2"
              placeholder="Select Shop"
              onChange={(e) => setFilteredShop(e.target.value===''? null : e.target.value)}
            >
              <option value={null}></option>
              {shops.length > 0 &&
                shops.map((sh) => (
                  <option key={sh._id} value={sh.shop_name}>
                    {sh.shop_name}
                  </option>
                ))}
            </select>
            <br />
            <label htmlFor="">Data Range</label> <br />
            <div onClick={forDate}>
              <input
                type="text"
                id="date_range_show"
                className="input input-bordered w-full lg:w-1/2"
                defaultValue=""
                disabled
              />
              <button
                className="btn bg-red-600 font-bold ml-2"
                onClick={clearInput}
              >
                Clear
              </button>
            </div>
            {showCalendar && (
              <div className=" flex flex-col">
                <DateRangePicker
                  onChange={(item) => onChangeDate(item)}
                  moveRangeOnFirstSelection={true}
                  ranges={state}
                  editableDateInputs={true}
                  direction="horizontal"
                  staticRanges={[]}
                />
                <button
                  className="btn btn-outline mt-2"
                  onClick={() => setCalendar()}
                >
                  {" "}
                  Set
                </button>
              </div>
            )}
            <br />
            {(role === "0" || role === "1") && (
              <>
                <label htmlFor="">Zone</label> <br />
                <select
                  id="select_region"
                  className="input input-bordered w-full lg:w-1/2"
                  placeholder="Select Zone"
                  onChange={(e) => setFilteredZone(e.target.value===''? null : e.target.value)}
                >
                  <option value={null}></option>
                  {region.length > 0 &&
                    region.map((sh) => (
                      <option key={sh._id} value={sh.region_name}>
                        {sh.region_name}
                      </option>
                    ))}
                </select>
                <br />
              </>
            )}
            {role === "0" && (
              <>
                <label htmlFor="">Admin</label> <br />
                <select
                  id="select_admin"
                  className="input input-bordered w-full lg:w-1/2"
                  placeholder="Select Admin"
                  onChange={(e) => setFilteredAdmin(e.target.value===''? null : e.target.value)}
                >
                  <option value={null}></option>
                  {adminUsers.length > 0 &&
                    adminUsers.map((sh) => (
                      <option key={sh._id} value={sh.name}>
                        {sh.name}
                      </option>
                    ))}
                </select>
                <br />
              </>
            )}
            {(role === "0" || role === "1") && (
              <>
                <label htmlFor="">ASM</label> <br />
                <select
                  id="select_asm"
                  className="input input-bordered w-full lg:w-1/2"
                  placeholder="Select ASM"
                  onChange={(e) => setFilteredASM(e.target.value===''? null : e.target.value)}
                >
                  <option value={null}></option>
                  {asmUsers.length > 0 &&
                    asmUsers.map((sh) => (
                      <option key={sh._id} value={sh.name}>
                        {sh.name}
                      </option>
                    ))}
                </select>
                <br />
              </>
            )}
            {role !== "3" && (
              <>
                <label htmlFor="">SR</label> <br />
                <select
                  id="select_sr"
                  className="input input-bordered w-full lg:w-1/2"
                  placeholder="Select SR"
                  onChange={(e) => setFilteredSR(e.target.value===''? null : e.target.value)}
                >
                  <option value={null}></option>
                  {sRUsers.length > 0 &&
                    sRUsers.map((sh) => (
                      <option key={sh._id} value={sh.name}>
                        {sh.name}
                      </option>
                    ))}
                </select>
                <br />
              </>
            )}
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
    </div>
  );
};

export default SalesReport;
