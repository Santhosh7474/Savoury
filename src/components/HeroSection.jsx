import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, ShoppingBag, ArrowDown } from 'lucide-react';
import { staggerContainer, staggerItem, VIEWPORT, SPRING } from '../utils/motion';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Deterministic particles
  const particles = React.useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: (i * 37 + 5) % 100,
    y: (i * 13 + 8) % 100,
    size: 2 + (i % 4),
    duration: 3.5 + (i % 4) * 0.6,
    delay: (i * 0.4) % 2.5,
  })), []);

  // Word-by-word headline split for stagger
  const headline = ['Experience', 'Culinary', 'Excellence', 'at'];

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{ padding: 0, position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
    >
      {/* Parallax background */}
      <motion.div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '125%',
        backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        y: bgY, zIndex: -2,
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(15,61,46,0.78) 0%, rgba(18,18,18,0.72) 50%, rgba(15,61,46,0.62) 100%)',
        zIndex: -1,
      }} />

      {/* Floating particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -28, 0], opacity: [0.15, 0.55, 0.15], rotate: [0, 180, 360] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            backgroundColor: 'rgba(212, 175, 55, 0.28)', zIndex: 0,
          }}
        />
      ))}

      <motion.div style={{ opacity }} className="container">
        <div
          className="hero-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}
        >
          {/* Left: Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1, 0.1)}
            style={{ color: 'var(--color-text-light)', y: textY }}
          >
            {/* Eyebrow label */}
            <motion.span
              variants={staggerItem}
              style={{
                display: 'inline-block', fontSize: '0.85rem', fontWeight: 600,
                letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem',
                color: 'var(--color-accent)', borderBottom: '2px solid var(--color-accent)',
                paddingBottom: '0.5rem',
              }}
            >
              ✦ Fine Dining Experience
            </motion.span>

            {/* Headline — word-by-word stagger */}
            <motion.h1
              variants={staggerContainer(0.08, 0)}
              initial="hidden"
              animate="visible"
              style={{ fontSize: '4rem', lineHeight: 1.08, marginBottom: '1.5rem', color: 'var(--color-text-light)' }}
            >
              {headline.map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
                  }}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                  {word}
                </motion.span>
              ))}{' '}
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
                }}
                style={{ display: 'inline-block', color: 'var(--color-accent)', textShadow: '0 0 40px rgba(212,175,55,0.35)' }}
              >
                Savoury
              </motion.span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.85, maxWidth: '90%', lineHeight: 1.7 }}
            >
              Discover farm-to-table dining, exquisite flavors, and an unforgettable ambiance right in the heart of the city.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={staggerItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <motion.a
                href="#reservations"
                className="btn-primary"
                data-magnetic
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
              >
                Reserve a Table
              </motion.a>
              <motion.a
                href="#menu"
                className="btn-outline"
                data-magnetic
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                style={{ fontSize: '1rem', padding: '0.9rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ShoppingBag size={18} /> Order Online
              </motion.a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={staggerContainer(0.12, 0)}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}
            >
              {[
                { number: '4.9', label: 'Rating' },
                { number: '10K+', label: 'Orders' },
                { number: '45min', label: 'Delivery' },
              ].map((stat, idx) => (
                <motion.div key={idx} variants={staggerItem} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent)' }}>{stat.number}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Glass card with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', justifyContent: 'center', perspective: '1200px' }}
          >
            <motion.div
              whileHover={{ rotateY: 4, rotateX: -2, scale: 1.015 }}
              transition={SPRING.gentle}
              className="glass-dark"
              style={{
                padding: '1.5rem', borderRadius: 'var(--radius-xl)',
                width: '100%', maxWidth: '380px', position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Inner glow on hover */}
              <motion.div
                whileHover={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute', inset: 0, borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.06), transparent)',
                  pointerEvents: 'none',
                }}
              />

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
                <motion.a
                  href="#menu"
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <ShoppingBag size={14} /> Order Now
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '2px',
        }}
      >
        <span>SCROLL</span>
        <ArrowDown size={16} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
