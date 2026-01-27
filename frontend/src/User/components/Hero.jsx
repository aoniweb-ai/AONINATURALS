import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSlide from "./HeroSlide";
import hero_1 from "../../assets/hero_1.png";
import hero_2 from "../../assets/hero_2.png";
import hero_3 from "../../assets/hero_3.png";
import hero_4 from "../../assets/hero_4.png";

const slides = [
  {
    title: "Strong Hair Starts with Nature 🌿",
    desc: "100% natural hair oil that reduces hair fall.",
    img: hero_1,
  },
  {
    title: "Say Goodbye to Hair Fall ❌",
    desc: "Clinically tested & trusted formula.",
    img: hero_2,
  },
  {
    title: "Grow Hair Faster & Stronger 💪",
    desc: "Deep nourishment from roots to tips.",
    img: hero_3,
  },
  {
    title: "Healthy Hair, Naturally ✨",
    desc: "No chemicals. Only real results.",
    img: hero_4,
  },
];

const Hero = () => {
  const [active, setActive] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [pause]);

  const prevSlide = () =>
    setActive((prev) => (prev - 1 + slides.length) % slides.length);

  const nextSlide = () =>
    setActive((prev) => (prev + 1) % slides.length);

  return (
    <section className="bg-linear-to-r from-emerald-50 to-white">
      <div
        className="max-w-7xl mx-auto relative overflow-hidden"
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >

        <div
          className="flex w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="w-full shrink-0">
              
              <div className="px-6 py-14">
                <HeroSlide {...slide} />
              </div>
            </div>
          ))}
        </div>

        
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-white shadow"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-white shadow"
        >
          <ChevronRight size={18} />
        </button>

        
        <div className="flex justify-center gap-2 pb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                active === i
                  ? "w-6 bg-emerald-600"
                  : "w-2.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
