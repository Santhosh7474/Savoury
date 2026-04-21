import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';


import { useNavigate } from 'react-router-dom';
import { Trash2, Tag, X, CheckCircle, XCircle, ArrowLeft, Minus, Plus } from 'lucide-react';
import { db, addDoc, collection } from '../firebase';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';



// Coupon definitions
const COUPONS = [
  { code: 'WELCOME20', discount: 20, type: 'percent', minOrder: 30, label: '20% OFF on orders above $30' },
  { code: 'SAVOURY50', discount: 50, type: 'percent', minOrder: 100, label: '50% OFF on orders above $100' },
  { code: 'FLAT10', discount: 10, type: 'flat', minOrder: 25, label: 'Flat $10 OFF on orders above $25' },
  { code: 'FEAST15', discount: 15, type: 'flat', minOrder: 50, label: 'Flat $15 OFF on orders above $50' },
];

const Checkout = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponAppliedAnim, setCouponAppliedAnim] = useState(false);

  // Payment Result States
  const [paymentResult, setPaymentResult] = useState(null); // 'success' | 'failed' | null

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth', { state: { from: { pathname: '/checkout' } } });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Coupon Logic
  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return (cartTotal * appliedCoupon.discount) / 100;
    return appliedCoupon.discount;
  };
  const discount = getDiscount();
  const finalTotal = Math.max(0, cartTotal - discount);

  const handleApplyCoupon = (code) => {
    const c = COUPONS.find(c => c.code === (code || couponInput).toUpperCase());
    if (!c) { setCouponError('Invalid coupon code'); return; }
    if (cartTotal < c.minOrder) { setCouponError(`Minimum order of $${c.minOrder} required`); return; }
    setAppliedCoupon(c);
    setCouponError('');
    setCouponInput('');
    setShowCoupons(false);
    setCouponAppliedAnim(true);
    setTimeout(() => setCouponAppliedAnim(false), 2000);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Payment
  const handlePayment = async () => {
    if (!window.Razorpay) { alert("Razorpay SDK failed to load."); return; }
    setLoading(true);

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RSrHHLj5py8Lll',
        amount: Math.round(finalTotal * 100),
        currency: "INR",
        name: "Savoury",
        description: "Gourmet Restaurant Order",
        handler: async function (response) {
          const paymentId = response.razorpay_payment_id;
          try {
            await addDoc(collection(db, 'orders'), {
              items: cartItems,
              total: finalTotal,
              subtotal: cartTotal,
              couponCode: appliedCoupon?.code || null,
              couponDiscount: discount || 0,
              paymentId, status: 'success',
              date: new Date().toISOString(),
              userId: currentUser.uid || 'guest'
            });
            clearCart();
            setAppliedCoupon(null);
            setPaymentResult('success');
          } catch (e) {
            console.error(e);
            setPaymentResult('success'); // payment was still successful
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        },
        prefill: {
          name: currentUser?.displayName || "Guest",
          email: currentUser?.email || "guest@example.com",
          contact: "9999999999"
        },
        theme: { color: "#0F3D2E" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setPaymentResult('failed');
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      setPaymentResult('failed');
    }
    setLoading(false);
  };

  if (!currentUser) return null;

  // Payment Result Overlays
  if (paymentResult) {
    const isSuccess = paymentResult === 'success';
    return (
      <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
          style={{
            backgroundColor: '#fff', borderRadius: '24px', padding: '3rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)', textAlign: 'center',
            maxWidth: '440px', width: '100%', position: 'relative', overflow: 'hidden'
          }}
        >
          {/* Animated Background Gradient */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '6px',
            background: isSuccess
              ? 'linear-gradient(90deg, #22c55e, #16a34a, #22c55e)'
              : 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)',
            backgroundSize: '200% 100%',
            animation: 'gradient-slide 2s linear infinite'
          }} />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          >
            {isSuccess ? (
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 1.5rem'
              }}>
                <CheckCircle size={40} color="#22c55e" />
              </div>
            ) : (
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 1.5rem'
              }}>
                <XCircle size={40} color="#ef4444" />
              </div>
            )}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: isSuccess ? '#166534' : '#991b1b', marginBottom: '0.5rem' }}
          >
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}
          >
            {isSuccess
              ? 'Your order has been placed successfully. You can track it from your orders page.'
              : 'Something went wrong with your payment. Please try again or use a different payment method.'}
          </motion.p>

          {/* Confetti-like dots for success (stable values for React Purity) */}
          {isSuccess && (
            <>
              {[...Array(12)].map((_, i) => {
                const randomY = -60 - (i * 7) % 40;
                const randomX = (i * 31) % 200 - 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [-20, randomY],
                      x: randomX
                    }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 1.2 }}
                    style={{
                      position: 'absolute', top: '30%', left: '50%',
                      width: '8px', height: '8px', borderRadius: '50%',
                      backgroundColor: ['#22c55e', '#D4AF37', '#0F3D2E', '#f59e0b'][i % 4]
                    }}
                  />
                );
              })}
            </>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {isSuccess ? (
              <>
                <button className="btn-primary" onClick={() => navigate('/orders')} style={{ borderRadius: '10px' }}>
                  View Orders
                </button>
                <button className="btn-outline" onClick={() => navigate('/')} style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)', borderRadius: '10px' }}>
                  Back to Menu
                </button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={() => setPaymentResult(null)} style={{ borderRadius: '10px' }}>
                  Try Again
                </button>
                <button className="btn-outline" onClick={() => navigate('/')} style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)', borderRadius: '10px' }}>
                  Back Home
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '80vh', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>
            <ArrowLeft size={18} /> Continue Shopping
          </button>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '2rem' }}>
            Complete Your Order
          </h2>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
          >
            <h3 style={{ marginBottom: '1rem', color: '#666' }}>Your cart is empty.</h3>
            <button className="btn-primary" onClick={() => navigate('/')}>Browse Menu</button>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem', color: '#333' }}>
                Order Summary ({cartItems.reduce((a, i) => a + i.qty, 0)} items)
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {cartItems.map((item, idx) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#1A1A1A' }}>{item.name}</h4>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.9rem' }}>${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                        <button onClick={() => updateQuantity(item.id, item.qty - 1)} style={{ padding: '0.3rem 0.6rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>{item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, item.qty + 1)} style={{ padding: '0.3rem 0.6rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <span style={{ fontWeight: 600, color: '#333', minWidth: '60px', textAlign: 'right' }}>${(item.price * item.qty).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ccc', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Coupon Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ backgroundColor: '#fff', padding: '1.5rem 2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Tag size={18} color="var(--color-primary)" />
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', margin: 0, color: '#333' }}>Apply Coupon</h3>
              </div>

              {appliedCoupon ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 1rem', borderRadius: '10px',
                    backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: '#166534', fontSize: '0.95rem' }}>🎉 {appliedCoupon.code}</span>
                    <span style={{ color: '#22c55e', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                      — You save ${discount.toFixed(2)}!
                    </span>
                  </div>
                  <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    <X size={16} />
                  </button>
                </motion.div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                      style={{ flex: 1, padding: '0.7rem 1rem', border: '1px solid #e0e0e0', borderRadius: '10px', outline: 'none', fontSize: '0.95rem' }}
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="btn-primary"
                      style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem' }}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{couponError}</p>}
                  <button
                    onClick={() => setShowCoupons(!showCoupons)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.75rem', padding: 0 }}
                  >
                    {showCoupons ? 'Hide available coupons' : 'View available coupons →'}
                  </button>

                  <AnimatePresence>
                    {showCoupons && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                          {COUPONS.map(c => {
                            const eligible = cartTotal >= c.minOrder;
                            return (
                              <div
                                key={c.code}
                                onClick={() => eligible && handleApplyCoupon(c.code)}
                                style={{
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                  padding: '0.75rem 1rem', borderRadius: '10px',
                                  border: '1px dashed',
                                  borderColor: eligible ? 'var(--color-primary)' : '#e0e0e0',
                                  cursor: eligible ? 'pointer' : 'not-allowed',
                                  opacity: eligible ? 1 : 0.5,
                                  transition: 'all 0.2s',
                                  backgroundColor: eligible ? 'rgba(15,61,46,0.03)' : '#fafafa'
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: 700, color: eligible ? 'var(--color-primary)' : '#999', fontSize: '0.95rem', fontFamily: 'monospace' }}>{c.code}</div>
                                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.15rem' }}>{c.label}</div>
                                </div>
                                {eligible && (
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>TAP TO APPLY</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>

            {/* Bill Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', marginBottom: '1.25rem', color: '#333' }}>Bill Details</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#666', fontSize: '0.95rem' }}>
                <span>Item Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#22c55e', fontSize: '0.95rem' }}
                >
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </motion.div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#666', fontSize: '0.95rem' }}>
                <span>Delivery Fee</span>
                <span style={{ color: '#22c55e' }}>FREE</span>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '0.75rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333' }}>To Pay</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>${finalTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {loading ? 'Initializing Payment...' : `Pay $${finalTotal.toFixed(2)} Securely`}
                </span>
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Coupon Applied Toast */}
      <AnimatePresence>
        {couponAppliedAnim && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{
              position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: '#166534', color: '#fff', padding: '1rem 2rem',
              borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 10000,
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <CheckCircle size={18} /> Coupon Applied Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
