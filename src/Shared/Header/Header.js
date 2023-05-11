import React, { useState } from "react";
import { Link } from "react-router-dom";
import imgLogo from '../../assets/images/logo/logo-rmv.png'
const Header = () => {
  const [name,setName] = useState('Menu');
  const [customClass,setCustomCalss] = useState('');
  const [count,setCount] = useState(0)
  const username = localStorage.getItem("username");
  const handleMenuButton = ()=>{
    setCount(count+1);
    if(count%2===0){
      setName('x')
      setCustomCalss('btn-error')
    }else{
      setName('Menu')
      setCustomCalss('btn-primary')
    }

  }
  return (
    <div className="flex  flex-row justify-between">
    
          <Link to={`${username===null? '/':'/home'}`} className=" normal-case text-xl lg:hidden" ><img src={imgLogo} alt="logo" className="w-[80px] h-[40px] lg:w-[200px] lg:h-[100px]" /></Link>
   
       
      <label
        htmlFor="dashboard-drawer"
        tabIndex={2}
        onClick={handleMenuButton}
        className={`btn ${customClass} w-1/4 drawer-button lg:hidden `}
      >
        {name}
      </label>
      </div>
  );
};

export default Header;
