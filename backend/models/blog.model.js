import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 300,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    cover_image: {
      secure_url: String,
      public_id: String,
    },
    images: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    tags: [String],
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 100)
      + "-" + Date.now().toString(36);
  }
});

export default mongoose.model("Blog", blogSchema);
