import React from "react";
import { motion } from "framer-motion";

const CenterLoader = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fa] relative overflow-hidden">
      
      {/* --- BACKGROUND BLOBS (Matches your other pages) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-gray-200/40 rounded-full blur-3xl"
        />
      </div>

      {/* --- THE LOADER --- */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-2 border-gray-200 rounded-full"
        />
        
        {/* Middle Ring (Counter Rotating) */}
        <motion.div
          className="absolute w-16 h-16 border-t-2 border-l-2 border-black rounded-xl"
          animate={{ 
            rotate: -360,
            borderRadius: ["20%", "50%", "20%"] 
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner Core */}
        <motion.div
          className="absolute w-4 h-4 bg-black rounded"
          animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-8 text-sm font-bold tracking-[0.2em] text-gray-400 uppercase"
      >
        Loading
      </motion.p>
    </div>
  );
};

export default CenterLoader;