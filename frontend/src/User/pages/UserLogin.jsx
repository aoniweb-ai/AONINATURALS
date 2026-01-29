import React, { useState } from "react";
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import useUserBear from "../../../store/user.store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const { register, handleSubmit } = useForm();
  const { userLogin } = useUserBear((state) => state);
  const navigate = useNavigate();

  const loginHandler = async (data) => {
    try {
      setLoader(true);
      await userLogin(data);
      navigate("/");
      toast.success("Welcome back! 👋");
    } catch (error) {
      toast.error(error?.message || "Login failed");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden font-sans selection:bg-black selection:text-white">
      
      {/* --- ANIMATED BACKGROUND BLOBS --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vh] h-[70vh] rounded-full bg-gradient-to-br from-purple-200/40 to-blue-200/40 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -50, 0],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vh] h-[60vh] rounded-full bg-gradient-to-tr from-emerald-200/40 to-teal-200/40 blur-3xl"
        />
      </div>

      {/* --- MAIN CARD --- */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md relative z-10 px-6"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 sm:p-12">
          
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4 mb-10">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white shadow-xl shadow-black/20"
            >
              <LogIn size={28} strokeWidth={2.5} />
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 font-medium">Enter your details to access your account</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(loginHandler)} className="space-y-6">
            
            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-black text-gray-400 ml-1 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent hover:bg-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black transition-all font-medium"
                  {...register("email", { required: true })}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent hover:bg-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-black transition-all font-medium"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors cursor-pointer focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={showPassword ? "hide" : "show"}
                      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={loader}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-900 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-black/10"
              >
                {loader ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="font-bold text-black hover:underline underline-offset-4 transition-all"
              >
                Create an account
              </button>
            </p>
          </motion.div>
        </div>
        
        {/* Optional: Simple decorative element at bottom */}
        <motion.div variants={itemVariants} className="flex justify-center mt-8 text-gray-400 gap-2 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={14} /> Secure Access
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserLogin;