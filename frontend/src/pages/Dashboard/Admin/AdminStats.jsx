import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminStats = ({ users }) => {
  const [data, setData] = useState();
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    axiosSecure
      .get("/admin-stats")
      .then((res) => setData(res.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 px-4 mt-8 sm:grid-cols-4 sm:px-8">
        {/* four icons what you have to implement*/}
        <div>
          <div>
            {/*icon should goes here*/}
            <h3 className="text-sm tracking-wider">Total members</h3>
            <p className="text-3xl">{users?.length}</p>
          </div>
        </div>
        <div>
          <div>
            {/*icon should goes here*/}
            <h3 className="text-sm tracking-wider">Approved Classes</h3>
            <p className="text-3xl">{data?.approvedClasses}</p>
          </div>
        </div>
        <div>
          <div>
            {/*icon should goes here*/}
            <h3 className="text-sm tracking-wider">Instructors</h3>
            <p className="text-3xl">{data?.instructors}</p>
          </div>
        </div>
        <div>
          <div>
            {/*icon should goes here*/}
            <h3 className="text-sm tracking-wider">Pending</h3>
            <p className="text-3xl">{data?.pendingClasses}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
