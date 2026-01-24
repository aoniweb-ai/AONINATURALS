import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import useUserBear from "../../../store/user.store";

const UserSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {userSignup, UserLogin} = useUserBear(state=>state);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const rules = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&#^()_\-+=]/.test(password),
    length: password.length >= 8,
  };

  const isStrong = Object.values(rules).every(Boolean);

  const signupHandler = async (data) => {
    try {
      await userSignup(data);
      await UserLogin(data)
    } catch (error) {
      console.log("error ",error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <form
        onSubmit={handleSubmit(signupHandler)}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <UserPlus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-sm opacity-70">Sign up to continue</p>
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Email <span className="text-red-800">*</span>
              </span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full outline-none"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-error ps-3">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Phone Number <span className="text-red-800">*</span>
              </span>
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="input input-bordered w-full outline-none"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^(?:\+91)?[6-9]\d{9}$/,
                  message: "Invalid phone number",
                },
              })}
            />
            {errors.phone && (
              <p className="text-error ps-3">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Password <span className="text-red-800">*</span>
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="input input-bordered w-full pr-12 outline-none"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/,
                    message:
                      "Invalid password",
                  },
                })}
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

            {errors.password && (
              <p className="text-error ps-3">{errors.password.message}</p>
            )}

            {/* Rules */}
            <ul className="text-sm space-y-1 mt-6">
              <Rule text="At least 1 lowercase letter" ok={rules.lowercase} />
              <Rule text="At least 1 uppercase letter" ok={rules.uppercase} />
              <Rule text="At least 1 number" ok={rules.number} />
              <Rule text="At least 1 special character" ok={rules.special} />
              <Rule text="Minimum 8 characters" ok={rules.length} />
            </ul>

            {password && (
              <p
                className={`font-semibold ${
                  isStrong ? "text-success" : "text-warning"
                }`}
              >
                {isStrong ? "Strong Password 💪" : "Weak Password 🚫"}
              </p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full">
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
      </form>
    </div>
  );
};

const Rule = ({ text, ok }) => (
  <li
    className={`flex items-center gap-2 ${ok ? "text-success" : "text-error"}`}
  >
    <span>{ok ? "✔" : "✖"}</span>
    <span>{text}</span>
  </li>
);

export default UserSignup;
