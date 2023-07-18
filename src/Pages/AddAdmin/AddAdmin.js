import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState(" ");
  useEffect(() => {
    if (username === null || role !== "0") {
      localStorage.clear();
      navigate("/");
    }
  });
  const setPassword = (event) => {
    const getUsername = event.target.value;
    fetch(`http://localhost:5000/users?username=${getUsername}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setUsernameError(
            "Change the username! The current one is already in the list"
          );
        }
      });
    if (getUsername.length < 11 || getUsername.length > 11) {
      setUsernameError("Phone number length needs to be 11 digit");
    } else {
      document.getElementById("password").value = getUsername;
      setUsernameError("");
    }
  };
  const addAdmin = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const username = form.username.value;
    const password = form.password.value;
    const assigned = form.permission.value;
    let currentData = new Date();
    const created_at = currentData.toISOString().split("T")[0];
    const role = "1";
    const user = {
      username,
      password,
      name,
      role,
      assigned,
      created_at,
    };
    fetch("http://localhost:5000/addAdmin", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.success("An Admin is successfully addded");
        }
      })
      .catch((err) => toast.error("Duplicate username found"));
    form.reset();
  };
  return (
    <div className="card  px-4 mt-10 lg:mx-40 lg:p-20 shadow-2xl bg-base-100">
      <form onSubmit={addAdmin}>
        <p className="text-2xl text-center  font-bold">Add Admin</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Name</span>
          </label>
          <input
            name="name"
            type="text"
            placeholder="Name"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Username</span>
          </label>
          <input
            name="username"
            type="text"
            onChange={setPassword}
            placeholder="username"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
          {usernameError === "" ? (
            <span className="text-sm font-bold text-success">
              Username Found
            </span>
          ) : (
            <span className="text-sm font-bold text-error">
              {usernameError}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Password</span>
          </label>
          <input
            name="password"
            id="password"
            type="text"
            placeholder="password"
            className=" input input-bordered w-full lg:w-1/2"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Factory Permission</span>
          </label>
          <select name="permission" id="permission" className=" input input-bordered w-full lg:w-1/2 mb-4">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary w-1/2 lg:w-1/4">Add Admin</button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
