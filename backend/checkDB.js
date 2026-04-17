import mongoose from 'mongoose';
import Stats from './models/statsModel.js';
import dotenv from 'dotenv';
dotenv.config();

const checkStats = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb+srv://ankannewar4_db_user:hQL3efEuBn0NF0VU@cluster0.kq5adzn.mongodb.net/";
    await mongoose.connect(uri);
    const data = await Stats.find().lean();
    console.log('Current Stats in DB:', JSON.stringify(data, null, 2));
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
};
checkStats();
