import express from "express";
import {
  adminAddUpdateBlogController,
  adminGetAllBlogsController,
  adminGetABlogController,
  adminDeleteBlogController,
} from "../controller/admin.blog.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";
import upload from "../libs/multer.js";

const adminBlogRouter = express.Router();

adminBlogRouter.post("/addupdateblog", adminProtectedRoute, upload.array("blog_images", 6), adminAddUpdateBlogController);
adminBlogRouter.get("/getblogs", adminProtectedRoute, adminGetAllBlogsController);
adminBlogRouter.get("/getablog/:id", adminProtectedRoute, adminGetABlogController);
adminBlogRouter.delete("/deleteblog/:id", adminProtectedRoute, adminDeleteBlogController);

export default adminBlogRouter;
