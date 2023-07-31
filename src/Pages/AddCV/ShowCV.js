import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ShowCV = () => {
  const userId = localStorage.getItem("user_id");

  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [cvImages, setCvImages] = useState([]);

  const params = useParams()

  useEffect(() => {
    if (userId === null || role === "3") {
      localStorage.clear();
      navigate("/");
    }
    fetch(`http://localhost:5000/users/${params.id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCvImages(data[0]?.cv);
          console.log(data);
        }
      });
  }, [userId, role, navigate,params]);
  return (
    <div>
      <div className="text-center font-bold text-primary text-4xl">MY CV</div>
      <div className="p-4 lg:p-10 flex flex-col justify-center items-center">
        {cvImages?.length > 0 &&
          cvImages.map((img, idx) => (
            <div key={idx} className="p-4 my-6  border-2 border-black">
              <img
                        src={
                          process.env.REACT_APP_API_HOST +
                          "/" +
                          img.img
                        }
                        alt=""
                      />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShowCV;
