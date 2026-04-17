import mongoose from 'mongoose';

/**
 * Daily Stats Schema
 * Optimized for high performance and low storage.
 * Stores one document per day instead of thousands of individual logs.
 */
const statsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true, // "YYYY-MM-DD"
    index: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// TTL index: keep summaries for 90 days (much longer than individual logs since they are small)
statsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const Stats = mongoose.model('Stats', statsSchema);

export default Stats;