import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

import { db, collection, getDocs } from '../firebase';
import { Plus, X, Minus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { staggerContainer, staggerItem, VIEWPORT, SPRING } from '../utils/motion';

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

const QuantityController = ({ item, cartItems, addToCart, updateQuantity, handleAction }) => {
  const cartItem = cartItems.find(i => i.id === item.id);
  const qty = cartItem ? cartItem.qty : 0;

  if (qty === 0) {
    return (
      <motion.button
        whileHover={{ scale: 1.06, boxShadow: '0 4px 14px rgba(15,61,46,0.2)' }}
        whileTap={{ scale: [1, 0.85, 1.12, 1] }}
        transition={SPRING.snappy}
        onClick={(e) => handleAction(e, () => addToCart(item))}
        style={{
          backgroundColor: '#fff', color: 'var(--color-primary)',
          border: '1.5px solid rgba(15,61,46,0.15)',
          borderRadius: '8px', padding: '0.4rem 1.5rem',
          fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        ADD
      </motion.button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'flex', alignItems: 'center',
        backgroundColor: '#fff', border: '1.5px solid rgba(15,61,46,0.15)',
        borderRadius: '8px', overflow: 'hidden',
      }}
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => handleAction(e, () => updateQuantity(item.id, qty - 1))}
        style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: '0.4rem 0.65rem', display: 'flex', alignItems: 'center' }}
      >
        <Minus size={18} strokeWidth={3} />
      </motion.button>
      <motion.span
        key={qty}
        initial={{ scale: 1.4, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING.bouncy}
        style={{ fontSize: '1rem', fontWeight: 800, width: '24px', textAlign: 'center', color: 'var(--color-primary)' }}
      >
        {qty}
      </motion.span>
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => handleAction(e, () => updateQuantity(item.id, qty + 1))}
        style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: '0.4rem 0.65rem', display: 'flex', alignItems: 'center' }}
      >
        <Plus size={18} strokeWidth={3} />
      </motion.button>
    </div>
  );
};

const MenuShowcase = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const { currentUser } = useAuth();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'menu'));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(items);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch menu', err);
      }
    };
    fetchMenu();
  }, []);

  const handleAction = (e, actionCallback) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/auth', { state: { from: { pathname: '/' } } });
      return;
    }
    actionCallback();
  };

  const filteredItems = menuItems.filter(item =>
    activeTab === 'All' ? true : item.category === activeTab
  );

  return (
    <section id="menu" style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '0.75rem' }}>
            ✦ Our Menu
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '3rem', marginBottom: '1rem' }}>
            Explore Our Dishes
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Curated dishes crafted with the finest ingredients for an unforgettable dining experience.
          </p>
        </motion.div>

        {/* Category filters — shared layoutId pill for smooth slide */}
        <LayoutGroup>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: activeTab === cat ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '0.6rem 1.5rem', borderRadius: '30px',
                  border: activeTab === cat ? 'none' : '1px solid #ddd',
                  backgroundColor: 'transparent',
                  color: activeTab === cat ? '#fff' : '#666',
                  cursor: 'pointer', fontWeight: 600, position: 'relative',
                  zIndex: 1, transition: 'color 0.2s',
                }}
              >
                {activeTab === cat && (
                  <motion.span
                    layoutId="menu-category-pill"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '30px',
                      backgroundColor: 'var(--color-primary)',
                      boxShadow: '0 4px 12px rgba(15,61,46,0.3)',
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                {cat}
              </motion.button>
            ))}
          </div>
        </LayoutGroup>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff' }}>
                <div className="skeleton" style={{ height: '220px', borderRadius: 0 }} />
                <div style={{ padding: '1.5rem' }}>
                  <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '0.75rem' }} />
                  <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.5rem' }} />
                  <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            No items found in this category.
          </div>
        ) : (
          <motion.div
            layout
            variants={staggerContainer(0.07, 0)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}
          >
            <AnimatePresence>
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  variants={staggerItem}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="menu-card"
                  style={{
                    backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)', cursor: 'pointer', position: 'relative',
                  }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div style={{ position: 'relative' }}>
                    {/* Image with group-hover zoom via CSS class */}
                    <div className="menu-card-image" style={{ height: '220px', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                      />
                    </div>

                    {/* Qty/Add button — floating */}
                    <div style={{ position: 'absolute', bottom: '-18px', left: '50%', transform: 'translateX(-50%)', zIndex: 5, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                      <QuantityController
                        item={item}
                        cartItems={cartItems}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                        handleAction={handleAction}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '2.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: '#1A1A1A', margin: 0 }}>{item.name}</h3>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1.1rem' }}>${item.price.toFixed(2)}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.5, minHeight: '40px', margin: 0 }}>
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 9999,
              display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff', borderRadius: '24px', width: '100%',
                maxWidth: '500px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
                position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '90vh',
              }}
            >
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => setSelectedItem(null)}
                style={{
                  position: 'absolute', top: '15px', right: '15px',
                  backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                  border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  cursor: 'pointer', zIndex: 10,
                }}
              >
                <X size={20} color="#333" />
              </motion.button>

              <div className="hover-zoom" style={{ height: '300px', width: '100%', flexShrink: 0 }}>
                <img src={selectedItem.image} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '2rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)', margin: 0 }}>{selectedItem.name}</h2>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.5rem' }}>${selectedItem.price.toFixed(2)}</span>
                </div>
                <p style={{ color: '#444', lineHeight: 1.6, fontSize: '1rem', marginBottom: '2rem' }}>
                  {selectedItem.detailedDescription || selectedItem.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ transform: 'scale(1.2)' }}>
                    <QuantityController
                      item={selectedItem}
                      cartItems={cartItems}
                      addToCart={addToCart}
                      updateQuantity={updateQuantity}
                      handleAction={handleAction}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MenuShowcase;
