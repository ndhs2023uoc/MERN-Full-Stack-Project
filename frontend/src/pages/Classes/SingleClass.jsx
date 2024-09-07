import React from "react";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLocation, useNavigate } from "react-router-dom";

const SingleClass = () => {
  const location = useLocation();
  const cls = location.state?.classDetails;
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!currentUser) {
      alert("Please Login First");
      return navigate("/login");
    }

    axiosSecure
      .post("/add-to-cart", { classId: cls._id, userMail: currentUser.email })
      .then((res) => {
        alert("Successfully added to the cart");
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  if (!cls) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full h-96 overflow-hidden">
          <img
            className="w-full h-full object-cover object-center"
            src={cls.image}
            alt={cls.name}
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{cls.name}</h1>
          <p className="text-gray-600 text-sm mb-4">
            Instructor: {cls.instructorName}
          </p>
          <p className="text-gray-700 mb-4">{cls.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">
              Available Seats: {cls.availableSeats}
            </span>
            <span className="text-green-500 font-semibold text-xl">
              ${cls.price}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={
              role === "admin" ||
              role === "instructor" ||
              cls.availableSeats < 1
            }
            className="w-full px-4 py-2 bg-secondary text-white rounded hover:bg-red-700 transition duration-300 disabled:bg-gray-400"
          >
            {role === "admin" || role === "instructor"
              ? "Instructor/Admin Cannot Select"
              : cls.availableSeats < 1
              ? "No Seats Available"
              : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleClass;
