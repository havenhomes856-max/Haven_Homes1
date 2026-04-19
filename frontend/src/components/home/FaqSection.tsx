import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How do I start the process of buying a property with Haven Homes?",
    answer: "At Haven Homes, we make it simple for you to find your dream home. Start by browsing our property listings, and once you've found a property that interests you, contact our team to schedule a viewing and get expert advice on the next steps."
  },
  {
    question: "What types of properties does Haven Homes offer?",
    answer: "We offer a diverse range of properties including luxury apartments, single-family homes, townhouses, and large estates suitable for various lifestyles and budgets."
  },
  {
    question: "Can Haven Homes assist with property financing or mortgages?",
    answer: "Yes, our team can connect you with trusted financial partners to help you secure the best mortgage rates and financing options tailored to your needs."
  },
  {
    question: "Does Haven Homes provide property management services?",
    answer: "Absolutely. We offer comprehensive property management services to ensure your investment is well-maintained and profitable without any hassle."
  },
  {
    question: "Are there any fees involved in working with Haven Homes?",
    answer: "Our consultation and property viewing services are generally free. Standard brokerage fees apply only upon the successful purchase or sale of a property."
  }
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="bg-white py-24 border-t border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">

        {/* Container for the split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-sm">

          {/* Left Column - Your Custom Gold #C5A059 */}
          <div className="lg:col-span-5 bg-[#C5A059] p-10 sm:p-16 flex flex-col justify-center relative">
            <h2 className="font-inter font-bold text-5xl sm:text-[64px] leading-tight text-white tracking-tighter mb-8">
              Frequently Asked<br />Question
            </h2>
            <p className="font-inter font-medium text-base text-white/90 leading-relaxed max-w-sm">
              Whether you're looking for a modern apartment in the city or a peaceful home in the suburbs, our listings offer something for everyone.
            </p>

            {/* Vertical Separator Line - Using white/20 to divide by / the sections elegantly */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-white/20" />
          </div>

          {/* Right Column - Accordion Section */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-12 lg:p-16">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#F8F9FA] hover:bg-[#F3F4F6] rounded-2xl overflow-hidden transition-all duration-300 border border-transparent hover:border-[#E5E7EB]"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-8 py-7 flex items-center justify-between text-left group"
                  >
                    <span className="font-inter font-semibold text-lg sm:text-xl text-[#111827] pr-8">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[#9CA3AF] flex-shrink-0 group-hover:text-[#C5A059] transition-colors"
                    >
                      <ChevronDown className="w-6 h-6" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-8 pb-8 pr-16">
                          <p className="font-inter text-base text-[#6B7280] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FaqSection;