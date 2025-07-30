import React, { useEffect, useState } from "react";
import HeaderAuth from "../components/Header/HeaderAuth";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import CompareSidebar from "../components/Sidebar/Compare";

const MainLayout = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Animate header visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isHovering) return;
      if (window.scrollY > 0) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowHeader(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          showHeader
            ? "translate-y-0 pointer-events-auto"
            : "-translate-y-full pointer-events-none"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {localStorage.getItem("token") ? <HeaderAuth /> : <Header />}
      </div>

      {/* Avoid content being hidden, add padding-top equal to header height (assumed 64px) */}
      <div className="pt-16" />

      {/* Main content */}
      <main className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-[1440px] px-4 py-8 flex flex-col gap-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Compare Sidebar */}
      <CompareSidebar />
    </div>
  );
};

export default MainLayout;
