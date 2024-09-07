import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("inside login");
      const userCredential = await googleLogin();
      const user = userCredential.user;
      console.log(user);
      if (user) {
        const userImp = {
          name: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL, // Corrected typo here
          role: "user",
          gender: "Is not specified",
          address: "Is not specified",
          phone: "Is not specified",
        };
        if (user.email && user.displayName) {
          await axios.post("http://localhost:3000/new-user", userImp);
          navigate("/");
          console.log("Registration Successful!");
        }
      }
    } catch (error) {
      console.error("Error during Google login:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center my-3">
      <button
        onClick={handleLogin} // Simplified onClick handler
        className="flex items-center outline-none bg-white border border-gray-300 rounded-lg shadow-lg px-6 py-4 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none"
      >
        <FcGoogle className="h-6 w-6 mr-2" />
        <span>Continue With Google</span>
      </button>
    </div>
  );
};

export default GoogleLogin;
