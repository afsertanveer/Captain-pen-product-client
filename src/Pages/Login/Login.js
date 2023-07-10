import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/images/login/login.svg";
import logo from "../../assets/images/logo/logo.jpeg";
import { toast } from "react-hot-toast";
const Login = () => {
  const [loginError, setLoginError] = useState(null);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const handleLogin = (event) => {
    event.preventDefault();
    localStorage.clear();
    const form = event.target;
    const phonNumber = form.email.value;
    const password = form.password.value;
    fetch(`http://localhost:5000/users?username=${phonNumber}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          if (password === data[0].password) {
            toast.success("Successfully Logged in");
            localStorage.setItem("username", data[0].username);
            localStorage.setItem("role", data[0].role);
            localStorage.setItem("user_id", data[0]._id);
            localStorage.setItem("name", data[0].name);
            localStorage.setItem("permission",data[0].assigned);
            navigate("/home");
          } else {
            toast.error("Wrong Password");
            setLoginError("Wrong Password");
          }
        } else {
          toast.error("Wrong username");
          setLoginError("Wrong username");
        }
      });
  };
  useEffect(() => {
    if (username) {
      navigate("/home");
    }
  }, [username, navigate]);
  return (
    <div >
       <div className="flex justify-center items-center max-h-[500px]">
        <img src={logo} alt="logo" className="w-1/3 h-1/3 lg:w-1/6 lg:h-1/6" />
       </div>
      <div className="hero w-full">
        <div className="hero-content ">
          <div className="text-center  lg:text-left">
            <img className="w-3/4" src={img} alt="login" />
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100  py-12">
            <h1 className="text-5xl text-center font-bold">Login</h1>
            <form
              onSubmit={handleLogin}
              autoComplete={"off"}
              className="card-body"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  name="email"
                  type="text"
                  placeholder="phone number"
                  className=" input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  className=" input input-bordered "
                />
                <label className="label">
                  {loginError && (
                    <p className="text-center font-semibold text-red-600">
                      {loginError}
                    </p>
                  )}
                </label>
              </div>
              <div className="form-control mt-6">
                <input
                  className="btn btn-primary w-1/2 lg:w-1/4"
                  type="submit"
                  value="Login"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
