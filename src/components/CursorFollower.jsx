import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorFollower = () => {
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Outer ring — slow, lagged spring (gives the "trailing" premium feel)
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.3 });
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.3 });

  // Inner dot — fast, pixel-precise
  const dotX = useSpring(mouseX, { damping: 30, stiffness: 500 });
  const dotY = useSpring(mouseY, { damping: 30, stiffness: 500 });

  useEffect(() => {
    // Hide on touch devices — cursor is desktop-only
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleOver = (e) => {
      const el = e.target;
      const interactive = el.closest('button, a, [role="button"], [data-magnetic], input, select, textarea');
      const text = interactive?.getAttribute('data-cursor-text') || '';
      setIsHovering(!!interactive);
      setCursorText(text);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [visible, mouseX, mouseY]);

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return null;
  if (!visible) return null;

  return (
    <>
      {/* Outer ring — lagged, expands on hover */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          pointerEvents: 'none', zIndex: 99999,
          x: ringX, y: ringY,
          translateX: '-50%', translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 52 : 32,
            height: isHovering ? 52 : 32,
            borderColor: isHovering ? 'rgba(212,175,55,0.8)' : 'rgba(15,61,46,0.45)',
            backgroundColor: isHovering ? 'rgba(212,175,55,0.08)' : 'transparent',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            borderRadius: '50%',
            border: '1.5px solid rgba(15,61,46,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: '7px', fontWeight: 800, color: 'var(--color-accent)',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                textAlign: 'center', lineHeight: 1, userSelect: 'none',
              }}
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Inner dot — fast, precise */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          pointerEvents: 'none', zIndex: 99999,
          x: dotX, y: dotY,
          translateX: '-50%', translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 4 : 6,
            height: isHovering ? 4 : 6,
            opacity: isHovering ? 0.6 : 1,
            backgroundColor: isHovering ? 'var(--color-accent)' : 'var(--color-primary)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ borderRadius: '50%' }}
        />
      </motion.div>
    </>
  );
};

export default CursorFollower;
