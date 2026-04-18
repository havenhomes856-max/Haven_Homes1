import React from 'react';

const ContactHeroSection: React.FC = () => {
  return (
    <section className="bg-[#FAF8F4] border-b border-[#E6E0DA] py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="text-center">
          {/* Label */}
          <div className="flex justify-center mb-4">
            <span className="font-red-hat text-xs text-[#C5A059] uppercase tracking-[4px] font-bold">
              Contact & Support
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-fraunces font-bold text-6xl text-[#1C1B1A] mb-6 tracking-tight">
            We'd Love to Hear From You
          </h1>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;
