import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body space-y-5">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <LogIn className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-sm opacity-70">
              Login to your account
            </p>
          </div>

          {/* Email / Phone */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email or Phone</span>
            </label>
            <input
              type="text"
              placeholder="Enter email or phone number"
              className="input input-bordered w-full"
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="input input-bordered w-full pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 opacity-70" />
                ) : (
                  <Eye className="w-5 h-5 opacity-70" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <span className="text-sm text-primary cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button className="btn btn-primary w-full">
            Login
          </button>

          {/* Footer */}
          <p className="text-center text-sm opacity-70">
            Don’t have an account?{" "}
            <span className="text-primary cursor-pointer font-medium">
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserLogin;
