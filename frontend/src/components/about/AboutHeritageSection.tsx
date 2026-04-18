import React from 'react';
import { ArrowRight } from 'lucide-react';


const AboutHeritageSection: React.FC = () => {
  return (
    <section className="bg-[#FAF8F4] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left - Image */}
          <div className="relative">
            <div className="border border-[#E5E7EB] rounded-2xl p-3">
              <div className="relative h-[400px] sm:h-[600px] lg:h-[700px] rounded-xl overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776496833/about_us1.jpg"
                  alt="Architectural detail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="lg:pt-12">
            {/* Label */}
            <p className="font-red-hat text-xs uppercase tracking-[2.4px] text-[#5A5856] mb-6 font-bold">
              Our Heritage
            </p>

            {/* Headline */}
            <h2 className="mb-8">
              <span className="font-fraunces text-[36px] sm:text-[40px] leading-[1.25] text-[#1C1B1A] block font-bold">
                Redefining the Real Estate Landscape with
              </span>
              <span className="font-fraunces italic text-[36px] sm:text-[40px] leading-[1.25] text-[#5A5856] block font-light mt-1">
                Better Property Discovery
              </span>
            </h2>

            {/* Description */}
            <div className="space-y-5 mb-10">
              <p className="font-red-hat text-base leading-7 text-[#5A5856] font-medium">
                Haven Homes Punjab, led by Gaurav Sharma (Director), is a trusted real estate service focused on helping clients buy, sell, and invest in property with confidence. With strong local market knowledge and a transparent approach, we ensure smooth and reliable property deals.
              </p>
            </div>

            {/* Blockquote */}
            <blockquote className="border-l-[3px] border-[#C5A059] pl-6 mb-10">
              <p className="font-fraunces italic text-xl leading-8 text-[#1C1B1A]">
                "We believe finding a home should be inspiring,
                not exhausting."
              </p>
            </blockquote>

            {/* Link */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeritageSection;
