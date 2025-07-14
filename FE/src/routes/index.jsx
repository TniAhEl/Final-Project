import { Routes, Route } from "react-router-dom";
import ProductPage from "../pages/Product/Products";
import ProductDetailPage from "../pages/Product/Details";
import PageSignUp from "../pages/Auth/SignUp";
import PageSignIn from "../pages/Auth/SignIn";
import PageHomeMain from "../pages/Home/Main";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
import Orders from "../components/Table/Customer/Order";
import Profile from "../components/Form/User/Profile";
import WarrantyTable from "../components/Table/Customer/Warranty";
import InsuranceTable from "../components/Table/Customer/Insurance";
import CartTable from '../components/Table/Customer/Cart'
import CheckOut from '../components/Form/User/Checkout'

// Import các trang con cho admin
import Dashboard from "../layouts/DashBoard";
import UserManagement from "../components/Table/Admin/User";
import ProductManagement from "../components/Table/Admin/Product";
import OrderManagement from "../components/Table/Admin/Order";
import PromotionManagement from "../components/Table/Admin/Promotion"
import InsuranceManagement from "../components/Table/Admin/Insurance"
import WarrantyManagement from "../components/Table/Admin/Warranty"

import PageNotFound from '../pages/Exception/404'
import AboutUs from "../pages/Home/AboutUs";
import CustomerDashboard from "../layouts/CustomerDashboard";

// import các trang con khác nếu cần

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PageHomeMain />} />
    <Route path="/products" element={<ProductPage />} />
    <Route path="/product/:id" element={<ProductDetailPage />} />
    <Route path="/signup" element={<PageSignUp />} />
    <Route path="/signin" element={<PageSignIn />} />

    {/* Route lồng nhau cho customer */}
    <Route path="/customer" element={<CustomerLayout />}>
      <Route index element={<Orders />} />
      <Route path="orders" element={<Orders />} />
      <Route path="cart" element={<CartTable />} />
      <Route path="profile" element={<Profile />} />
      <Route path="warranty" element={<WarrantyTable />} />
      <Route path="insurance" element={<InsuranceTable />} />
      <Route path="checkout" element={<CheckOut />} />
      <Route path="dashboard" element={<CustomerDashboard />} />
      {/* Thêm các route con khác nếu muốn */}
    </Route>

    {/* Route lồng nhau cho admin */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="products" element={<ProductManagement />} />
      <Route path="orders" element={<OrderManagement />} />
      <Route path="promotions" element={<PromotionManagement />} />
      <Route path="insurances" element={<InsuranceManagement />} />
      <Route path="warranties" element={<WarrantyManagement />} />
    </Route>


    <Route path="/about-us" element={<AboutUs/>}/>
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AppRoutes;
