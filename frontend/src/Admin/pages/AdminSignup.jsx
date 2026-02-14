import React, { useState } from 'react';
import { Eye, EyeOff, User, BadgeCheck, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {useForm} from "react-hook-form"
import useAdminBear from '../../../store/admin.store';


const AdminSignup = () => {
  
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {adminSignup, adminLogin} = useAdminBear(state=>state);
  const [loader, setLoader] = useState(false);

  const {register, handleSubmit} = useForm();

  const signupSubmit = async(data)=>{
    try {
      setLoader(true)
      await adminSignup(data);
      await adminLogin(data);
      navigate(`/${import.meta.env.VITE_ADMIN_POST_URI}/dashboard`);
      
    } catch (error) {
      toast.error(error);
    } finally{
      setLoader(false)
    }
  }
  
  return (
    <div className="drawer-content flex flex-col min-h-screen">
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-secondary/10 rounded-full">
                <UserPlus className="w-10 h-10 text-secondary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-base-content">Create Account</h2>
            <p className="text-base-content/60 mt-2">Register as a new Admin</p>
          </div>

          <form onSubmit={handleSubmit(signupSubmit)} className="space-y-3">
            
            {/* Username Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="admin_new"
                  className="input input-bordered w-full pl-10"
                  {...register("username",{required:true})}
                />
              </div>
            </div>

            {/* Unique ID Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Unique Admin ID</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BadgeCheck className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  name="uniqueId"
                  placeholder="Assign Unique ID"
                  className="input input-bordered w-full pl-10"
                  {...register("unique_id",{required:true})}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  className="input input-bordered w-full pl-10 pr-10"
                  {...register("password",{required:true})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-secondary transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/60" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/60" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className={`input input-bordered w-full pl-10 pr-10`}
                  {...register("confirm_password",{required:true})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-secondary transition-colors cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/60" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/60" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button disabled={loader} className="btn btn-secondary w-full text-lg">
                Sign Up
                <ArrowRight className="w-5 h-5 ml-1" /> {loader && <span className="loading loading-spinner loading-sm"></span>}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an admin ID?{' '}
              <span onClick={()=>navigate(`/${import.meta.env.VITE_ADMIN_POST_URI}/login`)} className="link link-secondary font-semibold hover:underline">
                Login here
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminSignup;