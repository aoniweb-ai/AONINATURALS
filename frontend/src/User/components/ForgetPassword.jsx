import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Fingerprint,
  EyeOff,
  Eye,
  Check,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { set, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import SendotpModal from "./SendotpModal";
import useUserBear from "../../../store/user.store";

const ForgetPassword = () => {
    const {resendOtp} = useUserBear(state=>state);
  const {
    handleSubmit,
    register,
    control,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });
  const confirm_password = useWatch({
    control,
    name: "confirm_password",
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

  const forgetHandler = async (data) => {
    try {
        setLoading(true)
        if(password !== confirm_password) return toast.error("Invalid operation - Password not match");
        await resendOtp({email:data.email,topic:"Password Change"})
        document.getElementById("otp_modal").showModal();
    } catch (error) {
        toast.error(error)
    } finally{
        setLoading(false)
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden text-black selection:bg-black selection:text-white">
      {/* --- 1. Background Atmosphere (Monochrome) --- */}
      <div className="absolute inset-0 w-full h-full">
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Rotating Spotlight (black Fog) */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-black/5 to-transparent rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, 100, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-black/5 rounded-full blur-[120px] pointer-events-none"
        />
      </div>

      {/* --- 2. Main Card --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md p-8 bg-white/40 backdrop-blur-xl border border-black/10 rounded-3xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="absolute top-6 left-6">
          <Link
            to="/login"
            className="text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={22} />
          </Link>
        </motion.div>

        {/* Icon Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mb-10 mt-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-black/20 blur-xl rounded-full"></div>
            <div className="relative w-16 h-16 bg-white border border-black/20 rounded-2xl flex items-center justify-center shadow-2xl">
              <Fingerprint size={32} className="text-black" />
            </div>
          </div>
          <h2 className="text-3xl font-medium mt-6 tracking-tight text-black">
            Reset Password
          </h2>
          <p className="text-neutral-400 text-sm mt-2 text-center max-w-xs">
            Enter your email to receive a secure link to reset your password.
          </p>
        </motion.div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(forgetHandler)} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">
              Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-gray-50 border ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-black"} text-gray-900 text-sm rounded-xl focus:ring-2 focus:border-transparent block pl-11 p-3.5 transition-all outline-none font-medium placeholder:font-normal`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-semibold ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={`w-full bg-gray-50 border ${errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-black"} text-gray-900 text-sm rounded-xl focus:ring-2 focus:border-transparent block pl-11 pr-12 p-3.5 transition-all outline-none font-medium placeholder:font-normal`}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/,
                    message: "Password does not meet requirements",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password && (
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    passedRulesCount <= 2
                      ? "bg-red-500 w-1/3"
                      : passedRulesCount <= 4
                        ? "bg-yellow-500 w-2/3"
                        : "bg-emerald-500 w-full"
                  }`}
                />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`w-full bg-gray-50 border ${(confirm_password.length>0 ) &&  (password != confirm_password ? "border-red-500 focus:ring-red-300" : "border-green-300 focus:ring-green-300")} ${errors.confirm_password ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-black"} text-gray-900 text-sm rounded-xl focus:ring-2 focus:border-transparent block pl-11 pr-12 p-3.5 transition-all outline-none font-medium placeholder:font-normal`}
                {...register("confirm_password", { required: true })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">
              Password Requirements
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
              <Rule text="Min 8 chars" ok={rules.length} />
              <Rule text="Lowercase (a-z)" ok={rules.lowercase} />
              <Rule text="Uppercase (A-Z)" ok={rules.uppercase} />
              <Rule text="Number (0-9)" ok={rules.number} />
              <Rule text="Special Char (@#$)" ok={rules.special} />
            </div>
          </div>

          {/* Submit Button */}
          <button
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed font-bold rounded-xl text-sm px-5 py-4 text-center flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-black/20 mt-4"
            >
              {loading ? (
                 <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Sending...</span>
                 </>
              ) : (
                <>
                  <span>Send otp</span>
                </>
              )}
            </button>
        </form>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <Link
            to="/login"
            className="text-xs text-neutral-500 hover:text-black transition-colors uppercase tracking-widest font-medium"
          >
            Back to Login
          </Link>
        </motion.div>
      </motion.div>

      <SendotpModal email={getValues('email')} password={password} changePassword={true} msg={'Password changed'} />
    </div>
  );
};
const Rule = ({ text, ok }) => (
  <div
    className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${ok ? "text-emerald-600" : "text-gray-400"}`}
  >
    <div
      className={`w-4 h-4 rounded-full flex items-center justify-center border ${ok ? "bg-emerald-100 border-emerald-200" : "bg-gray-200 border-gray-300"}`}
    >
      {ok ? (
        <Check size={10} strokeWidth={4} />
      ) : (
        <div className="w-1 h-1 bg-gray-400 rounded-full" />
      )}
    </div>
    <span className={ok ? "opacity-100" : "opacity-70"}>{text}</span>
  </div>
);
export default ForgetPassword;
