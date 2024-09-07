import useUser from "../../hooks/useUser";
import DashboardNavigate from "../../routes/DashboardNavigate";

const Dashboard = () => {
  const { currentUser, isLoading } = useUser();
  const role = currentUser?.role;

  if (isLoading) {
    return;
    <div className="flex justify-center items-center h-screen">
      <HashLoader color="#36d7b7" />{" "}
      {/*react spinner serch the webloader will replace here */}
    </div>;
  }

  return <DashboardNavigate />;
};

export default Dashboard;
