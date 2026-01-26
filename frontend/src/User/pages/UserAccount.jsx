import { Mail, Phone, MapPin, ShoppingBag, Lock, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useUserBear from "../../../store/user.store";

const UserAccount = () => {
  const { user, userProfileUpdate, userAddressUpdate } = useUserBear((state) => state);
  const { handleSubmit, register, reset, formState:{errors} } = useForm({});

  const [editProfile, setEditProfile] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);
  const [addressLoader, setAddressLoader] = useState(false);

  useEffect(() => {
    reset({
      fullname: user?.fullname || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
  }, [user, reset]);

  const editHandler = async (data) => {
    try {
        if(user.fullname==data.fullname.trim() || user.phone==data.phone.trim()){
            return toast.error("No change detected")
        }

      setProfileLoader(true);
      await userProfileUpdate({fullname:data.fullname,phone:data.phone});
      toast.success("Profile updated")
    } catch (error) {
      toast.error(error);
    } finally {
      setProfileLoader(false);
      setEditProfile(false);
    }
  };

  const addressHandler = async(data)=>{
    try {
        if(user.address==data.address.trim()){
            return toast.error("No change detected")
        }
      setAddressLoader(true);
      await userAddressUpdate({address:data.address});
      toast.success("Address updated")
    } catch (error) {
      toast.error(error);
    } finally {
        setAddressLoader(false)
      setEditAddress(false);
    }
  }

  return (
    <section className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-base-content/60">
            Manage your personal information
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="card bg-base-100 shadow mb-8">
          <div className="card-body">
            <form
              onSubmit={handleSubmit(editHandler)}
              className="flex flex-wrap gap-6 items-center"
            >
              {/* AVATAR */}
              <div className="avatar avatar-placeholder placeholder">
                <div className="bg-primary text-primary-content rounded-full w-20">
                  <span className="text-3xl">{user.fullname.charAt(0)}</span>
                </div>
              </div>

              {/* INFO */}
              <div className="flex-1">
                {!editProfile ? (
                  <h2 className="text-xl font-semibold">{user.fullname}</h2>
                ) : (
                  <input
                    {...register("fullname", { required: true })}
                    className="input outline-none"
                  />
                )}

                <div className="mt-2 space-y-1 text-sm text-base-content/70">
                  <p className="flex items-center gap-2">
                    <Mail size={16} /> {user.email}
                  </p>
                  {!editProfile ? (
                    <p className="flex items-center gap-2">
                      <Phone size={16} /> {user.phone}
                    </p>
                  ) : (
                    <input
                      type="tel"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^(?:\+91)?[6-9]\d{9}$/,
                          message: "Invalid phone number",
                        },
                      })}
                      className="input outline-none"
                    />
                  )}
                  <p className="text-error">{errors.phone && 'Invalid phone no.'}</p>
                </div>
              </div>

              {/* ACTION */}
              {!editProfile ? (
                <div
                  onClick={() => setEditProfile(true)}
                  className="btn btn-outline btn-sm"
                >
                  Edit Profile
                </div>
              ) : (
                <button
                  type="submit"
                  className={` ${profileLoader ? "btn-disabled" : ""} btn btn-outline btn-sm`}
                >
                  Save changes{" "}
                  {profileLoader && (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="card bg-base-100 shadow mb-8">
          <div className="card-body">
            <form onSubmit={handleSubmit(addressHandler)}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <MapPin />
                  <h3 className="font-semibold text-lg">
                    Saved Address
                  </h3>
                </div>

                {!editAddress && (
                  <button
                    type="button"
                    onClick={() => setEditAddress(true)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </button>
                )}
              </div>

              {!editAddress ? (
                <p className="text-sm text-base-content/70">
                  {user?.address || "No address added"}
                </p>
              ) : (
                <>
                  <textarea
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 10,
                        message: "Address too short",
                      },
                    })}
                    className="textarea textarea-bordered w-full"
                    placeholder="Enter full address"
                  ></textarea>

                  {errors.address && (
                    <p className="text-error text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}

                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      className={`btn btn-primary btn-sm ${
                        profileLoader && "btn-disabled"
                      }`}
                    >
                      Save Address{" "}{addressLoader && (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditAddress(false);
                        reset({ address: user.address });
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>

        {/* ACCOUNT OPTIONS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ORDERS */}
          <div className="card bg-base-100 shadow hover:shadow-md transition cursor-pointer">
            <div className="card-body flex-row items-center gap-4">
              <div className="p-3 rounded-xl bg-info/10 text-info">
                <ShoppingBag />
              </div>
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-base-content/60">
                  View & track orders
                </p>
              </div>
            </div>
          </div>

          {/* SECURITY */}
          <div className="card bg-base-100 shadow hover:shadow-md transition cursor-pointer">
            <div className="card-body flex-row items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                <Lock />
              </div>
              <div>
                <h3 className="font-semibold">Security</h3>
                <p className="text-sm text-base-content/60">Change password</p>
              </div>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="mt-10">
          <button className="btn btn-error btn-outline flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserAccount;
