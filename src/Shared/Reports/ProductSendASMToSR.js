import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Pagination from "../Pagination/Pagination";
import { exportToCSV, fileName } from "../../utils/exportCSV";

const ProductSendASMToSR = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [sendProduct, setSendProduct] = useState([]);
  const [allSendProduct, setAllSendProduct] = useState([]);
 
  const [region, setRegion] = useState([]);
  const [SrUsers, setSrUsers] = useState([]);
  const [asmUsers, setAsmUsers] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState(null);
  const [filteredZone, setFilteredZone] = useState(null);
  const [filteredSR, setFilteredSR] = useState(null);
  const [filteredASM, setFilteredASM] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [state, setState] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [pagiNationData, setPagiNationData] = useState({});
  const [open,setOpen] = useState(true);
  let excelData = [];
  // let allExcelData = [];
  console.log(allSendProduct);
  let asmName;
  let count = 1;
  const productSendAdminToASM = [];
  const setExcelDataBundle = (sendProductData) => {
    sendProductData.forEach((sh) => {
      const singleItem = {};
      let distributedAmount;
      singleItem.serialIndex = count;
      singleItem.issueDate = sh.recieved_date.split("T")[0];
      singleItem.productName = sh.product_name;
      singleItem.asmName = sh.asmUserDetails.name;
      singleItem.zoneName = sh.srUserDetails.regionDetails.region_name;
      singleItem.srName = sh.srUserDetails.name;
      asmName = sh.asmUserDetails.name;

      singleItem.category =
        sh.productDetails.category +
        `${
          sh.productDetails.secondary_category !== ""
            ? `=> ${sh.productDetails.secondary_category}`
            : ""
        }`;
      distributedAmount = sh.distributed_amount;
      singleItem.distributedAmount = distributedAmount;
      if (role === "1") {
        if (name === sh.asmUserDetails.admin.name) {
          productSendAdminToASM.push(singleItem);
          count++;
        }
      } else if (role === "2") {
        if (asmName === name) {
          productSendAdminToASM.push(singleItem);
          count++;
        }
      } else {
        singleItem.perUnitCost = sh.productDetails.unit_price;
        singleItem.totalCost =
          parseFloat(distributedAmount) *
          parseFloat(sh.productDetails.unit_price);
        productSendAdminToASM.push(singleItem);
        count++;
      }
    });
    return productSendAdminToASM;
  };
  excelData = setExcelDataBundle(sendProduct);
  const clearFilter = () => {
    window.location.reload(false);
  };
  const onChangeDate = (item) => {
    if (isNaN(Date.parse(item.selection.endDate)) === true) {
      item.selection.endDate = item.selection.startDate;
    }
    setState([item.selection]);
  };
  const forDate = () => {
    setShowCalendar(true);
  };
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
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
  const filterData = (e) => {
    e.preventDefault();

    const selectedDate = state;
    if (isNaN(Date.parse(selectedDate[0].startDate)) === true) {
      selectedDate[0].startDate = null;
    } else {
      selectedDate[0].startDate = convert(selectedDate[0].startDate);
    }

    if (isNaN(Date.parse(selectedDate[0].endDate)) === true) {
      selectedDate[0].endDate = null;
    } else {
      selectedDate[0].endDate = convert(selectedDate[0].endDate);
    }
    setState(selectedDate);

    fetch(
      `http://localhost:5000/filtered-asm-send-sr?productName=${filteredProduct}&srName=${filteredSR}&asmName=${filteredASM}&zoneName=${filteredZone}&category=${filteredCategory}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setSendProduct(data);
        excelData = setExcelDataBundle(sendProduct);
        setFilteredASM(null);
        setOpen(false);
        setFilteredSR(null);
        setFilteredProduct(null);
        setFilteredCategory(null);
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
    document.getElementById("my-modal").checked = false;
  };
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
      
      fetch(
        `http://localhost:5000/asm-send-sr?page=${clickedPage}`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data) => {
        setSendProduct(data.data)
        excelData = setExcelDataBundle(sendProduct);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
        setSendProduct([]);
      });
    } else {
      fetch(
        `http://localhost:5000/asm-send-sr?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setSendProduct(data.data)
        excelData = setExcelDataBundle(sendProduct);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
        setSendProduct([]);
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    if (username === undefined || (role === "0" || role === "1" || role==="2") === false) {
      localStorage.clear();
      navigate("/");
    }
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

    fetch(`http://localhost:5000/users?role=3`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          if (role === "0") {
            setSrUsers(data);
          } else if (role === "1") {
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
            setSrUsers(sr);
          } else {
            setSrUsers(data.filter((d) => d.managed_by === userId));
          }
        }
        setIsLoading(false);
      });
    fetch(`http://localhost:5000/users?role=2`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (role === "1") {
          const adminAsm = data.filter((d) => d.managed_by === userId);
          setAsmUsers(adminAsm);
        } else if (role === "0") {
          setAsmUsers(data);
        } else {
          setAsmUsers(data.filter((d) => d._id === userId));
        }
        setIsLoading(false);
      });

    fetch(`http://localhost:5000/asm-send-sr`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSendProduct(data.data);
        setPagiNationData(data.paginateData);
        setIsLoading(false);
      }).catch(err=>console.log(err))
    fetch(`http://localhost:5000/all-asm-send-sr`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllSendProduct(data);
        setIsLoading(false);
      }).catch(err=>console.log(err))
  }, [username, navigate, role, userId]);
  return (
    <div>
      <div className="text-center py-4 mx-0 lg:mx-4 bg-green-300 my-8 text-white">
        <p className="text-4xl font-bold mb-4">Distribution to SR</p>
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
         onClick={(e) => exportToCSV(setExcelDataBundle(allSendProduct), fileName)}
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
              <th>Issue Date</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Total Pieces</th>
              {role === "0" && <th>Cost Price/Unit</th>}
              {role === "0" && <th>Total Cost Price</th>}
              {role!=='2' && <th>ASM Name</th>}
              <th>SR Name</th>
              
              <th>Zone Name</th>
            </tr>
          </thead>
          <tbody>
            {excelData.length > 0 &&
              excelData.map((ps, idx) => {
                return (
                  <tr key={idx}>
                    <td>{ps.serialIndex}</td>
                    <td>{ps.issueDate}</td>
                    <td>{ps.productName}</td>
                    <td>{ps.category}</td>
                    <td>{ps.distributedAmount}</td>
                    {role === "0" && <td>{ps.perUnitCost}</td>}
                    {role === "0" && <td>{ps.totalCost}</td>}
                    {role !== "2" && <td>{ps.asmName}</td>}
                    <td>{ps.srName}</td>
                    <td>{ps.zoneName}</td>
                  </tr>
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
            <label htmlFor="">Select Product</label>
            <br />
            <select
              id="select_product"
              className="input input-bordered w-full lg:w-1/2"
              placeholder="Select Shop"
              onChange={(e) =>
                setFilteredProduct(
                  e.target.value === "" ? null : e.target.value
                )
              }
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
              onChange={(e) =>
                setFilteredCategory(
                  e.target.value === "" ? null : e.target.value
                )
              }
            >
              <option value={null}></option>
              {products.length > 0 &&
                [...new Set(products.map((p) => p.category))]
                  .filter((x) => x !== "")
                  .map((sh) => (
                    <option key={sh} value={sh}>
                      {sh}
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
            <label htmlFor="">Zone</label> <br />
            <select
              id="select_region"
              className="input input-bordered w-full lg:w-1/2"
              placeholder="Select Zone"
              onChange={(e) =>
                setFilteredZone(e.target.value === "" ? null : e.target.value)
              }
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
            {role !== "2" && (
              <>
                <label htmlFor="">ASM</label> <br />
                <select
                  id="select_asm"
                  className="input input-bordered w-full lg:w-1/2"
                  placeholder="Select ASM"
                  onChange={(e) =>
                    setFilteredASM(
                      e.target.value === "" ? null : e.target.value
                    )
                  }
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
            <label htmlFor="">SR</label> <br />
            <select
              id="select_admin"
              className="input input-bordered w-full lg:w-1/2"
              placeholder="Select Admin"
              onChange={(e) =>
                setFilteredSR(e.target.value === "" ? null : e.target.value)
              }
            >
              <option value={null}></option>
              {SrUsers.length > 0 &&
                SrUsers.map((sh) => (
                  <option key={sh._id} value={sh.name}>
                    {sh.name}
                  </option>
                ))}
            </select>
            <br />
            <div htmlFor="my-modal" className="mx-4 my-4 flex justify-end">
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

export default ProductSendASMToSR;
