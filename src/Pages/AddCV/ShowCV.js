import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ShowCV = () => {
  const userId = localStorage.getItem("user_id");

  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [cvImages, setCvImages] = useState([]);

  useEffect(() => {
    if (userId === null || role !== "3") {
      localStorage.clear();
      navigate("/");
    }
    fetch(`http://localhost:5000/users/${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCvImages(data[0]?.cv);
        }
      });
  }, [userId, role, navigate]);
  return (
    <div>
      <div className="text-center font-bold text-primary text-4xl">MY CV</div>
      <div className="p-4 lg:p-10 flex flex-col justify-center items-center">
        {cvImages?.length > 0 &&
          cvImages.map((img, idx) => (
            <div key={idx} className="p-4 my-6  border-2 border-black">
              <img
                src={img.img}
                alt="cv-images"
                className="w-[400px] h-[600px]"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShowCV;
