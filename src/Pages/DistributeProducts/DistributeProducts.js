import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const DistributeProducts = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [disable, setDisable] = useState("");
  const [selectedProductList, setSelectedProductList] = useState([]);
  const [numberOfPieces, setNumberOfPieces] = useState("");
  const [asmUsers, setAsmUsers] = useState([]);
  const [customClass, setCustomClass] = useState(
    "absolute mt-1 w-full p-2 bg-white rounded-bl rounded-br max-h-36  overflow-y-auto "
  );
  const [customClassTwo, setCustomClassTwo] = useState("mt-2");
  const [updateError, setUpdateError] = "";

  const addProduct = (e) => {
    e.preventDefault();
    const searchedProduct = document.getElementById("searchProduct").value;
    const numofPieces = document.getElementById("numOfPieces").value;
    if (searchedProduct === "") {
      toast.error("Search your product please!");
    } else if (numofPieces === "") {
      toast.error("Enter the number of products");
    } else if (parseInt(numofPieces) > parseInt(numberOfPieces)) {
      toast.error("Exceeding Limit");
    } else {
      setDisable("");
      document.getElementById("searchProduct").value = "";
      document.getElementById("numOfPieces").value = "";
      const singleProduct = {
        product_name: searchedProduct,
        distributed_amount: numofPieces,
      };
      const curProductlist = [...selectedProductList];
      let check = 1;
      curProductlist.forEach((item) => {
        if (item.product_name === searchedProduct) {
          if (
            parseInt(item.distributed_amount) + parseInt(numofPieces) <=
            parseInt(numberOfPieces)
          ) {
            item.distributed_amount = (
              parseInt(item.distributed_amount) + parseInt(numofPieces)
            ).toString();
          } else {
            toast.error("Exceeding Limit");
          }
          check=0;
        }
      });
      if (check === 1) {
        curProductlist.push(singleProduct);
      }
      setSelectedProductList(curProductlist);
      setCustomClass(
        "absolute mt-1 w-full p-2 bg-white rounded-bl rounded-br max-h-36  overflow-y-auto "
      );
      setNumberOfPieces("");
      setCustomClassTwo("mt-2");
    }
  };
  const handleSearchBar = (event) => {
    const newProductpckg = [...productList];
    const searchedList = newProductpckg.filter((p) =>
      p.product_name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setProducts(searchedList);
    if (event.target.value === "") {
      setNumberOfPieces("");
      setCustomClass(
        "absolute block mt-1 w-full p-2 bg-white rounded-bl rounded-br max-h-36  overflow-y-auto "
      );
      setProducts([]);
      setCustomClassTwo("mt-2");
    }
    setCustomClassTwo("mt-44");
  };
  const handleSelectOption = (event) => {
    const selectedOption = event.target.value;
    document.getElementById("searchProduct").value = selectedOption;
    fetch(`http://localhost:5000/product?product_name=${selectedOption}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setNumberOfPieces(data[0].total_pieces));
    setCustomClass("none");
    setProducts([]);
    setDisable("enabled");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const senderId = localStorage.getItem("user_id");
    const recieverId = event.target.selectAsm.value;
    const selected = [...selectedProductList];
    selected.forEach((item) => {
      item.sender_id = senderId;
      item.reciever_id = recieverId;
      item.recieved_date = currentDate;
    });
    setSelectedProductList(selected);
    selectedProductList.forEach((item) => {
      fetch("http://localhost:5000/distributed-product", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(item),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            fetch("http://localhost:5000/product-collection", {
              method: "PUT",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(item),
            })
              .then((res) => res.json())
              .then((data) => {})
              .catch((err) => setUpdateError(err));
          }
        })
        .catch((error) => setUpdateError(error));
    });
    if (updateError === undefined) {
      toast.success("Succesfully distributed and stock updated");
    } else {
      toast.error(`${updateError}`);
    }
    setSelectedProductList([]);
    event.target.reset();
  };
  useEffect(() => {
    if (username === null || (role !== "0" && role !== "1")) {
      localStorage.clear();
      navigate("/");
    }
    fetch("http://localhost:5000/product-collection", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setProductList(data));

    fetch("http://localhost:5000/users?role=2", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (role === "0") {
          setAsmUsers(data);
        } else {
          const newData = data?.filter((d) => d.managed_by === userId);
          setAsmUsers(newData);
        }
      });
  }, [username, navigate, role, products, userId]);

  return (
    <div className="p-4 lg:p-10">
      <form onSubmit={handleSubmit} autoComplete={"off"}>
        <div className="">
          <div className="relative">
            <input
              type="text"
              onChange={handleSearchBar}
              name=""
              id="searchProduct"
              className="w-1/2 lg:w-[400px] px-5 py-3 text-lg rounded-full  input input-bordered  focus:border-gray-700 outline-none transition"
              placeholder="Type product name"
              disabled={disable}
            />

            <div className={` ${customClass}`}>
              {products.length > 0 && (
                <select
                  onChange={handleSelectOption}
                  className="w-1/2"
                  size={products.length < 3 ? 3 : 5}
                  name=""
                  id=""
                >
                  {products.map((ppckg, index) => (
                    <option key={index} value={ppckg.product_name}>
                      {ppckg.product_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
        <div className="form-control">
          {numberOfPieces && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Number of Pieces</span>
              </label>
              <input
                type="number"
                placeholder="Number of Pieces"
                className=" input input-bordered w-full lg:w-1/2"
                name="numOfPieces"
                id="numOfPieces"
                min={1}
                max={numberOfPieces}
              />
            </div>
          )}
        </div>

        {numberOfPieces && (
          <>
            <button onClick={addProduct} className="btn btn-outline mt-2">
              Add Product to list
            </button>
          </>
        )}
        <div className={`${customClassTwo} overflow-x-auto px-0 lg:px-4`}>
          {selectedProductList.length > 0 && (
            <>
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Number Of Pieces</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProductList.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.product_name}</td>
                      <td>{it.distributed_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
        <div className="form-control">
          {productList.length > 0 && (
            <>
              <label className="label mt-4">
                <span className="label-text font-bold">Assign to </span>
              </label>
              <select
                name="selectAsm"
                className=" input input-bordered w-full lg:w-1/2 mb-4"
                required
              >
                <option></option>
                {asmUsers.length > 0 &&
                  asmUsers.map((asm) => (
                    <option key={asm._id} value={asm._id}>
                      {asm.name}
                    </option>
                  ))}
              </select>
            </>
          )}
        </div>
        <input
          type="submit"
          className="btn btn-success text-white ml-3 mt-7"
          value="Send To ASM"
        />
      </form>
    </div>
  );
};

export default DistributeProducts;
