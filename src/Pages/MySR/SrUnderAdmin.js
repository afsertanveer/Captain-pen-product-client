import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";

const SrUnderAdmin = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    if (username === null || role !== "1") {
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
      .then((data) =>{
        if(data.length>0){
            let asms =[];
            asms=data.filter(d=>d.managed_by===userId);
            const srs= [];
            for(let i=0;i<asms.length;i++){
                for(let j=0;j<data.length;j++){
                    if(asms[i]._id===data[j].managed_by){
                        srs.push(data[j]);
                    }
                }
            }
            setUsers(srs);
            setLoading(false);
        }
      });
  }, [username, role, navigate,userId]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">MY SR</p>
      </div>
      {
        users.length>0 && <div className='table-class overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          {loading && <Loader></Loader>}
          <tbody>
            {users.length > 0 &&
              users.map((it) => (
                <tr key={it._id}>
                  <td>{it.name}</td>                  
                  <td>{it.created_at}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      }
    </div>
  );
};

export default SrUnderAdmin;
