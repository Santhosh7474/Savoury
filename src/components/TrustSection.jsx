import React from 'react';


const TrustSection = () => {
  return (
    <section style={{ padding: '3rem 0', backgroundColor: 'var(--color-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', marginBottom: '2rem', fontWeight: 600 }}>
          Trusted by 50+ Modern Restaurants & Cafés
        </p>
        
        {/* Simple flex container for fake logos/names */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', opacity: 0.8 }}>
          {['Gourmet Haven', 'The Rustic Spoon', 'Lumina Lounge', 'Urban Crumb', 'Oceanside Grill'].map((brand, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                color: '#fff',
                fontStyle: 'italic',
                fontWeight: 600
              }}
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
