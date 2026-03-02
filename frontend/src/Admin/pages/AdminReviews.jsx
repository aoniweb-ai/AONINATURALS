import { useEffect, useState, useRef, useCallback } from "react";
import useAdminBear from "../../../store/admin.store";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  Package,
  X,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { timeAgo } from "../../../utils/timeAgo";
import toast from "react-hot-toast";
import { getSocket } from "../../../utils/socket";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

const AdminReviews = () => {
  const { adminGetReviews, adminDeleteReview } = useAdminBear((s) => s);

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [total, setTotal] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const observerRef = useRef(null);

  const fetchReviews = useCallback(
    async (pageNum, reset = false) => {
      try {
        setLoading(true);
        const data = await adminGetReviews({ page: pageNum, limit: 10 });
        if (reset) {
          setReviews(data.reviews);
        } else {
          setReviews((prev) => [...prev, ...data.reviews]);
        }
        setHasMore(data.pagination.hasMore);
        setTotal(data.totalReviews);
        setAvgRating(data.avgRating);
      } catch (err) {
        toast.error(err || "Failed to load reviews");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [adminGetReviews]
  );

  useEffect(() => {
    setPage(1);
    fetchReviews(1, true);
  }, [fetchReviews]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReviewCreated = (data) => {
      setReviews((prev) => {
        if (prev.some((r) => r._id === data.review._id)) return prev;
        return [data.review, ...prev];
      });
      setTotal((prev) => prev + 1);
    };

    const handleReviewUpdated = (data) => {
      setReviews((prev) =>
        prev.map((r) => (r._id === data.review._id ? { ...r, ...data.review } : r))
      );
    };

    const handleReviewDeleted = (data) => {
      setReviews((prev) => prev.filter((r) => r._id !== data.review_id));
      setTotal((prev) => Math.max(0, prev - 1));
    };

    const handleReviewReacted = (data) => {
      setReviews((prev) =>
        prev.map((r) =>
          r._id === data.review_id
            ? { ...r, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0) }
            : r
        )
      );
    };

    socket.on("review:created", handleReviewCreated);
    socket.on("review:updated", handleReviewUpdated);
    socket.on("review:deleted", handleReviewDeleted);
    socket.on("review:reacted", handleReviewReacted);

    return () => {
      socket.off("review:created", handleReviewCreated);
      socket.off("review:updated", handleReviewUpdated);
      socket.off("review:deleted", handleReviewDeleted);
      socket.off("review:reacted", handleReviewReacted);
    };
  }, []);

  const lastReviewRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchReviews(nextPage);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, page, fetchReviews]
  );

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review? This action cannot be undone.")) return;
    try {
      setDeletingId(reviewId);
      await adminDeleteReview(reviewId);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error(err || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const displayedReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(filter));

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (r) => reviews.filter((rv) => rv.rating === r).length
  );

  return (
    <section className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <Motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight"
          >
            Reviews
          </Motion.h1>
          <p className="text-gray-500 mt-1 font-medium">
            {total} review{total !== 1 ? "s" : ""} &middot;{" "}
            <span className="text-yellow-600 font-bold">{avgRating} ★ avg</span>
          </p>
        </div>

        {/* Stats Bar */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                filter === "all"
                  ? "bg-black text-white shadow-lg shadow-black/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <MessageSquare size={16} />
              All
            </button>
            {[5, 4, 3, 2, 1].map((star, idx) => (
              <button
                key={star}
                onClick={() => setFilter(filter === String(star) ? "all" : String(star))}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                  filter === String(star)
                    ? "bg-yellow-500 text-white shadow-lg shadow-yellow-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Star size={14} className={filter === String(star) ? "fill-white" : ""} />
                {star}
                {ratingCounts[idx] > 0 && (
                  <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                    {ratingCounts[idx]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Motion.div>

        {/* Skeleton initial */}
        {initialLoad ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded mt-3" />
                    <div className="h-3 w-3/4 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedReviews.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Star size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-400">No reviews found</h3>
          </Motion.div>
        ) : (
          <Motion.div
            key={filter}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {displayedReviews.map((review, index) => (
              <Motion.div
                key={review._id}
                variants={itemVariants}
                ref={index === displayedReviews.length - 1 ? lastReviewRef : null}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* User avatar */}
                  <div className="w-10 h-10 bg-linear-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {review.user?.fullname?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row: user + product + rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                      <h4 className="font-bold text-gray-900 truncate">
                        {review.user?.fullname || "Deleted user"}
                      </h4>
                      <span className="text-xs text-gray-400 font-medium hidden sm:inline">•</span>
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1 truncate">
                        <Package size={12} />
                        {review.product?.product_name || "Deleted product"}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                      <span className="ml-2 text-xs text-gray-400 font-medium">
                        {timeAgo(review.first_reviewed_at || review.createdAt)}
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {review.review_text}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <ThumbsUp size={12} /> {review.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <ThumbsDown size={12} /> {review.dislikes?.length || 0}
                      </span>
                      {review.edit_count > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                          <Pencil size={10} /> Edited {review.edit_count}x
                        </span>
                      )}
                      <span className="text-xs text-gray-300 font-medium hidden sm:inline">
                        {review.user?.email}
                      </span>
                    </div>
                  </div>

                  {/* Product thumbnail + delete */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {review.product?.product_images?.[0] && (
                      <img
                        src={getCloudinaryImage(review.product?.product_images[0].secure_url, 80, 80)}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                      />
                    )}
                    <Motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(review._id)}
                      disabled={deletingId === review._id}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </Motion.button>
                  </div>
                </div>
              </Motion.div>
            ))}

            {/* Loading more */}
            {loading && !initialLoad && (
              <div className="flex justify-center py-6">
                <span className="loading loading-spinner loading-md text-gray-400" />
              </div>
            )}
          </Motion.div>
        )}
      </div>
    </section>
  );
};

export default AdminReviews;
