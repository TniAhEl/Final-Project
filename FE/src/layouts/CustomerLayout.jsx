import SidebarCustomer from "../components/Sidebar/Customer";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import HeaderAuth from "../components/Header/HeaderAuth";
import CompareSidebar from "../components/Sidebar/Compare";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <HeaderAuth />

      <div className="flex flex-1">
        {/* Sidebar with fixed width */}
        <div className="w-[220px] flex-shrink-0">
          <SidebarCustomer />
        </div>

        {/* Main Content takes the remaining space */}
        <main className="flex-1 p-6 bg-white overflow-x-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Compare Sidebar */}
      <CompareSidebar />
    </div>
  );
};

export default CustomerLayout;
