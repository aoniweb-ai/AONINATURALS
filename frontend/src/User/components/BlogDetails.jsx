import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Clock,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { formatDateTime } from "../../../utils/formatDateTime";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";

const BlogDetails = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { userGetABlog, blog } = useUserBear((state) => state);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        await userGetABlog(identifier);
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [identifier, userGetABlog]);

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

  const allImages = [];
  if (blog?.cover_image?.secure_url) allImages.push(blog.cover_image);
  if (blog?.images?.length > 0) allImages.push(...blog.images);

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const nextImage = () =>
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % allImages.length,
    }));
  const prevImage = () =>
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + allImages.length) % allImages.length,
    }));

  if (loading) {
    return (
      <section className="bg-[#f8f9fa] min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <BlogDetailsSkeleton />
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="bg-[#f8f9fa] min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Blog Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The blog you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/blogs")}
            className="btn bg-black text-white rounded-xl"
          >
            Back to Blogs
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <Motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Blogs
        </Motion.button>

        {/* Cover Image */}
        {blog.cover_image?.secure_url && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video rounded-4xl overflow-hidden mb-8 cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <img
              src={getCloudinaryImage(blog.cover_image.secure_url, {
                width: 1200,
                quality: 80,
              })}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </Motion.div>
        )}

        {/* Article Header */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDateTime(blog.createdAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              {getReadingTime(blog.content)} min read
            </div>
          </div>
        </Motion.div>

        {/* Gallery */}
        {allImages.length > 1 && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, index) => (
                <Motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openLightbox(index)}
                  className="shrink-0 w-28 h-28 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                >
                  <img
                    src={getCloudinaryImage(img.secure_url, {
                      width: 200,
                      quality: 50,
                    })}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        )}

        {/* Blog Content */}
        <Motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-4xl p-6 sm:p-10 border border-gray-100 shadow-sm mb-8"
        >
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-md
              prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-4
              prose-strong:text-gray-900
              prose-ul:text-gray-600 prose-ol:text-gray-600
              prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </Motion.article>

        {/* Share / Back */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between py-6"
        >
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            More Blogs
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              // optional: add toast
            }}
            className="btn btn-sm bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl border-none text-xs font-semibold"
          >
            Copy Link
          </button>
        </Motion.div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox.open && allImages.length > 0 && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-100 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
            >
              <X size={28} />
            </button>

            {/* Prev */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white/80 hover:text-white z-10"
              >
                <ChevronLeft size={36} />
              </button>
            )}

            {/* Image */}
            <Motion.img
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={getCloudinaryImage(
                allImages[lightbox.index].secure_url,
                { width: 1200, quality: 90 }
              )}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white/80 hover:text-white z-10"
              >
                <ChevronRight size={36} />
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 text-white/60 text-sm font-medium">
              {lightbox.index + 1} / {allImages.length}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </section>
  );
};

const BlogDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
    <div className="aspect-video bg-gray-200 rounded-4xl animate-pulse" />
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="h-10 bg-gray-200 rounded-xl w-3/4 animate-pulse" />
      <div className="h-5 bg-gray-200 rounded-lg w-1/3 animate-pulse" />
    </div>
    <div className="bg-white rounded-4xl p-10 space-y-4">
      {[100, 85, 92, 70, 95, 60].map((w, i) => (
        <div
          key={i}
          className="h-4 bg-gray-100 rounded-lg animate-pulse"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  </div>
);

export default BlogDetails;
