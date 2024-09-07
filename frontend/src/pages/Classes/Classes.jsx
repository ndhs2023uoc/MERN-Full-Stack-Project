import React, { useContext, useEffect, useState } from "react";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import { Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleHover = (index) => {
    setHoveredCard(index);
  };

  useEffect(() => {
    axiosFetch
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Failed to fetch classes:", err));
  }, [axiosFetch]);

  // const handleSelect = (id) => {
  //   // axiosSecure
  //   //   .get(`/enrolled-classes/${currentUser?.email}`)
  //   //   .then((res) => setEnrolledClasses(res.data))
  //   //   .catch((err) => console.log(err));

  //   if (!currentUser) {
  //     alert("Please Login First");
  //     return navigate("/login");
  //   }

  //   // .get(`/cart-item/${id}?email=${currentUser?.email}`)
  //   axiosSecure.get(`/cart-item/${id}`).then((res) => {
  //     console.log(res.data.classId);
  //     console.log("id", id);

  //     if (String(res.data.classId) === String(id)) {
  //       return alert("Already Selected");
  //     } else if (enrolledClasses.find((item) => item.classes._id === id)) {
  //       return alert("Already enrolled");
  //     } else {
  //       const data = {
  //         classId: id,
  //         userMail: currentUser?.email,
  //         date: new Date(),
  //       };

  //       axiosSecure.post("/add-to-cart", data).then((res) => {
  //         alert("Successfully added to the cart");
  //         console.log(res.data);
  //       });
  //     }
  //   });
  // };

  const handleSelect = (id) => {
    if (!currentUser) {
      alert("Please Login First");
      return navigate("/login");
    }

    axiosSecure
      .post("/add-to-cart", { classId: id, userMail: currentUser.email })
      .then((res) => {
        alert("Successfully added to the cart");
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return (
    <div>
      <div className="mt-20 pt-3">
        <h1 className="text-4xl font-bold text-center text-secondary">
          Classes
        </h1>
      </div>

      <div className="my-16 w-[90%] mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {classes.map((cls, index) => (
          <div
            key={index}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`relative hover:-translate-y-2 duration-150 hover:ring-[2px] hover:ring-secondary w-64 mx-auto ${
              cls.availableSeats < 1 ? "bg-red-300" : "bg-white"
            } dark:bg-slate-600 rounded-lg shadow-lg cursor-pointer`}
          >
            <div className="relative h-48">
              <div
                className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${
                  hoveredCard === index ? "opacity-60" : ""
                }`}
              />
              <img
                src={cls.image}
                className="object-cover w-full h-full"
                alt={cls.name}
              />

              <Transition show={hoveredCard === index}>
                <div className="absolute inset-0 flex items-center justify-center transition duration-300 ease-in">
                  <button
                    onClick={() => {
                      console.log(cls._id);
                      handleSelect(cls._id);
                    }}
                    title={
                      role === "admin" || role === "instructor"
                        ? "Instructor/Admin Cannot Select"
                        : cls.availableSeats < 1
                        ? "No Seats Available"
                        : "You Can Select Classes"
                    }
                    disabled={
                      role === "admin" ||
                      role === "instructor" ||
                      cls.availableSeats < 1
                    }
                    className="px-4 py-2 text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-red-700"
                  >
                    Add To Cart
                  </button>
                </div>
              </Transition>
            </div>
            <div className="px-6 py-2">
              <h3 className="font-semibold mb-1">{cls.name}</h3>
              <p className="text-gray-500 text-xs">
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
              <Link to={`/class/${cls._id}`} state={{ classDetails: cls }}>
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
