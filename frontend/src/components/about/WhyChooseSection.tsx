import React from 'react';
import { Award, Feather, Users, MapPin, ShieldCheck, Building2 } from 'lucide-react';

const WhyChooseSection: React.FC = () => {
  const reasons = [
    {
      icon: Award,
      title: "TRUSTED",
      description: "A reliable and transparent real estate partner in Jalandhar, delivering premium solutions across Punjab with absolute integrity."
    },
    {
      icon: Feather,
      title: "END-TO-END SERVICES",
      description: "From property search to documentation, loans, resale, and rentals – everything under one roof with the best property dealers in Jalandhar."
    },
    {
      icon: Users,
      title: "EXPERIENCED PROFESSIONALS",
      description: "A skilled team of property dealers in Jalandhar, Punjab, committed to providing personalized guidance and professional support."
    },
    {
      icon: MapPin,
      title: "PRIME LOCATION EXPERTISE",
      description: "Specialized knowledge of Urban Estate Phase 2, 66 Feet Road, and other prime areas, making us trusted Jalandhar property experts."
    },
    {
      icon: ShieldCheck,
      title: "FAIR & TRANSPARENT DEALS",
      description: "Every transaction is conducted with honesty and integrity, maintaining our reputation among top property dealers in Punjab."
    },
    {
      icon: Building2,
      title: "CUSTOMER-FIRST APPROACH",
      description: "Building lifelong relationships by offering tailored property solutions that fit every need and budget with complete trust."
    }
  ];

  return (
    <section className="bg-[#FAF8F4] py-24 border-t border-[#E6E0DA]">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="font-red-hat text-xs uppercase tracking-[4px] text-[#C5A059] mb-4 font-bold">
            Why Choose Us?
          </p>
          <div className="w-12 h-0.5 bg-[#C5A059] mx-auto" />
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {reasons.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              {/* Icon Circle */}
              <div className="w-20 h-20 rounded-full border border-[#C5A059]/30 flex items-center justify-center mb-8 group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-all duration-500">
                <item.icon className="w-8 h-8 text-[#C5A059] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="font-red-hat font-bold text-lg text-[#1C1B1A] mb-4 tracking-[2px] uppercase">
                {item.title}
              </h3>

              {/* Description */}
              <p className="font-red-hat font-medium text-sm text-[#5A5856] leading-relaxed max-w-[300px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
