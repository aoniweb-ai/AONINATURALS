import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const UserSignup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body space-y-5">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <UserPlus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-sm opacity-70">
              Sign up to continue
            </p>
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
            />
          </div>

          {/* Phone */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Phone Number</span>
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
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
                placeholder="Create password"
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

          {/* Submit */}
          <button className="btn btn-primary w-full">
            Sign Up
          </button>

          {/* Footer */}
          <p className="text-center text-sm opacity-70">
            Already have an account?{" "}
            <span className="text-primary cursor-pointer font-medium">
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserSignup;
