import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Home = () => {
  const username = localStorage.getItem("username");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  useEffect(() => {
    if (username === null) {
      navigate("/");
    }
  });

  return (
    <div className="px-20 ">
       <p className="mt-20 text-3xl text-center">
            Welcome,<span className="font-extrabold text-3xl">{name}</span>
          </p>
    </div>
  );
};

export default Home;
