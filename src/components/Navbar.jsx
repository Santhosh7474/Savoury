import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';


const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try { await logout(); navigate('/'); } catch (err) { console.error(err); }
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    color: isActive(path) ? 'var(--color-accent)' : '#fff',
    textDecoration: 'none',
    fontWeight: isActive(path) ? 700 : 500,
    fontSize: '0.95rem',
    transition: 'color 0.2s, transform 0.2s',
    position: 'relative',
    padding: '0.25rem 0'
  });

  const closeMobile = () => setMobileOpen(false);

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled ? 'rgba(15, 61, 46, 0.97)' : 'rgba(15, 61, 46, 1)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)'
      }}
      style={{
        color: '#fff', padding: '0.8rem 0',
        position: 'sticky', top: 0, zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700 }}>
          Savoury.
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={navLinkStyle('/')}>Home</Link>
          <a href="/#menu" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Menu</a>
          <a href="/#reservations" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Reservations</a>

          {currentUser && (
            <Link to="/orders" style={navLinkStyle('/orders')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Package size={16} /> Orders
              </div>
            </Link>
          )}

          <Link to="/checkout" style={{ position: 'relative', color: '#fff', textDecoration: 'none' }}>
            <ShoppingCart size={22} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    position: 'absolute', top: '-8px', right: '-10px',
                    backgroundColor: 'var(--color-accent)', color: '#000',
                    borderRadius: '50%', width: '20px', height: '20px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '0.7rem', fontWeight: 800
                  }}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.85 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800
                }}>
                  {(currentUser.displayName || currentUser.email)?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem' }}>{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
              </div>
              <button onClick={handleLogout} style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '8px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.85rem', transition: 'all 0.2s'
              }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary" style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px' }}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div style={{ padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/" onClick={closeMobile} style={navLinkStyle('/')}>Home</Link>
              <a href="/#menu" onClick={closeMobile} style={{ color: '#fff', textDecoration: 'none' }}>Menu</a>
              <a href="/#reservations" onClick={closeMobile} style={{ color: '#fff', textDecoration: 'none' }}>Reservations</a>
              {currentUser && <Link to="/orders" onClick={closeMobile} style={navLinkStyle('/orders')}>My Orders</Link>}
              <Link to="/checkout" onClick={closeMobile} style={navLinkStyle('/checkout')}>Cart ({cartCount})</Link>
              {currentUser ? (
                <button onClick={() => { handleLogout(); closeMobile(); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                  Logout ({currentUser.email?.split('@')[0]})
                </button>
              ) : (
                <Link to="/auth" onClick={closeMobile} style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>Login / Sign Up</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
