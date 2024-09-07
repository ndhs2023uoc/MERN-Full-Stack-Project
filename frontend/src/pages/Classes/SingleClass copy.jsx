import React from "react";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLoaderData } from "react-router-dom";

const SingleClass = () => {
  const course = useLoaderData();
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const axiosSecure = useAxiosSecure();

  return (
    <>
      <div className="font-gilroy font-medium text-gray dark:text-white text-lg leading-[27px] w-[90%] mx-auto">
        <div className="breadcrumbd bg-primary py-20 mt-20 section-padding bg-cover bg-center bg-no-repeat">
          <div className="container text-center">
            <h2>Course Details</h2>
          </div>
        </div>

        <div className="nav-tab-wrapper tabs section-padding mt-8">
          <div className="container">
            <div className="grid-cols-12 md:gap=[30px]">
              {/* Display course details here */}
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              {/* Add more course details as needed */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleClass;
