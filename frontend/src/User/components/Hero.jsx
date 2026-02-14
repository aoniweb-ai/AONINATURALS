import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, wrap } from "framer-motion";
import hero_1 from "../../assets/hero_1.png";
import hero_2 from "../../assets/hero_2.png";
import hero_3 from "../../assets/hero_3.png";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Strong Hair Starts with Nature.",
    desc: "100% natural hair oil that reduces hair fall.",
    img: hero_1,
    bg: "bg-emerald-50",
    accent: "text-emerald-600",
  },
  {
    id: 2,
    title: "Say Goodbye to Hair Fall.",
    desc: "Clinically tested & trusted formula.",
    img: hero_2,
    bg: "bg-blue-50",
    accent: "text-blue-600",
  },
  {
    id: 3,
    title: "Grow Hair Faster & Stronger.",
    desc: "Deep nourishment from roots to tips.",
    img: hero_3,
    bg: "bg-orange-50",
    accent: "text-orange-600",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Hero = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [pause, setPause] = useState(false);
  const navigate = useNavigate();
  const imageIndex = wrap(0, slides.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (pause) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [page, pause]);

  const currentSlide = slides[imageIndex];

  return (
    <section className="relative h-150 lg:h-162.5 w-full overflow-hidden bg-white">
      {/* Dynamic Background Blob */}
      <motion.div
        key={currentSlide.id + "-bg"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 ${currentSlide.bg} transition-colors duration-1000`}
      >
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-white/40 rounded-full blur-[120px] mix-blend-overlay" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-linear-to-t from-white/80 to-transparent rounded-full blur-[80px]" />
      </motion.div>

      <div
        className="relative h-full max-w-7xl mx-auto flex items-center px-4 lg:px-8"
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full left-0 top-0 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 lg:px-12 py-12 lg:py-0"
          >
            <div className="w-full lg:w-1/2 h-[40%] lg:h-full flex items-center justify-center relative pointer-events-none order-1 lg:order-2 mb-4 lg:mb-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative z-10 w-[80%] md:w-64 lg:w-[80%] max-w-125"
              >
                <img
                  src={currentSlide.img}
                  alt="Hero"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="absolute w-75 lg:w-125  lg:h-125 bg-white rounded-full opacity-40 blur-3xl"
              />
            </div>

            <div className="w-full flex not-first: lg:w-1/2 z-10  flex-col items-center lg:items-start text-center lg:text-left space-y-4 lg:space-y-6 order-2 lg:order-1">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`md:inline-block hidden px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-xs lg:text-sm font-bold uppercase tracking-wider ${currentSlide.accent}`}
              >
                Best Seller Product
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-6xl mt-28 md:mt-0 font-black text-gray-900 leading-[1.1]"
              >
                {currentSlide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-base  md:text-lg md:block hidden text-gray-600 max-w-md lg:max-w-lg px-2 lg:px-0"
              >
                {currentSlide.desc}
              </motion.p>

              <motion.button
                onClick={() => navigate("/products")}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.5 }}
                className="bg-black text-white px-6 py-3 lg:px-8 lg:py-4 rounded-full font-bold text-sm lg:text-lg flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-xl shadow-black/10 mt-2"
              >
                Shop Now <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- CONTROLS --- */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-2 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-20 shadow-lg text-gray-700 hover:text-black hidden sm:flex"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-2 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-20 shadow-lg text-gray-700 hover:text-black hidden sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const direction = i > imageIndex ? 1 : -1;
                setPage([i, direction]);
              }}
              className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
              style={{
                width: imageIndex === i ? "24px" : "6px", // Smaller dots on mobile logic
                backgroundColor: imageIndex === i ? "transparent" : "#9ca3af",
              }}
            >
              {imageIndex === i && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-black rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
