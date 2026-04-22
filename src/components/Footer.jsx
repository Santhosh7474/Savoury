import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Send, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, VIEWPORT } from '../utils/motion';

const socialIcons = [Globe, MessageCircle, Send, Mail];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const footerLinks = [
    { label: 'Home', to: '/' },
    { label: 'Menu', to: '/#menu' },
    { label: 'Reservations', to: '/#reservations' },
    { label: 'My Orders', to: '/orders' },
  ];

  return (
    <footer style={{ backgroundColor: '#0a0a0a', color: '#fff', paddingTop: '5rem', paddingBottom: '2rem', position: 'relative' }}>
      {/* Gradient top border */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-primary))' }} />

      <div className="container">
        <motion.div
          variants={staggerContainer(0.12, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="footer-grid"
          style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }}
        >
          {/* Brand column */}
          <motion.div variants={staggerItem}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>Savoury.</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '300px' }}>
              Experience culinary excellence. We bring the finest farm-to-table dining with seamless online ordering and reservations.
            </p>
            {/* Social icons — spring hover */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socialIcons.map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5, backgroundColor: 'var(--color-accent)', color: '#000', borderColor: 'var(--color-accent)' }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                  }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={staggerItem}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {footerLinks.map(l => (
                <li key={l.label}>
                  <motion.div whileHover="hover">
                    <Link
                      to={l.to}
                      style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <motion.span
                        variants={{ hover: { x: 4, color: 'var(--color-accent)' } }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        style={{ display: 'inline-block' }}
                      >
                        {l.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Hours */}
          <motion.div variants={staggerItem}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Opening Hours</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              <li>Mon - Fri: 11AM - 11PM</li>
              <li>Saturday: 10AM - 12AM</li>
              <li>Sunday: 10AM - 10PM</li>
              <li style={{ color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.5rem' }}>🟢 Open Now</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={staggerItem}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <motion.a
                href="mailto:hello@savoury.com"
                whileHover={{ x: 4, color: '#fff' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.9rem' }}
              >
                <Mail size={15} /> hello@savoury.com
              </motion.a>
              <motion.a
                href="tel:+15551234567"
                whileHover={{ x: 4, color: '#fff' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.9rem' }}
              >
                <Phone size={15} /> +1 (555) 123-4567
              </motion.a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
                <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px' }} /> 123 Gourmet Avenue, Downtown District
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem',
        }}>
          <p>© {new Date().getFullYear()} Savoury Restaurant. All rights reserved. Developed by <span style={{ color: 'var(--color-accent)' }}>Santhosh Buchala</span></p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <motion.span key={t} whileHover={{ color: 'rgba(255,255,255,0.7)' }} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>{t}</motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Back to top — spring bounce */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.12, boxShadow: '0 8px 24px rgba(212,175,55,0.45)' }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          position: 'absolute', bottom: '2rem', right: '2rem',
          width: '44px', height: '44px', borderRadius: '12px',
          backgroundColor: 'var(--color-accent)', color: 'var(--color-text-dark)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
        }}
      >
        <ArrowUp size={18} />
      </motion.button>
    </footer>
  );
};

export default Footer;
