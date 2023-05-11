import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const ShowItems = () => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  useEffect(()=>{
      if(username===null|| (role!=='0' && role!=='1')){
          localStorage.clear();
    navigate('/');   
      }
      fetch("http://localhost:5000/items", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setItems(data));
  })
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">All Items</p>
      </div>
      <div className="overflow-x-auto px-0 lg:px-4">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 &&
              items.map((it) => (
                <tr key={it._id}>
                  <td>{it.name}</td>
                  <td>
                  <Link to={`/add-category/${it._id}`}>  <button className="btn btn-primary w-1/2 lg:w-1/4 mr-2">Add Category</button></Link>
                  <Link to={`/view-category/${it._id}`}>  <button className="btn btn-primary w-1/2 lg:w-1/4 mr-2">View Category</button></Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowItems;
