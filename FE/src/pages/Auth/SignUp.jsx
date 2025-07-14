import { useEffect, useRef, useState } from "react";
import SignUpLayout from "../../layouts/SignUp";
import SignUpForm from "../../components/Form/User/SignUp"; // hoặc SignUp, Information, ...
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";





const SignUpPage = () => {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);


  // Xử lý scroll để ẩn/hiện header
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < 10) {
            setShowHeader(true);
          } else if (currentScrollY > lastScrollY.current) {
            // Cuộn xuống
            setShowHeader(false);
          } else {
            // Cuộn lên
            setShowHeader(true);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý mouse move lên vùng trên cùng để hiện header
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 80) {
        setShowHeader(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ willChange: "transform" }}
      >
        <Header />
      </div>
      <div className="pt-[64px]">
        {" "}
        {/* Để tránh che mất phần trên */}
        <SignUpLayout>
          <SignUpForm />
        </SignUpLayout>
        <Footer />
      </div>
    </div>
  );
};

export default SignUpPage;
