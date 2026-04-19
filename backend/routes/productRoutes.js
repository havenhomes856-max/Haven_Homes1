import express from 'express';
import { addproperty, listproperty, removeproperty, updateproperty, singleproperty, featuredproperty } from '../controller/productController.js';
import upload from '../middleware/multer.js';
import rateLimit from 'express-rate-limit';

const propertyrouter = express.Router();

const productRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});

propertyrouter.use(productRateLimiter);

propertyrouter.post('/add', upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), addproperty);
propertyrouter.get('/list', listproperty);
propertyrouter.get('/featured', featuredproperty);
propertyrouter.post('/remove', removeproperty);
propertyrouter.post('/update', upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), updateproperty);
propertyrouter.get('/single/:id', singleproperty);

export default propertyrouter;