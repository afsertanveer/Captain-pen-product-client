import React from "react";
import { Link } from "react-router-dom";
import imgLogo from '../../assets/images/logo/logo.jpeg'
const Header = () => {
  const username = localStorage.getItem("username");
  return (
    <div className="navbar bg-base-100 flex  flex-row-reverse lg:flex-row justify-between">
      <label
        htmlFor="dashboard-drawer"
        tabIndex={2}
        className="btn btn-primary w-1/4 drawer-button lg:hidden"
      >
        Menu
      </label>
      <Link to={`${username===null? '/':'/home'}`} className=" normal-case text-xl" ><img src={imgLogo} alt="logo" className="w-[80px] h-[40px] lg:w-[200px] lg:h-[100px]" /></Link>
    </div>
  );
};

export default Header;
