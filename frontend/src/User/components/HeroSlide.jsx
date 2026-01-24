const HeroSlide = ({ title, desc, btn, img }) => {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">

      
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-5 text-gray-600 text-lg">
          {desc}
        </p>

        <button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold">
          {btn}
        </button>
      </div>

      
      <div className="flex justify-center">
        <img
          src={img}
          alt="product"
          className="w-75 md:w-95 drop-shadow-xl"
        />
      </div>

    </div>
  );
};

export default HeroSlide;
