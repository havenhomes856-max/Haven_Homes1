import React from 'react';

const ContactInfoCards: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Visit Our Office Card */}
      <div className="bg-white border border-[#E6E0DA] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(212,117,91,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#C5A059]">
              location_on
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-fraunces font-bold text-lg text-[#1C1B1A] mb-2">
              Visit Our Office
            </h3>
            <p className="font-red-hat font-medium text-sm text-[#5A5856] leading-relaxed mb-3">
              502, Devpath Building,<br />
              Near Torrent Lab,<br />
              Ashram Road, Ahmedabad
            </p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-red-hat font-bold text-sm text-[#C5A059] hover:text-[#B86851] transition-colors"
            >
              <span>Get Directions</span>
              <span className="material-icons text-sm">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Call or Email Us Card */}
      <div className="bg-white border border-[#E6E0DA] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(212,117,91,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#C5A059]">
              phone
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-fraunces font-bold text-lg text-[#1C1B1A] mb-3">
              Call or Email Us
            </h3>
            <div className="space-y-2">
              <a 
                href="tel:9501490002" 
                className="flex items-center gap-2 font-red-hat font-medium text-sm text-[#5A5856] hover:text-[#D47556] transition-colors"
              >
                <span className="material-icons text-base">
                  call
                </span>
                <span>95014-90002</span>
              </a>
              <a 
                href="tel:9872311311" 
                className="flex items-center gap-2 font-red-hat font-medium text-sm text-[#5A5856] hover:text-[#C5A059] transition-colors"
              >
                <span className="material-icons text-base">
                  call
                </span>
                <span>9872 311311</span>
              </a>
              <a 
                href="mailto:hello@Haven Homes.com" 
                className="flex items-center gap-2 font-red-hat font-medium text-sm text-[#5A5856] hover:text-[#C5A059] transition-colors"
              >
                <span className="material-icons text-base">
                  email
                </span>
                <span>hello@Haven Homes.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours Card */}
      <div className="bg-white border border-[#E6E0DA] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[rgba(212,117,91,0.1)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-2xl text-[#C5A059]">
              schedule
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-fraunces font-bold text-lg text-[#1C1B1A] mb-3">
              Business Hours
            </h3>
            <div className="space-y-2 font-red-hat font-medium text-sm text-[#5A5856]">
              <div className="flex justify-between items-center">
                <span>Available:</span>
                <span className="font-bold text-[#1C1B1A]">24/7 Service</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Always here for your property needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCards;
