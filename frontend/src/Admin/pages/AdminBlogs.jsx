import { useEffect, useState } from "react";
import {
  Plus,
  FileText,
  Search,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import AddUpdateBlog from "../components/AddUpdateBlog";
import useAdminBear from "../../../store/admin.store";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { formatDateTime } from "../../../utils/formatDateTime";
import { motion as Motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const AdminBlogs = () => {
  const { adminGetBlogs, blogs, setEditBlog, adminDeleteBlog } = useAdminBear(
    (state) => state
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoader, setDeleteLoader] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);

  useEffect(() => {
    adminGetBlogs();
  }, [adminGetBlogs]);

  const filteredBlogs = blogs?.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setDeleteLoader(id);
    try {
      await adminDeleteBlog(id);
      toast.success("Blog deleted!");
    } catch (error) {
      toast.error(error || "Delete failed");
    } finally {
      setDeleteLoader(null);
    }
  };

  const handleEdit = (blog) => {
    setEditBlog(blog);
    const checkbox = document.getElementById("blog-modal");
    if (checkbox) checkbox.checked = true;
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Motion.div
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 flex flex-col gap-8 bg-[#f8f9fa] min-h-screen font-sans"
    >
      {/* HEADER */}
      <Motion.div
        variants={pageVariants}
        className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-6 rounded-4xl shadow-sm border border-gray-100"
      >
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="p-3 bg-black text-white rounded-xl shadow-lg shadow-black/20">
              <FileText size={24} />
            </div>
            Blog Manager
          </h2>
          <p className="text-slate-500 font-medium ml-15 -mt-1 text-sm">
            Create, edit and manage your blog posts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          {/* Search */}
          <div className="relative group w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black transition-all outline-none"
            />
          </div>

          {/* Add Blog Button */}
          <Motion.label
            htmlFor="blog-modal"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditBlog(null)}
            className="btn bg-black text-white hover:bg-gray-800 border-none gap-2 rounded-xl shadow-lg shadow-black/20 font-bold cursor-pointer"
          >
            <Plus size={18} />
            New Blog
          </Motion.label>
        </div>
      </Motion.div>

      {/* STATS */}
      <Motion.div
        variants={pageVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Total Blogs
          </p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {blogs?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Published
          </p>
          <p className="text-3xl font-black text-green-600 mt-1">
            {blogs?.filter((b) => b.published).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Drafts
          </p>
          <p className="text-3xl font-black text-amber-500 mt-1">
            {blogs?.filter((b) => !b.published).length || 0}
          </p>
        </div>
      </Motion.div>

      {/* BLOG CARDS */}
      {!filteredBlogs || filteredBlogs.length === 0 ? (
        <Motion.div
          variants={pageVariants}
          className="flex flex-col items-center justify-center py-20 bg-white rounded-4xl border border-gray-100"
        >
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No blogs yet</h3>
          <p className="text-sm text-slate-400 mt-1">
            Create your first blog post to get started!
          </p>
        </Motion.div>
      ) : (
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredBlogs.map((blog) => (
              <Motion.div
                key={blog._id}
                variants={cardVariants}
                layout
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {blog.cover_image?.secure_url ? (
                    <img
                      src={getCloudinaryImage(blog.cover_image.secure_url, {
                        width: 600,
                        quality: 60,
                      })}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={40} className="text-gray-300" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
                        blog.published
                          ? "bg-green-500/90 text-white"
                          : "bg-amber-500/90 text-white"
                      }`}
                    >
                      {blog.published ? (
                        <Eye size={12} />
                      ) : (
                        <EyeOff size={12} />
                      )}
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Gallery count */}
                  {blog.images?.length > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-black/60 text-white backdrop-blur-md">
                        <ImageIcon size={12} />
                        {1 + blog.images.length} photos
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {stripHtml(blog.content)}
                  </p>

                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-500 bg-gray-100 px-2 py-1 rounded-full"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-medium px-2 py-1">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar size={12} />
                    {formatDateTime(blog.createdAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setExpandedBlog(expandedBlog === blog._id ? null : blog._id)}
                      className="btn btn-sm btn-ghost flex-1 rounded-xl text-xs font-semibold gap-1.5"
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="btn btn-sm btn-ghost flex-1 rounded-xl text-xs font-semibold gap-1.5"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      disabled={deleteLoader === blog._id}
                      className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 rounded-xl text-xs font-semibold gap-1.5"
                    >
                      {deleteLoader === blog._id ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Preview */}
                <AnimatePresence>
                  {expandedBlog === blog._id && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      <div className="p-5 space-y-4">
                        {/* All images gallery */}
                        {(blog.cover_image?.secure_url ||
                          blog.images?.length > 0) && (
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {blog.cover_image?.secure_url && (
                              <img
                                src={getCloudinaryImage(
                                  blog.cover_image.secure_url,
                                  { width: 200, quality: 50 }
                                )}
                                alt="cover"
                                className="w-20 h-20 rounded-lg object-cover shrink-0 ring-2 ring-primary"
                              />
                            )}
                            {blog.images?.map((img, idx) => (
                              <img
                                key={idx}
                                src={getCloudinaryImage(img.secure_url, {
                                  width: 200,
                                  quality: 50,
                                })}
                                alt=""
                                className="w-20 h-20 rounded-lg object-cover shrink-0"
                              />
                            ))}
                          </div>
                        )}

                        {/* Content preview */}
                        <div
                          className="prose prose-sm max-w-none text-slate-600 max-h-60 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </Motion.div>
            ))}
          </AnimatePresence>
        </Motion.div>
      )}

      {/* ADD/UPDATE BLOG MODAL */}
      <AddUpdateBlog />
    </Motion.div>
  );
};

export default AdminBlogs;
