import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  guestInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  date: {
    type: Date,
    required: false
  },
  time: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  meetingLink: {
    type: String,
    trim: true
  },
  meetingPlatform: {
    type: String,
    enum: ['zoom', 'google-meet', 'teams', 'other'],
    default: 'other'
  },
  notes: {
    type: String
  },
  cancelReason: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
appointmentSchema.index({ propertyId: 1, date: -1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;