import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, wrap } from "framer-motion";
import hero_1 from "../../assets/hero_1.png";
import hero_2 from "../../assets/hero_2.png";
import hero_3 from "../../assets/hero_3.png";
import { useNavigate } from "react-router-dom";

// Slides Data
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
  // {
  //   id: 4,
  //   title: "Healthy Hair, Naturally ✨",
  //   desc: "No chemicals. Only real results.",
  //   img: hero_4,
  //   bg: "bg-rose-50",
  //   accent: "text-rose-600",
  // },
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
  const navigate = useNavigate()
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
    <section className="relative h-[650px] w-full overflow-hidden bg-white">
      {/* Dynamic Background Blob */}
      <motion.div
        key={currentSlide.id + "-bg"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 ${currentSlide.bg} transition-colors duration-1000`}
      >
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-white/40 rounded-full blur-[120px] mix-blend-overlay" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-t from-white/80 to-transparent rounded-full blur-[80px]" />
      </motion.div>

      <div 
        className="relative h-full max-w-7xl mx-auto flex items-center px-6 lg:px-8"
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
            className="absolute w-full h-full left-0 top-0 flex items-center justify-center lg:justify-between px-6 lg:px-12"
          >
            {/* CONTENT LEFT */}
            <div className="w-full lg:w-1/2 z-10 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 pt-20 lg:pt-0">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-block px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-bold uppercase tracking-wider ${currentSlide.accent}`}
              >
                Best Seller Product
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]"
              >
                {currentSlide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-gray-600 max-w-lg"
              >
                {currentSlide.desc}
              </motion.p>

              <motion.button
              onClick={()=>navigate('/products')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.5 }}
                className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-xl shadow-black/10 mt-4"
              >
                Shop Now <ArrowRight size={20} />
              </motion.button>
            </div>

            {/* IMAGE RIGHT */}
            <div className="w-full lg:w-1/2 h-full hidden lg:flex items-center justify-center relative pointer-events-none">
              <motion.div
                 initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
                 animate={{ scale: 1, opacity: 1, rotate: 0 }}
                 transition={{ delay: 0.2, duration: 0.6 }}
                 className="relative z-10 w-[80%] max-w-[500px]"
              >
                  <img
                    src={currentSlide.img}
                    alt="Hero"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
              </motion.div>
              
              {/* Decorative Circle behind image */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="absolute w-[500px] h-[500px] bg-white rounded-full opacity-40 blur-3xl" 
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- CONTROLS --- */}
        
        {/* Navigation Arrows (Glassmorphism) */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-20 shadow-lg text-gray-700 hover:text-black hidden sm:flex"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-20 shadow-lg text-gray-700 hover:text-black hidden sm:flex"
        >
          <ChevronRight size={24} />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const direction = i > imageIndex ? 1 : -1;
                setPage([i, direction]);
              }}
              className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
              style={{
                width: imageIndex === i ? "32px" : "8px",
                backgroundColor: imageIndex === i ? "transparent" : "#d1d5db"
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