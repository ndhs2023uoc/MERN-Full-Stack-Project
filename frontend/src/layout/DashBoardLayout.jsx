import React, { useState } from "react";
import { BiHomeAlt, BiLogInCircle, BiSelectMultiple } from "react-icons/bi";
import useUser from "../hooks/useUser";
import { FaHome, FaUsers } from "react-icons/fa";
import { IoSchoolSharp } from "react-icons/io5";
import { SiGoogleclassroom, SiInstructure } from "react-icons/si";
import { BsFillPostageFill } from "react-icons/bs";
import { TbBrandAppleArcade } from "react-icons/tb";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Swal from "sweetalert2";
import {
  MdDoneAll,
  MdExplore,
  MdPayment,
  MdPendingActions,
} from "react-icons/md";
import Scroll from "../hooks/useScroll";
import useAuth from "../hooks/useAuth";
import UpdateProfile from "../pages/UpdateProfile";

const adminNavItems = [
  {
    to: "/dashboard/admin-home",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Dashboard Home",
  },

  {
    to: "/dashboard/manage-users",
    icon: <FaHome className="text-2xl" />,
    label: "Manage Users",
  },

  {
    to: "/dashboard/manage-classes",
    icon: <BsFillPostageFill className="text-2xl" />,
    label: "Manage Class",
  },

  {
    to: "/dashboard/manage-applications",
    icon: <TbBrandAppleArcade className="text-2xl" />,
    label: "Applicattions",
  },
];

const instructorsNavItems = [
  {
    to: "/dashboard/instructor-cp",
    icon: <FaHome className="text-2xl" />,
    label: "Home",
  },
  {
    to: "/dashboard/add-class",
    icon: <MdExplore className="text-2xl" />,
    label: "Add a class",
  },
  {
    to: "/dashboard/my-classes",
    icon: <IoSchoolSharp className="text-2xl" />,
    label: "My Classes",
  },
  {
    to: "/dashboard/my-pending",
    icon: <MdPendingActions className="text-2xl" />,
    label: "Pending Courses",
  },
  {
    to: "/dashboard/my-approved",
    icon: <MdDoneAll className="text-2xl" />,
    label: "Approved Classes",
  },
];

const studentsNavItems = [
  {
    to: "/dashboard/student-cp",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Dashboard",
  },
  {
    to: "/dashboard/enrolled-classes",
    icon: <SiGoogleclassroom className="text-2xl" />,
    label: "My Enrolled Classes",
  },
  // {
  //   to: "/dashboard/my-classes",
  //   icon: <IoSchoolSharp className="text-2xl" />,
  //   label: "My Classes",
  // },
  {
    to: "/dashboard/my-selected",
    icon: <BiSelectMultiple className="text-2xl" />,
    label: "My Selected",
  },
  {
    to: "/dashboard/my-payment",
    icon: <MdPayment className="text-2xl" />,
    label: "Payment History",
  },
  {
    to: "/dashboard/apply-instructor",
    icon: <SiInstructure className="text-2xl" />,
    label: "Apply for Instructor",
  },
];

const lastMenuItems = [
  {
    to: "/",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Main Home",
  },
  {
    to: "/update-profile",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Update Profile",
  },
  {
    to: "/browse",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Following",
  },
];

