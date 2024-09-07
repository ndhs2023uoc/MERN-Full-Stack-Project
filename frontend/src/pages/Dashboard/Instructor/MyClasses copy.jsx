import { useScroll } from "framer-motion";
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
    axiosSecure
      .get(`/classes/${currentUser.email}`)
      .then((res) => setClasses(res.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <div className="my-9">
        <h1 className="text-4xl font-bold text-center">
          My <span className="text-secondary">Classes</span>
        </h1>
        <div>
          <p className="text-[12px] text-center m-2">
            Here you can See how many classes added by you and all classes
            status
          </p>
        </div>
      </div>

      <div>
        {classes.length === 0 ? (
          <div className="text-3xl text-center mt-10 font-bold">
            You don't have any clsses Yet
          </div>
        ) : (
          <div>
            {classes.map((cls, index) => (
              <div key={index}>
                <div>
                  <div>
                    <img
                      className="max-h-[200px] max-w-[300px]"
                      src={cls.image}
                    />
                  </div>
                  <div className="w-full">
                    <h2 className="text-[21px] font-bold text-secondary border-b pb-2 mb-2">
                      {cls.name}
                    </h2>
                    <div>
                      <div>
                        <div>
                          <h1 className="font-bold mb-3">Some Info: </h1>
                          <h1 className="text-secondary my-2">
                            <span className="text-black">Total Students</span> :{" "}
                            {cls.totalEnrolled ? cls.totalEnrolled : 0}
                          </h1>
                          <h1 className="text-secondary">
                            <span className="text-black">Total Seats</span> :{" "}
                            {cls.availableSeats}
                            <h1 className="text-secondary my-2">
                              <span className="text-black">Status</span>
                              <span
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
                                {cls.status}
                              </span>
                            </h1>
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClasses;
