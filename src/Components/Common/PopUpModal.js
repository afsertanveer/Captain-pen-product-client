import React from "react";

const PopUpModal = ({remove,modalData}) => {
  return (
    <div>
      <input type="checkbox" id="my-modal-1" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg text-center">
            {  `Are you sure?`}
          </h3>

          <div className="modal-action flex justify-center items-center">
            <button
              className="btn bg-[#1b5e20] text-white mr-2"
              onClick={() => remove(modalData)}
            >
              Yes
            </button>
            <label htmlFor="my-modal-1" className="btn bg-[red]">
              No!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;
