import React, { useEffect, useState } from "react";
import HeaderAuth from "../components/Header/HeaderAuth";
import Footer from "../components/Footer/Footer";

const MainLayout = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Hiệu ứng header trượt lên/xuống khi scroll
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
        <HeaderAuth />
      </div>

      {/* Để tránh nội dung bị che, thêm padding-top bằng chiều cao header (giả sử 64px) */}
      <div className="pt-16" />

      {/* Nội dung chính */}
      <main className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-[1440px] px-4 py-8 flex flex-col gap-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
