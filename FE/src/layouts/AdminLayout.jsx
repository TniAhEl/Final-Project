import SidebarAdmin from "../components/Sidebar/Admin";
import HeaderAuth from "../components/Header/HeaderAuth";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import ScrollToTopButton from "../components/Button/ScrollToTop";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <HeaderAuth />

      <div className="flex flex-1">
        <div className="w-[220px] flex-shrink-0">
          <SidebarAdmin />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white overflow-x-auto">
          <Outlet />
          <ScrollToTopButton />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
