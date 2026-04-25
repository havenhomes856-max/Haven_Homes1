import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const removeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@buildestate.com';
        
        const result = await User.deleteOne({ email: adminEmail });

        if (result.deletedCount > 0) {
            console.log(`Successfully removed admin with email: ${adminEmail}`);
        } else {
            console.log(`No admin found with email: ${adminEmail}`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error removing admin:', error);
        process.exit(1);
    }
};

removeAdmin();
