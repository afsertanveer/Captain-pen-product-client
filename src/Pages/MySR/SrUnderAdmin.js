import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import axios from "axios";

const SrUnderAdmin = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleUser, setSingleUser] = useState({});
  const addCV = async (e) => {
    e.preventDefault();
    let images, formData;
    formData = new FormData();
    images = e.target.images.files;
    console.log(images);
    if (images.length > 2) {
      toast.error("Cannot Upload more than two photo");
    } else {
      for (let i = 0; i < images.length; i++) {
        console.log("h");
        const singleImg = images[i];
        formData.append("files", singleImg);
      }
      console.log(formData);
    }

    const result = await axios.put(
      `http://localhost:5000/users-cv/${singleUser._id}`,
      formData
    );
    if (result.data.modifiedCount > 0) {
      toast.success("CV added");
      window.location.reload(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    if (username === null || role !== "1") {
      localStorage.clear();
      navigate("/");
    }

    fetch(`http://localhost:5000/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          let asms = [];
          asms = data.filter((d) => d.managed_by === userId);
          const srs = [];
          for (let i = 0; i < asms.length; i++) {
            for (let j = 0; j < data.length; j++) {
              if (asms[i]._id === data[j].managed_by) {
                srs.push(data[j]);
              }
            }
          }
          setUsers(srs);
          setLoading(false);
        }
      });
  }, [username, role, navigate, userId]);
  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-bold">MY SR</p>
      </div>
      {users.length > 0 && (
        <div className="table-class overflow-x-auto w-full">
          <table className="mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created At</th>
                <th>Add CV</th>
                <th>Show CV</th>
              </tr>
            </thead>
            {loading && <Loader></Loader>}
            <tbody>
              {users.length > 0 &&
                users.map((it) => (
                  <tr key={it._id}>
                    <td>{it.name}</td>
                    <td>{it.created_at}</td>
                    <td>
                      {it.cv?.length > 0 ? (
                        <p className="font-semibold">Already Added</p>
                      ) : (
                        <label
                          htmlFor="edit-modal"
                          onClick={() => setSingleUser(it)}
                          className="ml-4 btn bg-green-900 text-white"
                        >
                          Add CV
                        </label>
                      )}{" "}
                    </td>
                    <td>
                      {it.cv?.length > 0 ? (
                        <Link
                          className="text-lg underline text-green-600 hover:bg-red-200"
                          target="_blank"
                          to={`/show-cv/${it._id}`}
                        >
                          View CV
                        </Link>
                      ) : (
                        <p className="font-semibold">Yet to be Added</p>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <input type="checkbox" id="edit-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box  w-5/6 lg:w-1/2 max-w-5xl ">
          <form onSubmit={addCV}>
            <p className="text-2xl text-center  font-bold">Add CV</p>
            <div className="form-control">
              <label className="label mt-4">
                <span className="label-text font-bold">
                  Upload Images (Max 2){" "}
                </span>
              </label>
              <input
                name="images"
                id="images"
                type="file"
                className="input input-bordered w-full lg:w-1/2"
                multiple
                required
              />
            </div>
            <div className="form-control mt-4">
              <div className="flex justify-between">
                <input type="submit" value="ADD CV" className="btn w-[150px]" />

                <label htmlFor="edit-modal" className="btn bg-red-600 ">
                  Close
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SrUnderAdmin;
