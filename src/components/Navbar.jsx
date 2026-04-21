import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

// Animated nav link with shared layoutId underline that slides between active links
const NavLink = ({ to, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      color: isActive ? 'var(--color-accent)' : '#fff',
      textDecoration: 'none',
      fontWeight: isActive ? 700 : 500,
      fontSize: '0.95rem',
      position: 'relative',
      padding: '0.25rem 0',
      transition: 'color 0.2s ease',
    }}
  >
    <motion.span whileHover={{ y: -1 }} style={{ display: 'inline-block' }}>
      {label}
    </motion.span>
    {isActive && (
      <motion.span
        layoutId="nav-underline"
        style={{
          position: 'absolute', bottom: -2, left: 0, right: 0,
          height: '2px', background: 'var(--color-accent)',
          borderRadius: '99px',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      />
    )}
  </Link>
);

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try { await logout(); navigate('/'); } catch (err) { console.error(err); }
  };

  const isActive = (path) => location.pathname === path;
  const closeMobile = () => setMobileOpen(false);

  // Mobile link stagger variant
  const mobileItemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: (i) => ({
      opacity: 1, x: 0,
      transition: { delay: i * 0.06, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled ? 'rgba(15, 61, 46, 0.97)' : 'rgba(15, 61, 46, 1)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
        paddingTop: scrolled ? '0.5rem' : '0.8rem',
        paddingBottom: scrolled ? '0.5rem' : '0.8rem',
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ color: '#fff', position: 'sticky', top: 0, zIndex: 1000 }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Logo — subtle scale on hover */}
        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
          <Link to="/" style={{
            textDecoration: 'none', color: 'var(--color-accent)',
            fontFamily: 'var(--font-serif)',
            fontSize: scrolled ? '1.75rem' : '2rem',
            fontWeight: 700, transition: 'font-size 0.3s ease',
          }}>
            Savoury.
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <NavLink to="/" label="Home" isActive={isActive('/')} />

          {/* Hash links — no route tracking, simple hover only */}
          {['Menu', 'Reservations'].map((label) => (
            <a
              key={label}
              href={`/#${label.toLowerCase()}`}
              style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', position: 'relative', padding: '0.25rem 0' }}
            >
              <motion.span whileHover={{ y: -1 }} style={{ display: 'inline-block', transition: 'color 0.2s' }}>
                {label}
              </motion.span>
            </a>
          ))}

          {currentUser && (
            <NavLink to="/orders" label="Orders" isActive={isActive('/orders')} />
          )}

          {/* Cart icon with count badge */}
          <Link to="/checkout" style={{ position: 'relative', color: '#fff', textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <ShoppingCart size={22} />
            </motion.div>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  style={{
                    position: 'absolute', top: '-8px', right: '-10px',
                    backgroundColor: 'var(--color-accent)', color: '#000',
                    borderRadius: '50%', width: '20px', height: '20px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '0.7rem', fontWeight: 800,
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
                  fontSize: '0.75rem', fontWeight: 800,
                }}>
                  {(currentUser.displayName || currentUser.email)?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem' }}>{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.18)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '8px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.85rem',
                }}
              >
                <LogOut size={14} /> Logout
              </motion.button>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/auth" className="btn-primary" style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px' }}>
                Login
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mobileOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Dropdown — staggered children */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div style={{ padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Home', onClick: () => { navigate('/'); closeMobile(); } },
                { label: 'Menu', onClick: () => { window.location.href = '/#menu'; closeMobile(); } },
                { label: 'Reservations', onClick: () => { window.location.href = '/#reservations'; closeMobile(); } },
                ...(currentUser ? [{ label: 'My Orders', onClick: () => { navigate('/orders'); closeMobile(); } }] : []),
                { label: `Cart (${cartCount})`, onClick: () => { navigate('/checkout'); closeMobile(); } },
              ].map((item, i) => (
                <motion.button
                  key={item.label}
                  custom={i}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={item.onClick}
                  style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font-sans)', padding: '0.25rem 0' }}
                >
                  {item.label}
                </motion.button>
              ))}
              {currentUser ? (
                <motion.button
                  custom={5}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => { handleLogout(); closeMobile(); }}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}
                >
                  Logout ({currentUser.email?.split('@')[0]})
                </motion.button>
              ) : (
                <motion.div custom={5} variants={mobileItemVariants} initial="hidden" animate="visible">
                  <Link to="/auth" onClick={closeMobile} style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>Login / Sign Up</Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
