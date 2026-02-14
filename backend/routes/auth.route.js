import express from "express"
import { changePasswordController, editAddressController, editProfileController, getUserController, loginController, logoutController, resendOtpController, signupController, verifyOtpController } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const authRouter = express.Router();

authRouter.post('/login',loginController);
authRouter.post('/logout',logoutController);
authRouter.post('/signup',signupController);
authRouter.post('/verify-otp',verifyOtpController);
authRouter.post('/resend-otp',resendOtpController);
authRouter.post('/change-password',changePasswordController);
authRouter.get('/getuser',protectedRoute,getUserController);
authRouter.put('/edit-profile',protectedRoute,editProfileController);
authRouter.put('/edit-address',protectedRoute,editAddressController);


export default authRouter;