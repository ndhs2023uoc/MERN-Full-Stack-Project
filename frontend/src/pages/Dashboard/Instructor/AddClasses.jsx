import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUser from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";

const KEY = import.meta.env.VITE_IMG_TOKEN;

const AddClasses = () => {
  const API_URL = `https://api.imgbb.com/1/upload?key=${KEY}`;
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { currentUser, isLoading } = useUser();
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newData = Object.fromEntries(formData);
    formData.append("file", image);

    fetch(API_URL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.success === true) {
          newData.image = data.data.display_url;
          newData.instructorName = currentUser?.name;
          newData.instructorEmail = currentUser?.email;
          newData.status = "pending";
          newData.submitted = new Date();
          newData.totalEnrolled = 0;
          axiosSecure.post("/new-class", newData).then((res) => {
            alert("Succesfully added");
            navigate("/dashboard");
          });
        }
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-yellow-50">
      <div className="mt-10 bg-red-400">
        <h1 className="text-center text-3xl font-bold">Add Your Course Here</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto p-6 bg-white rounded shadow w-full"
      >
        <div className="grid grid-cols-2 w-full gap-3">
          {/*Course Name*/}
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
              placeholder="Your Course Name"
              name="name"
              id="name"
              className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
            />
          </div>

          {/*Course Thumbnail*/}
          <div className="mb-6">
            <label
              className=" text-xl block text-gray-700 font-bold mb-2"
              htmlFor="image"
            >
              Course Thumbnail
            </label>
            <input
              type="file"
              required
              onChange={handleImageChange}
              name="image"
              className="block mt-[5px]   w-full border rounded-md cursor-pointer border-blue-500 shadow-md text-sm file:border-0 file:bg-secondary file:text-white file:mr-4 file:py-3 file:px-4 "
            />
          </div>

          {/*Instructor Name*/}
          <div className="mb-6 ">
            <label
              className="text-xl block text-gray-700 font-bold mb-2"
              htmlFor="instructorName"
            >
              Instrcutor Name
            </label>
            <input
              type="text"
              readOnly
              value={currentUser?.name}
              name="instructorName"
              disabled
              className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
            />
          </div>

          {/*Instructor Email*/}
          <div className="mb-6 ">
            <label
              className="text-xl block text-gray-700 font-bold mb-2"
              htmlFor="instructorEmail"
            >
              Instrcutor Email
            </label>
            <input
              type="email"
              value={currentUser?.email}
              disabled
              readOnly
              name="instructorEmail"
              className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
            />
          </div>

          {/*Available Seats*/}
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
              placeholder="How many seats are available?"
              name="availableSeats"
              className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
            />
          </div>

          {/*Price*/}
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
              placeholder="How much does it cost?"
              name="price"
              className="w-full px-4 py-3 border border-blue-500 rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* link to resources*/}
        <div className="mb-6 w-full">
          <label
            className="text-xl block text-gray-700 font-bold mb-2"
            htmlFor="videoLink"
          >
            Youtube Link
          </label>
          <input
            type="text"
            placeholder="Your Cource Intro video"
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
            placeholder="Provide a detailed description about your course"
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClasses;
