import {
  Mail,
  Phone,
  MapPin,
  Edit2,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  Package,
  LogOut,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useUserBear from "../../../store/user.store";
import CenterLoader from "../../../components/CenterLoader";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../utils/formatDateTime";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 300 },
  },
};

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

  const [signOutLoader, setSignOutLoader] = useState(false);
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
  }, [user, reset, editAddress]);

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
      toast.error(error || "Update failed");
    } finally {
      setProfileLoader(false);
    }
  };

  const addressHandler = async (data) => {
    try {
      if (
        user.address?.address == data.address.trim() &&
        user.address?.pincode == data.pincode &&
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
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50/50 font-sans py-12 selection:bg-indigo-500 selection:text-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* --- HEADER --- */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Settings & Account
            </h1>
            <p className="text-gray-500 font-medium">
              Manage your personal details and preferences.
            </p>
          </div>
          <div className="hidden md:block">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 shadow-sm cursor-default"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Active Member
            </motion.span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* --- LEFT COLUMN (Profile & Address) --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. PERSONAL INFO CARD */}
            <motion.div
              variants={itemVariants}
              whileHover={!editProfile ? "hover" : ""} // Disable hover effect when editing
              initial="hidden"
              animate="visible"
              layout // Enables smooth resizing
              className="group bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden"
            >
              {/* Decoration Background */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -z-0 opacity-70"
              />

              <div className="relative z-10 flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className="relative cursor-pointer"
                  >
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white flex items-center justify-center text-4xl font-bold shadow-lg ring-4 ring-white">
                      {user?.fullname?.charAt(0).toUpperCase()}
                    </div>
                    {/* Active Status Indicator on Avatar */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </motion.div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Profile
                  </p>
                </div>

                {/* Form Section */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Personal Information
                        <AnimatePresence>
                          {editProfile && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100"
                            >
                              Editing Mode
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </h2>
                    </div>

                    <div className="flex gap-2">
                      <AnimatePresence mode="wait" initial={false}>
                        {!editProfile ? (
                          <motion.button
                            key="edit-btn"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 45 }}
                            whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => setEditProfile(true)}
                            className="btn btn-circle btn-sm btn-ghost text-gray-500"
                          >
                            <Edit2 size={18} />
                          </motion.button>
                        ) : (
                          <>
                            <motion.button
                              key="cancel-btn"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => {
                                setEditProfile(false);
                                reset();
                              }}
                              className="btn btn-circle btn-sm bg-red-50 text-red-500 border-none hover:bg-red-100"
                            >
                              <X size={18} />
                            </motion.button>
                            <motion.button
                              key="save-btn"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleSubmit(editHandler)}
                              disabled={profileLoader}
                              className="btn btn-circle btn-sm bg-green-50 text-green-600 border-none hover:bg-green-100"
                            >
                              {profileLoader ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <Check size={18} />
                              )}
                            </motion.button>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <form className="space-y-5">
                    {/* Name */}
                    <div className="relative">
                      <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                        Full Name
                      </label>
                      <AnimatePresence mode="wait">
                        {editProfile ? (
                          <motion.div
                            key="name-input"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                          >
                            <input
                              {...register("fullname", {
                                required: "Name is required",
                              })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            />
                          </motion.div>
                        ) : (
                          <motion.p
                            key="name-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-lg font-medium text-gray-900 border-b border-transparent py-2"
                          >
                            {user.fullname}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                          Email Address
                        </label>
                        <div className="flex items-center gap-3 py-2 text-gray-500 bg-gray-50/50 rounded-xl px-3 border border-transparent">
                          <Mail size={16} />
                          <span className="font-medium text-gray-700">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                          Phone Number
                        </label>
                        <AnimatePresence mode="wait">
                          {editProfile ? (
                            <motion.div
                              key="phone-input"
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                            >
                              <input
                                type="tel"
                                {...register("phone", {
                                  required: "Phone is required",
                                  pattern: {
                                    value: /^[6-9]\d{9}$/,
                                    message: "Invalid 10-digit number",
                                  },
                                })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                              />
                              {errors.phone && (
                                <p className="text-xs text-red-500 mt-1">
                                  {errors.phone.message}
                                </p>
                              )}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="phone-text"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={`flex items-center gap-3 py-2 ${
                                user.phone
                                  ? "text-gray-900"
                                  : "text-gray-400 italic"
                              }`}
                            >
                              <Phone size={16} className="text-gray-400" />
                              <span className="font-medium">
                                {user.phone || "Add phone number"}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* 2. ADDRESS CARD */}
            <motion.div
              variants={itemVariants}
              // Only apply hover float effect when NOT editing to prevent jumpiness while typing
              whileHover={!editAddress ? cardHoverVariants.hover : {}}
              layout
              className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-gray-200/50 border border-white"
            >
              <motion.div layout className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Delivery Address
                    </h2>
                    <p className="text-sm text-gray-400">
                      Where should we send your orders?
                    </p>
                  </div>
                </div>
                {!editAddress && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditAddress(true)}
                    className="px-5 py-2 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 shadow-md"
                  >
                    Edit Address
                  </motion.button>
                )}
              </motion.div>

              <form onSubmit={handleSubmit(addressHandler)}>
                <AnimatePresence mode="wait">
                  {!editAddress ? (
                    <motion.div
                      key="address-view"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row gap-6 md:items-center justify-between group hover:border-gray-200 transition-colors"
                    >
                      {user?.address?.address ? (
                        <>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="badge badge-neutral badge-sm">
                                Home
                              </span>
                              {user.address.landmark && (
                                <span className="text-xs text-gray-500">
                                  Near {user.address.landmark}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-800 font-medium leading-relaxed">
                              {user.address.address}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {user.address.state} -{" "}
                              <span className="font-mono text-gray-700">
                                {user.address.pincode}
                              </span>
                            </p>
                          </div>
                          <div className="hidden md:flex flex-col items-center justify-center pl-6 border-l border-gray-200">
                            <MapPin className="text-gray-300 mb-1" size={32} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              Primary
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full py-6 text-center">
                          <div className="p-3 bg-gray-100 rounded-full mb-3">
                            <MapPin className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            No address saved yet
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="address-edit"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <textarea
                          {...register("address", {
                            required: "Address cannot be empty",
                            minLength: {
                              value: 10,
                              message: "Address is too short",
                            },
                          })}
                          className="textarea w-full h-32 rounded-2xl bg-white border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 text-base p-4 shadow-sm resize-none transition-all"
                          placeholder="Flat / House No / Floor / Building Name"
                          autoFocus
                        ></textarea>
                        {errors.address && (
                          <span className="absolute right-4 top-4 text-xs text-red-500 font-medium bg-white px-2">
                            {errors.address.message}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <input
                            placeholder="Pincode"
                            type="tel"
                            {...register("pincode", { required: "Required" })}
                            className="input w-full bg-white border-2 border-gray-100 focus:border-indigo-500 focus:outline-none rounded-xl"
                          />
                          {errors.pincode && (
                            <p className="text-red-500 text-xs ml-1">
                              {errors.pincode.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <input
                            placeholder="State"
                            type="text"
                            {...register("state", { required: "Required" })}
                            className="input w-full bg-white border-2 border-gray-100 focus:border-indigo-500 focus:outline-none rounded-xl"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-xs ml-1">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <input
                            placeholder="Landmark"
                            type="text"
                            {...register("landmark", { required: "Required" })}
                            className="input w-full bg-white border-2 border-gray-100 focus:border-indigo-500 focus:outline-none rounded-xl"
                          />
                          {errors.landmark && (
                            <p className="text-red-500 text-xs ml-1">
                              {errors.landmark.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => {
                            setEditAddress(false);
                            reset({ address: user.address?.address });
                          }}
                          className="px-6 py-2.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={addressLoader}
                          className="px-8 py-2.5 rounded-xl bg-black text-white font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                        >
                          {addressLoader ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Save Address"
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN (Actions) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Menu Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] p-3 shadow-xl shadow-gray-200/50 border border-white"
            >
              <div className="px-4 py-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Dashboard
                </h3>
              </div>
              <div className="space-y-1">
                {/* Orders */}
                <motion.div
                  whileHover={{ scale: 1.02, backgroundColor: "#eff6ff" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/orders")}
                  className="group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        My Orders
                      </h3>
                      <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                        Track shipments
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                  />
                </motion.div>

                {/* Security */}
                <motion.div
                  whileHover={{ scale: 1.02, backgroundColor: "#faf5ff" }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        Security
                      </h3>
                      <p className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors">
                        Login details
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                onClick={() => {
                  setSignOutLoader(true);
                  userLogout()
                    .then(() => {
                      navigate("/login");
                      toast.success("Logged out successfully");
                    })
                    .catch((err) => {
                      toast.error(err);
                    })
                    .finally(() => {
                      setSignOutLoader(false);
                    });
                }}
                disabled={signOutLoader}
                whileHover={!signOutLoader ? { scale: 1.02 } : {}}
                whileTap={!signOutLoader ? { scale: 0.95 } : {}}
                className={`w-full relative group overflow-hidden ${
                  signOutLoader
                    ? "bg-red-50 border-red-100"
                    : "bg-white border-red-100 hover:bg-red-500 hover:border-red-500"
                } border-2 p-1 rounded-3xl transition-colors duration-300`}
              >
                <div
                  className={`relative flex items-center justify-center gap-2 py-4 rounded-[1.3rem] transition-all duration-300 ${
                    signOutLoader ? "" : "group-hover:text-white"
                  }`}
                >
                  {signOutLoader ? (
                    <span className="loading loading-spinner loading-md text-red-500"></span>
                  ) : (
                    <>
                      <span className="font-bold text-red-500 group-hover:text-white transition-colors">
                        Log Out
                      </span>
                      <LogOut
                        size={18}
                        className="text-red-500 group-hover:text-white transition-colors"
                      />
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center pt-4">
              <p className="text-xs font-semibold text-gray-400">
                Member since {formatDateTime(user.createdAt)}
              </p>
              <div className="flex justify-center items-center gap-1 mt-1 text-[10px] text-gray-300">
                <Lock size={10} />
                <span>Secure Encrypted Connection</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UserAccount;