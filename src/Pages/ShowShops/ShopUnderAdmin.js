import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import Pagination from "../../Shared/Pagination/Pagination";

const ShopUnderAdmin = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [district, setDistrict] = useState([]);
  const [thana, setThana] = useState([]);
  const [subD, setSubD] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagiNationData,setPagiNationData] = useState({});  
  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
      
      fetch(`http://localhost:5000/admin-shops/${userId}?page=${clickedPage}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setShops(data.data);
          setPagiNationData(data.paginateData);
        }).catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    } else {
      fetch(`http://localhost:5000/admin-shops/${userId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setShops(data.data);
          setPagiNationData(data.paginateData);
        }).catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    if (username === null || role !== "1") {
      localStorage.clear();
      navigate("/");
    }
    fetch(`http://localhost:5000/admin-shops/${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setShops(data.data);
        setPagiNationData(data.paginateData);
      });
    // fetch(`http://localhost:5000/use?managed_by=${userId}`, {
    //   method: "GET",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setShops(data)
    //     setIsLoading(false)
    // });

    fetch("http://localhost:5000/district", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setDistrict(data));

    fetch("http://localhost:5000/subdistrict", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setSubD(data));

    fetch("http://localhost:5000/thana", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setThana(data);
        setIsLoading(false);
      });
  }, [username, role, navigate, userId]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-4">Shops</p>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Contact Number</th>
              <th>Owner Name</th>
              <th>Division</th>
              <th>District</th>
              <th>Upozilla/Thana</th>
            </tr>
          </thead>
          <tbody>
            {shops.length > 0 &&
              shops.map((it) => (
                <tr key={it._id}>
                  <td>{it.shop_name}</td>
                  <td>{it.contact_no}</td>
                  <td>{it.owner_name}</td>
                  <td>{it.division}</td>
                  <td>
                    {district.length > 0 &&
                      district.filter((ds) => ds.value === it.district_id)[0]
                        .label}
                  </td>
                  <td>
                    {it.thana
                      ? thana?.length > 0 &&
                        thana?.filter((th) => th.value === it.thana)[0]?.label
                      : subD?.length > 0 &&
                        subD?.filter((sub) => sub.value === it.subdistrict)[0]
                          .label}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="my-6 pr-0 lg:pr-10">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
    </div>
  );
};

export default ShopUnderAdmin;
