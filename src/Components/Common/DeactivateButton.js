import React from "react";

const DeactivateButton = ({ setter, value }) => {
  return (
    <label
      className="btn bg-[#1b5e20] text-white"
      htmlFor="my-modal-1"
      onClick={() => setter(value)}
    >
      Deactivate
    </label>
  );
};

export default DeactivateButton;
