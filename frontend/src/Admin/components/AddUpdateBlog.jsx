import { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import useAdminBear from "../../../store/admin.store";
import toast from "react-hot-toast";
import {
  X,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
  FileText,
  Tag,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", duration: 0.5, bounce: 0.3 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

const AddUpdateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [published, setPublished] = useState(true);
  const [loader, setLoader] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const { adminBlog_addUpdate, editBlog, setEditBlog } = useAdminBear(
    (state) => state
  );
  const modalCheckboxRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editBlog) {
      setTitle(editBlog.title || "");
      setContent(editBlog.content || "");
      setTags(editBlog.tags || []);
      setPublished(editBlog.published ?? true);

      const imgs = [];
      if (editBlog.cover_image?.secure_url) imgs.push(editBlog.cover_image);
      if (editBlog.images?.length > 0) imgs.push(...editBlog.images);
      setExistingImages(imgs);
    } else {
      resetForm();
    }
  }, [editBlog]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setPublished(true);
    setExistingImages([]);
    setNewImages([]);
    setNewPreviews([]);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const totalImages = existingImages.length + newImages.length + files.length;
      if (totalImages > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }
      setNewImages((prev) => [...prev, ...files]);
      const urls = files.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...urls]);
    }
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    const editorContent = editorRef.current?.getContent() || content;

    if (!title.trim()) return toast.error("Title is required");
    if (!editorContent.trim()) return toast.error("Blog content is required");
    if (existingImages.length === 0 && newImages.length === 0) {
      return toast.error("At least 1 image (cover) is required");
    }

    setLoader(true);
    try {
      const formData = new FormData();
      if (editBlog?._id) formData.append("blog_id", editBlog._id);
      formData.append("title", title);
      formData.append("content", editorContent);
      formData.append("tags", JSON.stringify(tags));
      formData.append("published", published);

      newImages.forEach((file) => {
        formData.append("blog_images", file);
      });

      await adminBlog_addUpdate(formData);
      toast.success(editBlog ? "Blog updated!" : "Blog created!");

      resetForm();
      setEditBlog(null);
      if (modalCheckboxRef.current) modalCheckboxRef.current.checked = false;
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setEditBlog(null);
    if (modalCheckboxRef.current) modalCheckboxRef.current.checked = false;
  };

  return (
    <>
      <input
        type="checkbox"
        id="blog-modal"
        className="modal-toggle"
        ref={modalCheckboxRef}
      />
      <div className="modal modal-bottom sm:modal-middle z-50">
        <AnimatePresence mode="wait">
          <Motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="modal-box max-w-5xl w-full max-h-[92vh] overflow-y-auto bg-white p-0"
          >
            {/* HEADER */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-black text-white rounded-xl">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editBlog ? "Edit Blog" : "Create New Blog"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Write and publish your blog post
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText size={16} /> Blog Title
                </label>
                <input
                  type="text"
                  placeholder="Enter blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black transition-all outline-none"
                />
              </div>

              {/* TINYMCE EDITOR */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText size={16} /> Content
                </label>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    initialValue={content}
                    init={{
                      height: 400,
                      menubar: true,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | link image | preview fullscreen",
                      content_style:
                        "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; padding: 12px; }",
                      branding: false,
                      promotion: false,
                    }}
                  />
                </div>
              </div>

              {/* IMAGES */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ImageIcon size={16} /> Images
                  <span className="text-xs text-slate-400 font-normal">
                    (First image = Cover, max 6)
                  </span>
                </label>

                <div className="flex flex-wrap gap-3">
                  {/* Existing images */}
                  {existingImages.map((img, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200"
                    >
                      <img
                        src={img.secure_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}

                  {/* New image previews */}
                  {newPreviews.map((url, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/30"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {existingImages.length === 0 && index === 0 && (
                        <span className="absolute top-1 left-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  {existingImages.length + newImages.length < 6 && (
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                      <UploadCloud size={20} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400 mt-1">
                        Upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* TAGS */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Tag size={16} /> Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn btn-sm btn-ghost bg-gray-100 rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* PUBLISHED TOGGLE */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  {published ? (
                    <Eye size={20} className="text-green-600" />
                  ) : (
                    <EyeOff size={20} className="text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {published ? "Published" : "Draft"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {published
                        ? "Blog is visible to everyone"
                        : "Blog is saved as draft"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-success"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="btn btn-ghost rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loader}
                className="btn bg-black text-white hover:bg-gray-800 rounded-xl min-w-35"
              >
                {loader ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : editBlog ? (
                  "Update Blog"
                ) : (
                  "Publish Blog"
                )}
              </button>
            </div>
          </Motion.div>
        </AnimatePresence>
        <label className="modal-backdrop" htmlFor="blog-modal">
          Close
        </label>
      </div>
    </>
  );
};

export default AddUpdateBlog;
