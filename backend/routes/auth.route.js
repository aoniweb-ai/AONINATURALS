import express from "express"
import { getUserController, loginController, logoutController, signupController } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const authRouter = express.Router();

authRouter.post('/login',loginController);
authRouter.post('/logout',logoutController);
authRouter.post('/signup',signupController);
authRouter.get('/getuser',protectedRoute,getUserController);


export default authRouter;