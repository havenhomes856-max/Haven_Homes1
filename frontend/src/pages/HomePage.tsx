import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import CuratedListingsSection from '../components/home/CuratedListingsSection';
import FaqSection from '../components/home/FaqSection';
import YouTubeMarquee from '../components/home/YouTubeMarquee';

const HomePage: React.FC = () => {
  const location = useLocation();

  useSEO({
    title: 'Premium Real Estate Platform',
    description: 'Haven Homes offers AI-powered property search, location trends analysis, and investment insights to find your perfect property in India.',
  });

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}


      {/* Curated Listings Section */}
      <CuratedListingsSection />

      {/* FAQ Section */}
      <YouTubeMarquee />
      <FaqSection />

      {/* YouTube Marquee */}


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;