import menuData from '../menuData.json';

const siteInfo = {
  name: "Savoury",
  tagline: "Experience Culinary Excellence",
  location: "123 Gourmet Avenue, Downtown District",
  phone: "+1 (555) 123-4567",
  email: "hello@savoury.com",
  hours: {
    mon_fri: "11:00 AM - 11:00 PM",
    sat: "10:00 AM - 12:00 AM",
    sun: "10:00 AM - 10:00 PM"
  },
  features: [
    "Online Ordering with Real-time Cart",
    "Secure Razorpay Integration",
    "Table Reservations with Confirmation",
    "Fine Dining Experience",
    "Digital Smart Menu with detailed descriptions"
  ],
  owner: "Santhosh Buchala"
};

// Generate a dense context string for the QA model
export const getAikontext = () => {
  let context = `Restaurant Information: ${siteInfo.name} is a fine dining restaurant located at ${siteInfo.location}. `;
  context += `It is owned by ${siteInfo.owner}. Our tagline is "${siteInfo.tagline}". `;
  context += `We are open Monday to Friday from ${siteInfo.hours.mon_fri}, Saturday from ${siteInfo.hours.sat}, and Sunday from ${siteInfo.hours.sun}. `;
  context += `Contact us at ${siteInfo.phone} or email ${siteInfo.email}. `;
  context += `Key features include ${siteInfo.features.join(', ')}. `;
  
  context += "\nMenu Items:\n";
  menuData.forEach(item => {
    context += `${item.name} (${item.category}): $${item.price}. ${item.description} ${item.detailedDescription}\n`;
  });
  
  return context;
};

export const SAVOURY_KNOWLEDGE = siteInfo;
