import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUser from "../../../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";

const KEY = import.meta.env.VITE_IMG_TOKEN;

const EditClass = () => {
  const API_URL = `https://api.imgbb.com/1/upload?key=${KEY}`;
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { currentUser, isLoading } = useUser();
  const [image, setImage] = useState(null);
  const [classData, setClassData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axiosSecure.get(`/class/${id}`).then((res) => {
      setClassData(res.data);
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);

    if (image) {
      fetch(API_URL, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === true) {
            updatedData.image = data.data.display_url;
            updateClass(updatedData);
          }
        });
    } else {
      updateClass(updatedData);
    }
  };

  const updateClass = (updatedData) => {
    updatedData.status = "pending";
    updatedData.submitted = new Date();
    axiosSecure.put(`/class/${id}`, updatedData).then((res) => {
      alert("Successfully updated");
      navigate("/dashboard/my-classes");
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  if (isLoading || !classData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-yellow-50">
      <div className="mt-10 bg-red-400">
        <h1 className="text-center text-3xl font-bold">Edit Your Course</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto p-6 bg-white rounded shadow w-full"
      >
        <div className="grid grid-cols-2 w-full gap-3">
          {/* Course Name */}
          <div className="mb-6 ">
            <label
              className="text-xl block text-gray-700 font-bold mb-2"
              htmlFor="name"
            >
              Course Name
            </label>
            <input
              type="text"
              required
              defaultValue={classData.name}
              name="name"
              id="name"
              className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
            />
          </div>

          {/* Course Thumbnail */}
          <div className="mb-6">
            <label
              className=" text-xl block text-gray-700 font-bold mb-2"
              htmlFor="image"
            >
              Course Thumbnail
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              name="image"
              className="block mt-[5px] w-full border rounded-md cursor-pointer border-blue-500 shadow-md text-sm file:border-0 file:bg-secondary file:text-white file:mr-4 file:py-3 file:px-4"
            />
          </div>

          {/* Available Seats */}
          <div className="mb-6 ">
            <label
              className="text-xl block text-gray-700 font-bold mb-2"
              htmlFor="availableSeats"
            >
              Available Seats
            </label>
            <input
              type="number"
              inputMode="numeric"
              required
              defaultValue={classData.availableSeats}
              name="availableSeats"
              className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
            />
          </div>

          {/* Price */}
          <div className="mb-6 ">
            <label
              className="text-xl block text-gray-700 font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              inputMode="numeric"
              required
              defaultValue={classData.price}
              name="price"
              className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* link to resources */}
        <div className="mb-6 w-full">
          <label
            className="text-xl block text-gray-700 font-bold mb-2"
            htmlFor="videoLink"
          >
            Youtube Link
          </label>
          <input
            type="text"
            defaultValue={classData.videoLink}
            name="videoLink"
            className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
          />
        </div>

        {/* description */}
        <div className="mb-6 w-full">
          <label
            className="text-xl block text-gray-700 font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            defaultValue={classData.description}
            name="description"
            rows="5"
            className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none resize-vertical"
          ></textarea>
        </div>

        <div className="text-center w-full">
          <button
            className="bg-secondary w-full hover:bg-red-500 duration-200 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClass;
