import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import apiClient from '../services/apiClient';
import { cn } from '../lib/utils';

const labelClass = "block text-sm font-bold font-red-hat text-[#1C1B1A] mb-2 uppercase tracking-wide";
const inputClass = "w-full px-4 py-3 bg-white border border-[#E6D5C3] rounded-xl text-[#1C1B1A] placeholder-[#9CA3AF] text-sm font-red-hat transition-all duration-200 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15";

const Settings = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const t = toast.loading("Updating password...");

    try {
      const response = await apiClient.put('/api/admin/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        toast.success("Password updated successfully!", { id: t });
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.data.message || "Failed to update password", { id: t });
      }
    } catch (error) {
      console.error("Update password error:", error);
      toast.error(error.response?.data?.message || "An error occurred", { id: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-12 px-4 bg-[#FAF8F4]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-fraunces text-[#1C1B1A] mb-1">Account Settings</h1>
          <p className="text-[#5A5856] font-red-hat">Manage your administrator account security</p>
        </motion.div>

        <div className="grid gap-6">
          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#C5A059]/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-fraunces text-[#1C1B1A]">Security & Password</h3>
                <p className="text-xs font-red-hat text-[#9CA3AF]">Update your login credentials</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Old Password */}
              <div>
                <label htmlFor="oldPassword" className={labelClass}>Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                  <input
                    type={showOld ? "text" : "password"}
                    id="oldPassword"
                    name="oldPassword"
                    required
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    className={cn(inputClass, "pl-11 pr-11")}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#C5A059] transition-colors"
                  >
                    {showOld ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="h-px bg-[#E6D5C3]/50 my-2" />

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className={labelClass}>New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                  <input
                    type={showNew ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={cn(inputClass, "pl-11 pr-11")}
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#C5A059] transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={cn(inputClass, "pl-11 pr-11")}
                    placeholder="Re-type new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#C5A059] transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full py-4 bg-[#1C1B1A] hover:bg-[#C5A059] text-[#FAF8F4] rounded-xl font-bold font-red-hat text-sm transition-all duration-300 shadow-lg hover:shadow-terracotta disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Quick Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-2xl"
          >
            <h4 className="text-sm font-bold text-[#C5A059] mb-2 uppercase tracking-wide">Security Tip</h4>
            <p className="text-sm text-[#5A5856] leading-relaxed">
              Ensure your new password is at least 8 characters long and includes a mix of letters, numbers, and symbols for maximum protection of your administrative account.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
