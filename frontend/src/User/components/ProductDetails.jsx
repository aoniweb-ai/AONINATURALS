import { useEffect, useState, useCallback, useRef } from "react";
import {
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Leaf,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Star,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Info,
  Send,
  MessageSquare,
  Trash2,
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsSkeleton from "./Skeleton/ProductDetailsSkeleton";
import toast from "react-hot-toast";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { sendMetaConversion } from "../../utils/sendMetaConversion";
import { motion, AnimatePresence } from "framer-motion";
import { timeAgo } from "../../../utils/timeAgo";
import { getSocket } from "../../../utils/socket";

const ProductDetails = () => {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImg, setSelectedImg] = useState(0);
  const [loader, setLoader] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const reviewsEndRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    userGetaProduct, userAddToCart, product, setProduct, user, cod_charges,
    addOrUpdateReview, getProductReviews, getMyReview, toggleLikeReview, toggleDislikeReview, deleteReview,
  } = useUserBear((state) => state);

  useEffect(() => {
    setProduct(null);
    userGetaProduct(id).catch((err) => toast.error(err));
  }, [id, userGetaProduct, setProduct]);

  useEffect(() => {
    if (user && id) {
      sendMetaConversion({
        event_name: "ViewContent",
        user_data: {
          em: user?.email,
          ph: user?.phone,
          fn: user?.fullname,
        },
        custom_data: {
          product_id: id,
        },
      }).catch(() => {});
    }
  }, [user, id]);

  const fetchReviews = useCallback(async (page = 1, append = false) => {
    try {
      setReviewLoading(true);
      const data = await getProductReviews(id, page, 5);
      setReviews((prev) => append ? [...prev, ...data.reviews] : data.reviews);
      setAvgRating(data.avgRating);
      setTotalReviews(data.totalReviews);
      setHasMoreReviews(data.pagination.hasMore);
      setReviewPage(page);
    }finally {
      setReviewLoading(false);
    }
  }, [id, getProductReviews]);

  const fetchMyReview = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getMyReview(id);
      setMyReview(data.review);
      setCanReview(data.canReview);
      if (data.review) {
        setReviewForm({ rating: data.review.rating, review_text: data.review.review_text });
      }
    } catch {}
  }, [id, user, getMyReview]);

  useEffect(() => {
    if (id) {
      fetchReviews(1);
      fetchMyReview();
    }
  }, [id, fetchReviews, fetchMyReview]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReviewCreated = (data) => {
      if (data.product_id !== id) return;
      setReviews((prev) => {
        if (prev.some((r) => r._id === data.review._id)) return prev;
        return [data.review, ...prev];
      });
      setTotalReviews((prev) => prev + 1);
      setAvgRating((prev) => {
        const newTotal = totalReviews + 1;
        return Math.round(((prev * totalReviews + data.review.rating) / newTotal) * 10) / 10;
      });
    };

    const handleReviewUpdated = (data) => {
      if (data.product_id !== id) return;
      setReviews((prev) =>
        prev.map((r) => (r._id === data.review._id ? { ...r, ...data.review } : r))
      );
    };

    const handleReviewReacted = (data) => {
      if (data.product_id !== id) return;
      setReviews((prev) =>
        prev.map((r) =>
          r._id === data.review_id
            ? { ...r, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0) }
            : r
        )
      );
    };

    const handleReviewDeleted = (data) => {
      if (data.product_id !== id) return;
      setReviews((prev) => prev.filter((r) => r._id !== data.review_id));
      setTotalReviews((prev) => Math.max(0, prev - 1));
    };

    socket.on("review:created", handleReviewCreated);
    socket.on("review:updated", handleReviewUpdated);
    socket.on("review:reacted", handleReviewReacted);
    socket.on("review:deleted", handleReviewDeleted);

    const handleOrderStatusUpdated = ({ order, userId }) => {
      const currentUser = useUserBear.getState().user;
      if (!currentUser || currentUser._id !== userId) return;
      if (order.status === "delivered") {
        const hasProduct = order.product?.some((item) => {
          const pid = item.product?._id || item.product;
          return pid?.toString() === id || pid === id;
        });
        if (hasProduct) setCanReview(true);
      }
    };
    socket.on("order:statusUpdated", handleOrderStatusUpdated);

    return () => {
      socket.off("review:created", handleReviewCreated);
      socket.off("review:updated", handleReviewUpdated);
      socket.off("review:reacted", handleReviewReacted);
      socket.off("review:deleted", handleReviewDeleted);
      socket.off("order:statusUpdated", handleOrderStatusUpdated);
    };
  }, [id, totalReviews]);

  const handleReviewSubmit = async () => {
    if (!reviewForm.review_text.trim()) {
      return toast.error("Please write a review");
    }
    try {
      setReviewSubmitting(true);
      const data = await addOrUpdateReview({
        product_id: id,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text,
      });
      toast.success(data.message);
      setEditMode(false);
      setMyReview(data.review);
      fetchReviews(1);
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleLike = async (reviewId, index) => {
    if (!user) return toast("Login to like reviews", { icon: "ℹ️" });
    try {
      const data = await toggleLikeReview(reviewId);
      setReviews((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0), _userLiked: data.userLiked, _userDisliked: data.userDisliked } : r
        )
      );
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  const handleDislike = async (reviewId, index) => {
    if (!user) return toast("Login to dislike reviews", { icon: "ℹ️" });
    try {
      const data = await toggleDislikeReview(reviewId);
      setReviews((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0), _userLiked: data.userLiked, _userDisliked: data.userDisliked } : r
        )
      );
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  const handleDeleteReview = async () => {
    if (!myReview) return;
    try {
      await deleteReview(myReview._id);
      toast.success("Review deleted");
      setMyReview(null);
      setEditMode(false);
      setReviewForm({ rating: 5, review_text: "" });
      fetchReviews(1, false);
    } catch (err) {
      toast.error(err || "Failed to delete review");
    }
  };

  const loadMoreReviews = () => {
    fetchReviews(reviewPage + 1, true);
  };

  const addToCartProduct = async () => {
    if(!user){
      toast("Create an account or login to add cart",{icon: 'ℹ️'});
      return navigate("/login");
    }
    try {
      setLoader(true);
      await userAddToCart({
        id,
        quantity: qty,
      });
      toast.success("Added to your bag! 🛍️");
      try {
        await sendMetaConversion({
          event_name: "AddToCart",
          user_data: {
            em: user?.email,
            ph: user?.phone,
            fn: user?.fullname,
          },
          custom_data: {
            product_id: id,
          },
        });
      } catch {}
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setLoader(false);
    }
  };


  if (!product) return <ProductDetailsSkeleton />;

  const tabs = [
    { key: "description", label: "Description", content: product.description },
    { key: "ingredients", label: "Ingredients", content: product.ingredients },
    { key: "how", label: "How to Use", content: product.how_to_use },
    { key: "benefits", label: "Benefits", content: product.benefits },
    { key: "recommended", label: "Recommended", content: product.recommended },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#fcfcfc] min-h-screen pb-20 font-sans w-full"
    >
      {/* --- TOP NAVIGATION --- */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 font-bold text-gray-700 hover:text-black transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- LEFT: IMAGE GALLERY (STICKY) --- */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImg}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={getCloudinaryImage(
                    product.product_images?.[selectedImg]?.secure_url,
                    { width: 1200, quality: 100 }
                  )}
                  alt={product.product_name}
                  className="w-full h-full object-contain p-8"
                />
              </AnimatePresence>

              {/* Discount Tag */}
              {product?.discount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-6 left-6 bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-lg flex items-center gap-1"
                >
                  <Zap size={12} className="text-yellow-400 fill-yellow-400"/>
                  {product.discount}%{product?.extra_discount && ' + '+product.extra_discount+'%'} OFF
                </motion.div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-3 overflow-x-auto py-2 no-scrollbar justify-center"
            >
              {product.product_images?.map((img, idx) => (
                <motion.button
                  variants={itemVariants}
                  key={img.public_id}
                  onClick={() => setSelectedImg(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImg === idx
                      ? "border-black shadow-lg"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getCloudinaryImage(img.secure_url, { width: 200, quality: 20 })}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                  {selectedImg === idx && (
                    <motion.div 
                      layoutId="active-ring"
                      className="absolute inset-0 border-2 border-black rounded-2xl"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* --- RIGHT: PRODUCT CONTENT --- */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-linear-to-r from-primary/10 to-primary/5 text-primary text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest border border-primary/10">
                  Best Seller
                </span>
                <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                  <Clock size={12} /> Fast Moving
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                {product.product_name}
              </h1>
              {totalReviews > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{avgRating}</span>
                  <span className="text-sm font-medium text-gray-400">({totalReviews} {totalReviews === 1 ? "review" : "reviews"})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <span className="text-sm font-medium text-gray-400">Be the first to review</span>
                </div>
              )}
            </motion.div>

            {/* Price & Offers */}
            <motion.div variants={itemVariants} className="p-8 rounded-4xl bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] space-y-6 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -z-10" />

              <div className="flex items-end gap-4">
                <span className="text-5xl font-black text-black tracking-tighter">
                  ₹{Math.round(product.final_price)}
                </span>
                {(product.discount > 0 || product.extra_discount > 0) && (
                  <div className="flex flex-col mb-1.5">
                    <span className="text-lg text-gray-400 font-bold line-through decoration-2 decoration-red-300">
                      ₹{product.price}
                    </span>
                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                      Save ₹{product.price - product.final_price}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-gray-50 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-bold">
                  <Info size={18} className="text-emerald-500 fill-emerald-50" />
                  {product?.stock} {' '} Units Available
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
                  Inclusive of all taxes 
                </div>
                {product.cod_charges > 0 && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
                    Cash on Delivery available (₹{cod_charges})
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cart Actions */}
            <motion.div variants={itemVariants} className="space-y-4">
              {product.stock > 0 && !product.sold ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-2xl w-full sm:w-40 shadow-sm">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                      onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    >
                      <Minus size={20} strokeWidth={2.5} />
                    </motion.button>
                    <span className="font-black text-xl tabular-nums">{qty}</span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                      onClick={() => product.stock > qty && setQty(qty + 1)}
                    >
                      <Plus size={20} strokeWidth={2.5} />
                    </motion.button>
                  </div>

                  {/* Add To Cart Button */}
                  <motion.button
                    onClick={addToCartProduct}
                    disabled={loader}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-black text-white py-5 rounded-2xl text-lg font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl relative overflow-hidden"
                  >
                    {loader ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : (
                      <>
                        <ShoppingCart size={22} strokeWidth={2.5} />
                        Add to Cart
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="w-full bg-red-50 text-red-600 py-6 rounded-2xl text-center font-black text-xl border border-red-100 flex items-center justify-center gap-2">
                  <ShieldCheck size={24}/> Out of Stock
                </div>
              )}
            </motion.div>

            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-3 gap-6 py-4"
            >
              {[
                { icon: <Truck />, label: "Express Shipping", color: "blue" },
                { icon: <Leaf />, label: "100% Organic", color: "emerald" },
                { icon: <ShieldCheck />, label: "Secure Payment", color: "amber" },
              ].map((badge, i) => (
                <motion.div variants={itemVariants} key={i} className="flex flex-col items-center gap-3 group p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-50">
                  <div className={`text-${badge.color}-600 bg-${badge.color}-50 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {badge.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* --- ANIMATED TABS SECTION --- */}
      <div className="mt-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-20">
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-16 border-b border-gray-100 pb-2 relative">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-colors z-10 ${
                   activeTab === tab.key ? "text-black" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.span 
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-t-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-75"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-8 capitalize tracking-tight">
                {activeTab.replace("_", " ")}
              </h2>
              <div className="text-gray-600 text-lg md:text-xl leading-[1.8] space-y-6 whitespace-pre-wrap font-medium">
                {tabs.find((t) => t.key === activeTab)?.content || (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                      <Zap size={40} className="mb-4"/>
                      <p className="italic">Detailed information coming soon.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="bg-[#fcfcfc] border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-20">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
              Customer Feedback
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
              Reviews
            </h2>

            {/* Average Rating */}
            {totalReviews > 0 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={22}
                      className={i <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                    />
                  ))}
                </div>
                <span className="text-2xl font-black text-gray-900">{avgRating}</span>
                <span className="text-sm font-medium text-gray-400">
                  ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </motion.div>

          {/* Write / Edit Review Form */}
          {user && canReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              {myReview && !editMode ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-gray-900">Your Review</h3>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
                      >
                        <Pencil size={14} /> Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete your review?")) {
                            handleDeleteReview();
                          }
                        }}
                        className="flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i <= myReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{myReview.review_text}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-gray-400 font-medium">
                    <span>{timeAgo(myReview.first_reviewed_at || myReview.createdAt)}</span>
                    {myReview.edit_count > 0 && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                        Edited {myReview.edit_count} {myReview.edit_count === 1 ? "time" : "times"} • {timeAgo(myReview.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (myReview && editMode) || !myReview ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.06)]">
                  <h3 className="text-lg font-black text-gray-900 mb-6">
                    {myReview ? "Edit Your Review" : "Write a Review"}
                  </h3>

                  {/* Star Rating Selector */}
                  <div className="flex items-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(i)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: i }))}
                        className="focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={
                            i <= (hoverRating || reviewForm.rating)
                              ? "text-yellow-400 fill-yellow-400 transition-colors"
                              : "text-gray-200 transition-colors"
                          }
                        />
                      </motion.button>
                    ))}
                    <span className="ml-3 text-sm font-bold text-gray-500">
                      {reviewForm.rating}/5
                    </span>
                  </div>

                  {/* Review Text */}
                  <textarea
                    value={reviewForm.review_text}
                    onChange={(e) =>
                      setReviewForm((prev) => ({ ...prev, review_text: e.target.value }))
                    }
                    placeholder="Share your experience with this product..."
                    maxLength={1000}
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none transition-all"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {reviewForm.review_text.length}/1000
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReviewSubmit}
                      disabled={reviewSubmitting}
                      className="bg-black text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-lg"
                    >
                      {reviewSubmitting ? (
                        <span className="loading loading-dots loading-sm"></span>
                      ) : (
                        <>
                          <Send size={16} />
                          {myReview ? "Update Review" : "Submit Review"}
                        </>
                      )}
                    </motion.button>
                    {editMode && (
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setReviewForm({ rating: myReview.rating, review_text: myReview.review_text });
                        }}
                        className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-4 py-3"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* Not eligible notice */}
          {user && !canReview && (
            <div className="text-center mb-12 text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
              <ShieldCheck size={16} />
              You can review this product after it is purchased by you
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl border border-gray-100 p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-sm uppercase">
                        {review.user?.fullname?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{review.user?.fullname || "User"}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {timeAgo(review.first_reviewed_at || review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Edit count badge */}
                    {review.edit_count > 0 && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                        Edited {review.edit_count}x
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap mb-4">
                    {review.review_text}
                  </p>

                  {/* Like / Dislike */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleLike(review._id, index)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                        review._userLiked || (user && review.likes?.some?.((l) => l === user._id || l._id === user._id))
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <ThumbsUp size={14} />
                      {review.likes?.length || 0}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleDislike(review._id, index)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                        review._userDisliked || (user && review.dislikes?.some?.((d) => d === user._id || d._id === user._id))
                          ? "bg-red-50 text-red-500"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <ThumbsDown size={14} />
                      {review.dislikes?.length || 0}
                    </motion.button>
                  </div>
                </motion.div>
              ))}

              {/* Load More */}
              {hasMoreReviews && (
                <div className="text-center pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMoreReviews}
                    disabled={reviewLoading}
                    className="bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                  >
                    {reviewLoading ? (
                      <span className="loading loading-dots loading-sm"></span>
                    ) : (
                      "Load More Reviews"
                    )}
                  </motion.button>
                </div>
              )}
              <div ref={reviewsEndRef} />
            </div>
          ) : (
            !reviewLoading && (
              <div className="text-center py-16">
                <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-400">No reviews yet</h3>
                <p className="text-sm text-gray-300 mt-1">Be the first to share your experience!</p>
              </div>
            )
          )}

          {/* Loading skeleton for first load */}
          {reviewLoading && reviews.length === 0 && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-7 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="w-24 h-3 bg-gray-200 rounded" />
                      <div className="w-16 h-2 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-gray-100 rounded" />
                    <div className="w-3/4 h-3 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default ProductDetails;