import express from 'express';
<<<<<<< HEAD
import { login, register, forgotpassword, adminlogin, resetpassword, getname, verifyEmail, changeAdminPassword, changeUserPassword } from '../controller/userController.js';
import authMiddleware, { adminProtect } from '../middleware/authMiddleware.js';
import { registrationLimiter, loginLimiter, passwordResetLimiter } from '../middleware/rateLimitMiddleware.js';


const userrouter = express.Router();

userrouter.post('/login', loginLimiter, login);
userrouter.post('/register', registrationLimiter, register);
userrouter.get('/verify/:token', verifyEmail);  // Email verification endpoint
userrouter.post('/forgot', passwordResetLimiter, forgotpassword);
userrouter.post('/reset/:token', resetpassword);
userrouter.post('/change-password', authMiddleware, changeUserPassword);
userrouter.post('/admin', loginLimiter, adminlogin);
userrouter.post('/admin/change-password', adminProtect, changeAdminPassword);
userrouter.get('/me', authMiddleware, getname);
=======
import { adminlogin } from '../controller/userController.js';
import { loginLimiter } from '../middleware/rateLimitMiddleware.js';

const userrouter = express.Router();

userrouter.post('/admin', loginLimiter, adminlogin);
>>>>>>> cdcc8922699eb172cb6edc752368d69c74a7e8a0

export default userrouter;