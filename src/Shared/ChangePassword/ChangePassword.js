import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [curPasswordStatus, setCurPasswordStaus] = useState("");
  const [newPasswordStatus, setNewPasswordStaus] = useState("");
  const [confirmNewPasswordStatus, setConfirmNewPasswordStaus] = useState("");
  const [passwordClass, setPasswordClass] = useState("");
  const [isValidPassword, setIsValidPasssword] = useState(false);
  const [newPclass, setNewPclass] = useState(`text-red-400`);
  const [confirmNewPclass, setConfirmNewPclass] = useState(`text-red-400`);
  const [matchNewPass,setMatchNewPass] = useState(false);

  const containsUppercase = (str) => {
    return /[A-Z]/.test(str);
  };
  const containsLowerCase = (str) => {
    return /[a-z]/.test(str);
  };
  const containsNumbers = (str) => {
    return /\d/.test(str);
  };
  const handleNewPassword = (e) => {
    const pass = e.target.value;
    if (pass.length > 5) {
      if (pass.length >= 6) {
        setNewPasswordStaus("Password strength is strong");
        setIsValidPasssword(true);
        setNewPclass("text-green-400");
      }
      if (containsUppercase(pass) === false) {
        const err = `Password must contain a capital letter.`;
        setNewPasswordStaus(err);
        setNewPclass("text-red-400");
      } else if (containsLowerCase(pass) === false) {
        const err = `Password must contain a samll letter.`;
        setNewPasswordStaus(err);
        setNewPclass("text-red-400");
      } else if (containsNumbers(pass) === false) {
        const err = `Password must contain a number.`;
        setNewPasswordStaus(err);
        setNewPclass("text-red-400");
      }
    } else {
      if (pass.length > 2) {
        setNewPasswordStaus("Password is Weak");
      }
    }
    const p = document.getElementById("confirm_new_password").value;
    if (p.length > 2) {
      if (p !== pass) {
        setConfirmNewPasswordStaus("Confirm password does Not Match");
        setConfirmNewPclass("text-red-400");
      }
    }
  };
  const handleConfirmNewPassword = (e) => {
    const newP = document.getElementById("new_password").value;
    const confirmNew = e.target.value;
    if (newP === confirmNew) {
      setConfirmNewPasswordStaus("Password Matched");
      setConfirmNewPclass("text-green-400");
      setMatchNewPass(true);
    } else {
      if (confirmNew.length > 2) {
        setConfirmNewPasswordStaus("Confirm password does Not Match");
        setConfirmNewPclass("text-red-400");
      }
    }
  };
  const handleCurPassword = (e) => {
    if (e.target.value === user?.password) {
      setCurPasswordStaus("Matched with the previous password");
      setPasswordClass("text-xs font-semibold text-green-600");
    } else {
      if (e.target.value.length > user?.password.length) {
        setCurPasswordStaus("Wrong Password! Type Again");
        setPasswordClass("text-xs font-semibold text-red-400");
        e.target.value = "";
      } else {
        setCurPasswordStaus("");
      }
    }
  };

  const updatePassword = e =>{
    e.preventDefault();
    if(isValidPassword && matchNewPass){
        const newPass = e.target.new_password.value;
        const user ={
            _id:userId,
            password:newPass
        }
        fetch(`http://localhost:5000/users/${userId}`,{
            method:"PUT",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(user)
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.modifiedCount>0){
                toast.success('Password is changed successfully');
                localStorage.clear();
                navigate('/');
            }
        })
        .catch(err=>toast.error(err))
    }
  }

  useEffect(() => {
    if (userId === null || role === null) {
      localStorage.clear();
      navigate("");
    }
    fetch(`http://localhost:5000/users/${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data[0]));
  }, [role, userId, navigate]);
  return (
    <div className="p-4 lg:p-10 ">
      <div className="flex items-start justify-center flex-col pl-2 lg:pl-0 ">
        <h1 className=" text-2xl font-extrabold text-red-300">
          New Password Restrictions
        </h1>
        <ul className=" p-2 lg:p-4">
          <li className="text-xl font-semibold text-red-500 list-disc">
            Password length has to be more than 6
          </li>
          <li className="text-xl font-semibold text-red-500 list-disc">
            password must contain a capital letter
          </li>
          <li className="text-xl font-semibold text-red-500 list-disc">
            Password must contain a small letter
          </li>
          <li className="text-xl font-semibold text-red-500 list-disc">
            Password must contain a number
          </li>
        </ul>
      </div>
      <form onSubmit={updatePassword}>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Current Password</span>
          </label>
          <input
            type="password"
            placeholder="Current Password"
            onChange={handleCurPassword}
            className="w-1/2 px-5 py-3 text-lg rounded-full  input input-bordered  focus:border-gray-700 outline-none transition"
            name="cur_password"
            id="cur_password"
            required
          />
          {curPasswordStatus.length > 0 && (
            <span className={`${passwordClass} mt-3 ml-4`}>
              {curPasswordStatus}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">New Password</span>
          </label>
          <input
            type="password"
            placeholder="Current Password"
            onChange={handleNewPassword}
            className="w-1/2 px-5 py-3 text-lg rounded-full  input input-bordered  focus:border-gray-700 outline-none transition"
            name="new_password"
            id="new_password"
            required
          />
          {newPasswordStatus.length > 0 && (
            <span className={`${newPclass} text-xs font-semibold mt-3 ml-4`}>
              {newPasswordStatus}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Confirm New Password</span>
          </label>
          <input
            type="password"
            placeholder="Current Password"
            onChange={handleConfirmNewPassword}
            className="w-1/2 px-5 py-3 text-lg rounded-full  input input-bordered  focus:border-gray-700 outline-none transition"
            name="confirm_new_password"
            id="confirm_new_password"
            required
          />
          {confirmNewPasswordStatus.length > 0 && (
            <span
              className={`${confirmNewPclass} text-xs font-semibold mt-3 ml-4`}
            >
              {confirmNewPasswordStatus}
            </span>
          )}
        </div>
        <input
          type="submit"
          className="btn btn-success text-white ml-3 mt-7"
          value="Change Password"
        />
      </form>
    </div>
  );
};

export default ChangePassword;
