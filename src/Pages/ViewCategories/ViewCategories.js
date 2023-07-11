import React, { useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

const ViewCategories = () => {
  const itemLayers = useLoaderData();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const setIndex = (idx)=>{
    
    localStorage.setItem('itemIndex',idx);
  }
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
              itemLayers[0].layers[0].map((it,idx) => (
                <tr key={idx}>
                  <td>{it}</td>
                  <td>
                    <Link onClick={()=>setIndex(idx)} to={`/add-category-secondary/${itemLayers[0].item_id}`}>
                      <button className="btn btn-primary w-1/2 lg:w-1/4 mr-2">
                        Add Category
                      </button>
                    </Link>
                    <Link onClick={()=>setIndex(idx)} to={`/view-secondary-category/${itemLayers[0].item_id}`}>
                      <button className="btn btn-primary w-1/2 lg:w-1/4 mr-2">
                        View Category
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCategories;
