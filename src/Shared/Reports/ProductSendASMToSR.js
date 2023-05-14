import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { CSVLink } from "react-csv";

const ProductSendASMToSR = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [sendProduct, setSendProduct] = useState([]);
  const [users,setUsers] = useState([]);
  const [regions, setRegions] = useState([]);
  let asmName;
  let adminName;
  let count = 1;
  const asmToSR = [];
  const setExcelDataBundle = () => {
    sendProduct.forEach((sh) => {
      const singleItem = {};
      let distributedAmount;
      singleItem.serialIndex = count;
      singleItem.issueDate = sh.recieved_date;
      singleItem.productName = sh.product_name;
      const recieverId = sh.reciever_id;
      const adminId = users.filter(us=>us._id===sh.sender_id)[0]?.managed_by;
      adminName = users.filter((us) => us._id === adminId)[0]?.name;
      asmName = users.filter((us) => us._id === sh.sender_id)[0]?.name;
      singleItem.asmName = asmName;
      singleItem.srName = users.filter((us) => us._id === sh.reciever_id)[0]?.name;
      let regionId = users.filter((us) => us._id === recieverId)[0]?.region_id;
      singleItem.zoneName = regions.filter(
        (rg) => rg._id === regionId
      )[0]?.region_name;
      let category = products.filter(p=>p.product_name===sh.product_name)[0]?.category;
      if(products.filter(p=>p.product_name===sh.product_name)[0]?.secondary_category!==""){
        category = category+`=> ${products.filter(p=>p.product_name===sh.product_name)[0]?.secondary_category}`;
      }
      singleItem.category = category;
      distributedAmount =sh.distributed_amount;
      singleItem.distributedAmount = distributedAmount;
      if(role==='1'){
        if(adminName===name){
            asmToSR.push(singleItem)
            count++;
        }
      }else if(role==='2'){
        if(asmName===name){
            asmToSR.push(singleItem)
            count++;
        }

      }else{
        asmToSR.push(singleItem)
        count++;
      }
      

    });
  };
  setExcelDataBundle();

  useEffect(() => {
    setIsLoading(true);
    if (username === undefined || (role === "0" || role === "1" || role==='2') === false) {
      localStorage.clear();
      navigate("/");
    }
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

    fetch(`http://localhost:5000/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      });
    
    fetch(`http://localhost:5000/distribution-details-sr`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSendProduct(data);
        setIsLoading(false);
      });
  }, [username, navigate, role]);
  return (
    <div>
      <div className="text-center py-4 mx-0 lg:mx-4 bg-green-300 my-8 text-white">
        <p className="text-4xl font-bold mb-4">Distribution to SR</p>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Issue Date</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Total Pieces</th>
              {(role==='0' || role==='1') && <th>ASM Name</th>}
              <th>SR Name</th>
              {(role==='0' || role==='1') &&<th>Zone Name</th>   }            
            </tr>
          </thead>
          <tbody>
            {
                asmToSR.length>0 && asmToSR.map((ps,idx)=>{
                    return <tr key={idx}>
                        <td>{ps.serialIndex}</td>
                        <td>{ps.issueDate}</td>
                        <td>{ps.productName}</td>
                        <td>{ps.category}</td>
                        <td>{ps.distributedAmount}</td>
                        {(role==='0' || role==='1') && <td>{ps.asmName}</td>}
                        <td>{ps.srName}</td>
                        {(role==='0' || role==='1') &&<td>{ps.zoneName}</td>}

                    </tr>
                })
            }
          </tbody>
        </table>
      </div>
     
      <div className="mt-3  px-0 lg:px-4">
        <CSVLink
          data={asmToSR}
          filename={"distribution-to-sr-stock.csv"}
          className="mt-3 btn btn-secondary"
          target="_blank"
        >
          Download me
        </CSVLink>
      </div>
    </div>
  );
};

export default ProductSendASMToSR;
