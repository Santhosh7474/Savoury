import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useSpring, useMotionValue } from 'framer-motion';


const CursorFollower = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring settings for smooth lag
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button';
      
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (typeof window === 'undefined' || !isVisible) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.3)' : 'rgba(15, 61, 46, 0.15)',
        border: `1.5px solid ${isHovering ? 'var(--color-accent)' : 'var(--color-primary)'}`,
        pointerEvents: 'none',
        zIndex: 9999,
        x: cursorX,
        y: cursorY,
        scale: isHovering ? 2 : 1,
      }}
      transition={{ scale: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      <motion.div 
        animate={{ scale: isHovering ? 0.5 : 0.2 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isHovering ? 'var(--color-accent)' : 'var(--color-primary)',
        }}
      />
    </motion.div>
  );
};

export default CursorFollower;
