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
import CartTable from "../components/Table/Customer/Cart";
import CheckOut from "../components/Form/User/Checkout";
import OrderCheckout from "../pages/Order/Checkout";
import ComparePage from "../pages/Product/Compare";

// Import admin page
import Dashboard from "../layouts/DashBoard";
import UserManagement from "../components/Table/Admin/User";
import ProductManagement from "../components/Table/Admin/Product";
import OrderManagement from "../pages/Admin/Orders";
import PromotionManagement from "../components/Table/Admin/Promotion";
import InsuranceManagement from "../components/Table/Admin/Insurance";
import WarrantyManagement from "../components/Table/Admin/Warranty";
import ReviewAdminTable from "../components/Table/Admin/Review";

import PageNotFound from "../pages/Exception/404";
import AboutUs from "../pages/Home/AboutUs";
import Jobs from "../pages/Home/Jobs";
import TermsOfService from "../pages/Home/TermsOfService";
import PrivacyPolicy from "../pages/Home/PrivacyPolicy";
import CustomerDashboard from "../layouts/CustomerDashboard";

// Import ProtectedRoute components
import ProtectedRoute from "../components/ProtectedRoute";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import CustomerProtectedRoute from "../components/CustomerProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PageHomeMain />} />
    <Route path="/products" element={<ProductPage />} />
    <Route path="/product/:id" element={<ProductDetailPage />} />
    
    {/* Protected auth routes - redirect if already authenticated */}
    <Route path="/signup" element={
      <ProtectedRoute redirectTo="/customer/dashboard">
        <PageSignUp />
      </ProtectedRoute>
    } />
    <Route path="/signin" element={
      <ProtectedRoute redirectTo="/customer/dashboard">
        <PageSignIn />
      </ProtectedRoute>
    } />
    
    <Route path="/order/checkout" element={<OrderCheckout />} />
    <Route path="/compare" element={<ComparePage />} />

    {/* Route nested for customer - only accessible by customers */}
    <Route path="/customer" element={
      <CustomerProtectedRoute>
        <CustomerLayout />
      </CustomerProtectedRoute>
    }>
      <Route index element={<CustomerDashboard />} />
      <Route path="orders" element={<Orders />} />
      <Route path="cart" element={<CartTable />} />
      <Route path="profile" element={<Profile />} />
      <Route path="warranty" element={<WarrantyTable />} />
      <Route path="insurance" element={<InsuranceTable />} />
      <Route path="checkout" element={<CheckOut />} />
    </Route>

    {/* Route nested for admin - only accessible by admins */}
    <Route path="/admin" element={
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    }>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="products" element={<ProductManagement />} />
      <Route path="orders" element={<OrderManagement />} />
      <Route path="promotions" element={<PromotionManagement />} />
      <Route path="insurances" element={<InsuranceManagement />} />
      <Route path="warranties" element={<WarrantyManagement />} />
      <Route path="review" element={<ReviewAdminTable />} />
    </Route>

    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/terms" element={<TermsOfService  />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AppRoutes;
