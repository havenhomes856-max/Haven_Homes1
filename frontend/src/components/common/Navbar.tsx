import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Home, Building, Info, MessageCircle, Phone } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { title: 'Home', path: '/', icon: Home },
    { title: 'Properties', path: '/properties', icon: Building },
    { title: 'About Us', path: '/about', icon: Info },
    { title: 'Contact', path: '/contact', icon: Phone },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'bg-[#1C1B1A]/95 backdrop-blur-md shadow-lg h-16' : 'bg-[#1C1B1A] h-20'
    }`}>
      <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 h-full py-0">
           <img 
             src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776491805/logo-Photoroom.png" 
             alt="Haven Homes Logo" 
             className="h-full w-auto object-contain brightness-0 invert"
           />
           <span className="font-fraunces font-bold text-xl sm:text-2xl text-white tracking-tight">Haven Homes</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.path}
              className={`font-red-hat text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-1 ${
                location.pathname === link.path 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.title}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4755B]" 
                />
              )}
            </Link>
          ))}
          <Link 
            to="/properties"
            className="bg-white text-[#1C1B1A] font-red-hat text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[#D4755B] hover:text-white transition-all duration-300 shadow-md"
          >
            Explore Listings
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-[#1C1B1A] z-[90] lg:hidden flex flex-col items-center justify-center p-8 text-center"
          >
            {/* Close Button Inside Menu */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="space-y-8 w-full">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.path}
                  className="flex items-center justify-center gap-4 group"
                >
                   <link.icon className="w-5 h-5 text-[#D4755B]" />
                   <span className="font-fraunces text-3xl font-bold text-white hover:text-[#D4755B] transition-colors">{link.title}</span>
                </Link>
              ))}
              <div className="pt-12">
                <Link 
                  to="/properties"
                  className="block w-full bg-white text-[#1C1B1A] font-red-hat text-sm font-bold uppercase tracking-widest py-5 rounded-2xl shadow-xl"
                >
                  View All listings
                </Link>
              </div>
            </div>
            
            {/* Contact Support */}
            <div className="absolute bottom-12 text-center w-full">
               <p className="font-red-hat text-xs text-gray-500 uppercase tracking-widest mb-2 opacity-60">Need Assistance?</p>
               <p className="font-fraunces text-xl font-bold text-white">95014-90002</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;