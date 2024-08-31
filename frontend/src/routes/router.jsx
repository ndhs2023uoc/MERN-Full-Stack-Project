import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Instructors from "../pages/Instructors/Instructors";
import Classes from "../pages/Classes/Classes";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import SingleClass from "../pages/Classes/SingleClass";
import DashBoardLayout from "../layout/DashBoardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import StudentCp from "../pages/Students/StudentCp";
import EnrolledClasses from "../pages/Dashboard/Students/Enroll/EnrolledClasses";
import SelectedClass from "../pages/Dashboard/Students/SelectedClass";
import MyPaymentHistory from "../pages/Dashboard/Students/Payment/History/MyPaymentHistory";
import AsInstructor from "../pages/Dashboard/Students/Apply/AsInstructor";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout>Hello world!</MainLayout>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "instructors",
        element: <Instructors />,
      },
      {
        path: "classes",
        element: <Classes />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/class/:id",
        element: <SingleClass />,
        loader: ({ params }) =>
          fetch(`http://localohost:5000/class/${params.id}`),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashBoardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      // {/*stdent routes */}
      {
        path: "student-cp",
        element: <StudentCp />,
      },
      {
        path: "enrolled-class",
        element: <EnrolledClasses />,
      },
      {
        path: "my-selected",
        element: <SelectedClass />,
      },
      {
        path: "my-payments",
        element: <MyPaymentHistory />,
      },
      {
        path: "apply-instructor",
        element: <AsInstructor />,
      },
    ],
  },
]);
