import { useEffect } from "react";
import axios from "axios";

const useAxiosFetch = () => {
  // Create an instance of axios with a base URL
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
  });

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        // You can add authorization headers or other configurations here
        return config;
      },
      (error) => {
        // Handle request errors here
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        // You can handle responses, log them, etc.
        return response;
      },
      (error) => {
        // Handle response errors here
        return Promise.reject(error);
      }
    );

    // Eject interceptors when the component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance]);

  return axiosInstance;
};

export default useAxiosFetch;
