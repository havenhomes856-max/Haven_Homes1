import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <section className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[90vh] overflow-hidden bg-white">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_80/v1776423229/Hero_Section.jpg"
          alt="Luxury Coastal Retreat"
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay to enhance text readability while maintaining "airy" feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />
      </div>

      {/* Main Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8">

        {/* Title Group */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-white/60" />
            <span className="font-red-hat text-white text-[10px] sm:text-xs font-bold uppercase tracking-[4px]">Curated Real Estate</span>
            <div className="h-px w-8 bg-white/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-fraunces font-bold text-[18vw] sm:text-[12vw] lg:text-[11vw] text-[#fad643] uppercase leading-[0.85] tracking-tighter drop-shadow-2xl"
          >
            HAVEN <br className="sm:hidden" /> HOMES
          </motion.h1>
        </div>

        {/* Universal Search Bar - Centered and Premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-2xl"
        >
          <form
            onSubmit={handleSearch}
            className="group relative flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 p-2 rounded-2xl sm:rounded-[2rem] shadow-2xl transition-all duration-500 hover:bg-white/15 hover:border-white/40"
          >
            <div className="flex-1 flex items-center gap-3 px-4 sm:px-6">
              <Search className="w-5 h-5 text-white/70 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search by city, neighborhood, or property type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none py-4 sm:py-5 font-red-hat text-sm sm:text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="bg-[#F5DF68] sm:bg-white text-[#1C1B1A] font-red-hat text-xs sm:text-sm font-bold uppercase tracking-widest px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] hover:bg-[#C5A059] hover:text-white transition-all duration-300 shadow-lg active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <p className="font-red-hat text-[10px] text-white/50 uppercase tracking-widest mr-2">Suggestion:</p>
            {['Jalandhar', 'Ludhiana', 'Plot', 'Villa'].map(item => (
              <button
                key={item}
                onClick={() => { setSearchTerm(item); }}
                className="font-red-hat text-[10px] sm:text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 transition-all font-bold"
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-40"
      >
        <div className="w-[1px] h-12 bg-white" />
        <span className="font-red-hat text-[9px] text-white uppercase tracking-[4px] rotate-90 translate-y-8">Scroll</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
