import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const GoogleLogin = () => {
//   const { googleLogin } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     googleLogin()
//       .then((userCredential) => {
//         const user = userCredential.user;
//         console.log(user);
//         if (user) {
//           const userImp = {
//             name: user?.displayName,
//             email: user?.email,
//             phpURL: user?.photoURL,
//             role: "user",
//             gender: "Is not specified",
//             address: "Is not specified",
//             phone: "Is not specified",
//           };
//           if (user.email && user.displayName) {
//             return axios
//               .post("http://localhost:3000/new-user", userImp)
//               .then(() => {
//                 navigate("/");
//                 return "Registration Successful!";
//               })
//               .catch((err) => {
//                 throw new Error(err);
//               });
//           }
//         }
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorMessage);
//       });
//   };

//   return (
//     <div className="flex items-center justify-center my-3">
//       <button
//         onClick={() => handleLogin()}
//         className="flex items-center outline-none bg-white border border-gray-300 rounded-lg shadow-lg px-6 py-4 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none"
//       >
//         <FcGoogle className="h-6 w-6 mr-2" />
//         <span>Continue With Google</span>
//       </button>
//     </div>
//   );
// };

// const GoogleLogin = () => {
//   const { googleLogin } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     googleLogin()
//       .then((userCredential) => {
//         const user = userCredential.user;
//         if (user) {
//           const userImp = {
//             name: user?.displayName,
//             email: user?.email,
//             photoURL: user?.photoURL,
//             role: "user",
//             gender: "Is not specified",
//             address: "Is not specified",
//             phone: "Is not specified",
//           };

//           if (user.email && user.displayName) {
//             return axios
//               .get(`http://localhost:3000/check-user/${user.email}`)
//               .then((response) => {
//                 console.log("response", response);

//                 if (response.status) {
//                   // If user does not exist, create a new user
//                   return axios.post("http://localhost:3000/new-user", userImp);
//                 } else {
//                   // User exists
//                   console.log("User already exists.");
//                 }
//               })
//               .then(() => {
//                 navigate("/");
//                 return "Login Successful!";
//               })
//               .catch((err) => {
//                 throw new Error(err);
//               });
//           }
//         }
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorMessage);
//       });
//   };

//   return <button onClick={handleLogin}>Login with Google</button>;
// };

const GoogleLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    googleLogin()
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        if (user) {
          const userImp = {
            name: user?.displayName,
            email: user?.email,
            photoURL: user?.photoURL,
            role: "user",
            gender: "Is not specified",
            address: "Is not specified",
            phone: "Is not specified",
          };

          if (user.email && user.displayName) {
            return axios
              .get(`http://localhost:3000/check-user/${user.email}`)
              .then((response) => {
                // If user exists, do something (e.g., navigate to the dashboard)
                // console.log("User already exists:", response.data);
                navigate("/");
              })
              .catch((error) => {
                if (error.response && error.response.status === 404) {
                  // If user does not exist, create a new user
                  return axios
                    .post("http://localhost:3000/new-user", userImp)
                    .then(() => {
                      console.log("New user created successfully.");
                      navigate("/");
                    })
                    .catch((err) => {
                      console.error("Error creating new user:", err);
                    });
                } else {
                  // Handle other errors (e.g., server errors)
                  console.error("Error fetching user:", error);
                }
              });
          }
        }
      })
      .catch((error) => {
        console.log("Google Login Error:", error.message);
      });
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
