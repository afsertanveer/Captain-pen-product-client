import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Shared/Pagination/Pagination";

const ShowUsers = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagiNationData, setPagiNationData] = useState({});

  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
        fetch(
          `http://localhost:5000/paginated-users?page=${clickedPage}`,{
            method:"GET"
          }
        )
        .then(res=>res.json())
        .then((data) => {
          setUsers(data.userData);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
        });
    } else {
      fetch(
        `http://localhost:5000/paginated-users?&page=1`,{
          method:"GET"
        }
      )
      .then(res=>res.json())
      .then((data ) => {
        setUsers(data.userData);
        setPagiNationData(data.paginateData);
      })
      .catch((e) => {
        console.log(e);
        setPagiNationData({});
      });
    }
  };
  useEffect(() => {
    if (username === null || role !== "0") {
      localStorage.clear();
      navigate("/");
    }
      fetch(`http://localhost:5000/paginated-users?page=1`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>{
        setUsers(data.userData)
        setPagiNationData(data.paginateData);
        });
    
  }, [username, role, navigate]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">All Users</p>
      </div>
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((it) => (
                <tr key={it._id}>
                  <td>{it.name}</td>
                  <td>
                    {it.role === "0"
                      ? "superadmin"
                      : it.role === "1"
                      ? "Admin"
                      : it.role === "2"
                      ? "ASM"
                      : "SR"}
                  </td>
                  <td>{it.created_at}</td>
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

export default ShowUsers;
