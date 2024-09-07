import React, { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PendingCourse = () => {
  const [pendingClasses, setPendingClasses] = useState([]);
  const { currentUser, isLoading } = useUser();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure
        .get(`/classes/${currentUser.email}`)
        .then((res) => {
          const pending = res.data.filter((cls) => cls.status === "pending");
          setPendingClasses(pending);
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
        My <span className="text-secondary">Pending Courses</span>
      </h1>

      {pendingClasses.length === 0 ? (
        <div className="text-3xl text-center mt-10 font-bold">
          You don't have any pending courses
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingClasses.map((cls) => (
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
                <p>Available Seats: {cls.availableSeats}</p>
                <p>Price: ${cls.price}</p>
                <p className="font-bold text-orange-400">
                  Status: {cls.status}
                </p>
              </div>
              {cls.reason && (
                <div className="mt-4 bg-yellow-100 p-2 rounded">
                  <p className="font-bold">Feedback:</p>
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

export default PendingCourse;
