import React from "react";
import { Navigate } from "react-router-dom";

const DashboardNavigate = () => {
  const { currentUser, isLoading } = useUser();
  const role = currentUser?.role;

  if (isLoading) {
    return <div> Loading...</div>;
  }

  if (role === "admin") return <Navigate to="/dashbord/admin-home" />;
  if (role === "instructor") return <Navigate to="/dashbord/instructor-cp" />;
  if (role === "user") return <Navigate to="/dashbord/student-cp" />;
};

export default DashboardNavigate;
