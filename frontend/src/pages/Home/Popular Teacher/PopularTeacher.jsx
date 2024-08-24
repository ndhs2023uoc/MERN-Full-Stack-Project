import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import Img from "../../../assets/home/girl.jpg";

const PopularTeacher = () => {
  const [instructors, setInstructors] = useState([]);
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    axiosFetch
      .get("/popular-instructors")
      .then((data) => {
        setInstructors(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(instructors);
  return (
    <div className="md:w-[80%] mx-auto my-36">
      <div>
        <h1 className="text-5xl font-bold text-center">
          Our <span className="text-secondary">Best</span> Instructors
        </h1>
        <div className="w-[40%] text-center mx-auto my-4">
          <p className="text-gap-500">
            Explore Our Popular Classes. Here is some Popular Classes Based on
            How Many student enrolled
          </p>
        </div>
      </div>

      {instructors ? (
        <>
          <div className="grid mb-28 md:grid-cols-2 lg:grid-cols-4 w-[90%] gap-4 mx-auto">
            {/* only best 4 are showing */}
            {instructors?.slice(0, 4).map((instructor, i) => (
              <div className="flex dark:text-white hover:-translate-y-2 duration-200 cursor-pointer flex-col shadow-md py-8 px-10 md:px-8 rounded-md">
                <div className="flex-col flex gap-6 md:gap-8">
                  <img
                    className="rounded-full border-4 border-gray-300 h-24 w-24 mx-auto"
                    src={instructor?.instructor?.photoUrl || `${Img}`}
                  />
                  <div>
                    <p>{instructor?.instructor?.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PopularTeacher;
