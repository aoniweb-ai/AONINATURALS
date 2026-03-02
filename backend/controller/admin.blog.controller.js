import Blog from "../models/blog.model.js";
import { uploadToCloudinary, deleteCloudinaryImages } from "../libs/cloudinary.js";
import { getIO } from "../libs/socket.js";

export const adminAddUpdateBlogController = async (req, res) => {
  const admin = req.admin;
  const { blog_id, title, content, tags, published } = req.body;

  try {
    const existingBlog = blog_id ? await Blog.findById(blog_id) : null;
    const images = [];

    if (req.files && req.files.length > 0) {
      if (existingBlog) {
        const oldIds = [];
        if (existingBlog.cover_image?.public_id) oldIds.push(existingBlog.cover_image.public_id);
        existingBlog.images?.forEach((img) => {
          if (img.public_id) oldIds.push(img.public_id);
        });
        if (oldIds.length > 0) deleteCloudinaryImages(oldIds);
      }

      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "blogs");
        images.push({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const parsedTags = tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : [];

    if (existingBlog) {
      existingBlog.title = title;
      existingBlog.content = content;
      existingBlog.tags = parsedTags;
      existingBlog.published = published === "true" || published === true;

      if (images.length > 0) {
        existingBlog.cover_image = images[0];
        existingBlog.images = images.slice(1);
      }

      const blog = await existingBlog.save();
      if (!blog) return res.status(500).json({ message: "Internal server error" });
      if (blog.published) getIO().emit("blog:updated", blog);
      return res.status(200).json({ message: "Blog updated successfully", edit: true, blog });
    }

    const blog = new Blog({
      owner: admin._id,
      title,
      content,
      tags: parsedTags,
      published: published === "true" || published === true,
      cover_image: images.length > 0 ? images[0] : null,
      images: images.slice(1),
    });

    await blog.save();
    if (blog.published) getIO().emit("blog:created", blog);
    return res.status(200).json({ message: "Blog created successfully", edit: false, blog });
  } catch (error) {
    console.log("error while creating/updating blog ", error);
    return res.status(500).json({ success: false, message: "Blog operation error" });
  }
};

export const adminGetAllBlogsController = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    if (!blogs) return res.status(500).json({ message: "Internal server error" });
    return res.status(200).json({ message: "success", blogs });
  } catch (error) {
    console.log("error while getting blogs ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminGetABlogController = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    return res.status(200).json({ message: "success", blog });
  } catch (error) {
    console.log("error while getting a blog ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminDeleteBlogController = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const publicIds = [];
    if (blog.cover_image?.public_id) publicIds.push(blog.cover_image.public_id);
    blog.images?.forEach((img) => {
      if (img.public_id) publicIds.push(img.public_id);
    });
    if (publicIds.length > 0) deleteCloudinaryImages(publicIds);

    await Blog.findByIdAndDelete(id);
    getIO().emit("blog:deleted", id);
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log("error while deleting blog ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
