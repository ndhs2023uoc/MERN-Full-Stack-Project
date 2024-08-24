import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/headers/NavBar";

const MainLayout = () => {
  return (
    <main>
      <NavBar />
      <Outlet />
      <footer>footer</footer>
    </main>
  );
};

export default MainLayout;
