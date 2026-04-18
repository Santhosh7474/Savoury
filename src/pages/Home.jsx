import React from 'react';
import HeroSection from '../components/HeroSection';
import MenuShowcase from '../components/MenuShowcase';
import ReservationSection from '../components/ReservationSection';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <HeroSection />
      <MenuShowcase />
      <ReservationSection />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
