import React from 'react';
const AboutHeroSection: React.FC = () => {
  const mainAboutImage = "https://ik.imagekit.io/kceia4cyw/havenhome_assets/frontend_images/Main_about_image__Ko32s5BNE.jpg?tr=f-auto";
  return (
    <section className="relative bg-[#111827] h-[480px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{ 
          backgroundImage: `url('${mainAboutImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} 
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/60 to-[#111827]/90" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-[700px] px-8">
          <p className="font-red-hat text-xs uppercase tracking-[3px] text-[#C5A059]/60 mb-6 font-bold">About Haven Homes</p>
          <h1 className="font-fraunces text-[48px] sm:text-[56px] leading-tight text-[#C5A059] font-bold mb-6">
            Redefining Real Estate with<br />
            <span className="font-light italic text-[#C5A059]/90">Intelligence & Elegance</span>
          </h1>
          
          {/* Divider */}
          <div className="w-16 h-[2px] bg-[#C5A059]/30 mx-auto mb-8" />
          
          <p className="font-red-hat text-lg text-[#C5A059]/70 font-medium leading-relaxed">
            Where data-driven precision meets the art of living.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
