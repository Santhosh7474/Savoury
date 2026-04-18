import React from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';


const FloatingCartBar = () => {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 150, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: 150, x: "-50%", opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            // transform: 'translateX(-50%)', <-- Framer motion overrides this, so we moved it to x/-50%
            width: 'calc(100% - 40px)',
            maxWidth: '600px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 40px rgba(15, 61, 46, 0.4)',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/checkout')}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
            View Cart <ShoppingBag size={20} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartBar;
