import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Facebook, ArrowRight, Home } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    services: [
      { name: 'Buy Property', path: '/properties' },
    ],

  };

  return (
    <footer className="bg-[#1C1B1A] text-[#ffe97f] pt-24 pb-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">

          {/* Logo & Vision */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776567470/Gemini_Generated_Image_2kiid52kiid52kii-Photoroom.png"
                alt="Haven Homes Logo"
                className="h-20 w-auto object-contain"
              />
              <span className="font-fraunces font-bold text-3xl tracking-tight text-[#ffe97f]">Haven Homes</span>
            </Link>
            <p className="font-red-hat text-base text-[#ffe97f]/80 max-w-sm leading-relaxed">
              Curating luxury living spaces and premium investment opportunities across India's most prestigious locations.
            </p>
            <div className="flex items-center gap-5">
              <a href="https://www.instagram.com/havenhomespunjab?igsh=MTVsM3Ixd3JnM21hcg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#ffe97f]/30 hover:border-[#ffe97f] hover:bg-[#ffe97f] hover:text-[#1C1B1A] transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@haven_homes_punjab?si=2LAcMfZd2jWVkDNN" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#ffe97f]/30 hover:border-[#ffe97f] hover:bg-[#ffe97f] hover:text-[#1C1B1A] transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/1F8iGtz8gA/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#ffe97f]/30 hover:border-[#ffe97f] hover:bg-[#ffe97f] hover:text-[#1C1B1A] transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="font-red-hat text-xs font-extra-bold uppercase tracking-[3px] text-[#ffe97f]/60">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="font-red-hat text-sm text-[#ffe97f]/80 hover:text-[#ffe97f] hover:translate-x-1 transition-all inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[#ffe97f]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-red-hat text-xs text-[#ffe97f]/60 uppercase tracking-widest">
            © {currentYear} Haven Homes Luxury Real Estate.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/contact" className="font-red-hat text-xs text-[#ffe97f]/60 hover:text-[#ffe97f] uppercase tracking-widest transition-colors font-bold">Contact Support</Link>
            <Link to="/properties" className="font-red-hat text-xs text-[#ffe97f]/60 hover:text-[#ffe97f] uppercase tracking-widest transition-colors font-bold">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
