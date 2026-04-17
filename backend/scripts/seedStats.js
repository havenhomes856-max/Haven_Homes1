import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stats from '../models/statsModel.js';

dotenv.config();

const seedStats = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb+srv://ankannewar4_db_user:hQL3efEuBn0NF0VU@cluster0.kq5adzn.mongodb.net/";
    await mongoose.connect(uri);
    
    console.log('Clearing old stats...');
    // Delete EVERYTHING in the stats collection to start fresh
    await Stats.deleteMany({});

    console.log('Seeding 30 days of sample data...');
    const statsData = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Random view count between 5 and 35
      const viewCount = Math.floor(Math.random() * 31) + 5;
      
      statsData.push({
        date: dateString,
        viewCount: viewCount,
        lastUpdated: new Date()
      });
    }

    await Stats.insertMany(statsData);
    console.log('Successfully seeded 30 days of stats.');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedStats();