const DashBoardLayout = () => {
  const [open, setOpen] = useState(true);
  const { loader, logout } = useAuth();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const role = currentUser?.role;

  const handleLogOut = (event) => {
    Swal.fire({
      title: "Are You sure",
      text: "You wont be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,, Logout me!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
          .then(
            Swal.fire({
              title: "Logged Out",
              text: "You have successfully logout",
              icon: "success",
            })
          )
          .catch((error) => console.log(error));
      }
      navigate("/");
    });
  };

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner animation="border" role="status" />{" "}
        {/*react spinner serch the webloader will replace here */}
      </div>
    );
  }

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72 overflow-y-auto" : "w-[90px] overflow-auto"
        } bg-blue-200 h-screen p-5 md:block hidden pt-8 relative duration-300`}
      >
        <div className="flex gap-x-4 items-center">
          <img
            onClick={!open}
            src="/frontend/public/yoga-logo.png"
            className={`cursor-pointer h-[40px] duration-500 ${
              open && "rotate-[360deg] "
            }`}
          />
          <Link to="/">
            <h1
              onClick={() => setOpen(!open)}
              className={`text-dark-primary cursor-pointer font-bold origin-left text-xl duration-200 ${
                !open && "scale-0"
              }`}
            >
              Yoga Master
            </h1>
          </Link>
        </div>

        {/* Nav links -> admin */}
        {role === "admin" && (
          <ul className="pt-6 ">
            <p className={`ml-3 text-gray-500 ${!open && "hidden"}`}>
              <small>Menu</small>
            </p>

            {role === "admin" &&
              adminNavItems.map((menuItem, index) => {
                return (
                  <li key={index} className="mb-2">
                    <NavLink
                      to={menuItem.to}
                      className={({ isActive }) =>
                        `flex ${
                          isActive ? "bg-red-500 text-white" : "text-[#413F44"
                        } duration-250 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                      }
                    >
                      {menuItem.icon}
                      <span
                        className={`${
                          !open && "hidden"
                        } origin-left duration-200`}
                      >
                        {menuItem.label}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        )}

        {/* Nav links -> instructor */}
        {role === "instructor" && (
          <ul className="pt-6 ">
            <p className={`ml-3 text-gray-500 ${!open && "hidden"}`}>
              <small>Menu</small>
            </p>

            {role === "instructor" &&
              instructorsNavItems.map((menuItem, index) => {
                return (
                  <li key={index} className="mb-2">
                    <NavLink
                      to={menuItem.to}
                      className={({ isActive }) =>
                        `flex ${
                          isActive ? "bg-red-500 text-white" : "text-[#413F44"
                        } duration-250 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                      }
                    >
                      {menuItem.icon}
                      <span
                        className={`${
                          !open && "hidden"
                        } origin-left duration-200`}
                      >
                        {menuItem.label}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        )}

        {/* Nav links -> student */}
        {role === "user" && (
          <ul className="pt-6 ">
            <p className={`ml-3 text-gray-500 ${!open && "hidden"}`}>
              <small>Menu</small>
            </p>

            {role === "user" &&
              studentsNavItems.map((menuItem, index) => {
                return (
                  <li key={index} className="mb-2">
                    <NavLink
                      to={menuItem.to}
                      className={({ isActive }) =>
                        `flex ${
                          isActive ? "bg-red-500 text-white" : "text-[#413F44"
                        } duration-250 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                      }
                    >
                      {menuItem.icon}
                      <span
                        className={`${
                          !open && "hidden"
                        } origin-left duration-200`}
                      >
                        {menuItem.label}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        )}

        {/*  */}
        <ul className="pt-6">
          <p
            className={`ml-3 mb-3 text-gray-500 uppercase ${!open && "hidden"}`}
          >
            <small>Useful Links</small>
          </p>

          {lastMenuItems.map((menuItem, index) => {
            return (
              <li key={index} className="mb-2">
                <NavLink
                  to={menuItem.to}
                  className={({ isActive }) =>
                    `flex ${
                      isActive ? "bg-red-500 text-white" : "text-[#413F44"
                    } duration-250 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-semibold text-sm items-center gap-x-4`
                  }
                >
                  {menuItem.icon}
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    {menuItem.label}
                  </span>
                </NavLink>
              </li>
            );
          })}

          <li>
            <button
              onClick={() => handleLogOut()}
              className="duration-250 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4 flex flex-col-2"
            >
              <BiLogInCircle className="text-2xl" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                LogOut
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div className="h-screen overflow-y-auto px-8 flex-1">
        <Scroll />
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoardLayout;
