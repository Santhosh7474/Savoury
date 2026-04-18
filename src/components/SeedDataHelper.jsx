import React, { useState } from 'react';
import { db, collection, getDocs, addDoc } from '../firebase';

const menuItems = [
  { name: 'Wagyu Ribeye Steak', price: 45, category: 'Main Course', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Perfectly seared, garlic butter.' },
  { name: 'Truffle Royale Pizza', price: 24, category: 'Main Course', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Hand-tossed crust, rich truffle cream, wild mushrooms.' },
  { name: 'Crispy Calamari', price: 14, category: 'Starters', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Tender calamari, spicy aioli dipping sauce.' },
  { name: 'Molten Chocolate Dome', price: 12, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Rich chocolate core, vanilla bean ice cream.' },
  { name: 'Signature Mojito', price: 9, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Fresh mint, lime, premium white rum.' },
];

const testimonials = [
  { name: 'Sarah L.', role: 'Food Critic', text: 'The Wagyu Ribeye Steak at Savoury is easily the best steak I have had in the city. Perfectly cooked and melted in my mouth. An absolute must-visit.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { name: 'Marcus T.', role: 'Local Guide', text: 'Booking a table here through their site was so easy. The ambiance when you arrive matches the premium online experience perfectly. The Truffle Royale Pizza is exquisite.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { name: 'Elena V.', role: 'Food Blogger', text: 'Savoury combines an incredible farm-to-table menu with flawless service. I loved ordering my drinks right from the table using their digital system.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
];

const SeedDataHelper = () => {
  const [status, setStatus] = useState('Idle');

  const seedDatabase = async () => {
    setStatus('Seeding Menu...');
    try {
      const menuRef = collection(db, "menu");
      for (const item of menuItems) {
        await addDoc(menuRef, item);
      }

      setStatus('Seeding Testimonials...');
      const testRef = collection(db, "testimonials");
      for (const item of testimonials) {
        await addDoc(testRef, item);
      }
      
      setStatus('Success! Please comment this component out in App.jsx and refresh.');
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#333', color: '#fff', textAlign: 'center' }}>
      <h3>Dev Tool: Seed Database</h3>
      <p>Click below to populate your empty Firestore database with the high-quality demo data.</p>
      <button onClick={seedDatabase} style={{ padding: '10px 20px', cursor: 'pointer', background: 'var(--color-accent)', color: '#000', fontWeight: 'bold' }}>
        Run Seeder
      </button>
      <p>Status: {status}</p>
    </div>
  );
};

export default SeedDataHelper;
