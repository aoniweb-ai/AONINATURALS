import express from "express"
import { editAddressController, editProfileController, getUserController, loginController, logoutController, signupController } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const authRouter = express.Router();

authRouter.post('/login',loginController);
authRouter.post('/logout',logoutController);
authRouter.post('/signup',signupController);
authRouter.get('/getuser',protectedRoute,getUserController);
authRouter.put('/edit-profile',protectedRoute,editProfileController);
authRouter.put('/edit-address',protectedRoute,editAddressController);


export default authRouter;