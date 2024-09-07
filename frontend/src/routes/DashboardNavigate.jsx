import React from "react";
import { Navigate } from "react-router-dom";
import useUser from "../hooks/useUser";

const DashboardNavigate = () => {
  const { currentUser, isLoading } = useUser();
  const role = currentUser?.role;

  if (isLoading) {
    return <div> Loading...</div>;
  }

  if (role === "admin") return <Navigate to="/dashboard/admin-home" />;
  if (role === "instructor") return <Navigate to="/dashboard/instructor-cp" />;
  if (role === "user") return <Navigate to="/dashboard/student-cp" />;
};

export default DashboardNavigate;
