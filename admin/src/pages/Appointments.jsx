import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, User, Home, Check, X, Loader2,
  Search, Link as LinkIcon, Send, Phone, Mail,
  Clock, Building2, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "../services/apiClient";
import { cn, formatDate } from "../lib/utils";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700 border border-red-200" },
  completed: { label: "Completed", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", cfg.cls)}>
      {cfg.label}
    </span>
  );
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMeetingLink, setEditingMeetingLink] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await apiClient.get("/api/appointments/all");
      if (response.data.success) {
        const valid = response.data.appointments.filter((apt) => apt.propertyId);
        setAppointments(valid);
      } else {
        toast.error(response.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId);
      const response = await apiClient.put("/api/appointments/status", {
        appointmentId,
        status: newStatus,
      });
      if (response.data.success) {
        toast.success(`Appointment ${newStatus}`);
        fetchAppointments(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update appointment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMeetingLinkUpdate = async (appointmentId) => {
    if (!meetingLink) { toast.error("Please enter a meeting link"); return; }
    try {
      const response = await apiClient.put("/api/appointments/update-meeting", {
        appointmentId,
        meetingLink,
      });
      if (response.data.success) {
        toast.success("Meeting link sent successfully");
        setEditingMeetingLink(null);
        setMeetingLink("");
        fetchAppointments(true);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Failed to update meeting link");
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const name  = apt.clientName  || "";
    const email = apt.clientEmail || "";
    const prop  = apt.propertyId?.title || "";
    const matchSearch =
      !searchTerm ||
      prop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === "all" || apt.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center bg-[#FAF8F4]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5A5856] font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-12 px-4 bg-[#FAF8F4]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#1C1B1A] mb-1">Appointments</h1>
            <p className="text-[#5A5856] text-sm">Manage and track property viewing requests</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fetchAppointments(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E6D5C3] text-[#1C1B1A] rounded-xl text-sm font-medium hover:border-[#C5A059] hover:text-[#C5A059] transition-all shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
        </motion.div>

        {/* Filters + Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 border border-[#E6D5C3] shadow-sm mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-1 bg-[#FAF8F4] rounded-xl p-1 flex-wrap">
              {["all", "pending", "confirmed", "cancelled", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                    filter === s
                      ? "bg-[#1C1B1A] text-[#FAF8F4] shadow-sm"
                      : "text-[#5A5856] hover:text-[#1C1B1A]"
                  )}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  <span className={cn(
                    "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                    filter === s ? "bg-white/20" : "bg-[#E6D5C3] text-[#5A5856]"
                  )}>
                    {counts[s]}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search property, name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F4] border border-[#E6D5C3] rounded-xl text-sm text-[#1C1B1A] placeholder-[#9CA3AF] outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#F5F1E8] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[#E6D5C3]" />
            </div>
            <h3 className="text-base font-semibold text-[#1C1B1A] mb-1">No appointments found</h3>
            <p className="text-sm text-[#9CA3AF]">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filters"
                : "No viewing requests have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredAppointments.map((apt, idx) => (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white rounded-2xl border border-[#E6D5C3] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Property Banner */}
                  <div className="bg-[#1C1B1A] px-5 py-4 flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#C5A059] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#FAF8F4] truncate">
                        {apt.propertyId?.title || "Unknown Property"}
                      </p>
                      <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
                        {apt.propertyId?.location || "—"}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>

                  {/* Client Info */}
                  <div className="px-5 py-4 space-y-3 border-b border-[#F5F1E8]">
                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        apt.isGuest ? "bg-amber-50" : "bg-blue-50"
                      )}>
                        <User className={cn("w-4 h-4", apt.isGuest ? "text-amber-500" : "text-blue-500")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1C1B1A] truncate">
                          {apt.clientName}
                        </p>
                        {apt.isGuest && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">
                            Guest
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    {apt.clientEmail && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#F5F1E8] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <a
                          href={`mailto:${apt.clientEmail}`}
                          className="text-sm text-[#C5A059] hover:text-[#C05E44] truncate font-medium transition-colors"
                        >
                          {apt.clientEmail}
                        </a>
                      </div>
                    )}

                    {/* Phone */}
                    {apt.clientPhone && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#F5F1E8] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <a
                          href={`tel:${apt.clientPhone}`}
                          className="text-sm text-[#1C1B1A] hover:text-[#C5A059] font-medium transition-colors"
                        >
                          {apt.clientPhone}
                        </a>
                      </div>
                    )}

                    {/* Date submitted */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F5F1E8] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-[#9CA3AF]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#9CA3AF] leading-none mb-0.5">Submitted</p>
                        <p className="text-sm font-medium text-[#1C1B1A]">
                          {formatDate(apt.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Notes / Message */}
                    {apt.notes && (
                      <div className="bg-[#FAF8F4] rounded-lg px-3 py-2.5 text-xs text-[#5A5856] leading-relaxed">
                        <span className="font-semibold text-[#9CA3AF] uppercase tracking-wider text-[10px] block mb-1">Message</span>
                        {apt.notes}
                      </div>
                    )}
                  </div>

                  {/* Meeting Link Section */}
                  <div className="px-5 py-3 border-b border-[#F5F1E8]">
                    {editingMeetingLink === apt._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          placeholder="Paste meeting link..."
                          className="flex-1 px-3 py-1.5 border border-[#E6D5C3] rounded-lg text-xs outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20"
                        />
                        <button
                          onClick={() => handleMeetingLinkUpdate(apt._id)}
                          className="p-1.5 bg-[#C5A059] text-white rounded-lg hover:bg-[#C05E44] transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setEditingMeetingLink(null); setMeetingLink(""); }}
                          className="p-1.5 bg-[#E6D5C3] text-[#5A5856] rounded-lg hover:bg-[#D4B99A] transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        {apt.meetingLink ? (
                          <a
                            href={apt.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[#C5A059] hover:text-[#C05E44] font-medium underline underline-offset-2"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            View Meeting Link
                          </a>
                        ) : (
                          <span className="text-xs text-[#9CA3AF]">No meeting link set</span>
                        )}
                        {apt.status === "confirmed" && (
                          <button
                            onClick={() => { setEditingMeetingLink(apt._id); setMeetingLink(apt.meetingLink || ""); }}
                            className="text-xs text-[#C5A059] hover:text-[#C05E44] font-medium flex items-center gap-1 transition-colors"
                          >
                            <LinkIcon className="w-3 h-3" />
                            {apt.meetingLink ? "Edit" : "Add Link"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {apt.status === "pending" && (
                    <div className="px-5 py-3 flex items-center gap-2">
                      {updatingId === apt._id ? (
                        <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStatusChange(apt._id, "confirmed")}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(apt._id, "cancelled")}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {apt.status === "confirmed" && (
                    <div className="px-5 py-3">
                      <button
                        onClick={() => handleStatusChange(apt._id, "completed")}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
