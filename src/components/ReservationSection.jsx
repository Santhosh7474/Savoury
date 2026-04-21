import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Users, CalendarCheck } from 'lucide-react';
import { VIEWPORT, SPRING } from '../utils/motion';

const ReservationSection = () => {
  const [formData, setFormData] = useState({ name: '', date: '', time: '', guests: 2 });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]       = useState({});
  const [isShaking, setIsShaking] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.date)        e.date = 'Select a date';
    if (!formData.time)        e.time = 'Select a time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/auth', { state: { from: { pathname: '/' } } });
      return;
    }
    if (!validate()) {
      // Trigger shake animation on the form
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
    border: `1px solid ${errors[field] ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.15)'}`,
    backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none',
    fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
    transition: 'border-color 0.2s, box-shadow 0.25s',
  });

  return (
    <section id="reservations" style={{ backgroundColor: '#fff' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 420px) 1fr', gap: '4rem', alignItems: 'center' }}>

        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            backgroundColor: 'var(--color-primary)', padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-xl)', color: '#fff',
            boxShadow: '0 20px 50px rgba(15, 61, 46, 0.3)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Decorative circle */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '160px', height: '160px', borderRadius: '50%',
            backgroundColor: 'rgba(212,175,55,0.08)',
          }} />

          <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
            <CalendarCheck size={32} color="var(--color-accent)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', marginBottom: '0.3rem' }}>Reserve a Table</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Experience fine dining at its best.</p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <CheckCircle size={56} color="var(--color-accent)" />
                </motion.div>
                <h4 style={{ color: 'var(--color-accent)', marginTop: '1rem', marginBottom: '0.5rem' }}>Reservation Confirmed!</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>We've sent a confirmation to your email.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={isShaking
                  ? { opacity: 1, x: [0, -8, 8, -6, 6, -3, 3, 0] }
                  : { opacity: 1, x: 0 }
                }
                transition={isShaking
                  ? { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
                  : { opacity: { duration: 0.2 } }
                }
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                    style={inputStyle('name')}
                    placeholder="John Doe"
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: '#fca5a5', fontSize: '0.75rem', display: 'block', marginTop: '0.3rem' }}
                      >
                        {errors.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => { setFormData({ ...formData, date: e.target.value }); setErrors({ ...errors, date: '' }); }}
                      style={inputStyle('date')}
                    />
                    <AnimatePresence>
                      {errors.date && (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{ color: '#fca5a5', fontSize: '0.75rem', display: 'block', marginTop: '0.3rem' }}
                        >
                          {errors.date}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={e => { setFormData({ ...formData, time: e.target.value }); setErrors({ ...errors, time: '' }); }}
                      style={inputStyle('time')}
                    />
                    <AnimatePresence>
                      {errors.time && (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{ color: '#fca5a5', fontSize: '0.75rem', display: 'block', marginTop: '0.3rem' }}
                        >
                          {errors.time}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Number of Guests</label>
                  <select
                    value={formData.guests}
                    onChange={e => setFormData({ ...formData, guests: e.target.value })}
                    style={{ ...inputStyle('guests'), appearance: 'none', cursor: 'pointer' }}
                  >
                    {[1,2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n} style={{ color: '#000' }}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(212,175,55,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING.snappy}
                  className="btn-primary"
                  type="submit"
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.85rem', borderRadius: '10px' }}
                >
                  Confirm Reservation
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hover-zoom"
          style={{ position: 'relative', height: '100%', minHeight: '420px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Restaurant interior"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="gradient-overlay-bottom" style={{ height: '60%' }}>
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', color: '#fff' }}>
              <h4 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>An Unforgettable Ambiance</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5 }}>Join us for an evening of culinary excellence in our renovated dining room.</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                {[
                  { icon: <Clock size={14} />, label: 'Mon-Sun, 11AM-11PM' },
                  { icon: <Users size={14} />, label: 'Up to 12 guests' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                    {b.icon} {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationSection;
