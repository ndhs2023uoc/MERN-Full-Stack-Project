import React, { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
  FaClock,
  FaBan,
} from "react-icons/fa";

const AdminHome = () => {
  const { currentUser } = useUser();
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [popularClasses, setPopularClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, classesRes, popularRes] = await Promise.all([
          axiosSecure.get("/users"),
          axiosSecure.get("/classes-manage"),
          axiosSecure.get("/popular-classes"),
        ]);

        const users = usersRes.data;
        const classes = classesRes.data;

        setStats({
          totalUsers: users.length,
          instructors: users.filter((user) => user.role === "instructor")
            .length,
          approvedClasses: classes.filter((cls) => cls.status === "approved")
            .length,
          pendingClasses: classes.filter((cls) => cls.status === "pending")
            .length,
          rejectedClasses: classes.filter((cls) => cls.status === "rejected")
            .length,
        });

        setRecentUsers(users.slice(-5).reverse());
        setPopularClasses(popularRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, [axiosSecure]);

  const statItems = [
    { title: "Total Members", value: stats.totalUsers, icon: FaUsers },
    {
      title: "Instructors",
      value: stats.instructors,
      icon: FaChalkboardTeacher,
    },
    {
      title: "Approved Classes",
      value: stats.approvedClasses,
      icon: FaBookOpen,
    },
    { title: "Pending Classes", value: stats.pendingClasses, icon: FaClock },
    { title: "Rejected Classes", value: stats.rejectedClasses, icon: FaBan },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl mb-12 font-bold">
        Welcome Back,{" "}
        <span className="text-secondary">{currentUser?.name}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {statItems.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <RecentUsers users={recentUsers} />
        <PopularClasses classes={popularClasses} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <Icon className="text-4xl text-secondary mx-auto mb-4" />
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold">{value || 0}</p>
  </div>
);

const RecentUsers = ({ users }) => (
  <div className="bg-white p-8 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6">Recent User Registrations</h2>
    <ul className="space-y-4">
      {users.map((user, index) => (
        <li key={index} className="flex justify-between items-center">
          <span>{user.name}</span>
          <span className="text-gray-500">{user.email}</span>
        </li>
      ))}
    </ul>
  </div>
);

const PopularClasses = ({ classes }) => (
  <div className="bg-white p-8 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6">Popular Classes</h2>
    <ul className="space-y-4">
      {classes.map((cls, index) => (
        <li key={index} className="flex justify-between items-center">
          <span>{cls.name}</span>
          <span className="font-semibold">{cls.totalEnrolled} enrollments</span>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminHome;
