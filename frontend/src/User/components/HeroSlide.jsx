const HeroSlide = ({ title, desc, img }) => {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">

      
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-5 text-gray-600 text-lg">
          {desc}
        </p>

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
