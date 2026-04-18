import React from 'react';

const SimpleFooter: React.FC = () => {
  return (
    <footer className="bg-[#FAF8F4] border-t border-[#E6E0DA] py-8">
      <div className="max-w-[1280px] mx-auto px-8 text-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 bg-[#C5A059] rounded-full" />
          <span className="font-red-hat font-bold text-sm text-[#1C1B1A] uppercase tracking-[4px]">
            Haven Homes
          </span>
        </div>

        {/* Copyright */}
        <p className="font-red-hat font-medium text-xs text-[#5A5856]">
          © {new Date().getFullYear()} Haven Homes. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SimpleFooter;
