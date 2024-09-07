import React from "react";
import useAuth from "./useAuth";
import useAxioxSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  const { user } = useAuth();
  const axiosSecure = useAxioxSecure();
  const {
    data: currentUser,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user/${user?.email}`);
      return res.data;
    },
    enable: !!user?.email && !!localStorage.getItem("token"),
  });
  return { currentUser, isLoading, refetch };
};

export default useUser;
