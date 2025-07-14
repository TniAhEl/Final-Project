import React from 'react';
import HeaderAuth from '../../components/Header/HeaderAuth';
import Footer from '../../components/Footer/Footer';
import CategoryLayout from '../../layouts/CategoryLayout';
import ScrollToTopButton from '../../components/Button/ScrollToTop';

const Products = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Header */}
      <HeaderAuth />

      {/* Nội dung chính: CategoryLayout */}
      <div className="flex-1">
        <CategoryLayout />
      </div>

      {/* Footer */}
      <Footer />

      {/* Nút scroll to top */}
      <ScrollToTopButton />
    </div>
  );
};

export default Products;
