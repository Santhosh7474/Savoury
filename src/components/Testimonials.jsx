import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { db, collection, getDocs } from '../firebase';
import { staggerContainer, staggerItem, VIEWPORT } from '../utils/motion';

const StarRating = ({ delay = 0 }) => (
  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.25rem', color: 'var(--color-accent)' }}>
    {[1,2,3,4,5].map((s, i) => (
      <motion.span
        key={s}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ delay: delay + i * 0.05, type: 'spring', stiffness: 400, damping: 18 }}
      >
        <Star size={14} fill="var(--color-accent)" color="var(--color-accent)" />
      </motion.span>
    ))}
  </div>
);

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const items = [];
        querySnapshot.forEach((doc) => { items.push({ id: doc.id, ...doc.data() }); });
        setReviews(items);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="skeleton" style={{ width: '200px', height: '32px', margin: '0 auto 1rem' }} />
            <div className="skeleton" style={{ width: '300px', height: '16px', margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '250px', borderRadius: '16px' }} />)}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section style={{ backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 className="section-title">What Our Diners Say</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Real experiences from our valued guests</p>
        </motion.div>

        {/* Cards — staggered reveal */}
        <motion.div
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="testimonials-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              variants={staggerItem}
              whileHover={{
                y: -8,
                boxShadow: '0 24px 48px rgba(0,0,0,0.09), 0 0 0 1.5px rgba(212,175,55,0.2)',
              }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              style={{
                backgroundColor: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)', position: 'relative',
                border: '1px solid rgba(0,0,0,0.04)',
                cursor: 'default',
              }}
            >
              {/* Quote icon — delayed fade */}
              <motion.div
                initial={{ opacity: 0, rotate: 5 }}
                whileInView={{ opacity: 1, rotate: 10 }}
                viewport={VIEWPORT}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              >
                <Quote size={36} color="#f0f0f0" />
              </motion.div>

              {/* Stars — staggered per card */}
              <StarRating delay={i * 0.08} />

              <p style={{ fontStyle: 'italic', color: '#444', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                "{r.text}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {r.image ? (
                  <img src={r.image} alt={r.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: 'rgba(15,61,46,0.1)', color: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1.1rem',
                  }}>
                    {r.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-primary)' }}>{r.name}</h5>
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>{r.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
