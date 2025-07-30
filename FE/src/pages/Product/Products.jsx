import React from "react";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CategoryLayout from "../../layouts/CategoryLayout";
import ScrollToTopButton from "../../components/Button/ScrollToTop";
import CompareSidebar from "../../components/Sidebar/Compare";
import { isAuthenticated } from "../../services/localCartService";

const Products = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Header - Using HeaderAuth if logged in, Header if not */}
      {isAuthenticated() ? <HeaderAuth /> : <Header />}

      {/* Main content: CategoryLayout */}
      <div className="flex-1">
        <CategoryLayout />
      </div>

      {/* Footer */}
      <Footer />

      {/* Scroll to top button */}
      <ScrollToTopButton />
      
      {/* Compare Sidebar */}
      <CompareSidebar />
    </div>
  );
};

export default Products;
