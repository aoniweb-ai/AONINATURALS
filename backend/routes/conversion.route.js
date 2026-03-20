import express from "express"
const conversionRouter = express.Router();
import {sendConversion} from "../controller/conversion.controller.js"

conversionRouter.post('/meta-conversion', sendConversion);

export default conversionRouter;
