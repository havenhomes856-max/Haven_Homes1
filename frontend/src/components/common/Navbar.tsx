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
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-[#1C1B1A]/95 backdrop-blur-md shadow-lg h-[65px]' : 'bg-[#1C1B1A] h-[81px]'
      }`}>
      <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between relative">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 h-full py-0 lg:static absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0"
        >
          <img
            src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_auto,q_auto/v1776492125/logo-Photoroom.png"
            alt="Haven Homes Logo"
            className="h-full w-auto object-contain py-1"
          />
          <span className="font-fraunces font-bold text-xl sm:text-2xl text-[#C5A059] tracking-tight hidden lg:block">Haven Homes</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.path}
              className={`font-red-hat text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-1 ${location.pathname === link.path
                ? 'text-[#C5A059]'
                : 'text-gray-400 hover:text-[#C5A059]'
                }`}
            >
              {link.title}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059]"
                />
              )}
            </Link>
          ))}
          <Link
            to="/properties"
            className="bg-white text-[#1C1B1A] font-red-hat text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[#C5A059] hover:text-white transition-all duration-300 shadow-md"
          >
            Explore Listings
          </Link>
        </div>

        {/* Leftmost Decorative Image */}
        <div className="flex items-center h-full">
          <img
            src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_auto,q_auto/v1776584992/Gemini_Generated_Image_6q1o176q1o176q1o-Photoroom.png"
            alt="Decorative Element"
            className="h-[50px] sm:h-[60px] w-auto object-contain"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-[#C5A059]"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[85] lg:hidden"
            />
            
            {/* Slider Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[85%] sm:w-[400px] h-screen bg-[#1C1B1A] z-[90] lg:hidden flex flex-col p-8 shadow-2xl"
            >
              {/* Close Button Inside Menu */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-[#C5A059] hover:bg-white/5 rounded-full transition-all"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="space-y-6 w-full">
                <p className="font-red-hat text-[10px] text-gray-500 uppercase tracking-[4px] mb-8">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    to={link.path}
                    className="flex items-center gap-6 group py-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#C5A059]/10 transition-colors">
                      <link.icon className="w-5 h-5 text-[#C5A059]" />
                    </div>
                    <span className="font-fraunces text-2xl font-bold text-[#C5A059] group-hover:translate-x-2 transition-transform">{link.title}</span>
                  </Link>
                ))}
                
                <div className="pt-8">
                  <Link
                    to="/properties"
                    className="flex items-center justify-center gap-3 w-full bg-[#C5A059] text-[#1C1B1A] font-red-hat text-xs font-bold uppercase tracking-[2px] py-5 rounded-xl shadow-xl hover:shadow-[#C5A059]/20 transition-all active:scale-95"
                  >
                    Explore Properties
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="mt-auto pb-8">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <p className="font-red-hat text-[10px] text-gray-500 uppercase tracking-widest opacity-60">Direct Support</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-[#1C1B1A]">
                       <Phone className="w-5 h-5" />
                    </div>
                    <p className="font-fraunces text-xl font-bold text-[#C5A059]">95014-90002</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
