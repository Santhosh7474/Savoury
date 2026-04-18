import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { db, collection, getDocs } from '../firebase';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const items = [];
        querySnapshot.forEach((doc) => { items.push({ id: doc.id, ...doc.data() }); });
        setReviews(items);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
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
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: '250px', borderRadius: '16px' }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section style={{ backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 className="section-title">What Our Diners Say</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Real experiences from our valued guests</p>
        </motion.div>

        {/* Desktop Grid View */}
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              style={{
                backgroundColor: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)', position: 'relative',
                border: '1px solid rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease'
              }}
            >
              <Quote size={36} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#f0f0f0' }} />

              <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.25rem', color: 'var(--color-accent)' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="var(--color-accent)" />)}
              </div>

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
                    fontWeight: 700, fontSize: '1.1rem'
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
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
