import { useEffect, useState } from "react";
import {
  FileText,
  Calendar,
  Tag,
  ArrowRight,
  RefreshCcw,
  Image as ImageIcon,
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { formatDateTime } from "../../../utils/formatDateTime";
import { motion as Motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Footer from "../components/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const UserBlogs = () => {
  const { userGetBlogs, blogs } = useUserBear((state) => state);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    userGetBlogs();
  }, [userGetBlogs]);

  const refreshBlogs = async () => {
    try {
      setLoader(true);
      await userGetBlogs();
    } catch (error) {
      toast.error(error || "Failed to load blogs");
    } finally {
      setLoader(false);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getReadingTime = (html) => {
    const text = stripHtml(html);
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  return (
    <section className="bg-[#f8f9fa] min-h-screen font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
              Our Blog
            </h1>
            <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed font-medium">
              Tips, secrets and stories about natural hair & skin care. Stay
              informed, stay natural.
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshBlogs}
              className="bg-white border border-gray-200 p-3 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-gray-600"
              title="Refresh"
            >
              <RefreshCcw
                size={20}
                className={loader ? "animate-spin text-primary" : ""}
              />
            </Motion.button>
          </Motion.div>
        </div>

        {/* BLOGS GRID */}
        <AnimatePresence mode="wait">
          {loader && (!blogs || blogs.length === 0) ? (
            <Motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BlogSkeletonGrid />
            </Motion.div>
          ) : !blogs || blogs.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <Motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {blogs.map((blog, index) => (
                <Motion.article
                  key={blog._id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => navigate(`/blogs/${blog.slug || blog._id}`)}
                  className="group bg-white rounded-4xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    {blog.cover_image?.secure_url ? (
                      <Motion.img
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        src={getCloudinaryImage(blog.cover_image.secure_url, {
                          width: 600,
                          quality: 60,
                        })}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={40} className="text-gray-300" />
                      </div>
                    )}

                    {/* Reading time badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {getReadingTime(blog.content)} min read
                      </span>
                    </div>

                    {/* Featured badge for first post */}
                    {index === 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-black/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                          Latest
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Tags */}
                    {blog.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h2>

                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed flex-1 mb-4">
                      {stripHtml(blog.content)}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={12} />
                        {formatDateTime(blog.createdAt)}
                      </div>

                      <Motion.div
                        whileHover={{ x: 5 }}
                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300"
                      >
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </Motion.div>
                    </div>
                  </div>
                </Motion.article>
              ))}
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </section>
  );
};

const BlogSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="bg-white rounded-4xl border border-gray-100 overflow-hidden"
      >
        <div className="aspect-video bg-gray-100 animate-pulse" />
        <div className="p-6 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="h-6 bg-gray-100 rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-lg w-full animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-lg w-2/3 animate-pulse" />
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <FileText size={40} className="text-gray-300" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Blogs Yet</h3>
    <p className="text-gray-500 mb-6 max-w-sm">
      We're working on some great content. Check back soon!
    </p>
  </Motion.div>
);

export default UserBlogs;
