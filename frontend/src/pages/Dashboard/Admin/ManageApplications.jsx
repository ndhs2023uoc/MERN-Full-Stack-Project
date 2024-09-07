import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    axiosSecure
      .get("/applied-instructors")
      .then((response) => setApplications(response.data))
      .catch((error) => {
        console.error("Error fetching applications:", error);
        Swal.fire("Error", "Failed to fetch applications", "error");
      });
  };

  const handleStatusChange = (id, status) => {
    axiosSecure
      .patch(`/change-user-status/${id}`, { status })
      .then(() => {
        Swal.fire("Success", `Application ${status}`, "success");
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app._id === id ? { ...app, status } : app
          )
        );
      })
      .catch((error) => {
        console.error("Error updating application status:", error);
        Swal.fire("Error", "Failed to update application status", "error");
      });
  };

  const handleDelete = (id) => {
    axiosSecure
      .delete(`/delete-application/${id}`)
      .then(() => {
        Swal.fire("Deleted", "Application has been deleted", "success");
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app._id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
        Swal.fire("Error", "Failed to delete application", "error");
      });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">
        Manage Instructor Applications
      </h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Experience
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {app.name}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {app.email}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {app.experience}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                {app.status || "pending"}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(app._id, "approved")}
                    className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                    disabled={
                      app.status === "approved" || app.status === "rejected"
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
                    disabled={
                      app.status === "approved" || app.status === "rejected"
                    }
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageApplications;
