import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import imgLogo from "../../assets/images/logo/logo-rmv.png";
import './Sidebar.css';

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  let menuItems;
  if (role === "0") {
    menuItems = (
      <>
        <li  className="ml-0 lg:mx-2 " >
            <span className="hovmenu hover:bg-white hover:text-black">Factory
            <div className="dr-menu">
              <Link to="/add-unit">Add Unit</Link>
              <Link to="/">Link 2</Link>
              <Link to="#">Link 3</Link>
            </div>
            </span>
          
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/show-all-shops">
            View All Shops
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/addregion">
            Add Region
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/addadmin">
            Add Admin
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/add-asm">
            Add ASM
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/add-sr">
            Add SR
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/view-users">
            View Users
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/super-sr">
            My SR
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/add-primary-item">
            Add Primary Item
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/show-items">
            Show Items
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/addproduct">
            Add Product
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/show-product">
            Show Products
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/distribute-product-super-sr">
            Distribute Products to SR
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/show-distributed-product">
            Show Distribute Products
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/viewregion">
            Zone Report
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/product-stock-report">
            Product Stock Report
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/product-sales-report">
            Product Sales Report
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/admin-send-product-report">
            Distribution to ASM Report
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/asm-send-product-report">
            Distribution to SR Report
          </Link>
        </li>
      </>
    );
  }
  if (role === "1") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/add-asm">
            Add ASM
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/add-sr">
            Add SR
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/my-asm">
            My ASM
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/sr-under-me">
            SR Under Me
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/shop-under-me">
            Shop Under Me
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/show-product">
            Show Products
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/distribute-product">
            Distribute Products To ASM
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/show-distributed-product">
            Show Distribute Products
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/product-stock-report">
            Product Stock Report
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/product-sales-report">
            Product Sales Report
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/admin-send-product-report">
            Distribution to ASM Report
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/asm-send-product-report">
            Distribution to SR Report
          </Link>
        </li>
      </>
    );
  }
  if (role === "2") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/add-sr">
            Add SR
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/my-sr">
            My SR
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/recieved-product">
            Recieved Products
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/available-product">
            Available Products
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/distribute-product-to-sr">
            Distribute to SR
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/return-product-from-sr">
            Return from SR
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/show-distributed-product">
            Show Distribute Products
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/asm-send-product-report">
            Distribution to SR Report
          </Link>
        </li>
      </>
    );
  }
  if (role === "3") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/recieved-product">
            Recieved Products
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/available-product-sr">
            Available Products
          </Link>
        </li>

        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/view-shops">
            My Shops
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/distribute-product-to-shop">
            Distribute to Shop
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/distribution-to-shop">
            Show Shop Distribution
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/shop-transaction">
            My Shop Transaction
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/add-cv">
            Add CV
          </Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link className="py-[5px] my-[5PX]" to="/show-cv">
            Show My CV
          </Link>
        </li>
      </>
    );
  }

  const handleLogOut = () => {
    navigate("/");    
    localStorage.clear();
  };
  
  const [buttonName,setButtonName] = useState('Menu');
  const [count,setCount] = useState(0)
  const handleMenuButton = ()=>{
    setCount(count+1);
    if(count%2===0){
      setButtonName('X')
    }else{
      setButtonName('Menu')
    }

  }
  return (
    <div className="drawer drawer-mobile" >
      <input id="dashboard-drawer"  type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
      <div className="flex justify-end">
      <label
        htmlFor="dashboard-drawer"
        tabIndex={2}
        onClick={handleMenuButton}
        className={` py-3 px-6  bg-green-900 text-white w-24 rounded-md text-center  mr-4 my-4  lg:hidden `}
      >
        {buttonName}
      </label>
      </div>
        <Outlet></Outlet>
        
      </div>
      <div className="drawer-side overflow-hidden  w-1/3 lg:w-[216px]   lg:bg-green-900 text-white  font-semibold md:border-0 sm:border-0">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu  pb-4 bg-green-900 border-0">
          <li className="flex flex-row justify-around items-center">
            <Link
              to={`${username === null ? "/" : "/home"}`}
              className=" normal-case text-xl mt-2 hover:bg-green-900"
            >
              <img
                src={imgLogo}
                alt="logo"
                className="w-[80px] h-[40px] lg:w-[60px] lg:h-[60px]"
              />
            </Link>
            <Link
              onClick={() => handleLogOut()}
              className="btn btn-outline  rounded-lg mt-2  text-white font-extrabold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </Link>
          </li>
          <li className="ml-0 lg:mx-2">
            <Link className="py-[5px] my-[5PX]" to="/addshop">
              Add Shop
            </Link>
          </li>
          {menuItems}

          <li className="ml-0 lg:mx-2">
            <Link className="py-[5px] my-[5PX]" to="/shop-report">
              Shop Report
            </Link>
          </li>

          <li className="ml-0 lg:mx-2">
            <Link className="py-[5px] my-[5PX]" to="/sales-report">
              Sales Report
            </Link>
          </li>
          <li className="ml-0 lg:mx-2">
            <Link className="py-[5px] my-[5PX]" to="/cash-collection-report">
              Cash Collection Report
            </Link>
          </li>
          <li className="ml-0 lg:mx-2">
            <Link className="py-[5px] my-[5PX]" to="/change-password">
              Change Password
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
