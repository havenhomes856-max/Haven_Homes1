import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="bg-[#111827] py-24 relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1F2937] to-[#111827]" />

      <div className="max-w-[1280px] mx-auto px-8 text-center relative z-10">
        <p className="font-red-hat text-xs uppercase tracking-[2px] text-[#C5A059]/40 mb-6 font-bold">Get Started</p>
        <h2 className="font-fraunces text-4xl sm:text-5xl font-bold text-[#C5A059] mb-6">
          Ready to Find Your Dream Home?
        </h2>
        <p className="font-red-hat text-lg text-[#C5A059]/60 font-medium mb-10 max-w-[620px] mx-auto leading-relaxed">
          Join thousands of satisfied homeowners who found their perfect property with Haven Homes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/properties"
            className="bg-[#C5A059] text-[#1C1B1A] font-red-hat font-bold text-sm px-8 py-4 rounded-full hover:bg-[#F3F4F6] transition-colors uppercase tracking-widest active:scale-95"
          >
            Browse Properties
          </Link>
          <Link
            to="/contact"
            className="border-2 border-[#C5A059]/30 text-[#C5A059] font-red-hat font-bold text-sm px-8 py-4 rounded-full hover:bg-[#C5A059] hover:text-[#1C1B1A] transition-all uppercase tracking-widest active:scale-95"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
