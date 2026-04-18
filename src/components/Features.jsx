import React from 'react';
import { Utensils, CalendarCheck, FileText, CreditCard, BarChart3, Smartphone } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';


const featureItems = [
  {
    icon: <Utensils size={32} />,
    title: 'Online Ordering',
    desc: 'Seamless built-in online ordering system directly from your website. Keep 100% of your profits.'
  },
  {
    icon: <CalendarCheck size={32} />,
    title: 'Table Reservation',
    desc: 'Automated table booking with real-time availability and dynamic scheduling for your VIP guests.'
  },
  {
    icon: <FileText size={32} />,
    title: 'Smart Menu (QR)',
    desc: 'A gorgeous digital menu that customers can access via QR code or directly on your website.'
  },
  {
    icon: <CreditCard size={32} />,
    title: 'Integrated Payments',
    desc: 'Accept payments natively with Razorpay or Stripe without sending customers to third-party apps.'
  },
  {
    icon: <BarChart3 size={32} />,
    title: 'Analytics Dashboard',
    desc: 'Track your best-selling items, visitor conversions, and revenue growth in real-time.'
  },
  {
    icon: <Smartphone size={32} />,
    title: 'Mobile Optimized',
    desc: 'Flawless App-like experience on mobile devices where 80% of your customers are ordering from.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const Features = () => {
  return (
    <section id="features" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title">Everything You Need to Scale</h2>
          <p className="section-subtitle">A complete digital infrastructure packaged into one premium website.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem' 
          }}
        >
          {featureItems.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ 
                y: -12, 
                boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
                backgroundColor: '#fff'
              }}
              style={{
                padding: '3rem 2.5rem',
                borderRadius: '24px',
                backgroundColor: 'var(--color-bg)',
                boxShadow: '8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff',
                border: '1px solid rgba(255,255,255,0.8)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '20px', 
                backgroundColor: 'var(--color-primary)', 
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 10px 25px rgba(15, 61, 46, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }} />
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 700 }}>{item.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '1rem' }}>{item.desc}</p>
              
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                style={{ marginTop: '1.5rem', color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Learn More <span>→</span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
