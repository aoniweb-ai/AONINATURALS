import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import useUserBear from "../../../store/user.store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SendotpModal from "../components/SendotpModal";

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const { register, handleSubmit, getValues } = useForm();
  const { userLogin } = useUserBear((state) => state);
  const navigate = useNavigate();

  const loginHandler = async (data) => {
    try {
      setLoader(true);
      const otpSent = await userLogin(data);
      if (otpSent) {
        document.getElementById("otp_modal").showModal();
      } else {
        navigate("/");
        toast.success("Welcome back! 👋");
      }
    } catch (error) {
      toast.error(error || "Login failed");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#f8f9fa]">
      {/* --- RIGHT SIDE: FORM --- */}
      <div className="flex flex-col  justify-center bg-[#f8f9fa] h-full items-center px-6 py-12 lg:px-24 ">
        <div className="w-full max-w-md bg-white space-y-8 px-5 py-3  animate-in slide-in-from-bottom-4 fade-in duration-500">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 text-black mb-4 shadow-sm">
              <LogIn size={24} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500">
              Enter your details to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit(loginHandler)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                  {...register("email", { required: true })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-gray-700">
                  Password
                </label>
                {/* <a href="#" className="text-xs font-semibold text-black hover:underline">Forgot Password?</a> */}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <div
                  onClick={() => navigate("/forgot-password")}
                  className="font-bold text-sm text-black hover:underline transition-all"
                >
                  forget password?
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loader}
              className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-black/20"
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
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="font-bold text-black hover:underline transition-all"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
      <SendotpModal
        email={getValues("email")}
        password={getValues("password")}
        msg={"Welcome back! 👋"}
      />
    </div>
  );
};

export default UserLogin;
