import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import FloatingWidgets from './components/FloatingWidgets';
import Footer from './components/Footer';
import AnimatedRoutes from './components/AnimatedRoutes';


function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <CartDrawer />
        <main style={{ flex: 1 }}>
          <AnimatedRoutes />
        </main>
        <FloatingWidgets />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
