import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Youtube, Facebook, Share2, Plus, X } from 'lucide-react';

const SocialFloatingDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const socials = [
    {
      name: 'Instagram',
      image: 'https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776449354/Pngtree_instagram_icon_vector_8704817.png',
      url: 'https://www.instagram.com/havenhomespunjab?igsh=MTVsM3Ixd3JnM21hcg==',
      color: 'bg-white'
    },
    {
      name: 'YouTube',
      image: 'https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776449455/Pngtree_youtube_social_media_3d_stereo_8704808.png',
      url: 'https://youtube.com/@haven_homes_punjab?si=2LAcMfZd2jWVkDNN',
      color: 'bg-white'
    },
    {
      name: 'Facebook',
      image: 'https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776489495/facebook-logo-png-2320.png',
      url: 'https://www.facebook.com/share/1F8iGtz8gA/',
      color: 'bg-white'
    }
  ];

  return (
    <div className="fixed bottom-[166px] sm:bottom-[98px] right-6 z-[9999] flex flex-col items-center gap-4 pr-[2px] pb-[2px]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-3 mb-2"
          >
            {socials.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: -5 }}
                className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${social.name === 'Facebook' ? 'p-0 overflow-hidden' : 'p-2.5'}`}
                title={social.name}
              >
                <img
                  src={social.image}
                  alt={social.name}
                  className={`w-full h-full ${social.name === 'Facebook' ? 'object-cover' : 'object-contain'}`}
                />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${isOpen ? 'bg-[#1C1B1A]' : 'bg-white'} text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl z-10 transition-colors overflow-hidden border border-gray-100`}
      >
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <img
            src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776506061/Gemini_Generated_Image_caf7y5caf7y5caf7-Photoroom.png"
            alt="Socials"
            className="w-full h-full object-cover"
          />
        )}
      </motion.button>
    </div>
  );
};

export default SocialFloatingDrawer;
