import React, { useState } from 'react';
import { Eye, EyeOff, User, Key, ShieldCheck, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import useAdminBear from '../../../store/admin.store';
import { useNavigate } from 'react-router-dom';
const AdminLogin = () => {
  const navigate = useNavigate();
  const [showUniqueId, setShowUniqueId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {adminLogin} = useAdminBear(state=>state);
  const [loader, setLoader] = useState(false);

  const {register, handleSubmit} = useForm()
  const loginSubmit = async(data)=>{
    try {
      setLoader(true)
      await adminLogin(data);
      navigate(`/${import.meta.env.VITE_ADMIN_POST_URI}/dashboard`);
    } catch (error) {
      toast.error(error)
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
          
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-base-content">Admin Portal</h2>
            <p className="text-base-content/60 mt-2">Please enter your secure credentials</p>
          </div>

          <form onSubmit={handleSubmit(loginSubmit)} className="space-y-4">
            
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
                  placeholder="admin_user"
                  className="input input-bordered w-full pl-10"
                  {...register("username",{required:true})}
                />
              </div>
            </div>

            {/* Unique ID Field (with Eye Toggle) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Unique Admin ID</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showUniqueId ? "text" : "password"}
                  name="uniqueId"
                  placeholder="UID-XXXX-XXXX"
                  className="input input-bordered w-full pl-10 pr-10"
                  {...register("unique_id",{required:true})}
                />
                {/* Toggle Button for Unique ID */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setShowUniqueId(!showUniqueId)}
                >
                  {showUniqueId ? (
                    <EyeOff className="h-5 w-5 text-base-content/60" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/60" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Field (with Eye Toggle) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 pr-10"
                  {...register("password",{required:true})}
                />
                {/* Toggle Button for Password */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/60" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/60" />
                  )}
                </button>
              </div>
              <label className="label">
                <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button disabled={loader} className="btn btn-primary w-full gap-2 text-lg">
                <LogIn className="w-5 h-5" />
                Login {loader && <span className="loading loading-spinner loading-sm"></span>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>

    </div>
  );
};

export default AdminLogin;