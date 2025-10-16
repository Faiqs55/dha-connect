import { useEffect } from "react";
import ContainerCenter from "../../Components/ContainerCenter";
import AdminHeader from "./AdminHeader";
import { Link, useNavigate } from "react-router";


const Dashboard = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");  

  useEffect(() => {
      if(!token){
        navigate("/login");
      }
  }, []);

  return (
    <>
      <AdminHeader/>

      {/* MAIN CONTENT  */}
      <div>
        <ContainerCenter className="mt-5">
            <h1 className="text-4xl font-semibold text-center">Admin Dashboard</h1>
            <h2 className="text-2xl font-semibold mt-5">Quick Access:</h2>

            <div className="grid grid-cols-3 gap-5 mt-5">
                <Link to={"./agencies"} className="px-10 py-4 bg-[#114085] border-2 border-[#06234e] rounded-md">
                     <h3 className="text-white text-xl font-semibold">View Agencies</h3>
                </Link>
                <Link to={"./properties"} className="px-10 py-4 bg-[#114085] border-2 border-[#06234e] rounded-md">
                     <h3 className="text-white text-xl font-semibold">View Properties</h3>
                </Link>
                <Link to={"./agencies/add"} className="px-10 py-4 bg-[#114085] border-2 border-[#06234e] rounded-md">
                     <h3 className="text-white text-xl font-semibold">Add Agencies</h3>
                </Link>
                <Link to={"./properties/add"} className="px-10 py-4 bg-[#114085] border-2 border-[#06234e] rounded-md">
                     <h3 className="text-white text-xl font-semibold">Add Properties</h3>
                </Link>
            </div>
        </ContainerCenter>
      </div>
    </>
  );
};

export default Dashboard;
