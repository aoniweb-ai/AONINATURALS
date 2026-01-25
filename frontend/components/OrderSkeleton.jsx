const OrdersSkeleton = () => {
  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* PAGE TITLE */}
        <div className="h-8 w-40 bg-gray-200 rounded mb-8 animate-pulse" />

        {/* ORDER CARDS */}
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 sm:p-6 mb-6"
          >
            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="h-3 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
              </div>

              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* PRODUCTS */}
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  {/* IMAGE */}
                  <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse" />

                  {/* TEXT */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-300 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
              </div>

              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrdersSkeleton;
