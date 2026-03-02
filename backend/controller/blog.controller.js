import Blog from "../models/blog.model.js";

export const getPublishedBlogsController = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .select("title slug cover_image tags createdAt content")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.log("error while getting published blogs ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPublishedBlogController = async (req, res) => {
  const { identifier } = req.params;
  try {
    let blog = await Blog.findOne({ slug: identifier, published: true });
    if (!blog) {
      blog = await Blog.findOne({ _id: identifier, published: true });
    }
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.log("error while getting a blog ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
