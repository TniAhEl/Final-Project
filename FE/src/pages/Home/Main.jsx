import React from "react";
import MainLayout from "../../layouts/MainLayout";
import MainLanding from "../../components/Landing/Main"
import BrandLanding from "../../components/Landing/Brand"
import BestSeller from "../../components/Ad/BestSeller"
import NewArrivals from "../../components/Ad/NewArrivals"
import Suggest from "../../components/Suggest/Suggest";


const HomeMain = () => {
  return (
    <MainLayout>
      {/* Nội dung trang chủ ở đây */}
     <MainLanding/>
     <BrandLanding/>
     <BestSeller/>
     <NewArrivals/>
     <Suggest/>
    </MainLayout>
  );
};

export default HomeMain;
