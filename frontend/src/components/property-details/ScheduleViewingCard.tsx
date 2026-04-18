import React, { useState } from 'react';
import { toast } from 'sonner';
import { appointmentsAPI } from '../../services/api';

interface ScheduleViewingCardProps {
  property: {
    name: string;
    id: string;
  };
}

const ScheduleViewingCard: React.FC<ScheduleViewingCardProps> = ({ property }) => {
  const imgBackground = "https://cdn-icons-png.flaticon.com/512/1067/1067566.png";

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await appointmentsAPI.schedule({
        propertyId: property.id,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: `Viewing request for ${property.name}`,
      });
      setSuccess(true);
      toast.success('Visit Request Submitted!', {
        description: "We'll contact you shortly to confirm your visit."
      });
      setFormData({ fullName: '', email: '', phone: '' });
    } catch (err: any) {
      console.error('Failed to schedule viewing:', err);
      const msg = err.response?.data?.message || 'Failed to schedule. Please try again.';
      setError(msg);
      toast.error('Scheduling Failed', {
        description: msg
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-lg sticky top-8 text-center">
        <span className="material-icons text-5xl text-[#22C55E] mb-4">check_circle</span>
        <h3 className="font-fraunces font-bold text-xl text-[#1C1B1A] mb-2">Visit Requested!</h3>
        <p className="font-red-hat font-medium text-sm text-[#5A5856] mb-6">
          We'll contact you shortly to confirm your visit.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-[#C5A059] font-red-hat font-bold text-sm hover:underline"
        >
          Schedule another visit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-lg sticky top-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="material-icons text-[#C5A059] text-xl">
          calendar_today
        </span>
        <h3 className="font-fraunces font-bold text-xl text-[#1C1B1A]">
          Schedule a Call
        </h3>
      </div>

      {/* Agent Info */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E6E0DA]">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={imgBackground}
            alt="Agent"
            className="w-full h-full object-cover mt-2"
          />
        </div>
        <div>
          <p className="font-red-hat font-bold text-sm text-[#1C1B1A] mb-0.5">
            Agent Name
          </p>
          <p className="font-red-hat font-medium text-xs text-[#5A5856]">
            Senior Property Consultant
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block font-red-hat text-xs text-[#5A5856] uppercase tracking-wider mb-2 font-bold">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full bg-[#F8F6F6] border border-[#E6E0DA] rounded-lg px-4 py-3 font-red-hat text-sm text-[#1C1B1A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C5A059] transition-colors"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-red-hat text-xs text-[#5A5856] uppercase tracking-wider mb-2 font-bold">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="w-full bg-[#F8F6F6] border border-[#E6E0DA] rounded-lg px-4 py-3 font-red-hat text-sm text-[#1C1B1A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C5A059] transition-colors"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-red-hat text-xs text-[#5A5856] uppercase tracking-wider mb-2 font-bold">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+91 98765 43210"
            className="w-full bg-[#F8F6F6] border border-[#E6E0DA] rounded-lg px-4 py-3 font-red-hat text-sm text-[#1C1B1A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C5A059] transition-colors"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-center font-manrope text-xs text-red-500 mt-2">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1C1B1A] hover:bg-[#C5A059] disabled:opacity-60 disabled:cursor-not-allowed text-white font-red-hat font-bold text-sm py-4 rounded-xl transition-all shadow-lg active:scale-95 mt-6 uppercase tracking-widest"
        >
          {submitting ? 'Submitting...' : 'Request a Call'}
        </button>

        {/* Info Text */}
        <p className="text-center font-manrope font-extralight text-xs text-[#94A3B8] mt-4">
          We'll contact you within 24 hours to confirm your visit.
        </p>
      </form>
    </div>
  );
};

export default ScheduleViewingCard;
