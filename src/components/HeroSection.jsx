import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, ShoppingBag, ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
  }));

  return (
    <section ref={sectionRef} className="hero-section" style={{ padding: 0, position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      
      {/* Parallax Background */}
      <motion.div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '120%',
        backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        y: bgY, zIndex: -2,
      }} />

      {/* Animated Gradient Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(15,61,46,0.75) 0%, rgba(18,18,18,0.7) 50%, rgba(15,61,46,0.6) 100%)',
        zIndex: -1,
      }} />

      {/* Floating Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            backgroundColor: 'rgba(212, 175, 55, 0.3)', zIndex: 0
          }}
        />
      ))}

      <motion.div style={{ opacity }} className="container" >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ color: 'var(--color-text-light)', y: textY }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'inline-block', fontSize: '0.85rem', fontWeight: 600,
                letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem',
                color: 'var(--color-accent)', borderBottom: '2px solid var(--color-accent)',
                paddingBottom: '0.5rem'
              }}
            >
              ✦ Fine Dining Experience
            </motion.span>

            <h1 style={{ fontSize: '4rem', lineHeight: 1.08, marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
              Experience Culinary Excellence at{' '}
              <span style={{
                color: 'var(--color-accent)',
                textShadow: '0 0 40px rgba(212, 175, 55, 0.3)'
              }}>Savoury</span>
            </h1>

            <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.85, maxWidth: '90%', lineHeight: 1.7 }}>
              Discover farm-to-table dining, exquisite flavors, and an unforgettable ambiance right in the heart of the city.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#reservations" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                Reserve a Table
              </a>
              <a href="#menu" className="btn-outline" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                <ShoppingBag size={18} /> Order Online
              </a>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}
            >
              {[
                { number: '4.9', label: 'Rating' },
                { number: '10K+', label: 'Orders' },
                { number: '45min', label: 'Delivery' }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent)' }}>{stat.number}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateY: -5 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div className="glass-dark" style={{
              padding: '1.5rem', borderRadius: 'var(--radius-xl)',
              width: '100%', maxWidth: '380px', position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div className="hover-zoom" style={{ borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Truffle Royale Pizza"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-text-light)' }}>Truffle Royale Pizza</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: 'var(--color-accent)' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="var(--color-accent)" />)}
                <span style={{ color: '#fff', fontSize: '0.8rem', marginLeft: '0.4rem', opacity: 0.7 }}>(128 reviews)</span>
              </div>

              <p style={{ opacity: 0.7, fontSize: '0.85rem', margin: '1rem 0 1.5rem', lineHeight: 1.5 }}>
                Hand-tossed crust, rich truffle cream, wild mushrooms, and fresh mozzarella.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>$24.00</span>
                <a href="#menu" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <ShoppingBag size={14} /> Order Now
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '2px'
        }}
      >
        <span>SCROLL</span>
        <ArrowDown size={16} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
