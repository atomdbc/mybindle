import { Router } from "express";
import { emailRegister, phoneRegister, resend_phone_2FA, verify_phone_login_2FA,
         auth_passport, passport_callback, resend_2FA, verify_2FA, login, updateProfile, forgetPassword, verifyForgetPassword, deleteUser} from '../controllers/user.js';

import dotenv  from 'dotenv';
import { authenticate } from "../middleWare/auth.js";
dotenv.config(); 



const user_router = Router();


user_router.post('/email-register', emailRegister);
user_router.post('/phone-register', phoneRegister);
user_router.delete('/delete-user',authenticate, deleteUser);
user_router.get('/resend-phone-otp', resend_phone_2FA);
user_router.post('/verify-phone', verify_phone_login_2FA);
user_router.get('/resend-email-otp', resend_2FA);
user_router.post('/verify-email-2fa', verify_2FA);
user_router.post('/login', login);
user_router.post('/update-profile/:user_id', authenticate, updateProfile);
user_router.post('/forget-password', forgetPassword);
user_router.post('/verify-forget-password', verifyForgetPassword);


/**====== Google login ===== */
user_router.get('/auth-google', auth_passport.authenticate("google", { scope: ["profile"] }));
user_router.get("/auth/google-redirect", auth_passport.authenticate("google", { failureRedirect: "/login" }), passport_callback);

user_router.get('/secrets', )
export default user_router;
