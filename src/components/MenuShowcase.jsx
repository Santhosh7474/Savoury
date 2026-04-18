import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import { db, collection, getDocs } from '../firebase';
import { Plus, X, Minus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

// Reusable Add/Qty component (moved outside to satisfy React rules)
const QuantityController = ({ item, cartItems, addToCart, updateQuantity, handleAction }) => {
  const cartItem = cartItems.find(i => i.id === item.id);
  const qty = cartItem ? cartItem.qty : 0;

  if (qty === 0) {
    return (
      <button 
        onClick={(e) => handleAction(e, () => addToCart(item))}
        style={{ 
          backgroundColor: '#fff', 
          color: 'var(--color-primary)', 
          border: '1px solid #e0e0e0',
          borderRadius: '8px', 
          padding: '0.4rem 1.5rem', 
          fontWeight: 800,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          textTransform: 'uppercase'
        }}
      >
        ADD
      </button>
    );
  }

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        border: '1px solid #e0e0e0',
        borderRadius: '8px', 
        overflow: 'hidden'
      }}
    >
      <button 
        onClick={(e) => handleAction(e, () => updateQuantity(item.id, qty - 1))}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--color-primary)', 
          cursor: 'pointer', 
          padding: '0.4rem 0.6rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Minus size={18} strokeWidth={3} />
      </button>
      <span style={{ 
        fontSize: '1rem', 
        fontWeight: 800, 
        width: '24px', 
        textAlign: 'center', 
        color: 'var(--color-primary)' 
      }}>{qty}</span>
      <button 
        onClick={(e) => handleAction(e, () => updateQuantity(item.id, qty + 1))}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--color-primary)', 
          cursor: 'pointer', 
          padding: '0.4rem 0.6rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Plus size={18} strokeWidth={3} />
      </button>
    </div>
  );
};

const MenuShowcase = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);

  const { currentUser } = useAuth();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(items);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch menu", err);
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

  const handleOpenModal = (item) => {
    setSelectedItem(item);
  };

  const filteredItems = menuItems.filter(item => 
    activeTab === 'All' ? true : item.category === activeTab
  );

  return (
    <section id="menu" style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="container">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(cat)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '30px',
                border: activeTab === cat ? 'none' : '1px solid #ddd',
                backgroundColor: activeTab === cat ? 'var(--color-primary)' : 'transparent',
                color: activeTab === cat ? '#fff' : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 600,
                boxShadow: activeTab === cat ? '0 4px 12px rgba(15,61,46,0.25)' : 'none'
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

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
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}
          >
            <AnimatePresence>
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', cursor: 'pointer', position: 'relative' }}
                  onClick={() => handleOpenModal(item)}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ height: '220px', overflow: 'hidden' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                    
                    {/* Zomato style fast add block perfectly centered slightly above bottom edge of image container */}
                    <div style={{ position: 'absolute', bottom: '-18px', left: '50%', transform: 'translateX(-50%)', zIndex: 5, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
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
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: '#1A1A1A' }}>{item.name}</h3>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1.1rem' }}>${item.price.toFixed(2)}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.5, minHeight: '40px' }}>
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
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }} onClick={() => setSelectedItem(null)}>
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
            >
              
              <button 
                onClick={() => setSelectedItem(null)}
                style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 10 }}
              >
                <X size={20} color="#333" />
              </button>

              <div style={{ height: '300px', width: '100%', flexShrink: 0 }}>
                <img src={selectedItem.image} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '2rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)' }}>{selectedItem.name}</h2>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.5rem' }}>${selectedItem.price.toFixed(2)}</span>
                </div>
                
                <p style={{ color: '#444', lineHeight: 1.6, fontSize: '1rem', marginBottom: '2rem' }}>
                  {selectedItem.detailedDescription || selectedItem.description}
                </p>

                {/* Unified Quantity / Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto' }}>
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
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default MenuShowcase;
