import React from "react";
import instructorImage from "../../../assets/dashboard/jaconda-14.png";
import useUser from "../../../hooks/useUser";

const InstructorCp = () => {
  const { currentUser } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          <span className="text-black">Welcome</span>,{" "}
          {currentUser?.name || "Instructor"}!
        </h1>
        <img
          src={instructorImage}
          alt="Instructor Dashboard"
          className="w-full h-auto mb-6 rounded-lg"
        />
        <p className="text-lg text-gray-700 text-center">
          Manage your courses, track student progress, and create engaging
          content from your personalized dashboard.
        </p>
      </div>
    </div>
  );
};

export default InstructorCp;
