import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import imgLogo from "../../assets/images/logo/logo-rmv.png";
import './Sidebar.css';

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const permission = localStorage.getItem("permission");
  const navigate = useNavigate();
  let menuItems;
  if (role === "0") {
    menuItems = (
      <> 
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/show-all-shops">
            View All Shops
          </NavLink>
        </li> 
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/addregion">
            Add Region
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/super-sr">
            My SR
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/distribute-product">
            Distribute Products To ASM
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/distribute-product-super-sr">
            Distribute Products to SR
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/show-distributed-product">
            Show Distribute Products
          </NavLink>
        </li>
      </>
    );
  }
  if (role === "1") {
    menuItems = (
      <>
        
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/my-asm">
            My ASM
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/sr-under-me">
            SR Under Me
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/shop-under-me">
            Shop Under Me
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/distribute-product">
            Distribute Products To ASM
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/show-distributed-product">
            Show Distribute Products
          </NavLink>
        </li>
      </>
    );
  }
  if (role === "2") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/show-asm-shops">
            Shop Under Me
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/my-sr">
            My SR
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/recieved-product">
            Recieved Products
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/available-product">
            Available Products
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/distribute-product-to-sr">
            Distribute to SR
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/return-product-from-sr">
            Return from SR
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/show-distributed-product">
            Show Distribute Products
          </NavLink>
        </li>
      </>
    );
  }
  if (role === "3") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/recieved-product">
            Recieved Products
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/available-product-sr">
            Available Products
          </NavLink>
        </li>

        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/view-shops">
            My Shops
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/distribute-product-to-shop">
            Distribute to Shop
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/distribution-to-shop">
            Show Shop Distribution
          </NavLink>
        </li>
        <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px]" to="/shop-transaction">
            My Shop Transaction
          </NavLink>
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
      <div className="drawer-side overflow-hidden  w-1/2 lg:w-[240px]   lg:bg-green-900 text-white  font-semibold md:border-0 sm:border-0">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu  pb-4 bg-green-900 border-0">
          <li className="flex flex-row justify-around items-center">
            <NavLink
              to={`${username === null ? "/" : "/home"}`}
              className=" normal-case text-xl mt-2 hover:bg-green-900"
            >
              <img
                src={imgLogo}
                alt="logo"
                className="w-[80px] h-[40px] lg:w-[60px] lg:h-[60px]"
              />
            </NavLink>
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
          {
          permission==="1" && <li  className="hover:mb-40 mx-0 lg:mx-2" >
          <span className="hovmenu hover:bg-white hover:text-black ">Factory 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 inline-block w-7  h-7 font-extrabold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>

          <div className="dr-menu ">
            <NavLink to="/add-unit">Add Unit</NavLink>
            <NavLink to="/show-unit">Show Units</NavLink>
            <NavLink to="/add-factory-item">Add Factory Item</NavLink>
            <NavLink to="/show-factory-item">Show Factory Item</NavLink>
            <NavLink to="/factory-report">Factory Report</NavLink>
          </div>
          </span>
        
      </li>
        }
        {
          role!=='3' && <li  className={`${role==="0"? "hover:mb-32" : role==="1"? "hover:mb-16" : "hover:mb-8" } mx-0 lg:mx-2`} >
          <span className="hovmenu hover:bg-white hover:text-black ">{role==="0"? "Users" :"Add Users"}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 inline-block w-7  h-7 font-extrabold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>

          <div className="dr-menu ">
            { role==="0" && <NavLink to="/addadmin">Add Admin</NavLink>}
            { (role==="0" || role==="1") && <NavLink to="/add-asm">Add ASM</NavLink>}
           { role!=='3' && <NavLink to="/add-sr">Add SR</NavLink>}           
           { role==="0" && <NavLink to="/view-users">View All Users</NavLink>}
          </div>
          </span>
        
      </li>
        }
        {
          (role==='0') && <li  className={`hover:mb-16 mx-0 lg:mx-2`} >
          <span className="hovmenu hover:bg-white hover:text-black ">Items
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 inline-block w-7  h-7 font-extrabold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>

          <div className="dr-menu ">
          <NavLink to="/add-primary-item">Add Primary Items</NavLink>
          <NavLink to="/show-items">Show Items</NavLink>
          </div>
          </span>
        
      </li>
        }
        {
          role==='0'?<li  className={`hover:mb-16 mx-0 lg:mx-2`} >
          <span className="hovmenu hover:bg-white hover:text-black ">Products
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 inline-block w-7  h-7 font-extrabold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>

          <div className="dr-menu ">
          <NavLink to="/addproduct">Add Product</NavLink>
          <NavLink to="/show-product">Show Products</NavLink>
          </div>
          </span>
        
      </li> : role==="1" && <li className="ml-0 lg:mx-2  ">
      <NavLink to="/show-product">Show Products</NavLink>
          </li>
        }
          {
            role==="3"? <>
            <li className="ml-0 lg:mx-2 active:bg-white">
            <NavLink className="py-[5px] my-[5px]" to="/addshop">
              Add Shop
            </NavLink>
          </li></>
          :
          <>
          <li className="ml-0 lg:mx-2  ">
          <NavLink className="py-[5px] my-[5px] " to="/addshopbyothers">
            Add Shop
          </NavLink>
        </li>
        </>
          }
          {menuItems}
          
          {
          <li   className="hover:mb-40 mx-0 lg:mx-2" >
          <span className="hovmenu hover:bg-white hover:text-black ">REPORTS 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 inline-block w-7  h-7 font-extrabold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>

          <div className="dr-menu ">
          {
            role==="0" && <NavLink className="py-[5px] my-[5px]" to="/viewregion">
            Zone Report
          </NavLink>
          }
          {
            (role==="0" || role==="1") && <NavLink className="py-[5px] my-[5px]" to="/product-stock-report">
            Product Stock Report
          </NavLink>
          }
          {
            (role==="0" || role==="1") && <NavLink className="py-[5px] my-[5px]" to="/product-sales-report">
            Product Sales Report
          </NavLink>
          }
          {
            (role==="0" || role==="1") && <NavLink className="py-[5px] my-[5px]" to="/admin-send-product-report">
            Distribution to ASM Report
          </NavLink>
          }
          {
            (role!=="3") && <NavLink className="py-[5px] my-[5px]" to="/asm-send-product-report">
            Distribution to SR Report
          </NavLink>
          }
          
          
          <NavLink className="py-[5px] my-[5px]" to="/shop-report">
              Shop Report
            </NavLink>
          <NavLink className="py-[5px] my-[5px]" to="/sales-report">
              Sales Report
            </NavLink>
            <NavLink className="py-[5px] my-[5px]" to="/cash-collection-report">
              Cash Collection Report
            </NavLink>

          </div>
          </span>
        
      </li>
        }
          <li className="ml-0 lg:mx-2  ">
            <NavLink className="py-[5px] my-[5px]" to="/change-password">
              Change Password
            </NavLink>
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
