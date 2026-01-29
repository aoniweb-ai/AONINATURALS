import React, { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  UserPlus, 
  Mail, 
  Phone, 
  Lock, 
  Check, 
  ArrowRight,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
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
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

const errorVariants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: { opacity: 1, height: "auto", marginTop: 4 },
  exit: { opacity: 0, height: 0, marginTop: 0 },
};

const UserSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { userSignup, userLogin } = useUserBear((state) => state);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const rules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&#^()_\-+=]/.test(password),
  };

  const passedRulesCount = Object.values(rules).filter(Boolean).length;

  // Calculate strength color and text
  const getStrengthStats = () => {
    if (passedRulesCount <= 2) return { color: "#ef4444", text: "Weak", width: "33%" };
    if (passedRulesCount <= 4) return { color: "#eab308", text: "Good", width: "66%" };
    return { color: "#10b981", text: "Strong", width: "100%" };
  };

  const strengthStats = getStrengthStats();

  const signupHandler = async (data) => {
    try {
      setLoader(true);
      await userSignup(data);
      await userLogin(data);
      toast.success("Account created successfully! 🚀");
      navigate("/");
    } catch (error) {
      toast.error(error || "Signup failed");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4 font-sans relative overflow-hidden selection:bg-black selection:text-white">
      
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[80vh] h-[80vh] rounded-full bg-gradient-to-bl from-blue-100/50 to-purple-100/50 blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -left-[10%] w-[70vh] h-[70vh] rounded-full bg-gradient-to-tr from-emerald-100/50 to-teal-100/50 blur-3xl"
        />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10"
      >
        <div className="p-8 sm:p-10">
          
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white mb-4 shadow-xl shadow-black/20"
            >
              <UserPlus size={28} strokeWidth={2.5} />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-gray-500 mt-2 font-medium">Join us to start your journey</p>
          </motion.div>

          <form onSubmit={handleSubmit(signupHandler)} className="space-y-5">
            
            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full bg-gray-50 border-2 ${errors.email ? 'border-red-500/50 bg-red-50' : 'border-transparent hover:bg-gray-100 focus:bg-white focus:border-black'} text-gray-900 text-sm rounded-xl block pl-11 p-3.5 transition-all outline-none font-medium placeholder:font-normal placeholder:text-gray-400`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p variants={errorVariants} initial="hidden" animate="visible" exit="exit" className="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
                     <ShieldCheck size={12}/> {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Phone Input */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input
                  type="tel"
                  placeholder="98765 43210"
                  className={`w-full bg-gray-50 border-2 ${errors.phone ? 'border-red-500/50 bg-red-50' : 'border-transparent hover:bg-gray-100 focus:bg-white focus:border-black'} text-gray-900 text-sm rounded-xl block pl-11 p-3.5 transition-all outline-none font-medium placeholder:font-normal placeholder:text-gray-400`}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^(?:\+91)?[6-9]\d{9}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
              </div>
              <AnimatePresence>
                {errors.phone && (
                  <motion.p variants={errorVariants} initial="hidden" animate="visible" exit="exit" className="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
                     <ShieldCheck size={12}/> {errors.phone.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full bg-gray-50 border-2 ${errors.password ? 'border-red-500/50 bg-red-50' : 'border-transparent hover:bg-gray-100 focus:bg-white focus:border-black'} text-gray-900 text-sm rounded-xl block pl-11 pr-12 p-3.5 transition-all outline-none font-medium placeholder:font-normal placeholder:text-gray-400`}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/,
                      message: "Password does not meet requirements",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors focus:outline-none"
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
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
              
              {/* Animated Strength Bar */}
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-3 relative">
                 <motion.div 
                   className="h-full rounded-full"
                   initial={{ width: 0 }}
                   animate={{ 
                     width: password ? strengthStats.width : 0, 
                     backgroundColor: strengthStats.color 
                   }}
                   transition={{ type: "spring", stiffness: 50, damping: 15 }}
                 />
              </div>
            </motion.div>

            {/* Password Rules Grid */}
            <motion.div variants={itemVariants} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Requirements</p>
                    {password && (
                        <motion.span 
                            key={strengthStats.text}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: strengthStats.color }}
                        >
                            {strengthStats.text}
                        </motion.span>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                  <Rule text="Min 8 chars" ok={rules.length} />
                  <Rule text="Lowercase (a-z)" ok={rules.lowercase} />
                  <Rule text="Uppercase (A-Z)" ok={rules.uppercase} />
                  <Rule text="Number (0-9)" ok={rules.number} />
                  <Rule text="Special Char (@#$)" ok={rules.special} />
                </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                disabled={loader}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed font-bold rounded-xl text-sm px-5 py-4 text-center flex items-center justify-center gap-2 transition-all shadow-xl shadow-black/10"
                >
                {loader ? (
                    <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Creating Account...</span>
                    </>
                ) : (
                    <>
                    <span>Sign Up</span>
                    <ArrowRight size={18} />
                    </>
                )}
                </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <button 
                onClick={() => navigate('/login')} 
                className="text-black font-bold hover:underline underline-offset-4 transition-all"
              >
                Log in
              </button>
            </p>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

// Animated Rule Component
const Rule = ({ text, ok }) => (
  <motion.div 
    animate={{ opacity: ok ? 1 : 0.5 }}
    className="flex items-center gap-2.5 text-xs font-bold transition-colors duration-300"
  >
    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${ok ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-transparent"}`}>
       <motion.div
         initial={{ scale: 0 }}
         animate={{ scale: ok ? 1 : 0 }}
         transition={{ type: "spring", stiffness: 200, damping: 10 }}
       >
         <Check size={12} strokeWidth={4} />
       </motion.div>
    </div>
    <span className={`transition-colors duration-300 ${ok ? "text-gray-900" : "text-gray-400"}`}>{text}</span>
  </motion.div>
);

export default UserSignup;