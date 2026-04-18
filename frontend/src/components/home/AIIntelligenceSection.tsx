import React from 'react';

const AIIntelligenceSection: React.FC = () => {
  return (
    <section className="bg-[#F8F6F6] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">

        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border border-[#f3f4f6] rounded-2xl p-8 shadow-[0px_20px_25px_-5px_rgba(229,231,235,0.5)]">
            <div className="w-14 h-14 bg-[rgba(212,117,91,0.1)] rounded-xl flex items-center justify-center mb-6">
              <span className="font-material-icons text-3xl text-[#C5A059]">query_stats</span>
            </div>
            <h3 className="font-syne font-bold text-2xl text-[#111827] mb-4">Live Market Scraping</h3>
            <p className="font-manrope text-base text-[#6b7280] leading-relaxed">
              Real-time data feeds from every major listing source, aggregating hidden gems before
              they hit the mainstream market.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-[#f3f4f6] rounded-2xl p-8 shadow-[0px_20px_25px_-5px_rgba(229,231,235,0.5)]">
            <div className="w-14 h-14 bg-[rgba(212,117,91,0.1)] rounded-xl flex items-center justify-center mb-6">
              <span className="font-material-icons text-3xl text-[#C5A059]">psychology</span>
            </div>

          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-[#f3f4f6] rounded-2xl p-8 shadow-[0px_20px_25px_-5px_rgba(229,231,235,0.5)]">
            <div className="w-14 h-14 bg-[rgba(212,117,91,0.1)] rounded-xl flex items-center justify-center mb-6">
              <span className="font-material-icons text-3xl text-[#C5A059]">location_city</span>
            </div>
            <h3 className="font-syne font-bold text-2xl text-[#111827] mb-4">Best Area Suggestions</h3>
            <p className="font-manrope text-base text-[#6b7280] leading-relaxed">
              Neighborhood matching based on your lifestyle habits, commute preferences, and
              local amenities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIIntelligenceSection;
