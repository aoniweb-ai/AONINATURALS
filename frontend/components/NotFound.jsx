import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveLeft, Home, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-neutral-950 overflow-hidden text-white selection:bg-white selection:text-black">
      
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div 
            className="absolute inset-0 opacity-[0.05]" 
            style={{ 
                backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
                backgroundSize: '50px 50px' 
            }}
        />
        
        <motion.div
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [100, -100, 100], y: [50, -50, 50], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4">
        
        <div className="relative">
            <motion.h1 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1.1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                className="text-[12rem] md:text-[18rem] font-black text-white leading-none tracking-tighter absolute top-0 left-0 right-0 -translate-x-4 translate-y-4 blur-sm select-none pointer-events-none"
            >
                404
            </motion.h1>
            
            <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="text-[12rem] md:text-[18rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 leading-none tracking-tighter relative z-10 mix-blend-overlay"
            >
                404
            </motion.h1>
        </div>

        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="-mt-8 md:-mt-16 relative z-20 backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full"
        >
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-xl mb-6 shadow-inner border border-white/5">
                <SearchX size={32} className="text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Page Not Found
            </h2>
            
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                Oops! It seems you've ventured into the digital void. The page you are looking for doesn't exist or has been moved.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                    >
                        <Home size={18} />
                        Go Home
                    </motion.button>
                </Link>
                
                <button 
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                >
                    <MoveLeft size={18} />
                    Go Back
                </button>
            </div>
        </motion.div>

      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-neutral-600 text-xs uppercase tracking-[0.2em]"
      >
        Error Code: 404 • Coordinate: Unknown
      </motion.p>
    </div>
  );
};

export default NotFound;