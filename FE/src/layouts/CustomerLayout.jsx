import SidebarCustomer from "../components/Sidebar/Customer";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import HeaderAuth from "../components/Header/HeaderAuth";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <HeaderAuth />

      <div className="flex flex-1">
        {/* Sidebar với width cố định */}
        <div className="w-[220px] flex-shrink-0">
          <SidebarCustomer />
        </div>

        {/* Main Content chiếm phần còn lại */}
        <main className="flex-1 p-6 bg-white overflow-x-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;
