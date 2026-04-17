import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { appointmentsAPI } from '../../services/api';
import { toast } from 'sonner';

interface ConsultationSectionProps {
  defaultPropertyId?: string;
}

const ConsultationSection: React.FC<ConsultationSectionProps> = ({ defaultPropertyId }) => {
  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    try {
      await appointmentsAPI.schedule({
        propertyId: defaultPropertyId || 'general',
        name: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        message: 'General consultation request from the home page.',
      });

      toast.success('Consultation Request Submitted!', {
        description: "We'll contact you shortly to schedule your call."
      });
      setBookingData({ fullName: '', email: '', phone: '' });
    } catch (err: any) {
      console.error('Failed to schedule consultation:', err);
      toast.error('Submission Failed', {
        description: err.response?.data?.message || 'Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="consultation-section" className="w-full flex flex-col lg:flex-row mt-12">
      {/* Left Side Images */}
      <div className="lg:w-1/2 relative bg-gray-100 min-h-[400px]">
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_80/v1776423229/Hero_Section.jpg" 
            className="w-full h-1/2 object-cover opacity-80" 
            alt="House top" 
          />
          <img 
            src="https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_80/v1776423229/Happy_Homeowners_1.jpg" 
            className="w-full h-1/2 object-cover" 
            alt="House bottom" 
          />
        </div>
        <div className="absolute bottom-6 right-6 flex gap-4">
          <button className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white backdrop-blur-sm bg-black/20 hover:bg-black/40">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white backdrop-blur-sm bg-black/20 hover:bg-black/40">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="lg:w-1/2 bg-[#1C1B1A] text-white px-8 sm:px-16 py-16 flex flex-col justify-center">
        <h2 className="font-fraunces font-bold text-white text-3xl sm:text-4xl lg:text-5xl mb-12 tracking-tight leading-tight">
          Still haven't found what you're looking for?
        </h2>
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div>
            <label className="block font-red-hat text-xs uppercase tracking-widest mb-2 opacity-60 font-bold">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={bookingData.fullName}
              onChange={handleBookingInputChange}
              placeholder="Enter your full name"
              className="w-full bg-[#2A2928] border-none rounded-lg p-4 font-red-hat text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-white outline-none"
            />
          </div>
          <div>
            <label className="block font-red-hat text-xs uppercase tracking-widest mb-2 opacity-60 font-bold">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={bookingData.email}
              onChange={handleBookingInputChange}
              placeholder="your.email@example.com"
              className="w-full bg-[#2A2928] border-none rounded-lg p-4 font-red-hat text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-white outline-none"
            />
          </div>
          <div>
            <label className="block font-red-hat text-xs uppercase tracking-widest mb-2 opacity-60 font-bold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={bookingData.phone}
              onChange={handleBookingInputChange}
              placeholder="+91 98765 43210"
              className="w-full bg-[#2A2928] border-none rounded-lg p-4 font-red-hat text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-white text-[#1C1B1A] font-manrope font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors inline-block uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Requesting...' : 'Request a Call'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationSection;
