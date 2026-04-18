import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs, query, where } from '../firebase';
import { AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, CreditCard, Calendar, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';


const OrdersPage = () => {
  const { currentUser } = useAuth();
  const { addMultipleToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reorderSuccess, setReorderSuccess] = useState(false);


  useEffect(() => {
    if (!currentUser) {
      navigate('/auth', { state: { from: { pathname: '/orders' } } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid)
        );
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // sort by date descending client-side to avoid needing composite index
        fetched.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(fetched);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [currentUser, navigate]);

  const handleReorder = (orderItems) => {
    addMultipleToCart(orderItems);
    setReorderSuccess(true);
    setTimeout(() => {
      setReorderSuccess(false);
      navigate('/checkout');
    }, 1500);
  };

  const getStatusIcon = (status) => {
    if (status === 'success') return <CheckCircle size={18} color="#22c55e" />;
    if (status === 'failed') return <XCircle size={18} color="#ef4444" />;
    return <Clock size={18} color="#f59e0b" />;
  };

  const getStatusColor = (status) => {
    if (status === 'success') return '#22c55e';
    if (status === 'failed') return '#ef4444';
    return '#f59e0b';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!currentUser) return null;

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '80vh', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            My Orders
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Track and review your past orders.</p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '100px', borderRadius: '16px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s infinite'
              }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
          >
            <Package size={64} color="#ccc" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ color: '#666', marginBottom: '1rem' }}>No orders yet</h3>
            <p style={{ color: '#999', marginBottom: '2rem' }}>Your order history will appear here once you place your first order.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Browse Menu</button>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    backgroundColor: '#fff', borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    border: expandedOrder === order.id ? `1px solid ${getStatusColor(order.status)}20` : '1px solid transparent',
                    transition: 'border 0.3s ease'
                  }}
                >
                  {/* Order Header */}
                  <div
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    style={{
                      padding: '1.5rem', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        backgroundColor: `${getStatusColor(order.status)}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '1rem' }}>
                          Order #{order.id.slice(-6).toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          <Calendar size={13} />
                          {formatDate(order.date)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                          ${order.total?.toFixed(2)}
                        </div>
                        <div style={{
                          fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                          color: getStatusColor(order.status), letterSpacing: '0.5px'
                        }}>
                          {order.status === 'success' ? 'Paid' : order.status === 'failed' ? 'Failed' : 'Pending'}
                        </div>
                      </div>
                      {expandedOrder === order.id ? <ChevronUp size={20} color="#888" /> : <ChevronDown size={20} color="#888" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ borderTop: '1px solid #f0f0f0', padding: '1.5rem' }}>
                          {/* Payment Details */}
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            marginBottom: '1.25rem', padding: '0.75rem 1rem',
                            backgroundColor: '#f8f9fa', borderRadius: '10px'
                          }}>
                            <CreditCard size={16} color="var(--color-primary)" />
                            <div style={{ fontSize: '0.85rem' }}>
                              <span style={{ color: '#888' }}>Payment ID: </span>
                              <span style={{ fontWeight: 600, color: '#333', fontFamily: 'monospace' }}>
                                {order.paymentId || 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Item List */}
                          <h4 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
                            Items Ordered
                          </h4>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {order.items?.map((item, idx) => (
                              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                                  />
                                  <div>
                                    <div style={{ fontWeight: 500, color: '#1a1a1a', fontSize: '0.95rem' }}>{item.name}</div>
                                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Qty: {item.qty}</div>
                                  </div>
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                                  ${(item.price * item.qty).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* Coupon Applied */}
                          {order.couponCode && (
                            <div style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '0.85rem', color: '#92400e' }}>
                              🎟️ Coupon Applied: <strong>{order.couponCode}</strong> — Saved ${order.couponDiscount?.toFixed(2)}
                            </div>
                          )}

                          {/* Total */}
                          <div style={{
                            borderTop: '1px solid #f0f0f0', marginTop: '1.25rem', paddingTop: '1rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '1rem', color: '#666' }}>Total Paid</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                              ${order.total?.toFixed(2)}
                            </span>
                          </div>

                          {/* Reorder CTA */}
                          <button
                            className="btn-primary"
                            onClick={() => handleReorder(order.items)}
                            style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem', fontSize: '0.95rem', borderRadius: '10px', gap: '0.5rem' }}
                          >
                            <ShoppingCart size={16} /> Reorder These Items
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {reorderSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: 'var(--color-primary)', color: '#fff', padding: '1rem 2rem',
              borderRadius: '99px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600
            }}
          >
            <CheckCircle size={20} color="var(--color-accent)" />
            Order added to cart! Redirecting...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
