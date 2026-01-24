const ProductDetailsSkeleton = () => {
  return (
    <section className="bg-white min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* IMAGE SKELETON */}
          <div className="bg-gray-100 rounded-3xl h-[380px]" />

          {/* CONTENT SKELETON */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4 mt-4" />

            <div className="space-y-3 mt-6">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>

            {/* HIGHLIGHTS */}
            <div className="mt-6 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-1/2" />
              ))}
            </div>

            {/* QTY */}
            <div className="mt-8 flex gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded-xl" />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-10">
              <div className="h-14 bg-gray-200 rounded-xl flex-1" />
              <div className="h-14 w-14 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsSkeleton;
