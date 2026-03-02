import express from "express";
import {
  getPublishedBlogsController,
  getPublishedBlogController,
} from "../controller/blog.controller.js";

const blogRouter = express.Router();

blogRouter.get("/blogs", getPublishedBlogsController);
blogRouter.get("/blog/:identifier", getPublishedBlogController);

export default blogRouter;
