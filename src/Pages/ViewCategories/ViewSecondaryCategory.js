import React, { useEffect } from "react";
import {  useLoaderData, useNavigate } from "react-router-dom";

const ViewSecondaryCategory = () => {
  const itemLayers = useLoaderData();
  const username = localStorage.getItem("username");
  const layerIdx = parseInt(localStorage.getItem('itemIndex'));
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (username === null || (role !== "0" && role !== "1")) {
      localStorage.clear();
      navigate("/");
    }
  }, [username, navigate, role]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold mb-8">Categories</p>
      </div>
      <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {itemLayers[0]?.layers[0]?.length > 0 &&
              itemLayers[0].layers[1][layerIdx].map((it,idx) => (
                <tr key={idx}>
                  <td>{it}</td>
                  <td>
                    <button className="btn btn-outline w-20">EDIT</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSecondaryCategory;
