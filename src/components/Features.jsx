import React from 'react';
import { Utensils, CalendarCheck, FileText, CreditCard, BarChart3, Smartphone } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, VIEWPORT, SPRING } from '../utils/motion';

const featureItems = [
  { icon: <Utensils size={30} />,      title: 'Online Ordering',       desc: 'Seamless built-in online ordering system directly from your website. Keep 100% of your profits.' },
  { icon: <CalendarCheck size={30} />, title: 'Table Reservation',     desc: 'Automated table booking with real-time availability and dynamic scheduling for your VIP guests.' },
  { icon: <FileText size={30} />,      title: 'Smart Menu (QR)',        desc: 'A gorgeous digital menu that customers can access via QR code or directly on your website.' },
  { icon: <CreditCard size={30} />,    title: 'Integrated Payments',   desc: 'Accept payments natively with Razorpay or Stripe without sending customers to third-party apps.' },
  { icon: <BarChart3 size={30} />,     title: 'Analytics Dashboard',   desc: 'Track your best-selling items, visitor conversions, and revenue growth in real-time.' },
  { icon: <Smartphone size={30} />,    title: 'Mobile Optimized',      desc: 'Flawless App-like experience on mobile devices where 80% of your customers are ordering from.' },
];

const Features = () => {
  return (
    <section id="features" style={{ backgroundColor: '#fff' }}>
      <div className="container">

        {/* Section header — staggered reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={staggerContainer(0.12, 0)}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.span
            variants={staggerItem}
            style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '0.75rem' }}
          >
            ✦ Platform Features
          </motion.span>
          <motion.h2 variants={staggerItem} className="section-title">Everything You Need to Scale</motion.h2>
          <motion.p variants={staggerItem} className="section-subtitle">
            A complete digital infrastructure packaged into one premium website.
          </motion.p>
        </motion.div>

        {/* Cards — staggered grid */}
        <motion.div
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}
        >
          {featureItems.map((item, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{
                y: -10,
                boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
              }}
              style={{
                padding: '3rem 2.5rem', borderRadius: '24px',
                backgroundColor: 'var(--color-bg)',
                boxShadow: '8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff',
                border: '1px solid rgba(255,255,255,0.8)',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              }}
            >
              {/* Icon box — rotates slightly on card hover */}
              <motion.div
                whileHover={{ rotate: 6, scale: 1.1 }}
                transition={SPRING.snappy}
                style={{
                  width: '68px', height: '68px', borderRadius: '18px',
                  backgroundColor: 'var(--color-primary)', color: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '2rem',
                  boxShadow: '0 10px 25px rgba(15,61,46,0.2)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.12), transparent)' }} />
                {item.icon}
              </motion.div>

              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 700 }}>{item.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>{item.desc}</p>

              {/* Animated "Learn More" arrow — appears on hover */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                whileHover={{ opacity: 1, x: 0 }}
                style={{ marginTop: '1.5rem', color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Learn More
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
