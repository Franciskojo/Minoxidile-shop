import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AdminLayout from './pages/AdminLayout.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';

// Private Pages
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderDetailsPage from './pages/OrderDetailsPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProductListPage from './pages/AdminProductListPage.jsx';
import AdminProductEditPage from './pages/AdminProductEditPage.jsx';
import AdminOrderListPage from './pages/AdminOrderListPage.jsx';
import AdminCategoryPage from './pages/AdminCategoryPage.jsx';
import AdminCouponPage from './pages/AdminCouponPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminMessagesPage from './pages/AdminMessagesPage.jsx';

// Vendor Pages
import VendorLayout from './pages/VendorLayout.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';
import BecomeVendorPage from './pages/BecomeVendorPage.jsx';
import AdminVendorApplicationsPage from './pages/AdminVendorApplicationsPage.jsx';
import VendorChatPage from './pages/VendorChatPage.jsx';
import VendorProductsPage from './pages/VendorProductsPage.jsx';
import VendorOrdersPage from './pages/VendorOrdersPage.jsx';
import VendorSettingsPage from './pages/VendorSettingsPage.jsx';
import VendorProductEditPage from './pages/VendorProductEditPage.jsx';

// Guards
import { PrivateRoute, AdminRoute, VendorRoute } from './components/RouteGuards.jsx';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'hot-toast-custom',
          duration: 4000
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Protected User Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order/:id" element={<OrderDetailsPage />} />
              <Route path="/order/:id/success" element={<OrderSuccessPage />} />
              <Route path="/account/profile" element={<ProfilePage />} />
              <Route path="/account/orders" element={<MyOrdersPage />} />
              <Route path="/account/wishlist" element={<WishlistPage />} />
              <Route path="/become-vendor" element={<BecomeVendorPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProductListPage />} />
                <Route path="products/create" element={<AdminProductEditPage />} />
                <Route path="products/edit/:id" element={<AdminProductEditPage />} />
                <Route path="orders" element={<AdminOrderListPage />} />
                <Route path="order/:id" element={<OrderDetailsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="vendors/applications" element={<AdminVendorApplicationsPage />} />
                <Route path="categories" element={<AdminCategoryPage />} />
                <Route path="coupons" element={<AdminCouponPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
              </Route>
            </Route>

            {/* Vendor Routes */}
            <Route element={<VendorRoute />}>
              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<Navigate to="/vendor/dashboard" replace />} />
                <Route path="dashboard" element={<VendorDashboard />} />
                <Route path="chat" element={<VendorChatPage />} />
                <Route path="products" element={<VendorProductsPage />} />
                <Route path="products/create" element={<VendorProductEditPage />} />
                <Route path="products/edit/:id" element={<VendorProductEditPage />} />
                <Route path="orders" element={<VendorOrdersPage />} />
                <Route path="order/:id" element={<OrderDetailsPage />} />
                <Route path="settings" element={<VendorSettingsPage />} />
              </Route>
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={
              <div className="page-wrapper loader-center">
                <div className="empty-state">
                  <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--accent-primary)' }}>404</h1>
                  <h2>Oops! Page Not Found</h2>
                  <p>The page you are looking for doesn't exist or has been moved.</p>
                  <Link to="/"><button className="btn btn-primary">Back Home</button></Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
