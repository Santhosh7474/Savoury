import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { staggerContainer, VIEWPORT } from '../utils/motion';

const brands = ['Gourmet Haven', 'The Rustic Spoon', 'Lumina Lounge', 'Urban Crumb', 'Oceanside Grill'];

const TrustSection = () => {
  return (
    <section style={{ padding: '3rem 0', backgroundColor: 'var(--color-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '2rem', fontWeight: 600 }}
        >
          Trusted by 50+ Modern Restaurants &amp; Cafés
        </motion.p>

        <motion.div
          variants={staggerContainer(0.1, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.85 }}
        >
          {brands.map((brand, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                  opacity: 1, x: 0,
                  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
              whileHover={{ scale: 1.06, color: 'var(--color-accent)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                color: '#fff',
                fontStyle: 'italic',
                fontWeight: 600,
                cursor: 'default',
              }}
            >
              {brand}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
