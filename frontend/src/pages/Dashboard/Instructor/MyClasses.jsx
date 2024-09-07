import React, { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure
        .get(`/classes/${currentUser.email}`)
        .then((res) => {
          setClasses(res.data);
        })
        .catch((error) => console.log(error));
    }
  }, [currentUser?.email, axiosSecure]);

  const handleEdit = (classId) => {
    navigate(`/dashboard/edit-class/${classId}`);
  };

  const handleDelete = (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      axiosSecure
        .delete(`/class/${classId}`)
        .then((response) => {
          setClasses(classes.filter((cls) => cls._id !== classId));
        })
        .catch((error) => {
          console.error("Error deleting class:", error);
        });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-9">
        My <span className="text-secondary">Classes</span>
      </h1>

      {classes.length === 0 ? (
        <div className="text-3xl text-center mt-10 font-bold">
          You don't have any classes yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="border rounded-lg p-4 shadow-md flex flex-col h-full"
            >
              <img
                className="w-full h-48 object-cover rounded-t-lg"
                src={cls.image}
                alt={cls.name}
              />
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-secondary mt-2">
                  {cls.name}
                </h2>
                <p>Total Students: {cls.totalEnrolled || 0}</p>
                <p>Available Seats: {cls.availableSeats}</p>
                <p
                  className={`font-bold ${
                    cls.status === "pending"
                      ? "text-orange-400"
                      : cls.status === "checking"
                      ? "text-yellow-300"
                      : cls.status === "approved"
                      ? "text-green-500"
                      : "text-red-600"
                  }`}
                >
                  Status: {cls.status}
                </p>
              </div>
              <div className="mt-4 flex justify-between space-x-4">
                <button
                  onClick={() => handleEdit(cls._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cls._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClasses;
