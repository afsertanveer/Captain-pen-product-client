import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MySR = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (username === null || role !== "2") {
      localStorage.clear();
      navigate("/");
    }

    fetch("http://localhost:5000/users?role=3", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data?.filter(d=>d.managed_by===userId)));
  }, [username, role, navigate,userId]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">All Users</p>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
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
    </div>
  );
};

export default MySR;
