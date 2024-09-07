import React, { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

const UpdateProfile = () => {
  const [user, setUser] = useState({});
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const response = await axiosSecure.get("/user");
    setUser(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosSecure.put("/update-user", user);
    alert("Profile updated successfully!");
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl font-bold mb-6">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="photoUrl" className="block mb-1 font-medium">
            Photo URL
          </label>
          <input
            type="text"
            id="photoUrl"
            name="photoUrl"
            value={user.photoUrl || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
