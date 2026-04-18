import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, MessageCircle, Heart, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{ backgroundColor: '#0a0a0a', color: '#fff', paddingTop: '5rem', paddingBottom: '2rem', position: 'relative' }}>
      {/* Gradient top border */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-primary))' }} />

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>

          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>Savoury.</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '300px' }}>
              Experience culinary excellence. We bring the finest farm-to-table dining with seamless online ordering and reservations.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Globe, MessageCircle, Heart].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s',
                  textDecoration: 'none'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[{ label: 'Home', to: '/' }, { label: 'Menu', to: '/#menu' }, { label: 'Reservations', to: '/#reservations' }, { label: 'My Orders', to: '/orders' }].map(l => (
                <li key={l.label}>
                  <Link to={l.to} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Opening Hours</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              <li>Mon - Fri: 11AM - 11PM</li>
              <li>Saturday: 10AM - 12AM</li>
              <li>Sunday: 10AM - 10PM</li>
              <li style={{ color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.5rem' }}>🟢 Open Now</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="mailto:hello@savoury.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                <Mail size={15} /> hello@savoury.com
              </a>
              <a href="tel:+15551234567" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                <Phone size={15} /> +1 (555) 123-4567
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px' }} /> 123 Gourmet Avenue, Downtown District
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem'
        }}>
          <p>&copy; {new Date().getFullYear()} Savoury Restaurant. All rights reserved. Developed by <span style={{ color: 'var(--color-accent)' }}>Santhosh Buchala</span></p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button onClick={scrollToTop} style={{
        position: 'absolute', bottom: '2rem', right: '2rem',
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor: 'var(--color-accent)', color: 'var(--color-text-dark)',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(212,175,55,0.3)'
      }}>
        <ArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;
