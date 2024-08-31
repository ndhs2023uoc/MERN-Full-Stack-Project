import React, { useState } from "react";
import useUser from "../../hooks/useUser";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import useAxioxSecure from "../../hooks/useAxioxSecure";

const SingleClass = () => {
  const courses = useLoaderData();
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const useAxiosFetch = useAxiosFetch();
  const axiosSecure = useAxioxSecure();

  return (
    <>
      <div
        className="font-gilroy font-medium text-gray dark:text-white text-lg leading-[27px] w-[90%] mx-auto"
        data-new-gr-c-s-check-Loaded="14.1157.0"
        data-gr-ext-installed=""
      >
        <div className="breadcrumbd bg-primary py-20 mt-20 section-padding bg-cover bg-center bg-no-repeat">
          <div className="container text-center">
            <h2>Course Details</h2>
          </div>
        </div>

        <div className="nav-tab-wrapper tabs section-padding mt-8">
          <div className="container">
            <div className="grid-cols-12 md:gap=[30px]">{/*left side */}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleClass;

{
  /* 1:55:18 video need to refer if there any error for now we skip this part */
}
