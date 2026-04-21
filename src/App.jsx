import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';


import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import Checkout from './pages/Checkout';
import OrdersPage from './pages/OrdersPage';
import FloatingCartBar from './components/FloatingCartBar';
import CursorFollower from './components/CursorFollower';
import ChatSupport from './components/ChatSupport';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
};

function App() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CursorFollower />
      <Navbar />
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...pageTransition}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <FloatingCartBar />
      <ChatSupport />
    </div>
  );
}

export default App;
