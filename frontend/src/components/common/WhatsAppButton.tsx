import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppButton: React.FC = () => {
  const whatsappUrl = "https://wa.me/919876543210";
  const iconUrl = "https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776427639/WhatsApp_icon.png";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-[100px] sm:bottom-6 right-6 z-[9999] flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 drop-shadow-2xl active:drop-shadow-lg transition-shadow"
      title="Chat with us on WhatsApp"
    >
      <img 
        src={iconUrl} 
        alt="WhatsApp" 
        className="w-full h-full object-contain"
      />
      
      {/* Subtle ping animation for attention */}
      <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping -z-10" />
    </motion.a>
  );
};

export default WhatsAppButton;
