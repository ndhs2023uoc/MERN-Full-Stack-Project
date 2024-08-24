import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeProvider, THEME_ID, createTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import Switch from "@mui/material/Switch";

const navLinks = [
  { name: "Home", route: "/" },
  { name: "Instructors", route: "/instructors" },
  { name: "Classes", route: "/classes" },
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#060331",
    },
    secondary: {
      main: "#0d0e17",
    },
  },
});

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFIxed, setIsFixed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [navBg, setNavBg] = useState("bg-[$15151580]");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const darkClass = "dark";
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add(darkClass);
    } else {
      root.classList.remove(darkClass);
    }
  }, [isDarkMode]);

  useEffect(() => {
    setIsHome(location.pathname === "/");
    setIsLogin(location.pathname === "/login");
    setIsFixed(
      location.pathname == "/register" || location.pathname === "/login"
    );
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrollPosition > 10) {
      if (isHome) {
        setNavBg(
          "bg-white backdrop-filter backdrop-blur-xl dark-white text-black"
        );
      } else {
        setNavBg("bg-white dark:bg-white dark:text-white text-black");
      }
    } else {
      setNavBg(
        `${
          isHome || location.pathname === "/"
            ? "bg-transparent"
            : "bg-white dark:bg-black"
        } dark:text-white text-white`
      );
    }
  }, [scrollPosition]);

  const user = false;
  return (
    <nav className="">
      <div className="lg:w-[95%] mx-auto sm:px lg:px-6">
        <div className="px-4 py-4 flex items-center justify-between">
          {/*logo*/}
          <div>
            <h1 className="rext-2xl inline-flex gap-3 items-center font-bold">
              YogaMaster
              <img src="/yoga-logo.png" alt="" className="w-8 h-8" />
            </h1>
            <p className="font-bold text-[13px] tracking-[8px]">
              Quick Explore
            </p>
          </div>
          {/* mobile menu icon */}
          {/* Navigational Links*/}
          <div className="hidden md:block text-black dark:text-white">
            <div className="flex">
              <ul className="ml-10 flex items-center space-x-4 pr-4">
                {navLinks.map((Link) => (
                  <li key={Link.route}>
                    <NavLink
                      to={Link.route}
                      className={({ isActive, isPending }) =>
                        `font-bold ${
                          isActive
                            ? "text-secondary"
                            : `${
                                navBg.includes("bg-transparent")
                                  ? "text-white"
                                  : "text-black dark:text-white"
                              }`
                        } hover:text-secondary duration-500`
                      }
                    >
                      {Link.name}
                    </NavLink>
                  </li>
                ))}
                {/* based on user */}
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive, isPending }) =>
                      `font-bold ${
                        isActive
                          ? "text-secondary"
                          : `${
                              navBg.includes("bg-transparent")
                                ? "text-white"
                                : "text-black dark:text-white"
                            }`
                      } hover:text-secondary duration-500`
                    }
                  >
                    Login
                  </NavLink>
                </li>
                {/* color toggle */}
                <ThemeProvider theme={theme}>
                  <div className="flex flex-col justify-center items-center">
                    <Switch onChange={() => setIsDarkMode(!isDarkMode)} />
                    <h1 className="text-[8px] ">Light / Dark</h1>
                  </div>
                </ThemeProvider>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
