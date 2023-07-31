import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const PayModal = ({modalProps}) => {
  const {shopId,sellerId,due} = modalProps;
  const [searchAmountError, setSearchAmountError] = useState("");
  const handleSearchAmount = (e) => {
    const amount = parseInt(e.target.value);
    if (amount > parseInt(due)) {
      document.getElementById("searched_amount").value = "";
      setSearchAmountError("Paying amount cannot be more than due amount");
    } else {
      setSearchAmountError("");
    }
  };
  const handleRecoveryPay = async(e) => {
    e.preventDefault();
    const form = e.target;
    const amount = form.searched_amount.value;
    const image = e.target.bill.files[0];
    const currentDate = new Date();
    const formData = new FormData();
    formData.append("file", image);
    formData.append('shop_id',shopId);
    formData.append('seller_id',sellerId);
    formData.append('paying_amount',amount);
    formData.append('issue_date',currentDate);
    const result =await axios.post(`http://localhost:5000/due-recovery`,formData)
      if(result){
        form.reset();
        toast.success("Payment successfull");
        window.location.reload(false);
      }
  };
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
            {due}{shopId}
          <form onSubmit={handleRecoveryPay}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Amount</span>
              </label>
              <input
                type="number"
                name="searched_amount"
                id="searched_amount"
                onChange={handleSearchAmount}
                className=" input input-bordered h-1/2 mr-2 py-2 px-2"
                placeholder="Type your amount"
                required
              />
              {searchAmountError && (
                <span className="text-xl text-red-400">
                  {searchAmountError}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Attach Bill</span>
              </label>
              <input
                type="file"
                className=" input input-bordered pl-0 pr-4 py-2 mb-2 h-1/2"
                name="bill"
                id="bill"
                required
              />
            </div>
            <div className="form-control">
              <input
                type="submit"
                value="Pay"
                className="btn btn-success text-white w-1/6"
              />
            </div>
          </form>
          <div className="modal-action">
            <label onClick={()=>setSearchAmountError('')} htmlFor="my-modal" className="btn bg-red-600">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayModal;
