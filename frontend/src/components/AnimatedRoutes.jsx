import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Collections from '../pages/Collections';
import NewArrival from '../pages/NewArrival';
import Sale from '../pages/Sale';
import TrackOrder from '../pages/TrackOrder';
import ProductDetails from '../pages/ProductDetails';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import Wishlist from '../pages/Wishlist';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import { About, FAQ, Contact, LegalPage } from '../pages/StaticPages';
import AdminLayout from '../pages/Admin/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminOrders, { AdminCustomers, AdminMarketing, AdminSettings } from '../pages/Admin/AdminModules';
import AdminSecurityWrapper from './AdminSecurityWrapper';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
        <Route path="/collections" element={<PageWrapper><Collections /></PageWrapper>} />
        <Route path="/new-arrival" element={<PageWrapper><NewArrival /></PageWrapper>} />
        <Route path="/sale" element={<PageWrapper><Sale /></PageWrapper>} />
        <Route path="/track-order" element={<PageWrapper><TrackOrder /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetails /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/order-success" element={<PageWrapper><OrderSuccess /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        
        {/* Utility Pages */}
        <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
        
        {/* Brand & Support Pages */}
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
        <Route path="/shipping" element={<PageWrapper><LegalPage title="Shipping Policy" /></PageWrapper>} />
        <Route path="/returns" element={<PageWrapper><LegalPage title="Return & Exchange Policy" /></PageWrapper>} />
        <Route path="/size-guide" element={<PageWrapper><LegalPage title="Size Guide" /></PageWrapper>} />
        <Route path="/privacy" element={<PageWrapper><LegalPage title="Privacy Policy" /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper><LegalPage title="Terms of Service" /></PageWrapper>} />

        {/* Admin Panel */}
        <Route path="/admin" element={<PageWrapper><AdminSecurityWrapper><AdminLayout /></AdminSecurityWrapper></PageWrapper>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="marketing" element={<AdminMarketing />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
