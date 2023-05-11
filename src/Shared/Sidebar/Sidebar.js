import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import imgLogo from '../../assets/images/logo/logo-rmv.png'

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  let menuItems;
  if (role === "0") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2">
          <Link to="/show-all-shops">View All Shops</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/addregion">Add Region</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/viewregion">View Regions</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/addadmin">Add Admin</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/add-asm">Add ASM</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/add-sr">Add SR</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/view-users">View Users</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/super-sr">My SR</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/add-primary-item">Add Primary Item</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/show-items">Show Items</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/addproduct">Add Product</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/show-product">Show Products</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/distribute-product-super-sr">Distribute Products to SR</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/show-distributed-product">Show Distribute Products</Link>
        </li>
      </>
    );
  }
  if (role === "1") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2">
          <Link to="/add-asm">Add ASM</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/add-sr">Add SR</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/my-asm">My ASM</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/sr-under-me">SR Under Me</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/shop-under-me">Shop Under Me</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/show-product">Show Products</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/distribute-product">Distribute Products To ASM</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/show-distributed-product">Show Distribute Products</Link>
        </li>
      </>
    );
  }
  if (role === "2") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2">
          <Link to="/add-sr">Add SR</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/my-sr">My SR</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/recieved-product">Recieved Products</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/available-product">Available Products</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/distribute-product-to-sr">Distribute to SR</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/return-product-from-sr">Return from SR</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/show-distributed-product">Show Distribute Products</Link>
        </li>
      </>
    );
  }
  if (role === "3") {
    menuItems = (
      <>
        <li className="ml-0 lg:mx-2">
          <Link to="/recieved-product">Recieved Products</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/available-product-sr">Available Products</Link>
        </li>

        <li className="ml-0 lg:mx-2">
          <Link to="/view-shops">My Shops</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/distribute-product-to-shop">Distribute to Shop</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/distribution-to-shop">Show Shop Distribution</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/shop-transaction">My Shop Transaction</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/add-cv">Add CV</Link>
        </li>
        <li className="ml-0 lg:mx-2">
          <Link to="/show-cv">Show My CV</Link>
        </li>
      </>
    );
  }

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="drawer drawer-mobile ">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Outlet></Outlet>
      </div>
      <div className="drawer-side w-1/2 lg:w-60 bg-white lg:bg-[#04AA6D] text-black lg:text-white  font-semibold">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu ">
          <li className="hidden lg:block">
          <Link to={`${username===null? '/':'/home'}`} className=" normal-case text-xl mt-16" ><img src={imgLogo} alt="logo" className="w-[80px] h-[40px] lg:w-[200px] lg:h-[100px]" /></Link>
   
          </li>
          <li className="items-center">
            {
              <p className="text-yellow-50 font-bold text-center text-3xl">{name}</p>
            }
          </li>
          <li className="ml-0 lg:mx-2">
            <Link to="/addshop">Add Shop</Link>
          </li>
          {menuItems}

          <li className="ml-0 lg:mx-2">
            <Link to="/sales-report">Sales Report</Link>
          </li>
          <li className="ml-0 lg:mx-2">
            <Link to="/cash-collection-report">Cash Collection Report</Link>
          </li>
          <li className="ml-0 lg:mx-2">
            <Link to="/change-password">Change Password</Link>
          </li>
          <li className="px-2">
            <Link
              onClick={handleLogOut}
              className="btn  rounded-lg mt-2 bg-red-600 text-white font-extrabold"
            >
              Log Out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
