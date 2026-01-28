import {
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Lock,
  LogOut,
  Edit2,
  Camera,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useUserBear from "../../../store/user.store";
import CenterLoader from "../../../components/CenterLoader";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../utils/formatDateTime";

const UserAccount = () => {
  const { user, userProfileUpdate, userAddressUpdate, userLogout } =
    useUserBear((state) => state);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [editProfile, setEditProfile] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);
  const [addressLoader, setAddressLoader] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        fullname: user.fullname || "",
        phone: user.phone || "",
        address: user?.address?.address || "",
        state: user?.address?.state || "",
        pincode: user?.address?.pincode || "",
        landmark: user?.address?.landmark || "",
      });
    }
  }, [user, reset,editAddress]);

  const editHandler = async (data) => {
    try {
      const isNameSame = user.fullname === data.fullname.trim();
      const isPhoneSame = String(user.phone) === String(data.phone).trim();

      if (isNameSame && isPhoneSame) {
        setEditProfile(false);
        return toast("No changes made", { icon: "ℹ️" });
      }

      setProfileLoader(true);
      await userProfileUpdate({ fullname: data.fullname, phone: data.phone });
      toast.success("Profile updated successfully");
      setEditProfile(false);
    } catch (error) {
      toast.error(error?.message || "Update failed");
    } finally {
      setProfileLoader(false);
    }
  };

  const addressHandler = async (data) => {
    try {
      if (
        user.address?.address == data.address.trim() &&
        user.address?.pincode == data.pincode.trim() &&
        user.address?.state == data.state.trim() &&
        user.address?.landmark == data.landmark.trim()
      ) {
        setEditAddress(false);
        return toast("Address is same as before", { icon: "ℹ️" });
      }
      setAddressLoader(true);
      await userAddressUpdate({
        address: {
          address: data.address,
          pincode: data.pincode,
          state: data.state,
          landmark: data.landmark,
        },
      });
      toast.success("Address updated successfully");
      setEditAddress(false);
    } catch (error) {
      toast.error(error?.message || "Address update failed");
    } finally {
      setAddressLoader(false);
    }
  };

  if (!user) return <CenterLoader />;

  return (
    <section className="min-h-screen bg-[#f9fafb] font-sans py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* --- HEADER SECTION --- */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            My Account
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your profile, address, and preferences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN: PROFILE --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. PERSONAL INFO CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Avatar */}
                <div className="relative group mx-auto sm:mx-0">
                  <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-black/20">
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </div>
                  {/* Fake Edit Overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>

                {/* Info Form */}
                <form
                  onSubmit={handleSubmit(editHandler)}
                  className="flex-1 w-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-xs text-gray-400">
                        Update your photo and personal details.
                      </p>
                    </div>

                    {!editProfile ? (
                      <button
                        type="button"
                        onClick={() => setEditProfile(true)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditProfile(false);
                            reset();
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <X size={18} />
                        </button>
                        <button
                          type="submit"
                          disabled={profileLoader}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        >
                          {profileLoader ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <Check size={18} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Name Field */}
                    <div className="grid sm:grid-cols-3 items-center gap-2">
                      <label className="text-sm font-medium text-gray-500">
                        Full Name
                      </label>
                      <div className="sm:col-span-2">
                        {editProfile ? (
                          <input
                            {...register("fullname", {
                              required: "Name is required",
                            })}
                            className="w-full input input-bordered input-sm rounded-lg focus:outline-none focus:border-black"
                          />
                        ) : (
                          <p className="font-semibold text-gray-900">
                            {user.fullname}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email Field (Read Only) */}
                    <div className="grid sm:grid-cols-3 items-center gap-2">
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="grid sm:grid-cols-3 items-center gap-2">
                      <label className="text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <div className="sm:col-span-2">
                        {editProfile ? (
                          <div className="flex flex-col">
                            <input
                              type="tel"
                              {...register("phone", {
                                required: "Phone is required",
                                pattern: {
                                  value: /^[6-9]\d{9}$/,
                                  message: "Invalid 10-digit number",
                                },
                              })}
                              className="w-full input input-bordered input-sm rounded-lg focus:outline-none focus:border-black"
                            />
                            {errors.phone && (
                              <span className="text-xs text-red-500 mt-1">
                                {errors.phone.message}
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="flex items-center gap-2 font-semibold text-gray-900">
                            <Phone size={14} className="text-gray-400" />{" "}
                            {user.phone || "Not added"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* 2. ADDRESS CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <MapPin size={20} className="text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-gray-400">
                      Used for shipping orders
                    </p>
                  </div>
                </div>
                {!editAddress && (
                  <button
                    onClick={() => setEditAddress(true)}
                    className="text-xs font-bold border border-gray-200 px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all"
                  >
                    Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit(addressHandler)}>
                {!editAddress ? (
                  <div>
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm leading-relaxed">
                      {user?.address?.address || "No address saved yet."}
                    </div>
                    <div className="flex flex-col">
                      <p className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm leading-relaxed">
                        <span className="font-bold">PINCODE</span> :{" "}
                        {user?.address?.pincode}
                      </p>
                      <p className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm leading-relaxed">
                        <span className="font-bold">STATE</span> :{" "}
                        {user?.address?.state}
                      </p>
                      <p className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm leading-relaxed">
                        <span className="font-bold">LANDMARK</span> :{" "}
                        {user?.address?.landmark}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <textarea
                      {...register("address", {
                        required: "Address cannot be empty",
                        minLength: {
                          value: 10,
                          message: "Address is too short",
                        },
                      })}
                      className="textarea textarea-bordered w-full h-32 rounded-xl focus:outline-none focus:border-black text-base"
                      placeholder="House no, Street, City, "
                      autoFocus
                    ></textarea>
                    {errors.address && (
                      <p className="text-red-500 text-xs">
                        {errors.address.message}
                      </p>
                    )}
                    <input
                      className="input outline-none"
                      placeholder="pincode - xxxxxx"
                      type="tel"
                      {...register("pincode", { required: "Pincode cannot be empty" })}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs">
                        {errors.pincode.message}
                      </p>
                    )}
                    <input
                      className="input outline-none"
                      placeholder="state"
                      type="text"
                      {...register("state", { required: "State cannot be empty" })}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs">
                        {errors.state.message}
                      </p>
                    )}
                    <input
                      className="input outline-none"
                      placeholder="landmark"
                      type="text"
                      {...register("landmark", { required: "landmark cannot be empty" })}
                    />
                    {errors.landmark && (
                      <p className="text-red-500 text-xs">
                        {errors.landmark.message}
                      </p>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditAddress(false);
                          reset({ address: user.address });
                        }}
                        className="btn btn-ghost btn-sm rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addressLoader}
                        className="btn btn-neutral btn-sm rounded-lg px-6"
                      >
                        {addressLoader ? "Saving..." : "Save Address"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* --- RIGHT COLUMN: ACTIONS --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
              {/* Orders */}
              <div
                onClick={() => navigate("/orders")}
                className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      My Orders
                    </h3>
                    <p className="text-xs text-gray-400">
                      Track current & past orders
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-black transition-colors"
                />
              </div>

              <div className="h-px bg-gray-50 mx-4"></div>

              {/* Security */}
              <div className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Login & Security
                    </h3>
                    <p className="text-xs text-gray-400">Password & 2FA</p>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-black transition-colors"
                />
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                userLogout();
                toast.success("Logged out successfully");
                navigate("/login");
              }}
              className="w-full bg-white border border-red-100 text-red-500 font-bold py-4 rounded-3xl flex items-center justify-center gap-2 hover:bg-red-50"
            >
              <LogOut size={18} />
              Sign Out
            </button>

            <p className="text-center text-xs text-gray-300">
              Member since {formatDateTime(user.createdAt)} • Aoni Naturals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserAccount;
