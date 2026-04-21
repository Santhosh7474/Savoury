import React from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const FloatingCartBar = () => {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 160, x: '-50%', opacity: 0, rotateX: -12 }}
          animate={{ y: 0,   x: '-50%', opacity: 1, rotateX: 0 }}
          exit={{   y: 160, x: '-50%', opacity: 0, rotateX: -12 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          style={{
            position: 'fixed', bottom: '20px', left: '50%',
            width: 'calc(100% - 40px)', maxWidth: '600px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff', borderRadius: '16px',
            padding: '1rem 1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 12px 40px rgba(15,61,46,0.45)',
            zIndex: 9999, cursor: 'pointer',
            perspective: '800px',
          }}
          onClick={() => navigate('/checkout')}
          whileHover={{ boxShadow: '0 16px 48px rgba(15,61,46,0.55)', y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Subtle gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(255,255,255,0.06), transparent)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {/* Item count pulses when it changes */}
              <motion.span
                key={totalItems}
                initial={{ scale: 1.4, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                style={{ display: 'inline-block' }}
              >
                {totalItems}
              </motion.span>
              {' '}{totalItems === 1 ? 'Item' : 'Items'}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem', position: 'relative' }}
            whileHover="hover"
          >
            <ShoppingBag size={18} />
            View Cart
            <motion.span
              variants={{ hover: { x: 4 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartBar;
