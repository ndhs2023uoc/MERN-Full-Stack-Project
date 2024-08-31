import React, { useContext, useEffect, useState } from "react";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utilities/providors/AuthProvider";
import useUser from "../../hooks/useUser";
import useAxioxSecure from "../../hooks/useAxioxSecure";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxioxSecure();

  const { user } = useContext(AuthContext);
  const handleHover = (index) => {
    setHoveredCard(index);
  };

  useEffect(() => {
    axiosFetch
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSelect = (id) => {
    console.log(id);
  };

  return (
    <div>
      <div className="mt-20 pt-3">
        <h1 className="text-4xl font-bold text-center text-secondary">
          Classes
        </h1>
      </div>

      <div className="my-16 w-[90%] mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
        {/* Correct placement of the map function */}
        {classes.map((cls, index) => (
          <div
            key={index}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`relative hover:-translate-y-2 duration-150 hover:ring-[2px] hover:ring-secondary w-64 mx-auto ${
              cls.availableSeats < 1 ? "bg-red-300" : "bg-white"
            } dark:bg-slate-600 rounded-lg shadow-lg cursor-pointer `}
          >
            <div className="relative h-48">
              <div
                className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${
                  hoveredCard === index ? "opacity-60" : ""
                }`}
              />
              <img src={cls.image} className="object-cover w-full h-full" />

              <Transition show={hoveredCard === index}>
                <div className="transition duration-300 ease-in data-[closed]:opacity-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => handleSelect(cls._id)}
                      className="px-4 py-2 text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-red-700"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
            {/* details of the classes */}
            <div className="px-6 py-2">
              <h3 className="front-semibold mb-1">{cls.name}</h3>
              <p className="text-gray-500 text-xs ">
                Instructor: {cls.instructorName}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-gray-600 text-xs">
                  Available Seats: {cls.availableSeats}
                </span>
                <span className="text-green-500 font-semibold">
                  ${cls.price}
                </span>
              </div>
              <Link to={`/class/${cls._id}`}>
                <button className="px-4 py-2 my-4 mb-2 w-full mx-auto text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-red-700">
                  View
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
