import React, { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  UserPlus, 
  Mail, 
  Phone, 
  Lock, 
  Check, 
  X, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import useUserBear from "../../../store/user.store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const signupHandler = async (data) => {
    try {
      setLoader(true);
      await userSignup(data);
      await userLogin(data);
      toast.success("Account created successfully! 🚀");
      navigate("/");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4 font-sans relative overflow-hidden">
      
      {/* Background decoration (Subtle Gradients) */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="w-full max-w-125 bg-white rounded-3xl border border-gray-100 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white mb-4 shadow-lg shadow-black/20 transform rotate-3">
              <UserPlus size={28} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
            <p className="text-gray-500 mt-2 font-medium">Join us to start your journey</p>
          </div>

          <form onSubmit={handleSubmit(signupHandler)} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-black'} text-gray-900 text-sm rounded-xl focus:ring-2 focus:border-transparent block pl-11 p-3.5 transition-all outline-none font-medium placeholder:font-normal`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-semibold ml-1">{errors.email.message}</p>}
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input
                  type="tel"
                  placeholder="98765 43210"
                  className={`w-full bg-gray-50 border ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-black'} text-gray-900 text-sm rounded-xl focus:ring-2 focus:border-transparent block pl-11 p-3.5 transition-all outline-none font-medium placeholder:font-normal`}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^(?:\+91)?[6-9]\d{9}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs font-semibold ml-1">{errors.phone.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-black'} text-gray-900 text-sm rounded-xl focus:ring-2 focus:border-transparent block pl-11 pr-12 p-3.5 transition-all outline-none font-medium placeholder:font-normal`}
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Strength Bar */}
              {password && (
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${
                      passedRulesCount <= 2 ? 'bg-red-500 w-1/3' : 
                      passedRulesCount <= 4 ? 'bg-yellow-500 w-2/3' : 
                      'bg-emerald-500 w-full'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Password Rules Grid */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Password Requirements</p>
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
              disabled={loader}
              className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed font-bold rounded-xl text-sm px-5 py-4 text-center flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-black/20 mt-4"
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
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <button 
                onClick={() => navigate('/login')} 
                className="text-black font-bold hover:underline transition-all"
              >
                Log in
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simplified Rule Component
const Rule = ({ text, ok }) => (
  <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${ok ? "text-emerald-600" : "text-gray-400"}`}>
    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${ok ? "bg-emerald-100 border-emerald-200" : "bg-gray-200 border-gray-300"}`}>
        {ok ? <Check size={10} strokeWidth={4} /> : <div className="w-1 h-1 bg-gray-400 rounded-full" />}
    </div>
    <span className={ok ? "opacity-100" : "opacity-70"}>{text}</span>
  </div>
);

export default UserSignup;