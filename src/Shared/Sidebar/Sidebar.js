import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  let menuItems;
  if (role === "0") {
    menuItems = (
      <>
        <li>
          <Link to="/show-all-shops">View All Shops</Link>
        </li>
        <li>
          <Link to="/addregion">Add Region</Link>
        </li>
        <li>
          <Link to="/viewregion">View Regions</Link>
        </li>
        <li>
          <Link to="/addadmin">Add Admin</Link>
        </li>
        <li>
          <Link to="/add-asm">Add ASM</Link>
        </li>
        <li>
          <Link to="/add-sr">Add SR</Link>
        </li>
        <li>
          <Link to="/view-users">View Users</Link>
        </li>
        <li>
          <Link to="/super-sr">My SR</Link>
        </li>
        <li>
          <Link to="/add-primary-item">Add Primary Item</Link>
        </li>
        <li>
          <Link to="/show-items">Show Items</Link>
        </li>
        <li>
          <Link to="/addproduct">Add Product</Link>
        </li>
        <li>
          <Link to="/show-product">Show Products</Link>
        </li>
        <li>
          <Link to="/distribute-product-super-sr">Distribute Products to SR</Link>
        </li>
        <li>
          <Link to="/show-distributed-product">Show Distribute Products</Link>
        </li>
      </>
    );
  }
  if (role === "1") {
    menuItems = (
      <>
        <li>
          <Link to="/add-asm">Add ASM</Link>
        </li>
        <li>
          <Link to="/add-sr">Add SR</Link>
        </li>
        <li>
          <Link to="/my-asm">My ASM</Link>
        </li>
        <li>
          <Link to="/show-product">Show Products</Link>
        </li>
        <li>
          <Link to="/distribute-product">Distribute Products To ASM</Link>
        </li>
        <li>
          <Link to="/show-distributed-product">Show Distribute Products</Link>
        </li>
      </>
    );
  }
  if (role === "2") {
    menuItems = (
      <>
        <li>
          <Link to="/add-sr">Add SR</Link>
        </li>
        <li>
          <Link to="/my-sr">My SR</Link>
        </li>
        <li>
          <Link to="/recieved-product">Recieved Products</Link>
        </li>
        <li>
          <Link to="/available-product">Available Products</Link>
        </li>
        <li>
          <Link to="/distribute-product-to-sr">Distribute to SR</Link>
        </li>
        <li>
          <Link to="/return-product-from-sr">Return from SR</Link>
        </li>
        <li>
          <Link to="/show-distributed-product">Show Distribute Products</Link>
        </li>
      </>
    );
  }
  if (role === "3") {
    menuItems = (
      <>
        <li>
          <Link to="/recieved-product">Recieved Products</Link>
        </li>
        <li>
          <Link to="/available-product-sr">Available Products</Link>
        </li>

        <li>
          <Link to="/view-shops">My Shops</Link>
        </li>
        <li>
          <Link to="/distribute-product-to-shop">Distribute to Shop</Link>
        </li>
        <li>
          <Link to="/distribution-to-shop">Show Shop Distribution</Link>
        </li>
        <li>
          <Link to="/shop-transaction">My Shop Transaction</Link>
        </li>
        <li>
          <Link to="/add-cv">Add CV</Link>
        </li>
        <li>
          <Link to="/show-cv">Show My CV</Link>
        </li>
      </>
    );
  }

  const handleLogOut = () => {
    localStorage.clear();
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="drawer drawer-mobile mt-4 lg:mt-10">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Outlet></Outlet>
      </div>
      <div className="drawer-side w-1/2 lg:w-60">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu lg:p-4">
          <li>
            <Link to="/addshop">Add Shop</Link>
          </li>
          {menuItems}

          <li>
            <Link to="/change-password">Change Password</Link>
          </li>
          <li>
            <button
              onClick={handleLogOut}
              className="btn  rounded-lg mt-2 bg-red-400 text-white"
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
