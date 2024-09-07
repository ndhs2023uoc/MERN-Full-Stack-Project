import React, { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyApprovedCourse = () => {
  const [approvedClasses, setApprovedClasses] = useState([]);
  const [rejectedClasses, setRejectedClasses] = useState([]);
  const { currentUser, isLoading } = useUser();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure
        .get(`/classes/${currentUser.email}`)
        .then((res) => {
          const approved = res.data.filter((cls) => cls.status === "approved");
          const rejected = res.data.filter((cls) => cls.status === "rejected");
          setApprovedClasses(approved);
          setRejectedClasses(rejected);
        })
        .catch((error) => console.log(error));
    }
  }, [currentUser?.email, axiosSecure]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-9">
        My <span className="text-secondary">Approved Courses</span>
      </h1>

      {approvedClasses.length === 0 ? (
        <div className="text-3xl text-center mt-10 font-bold">
          You don't have any approved courses yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {approvedClasses.map((cls) => (
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
                <p className="font-bold text-green-500">Status: {cls.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-3xl font-bold text-center my-9">
        Rejected <span className="text-secondary">Courses</span>
      </h2>

      {rejectedClasses.length === 0 ? (
        <div className="text-2xl text-center mt-5 font-bold">
          No rejected courses
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rejectedClasses.map((cls) => (
            <div
              key={cls._id}
              className="border rounded-lg p-4 shadow-md bg-red-50"
            >
              <h3 className="text-lg font-bold">{cls.name}</h3>
              <p className="text-red-500">Status: {cls.status}</p>
              {cls.reason && (
                <div className="mt-2">
                  <p className="font-bold">Reason for rejection:</p>
                  <p>{cls.reason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApprovedCourse;
