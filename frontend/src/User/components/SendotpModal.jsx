import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldCheck, RefreshCw, Lock, Info } from "lucide-react";
import useUserBear from "../../../store/user.store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SendotpModal = ({ email, password, msg, changePassword = false }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(null);
  const navigate = useNavigate();
  const { verifyOtp, userLogin, resendOtp, updatePassword } = useUserBear((state) => state);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setOtp(value);
      if (error) setError("");
    }
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      if (!changePassword) {
        await verifyOtp({ email, otp });
        await userLogin({ email, password });
      } else {
        await updatePassword({ email, password, otp });
        await userLogin({ email, password });
      }
      navigate("/account");
      toast.success(msg);
    } catch (error) {
      setError(error);
      shakeInput();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoadingResend(true)
      await resendOtp({ email,topic: changePassword ? "Password Change" : 'Account Verification'});
      setResendMessage(`Code sent to ${email}`);
      const t = setTimeout(() => setResendMessage(""), 5000);
      setResendTimer(t);
    } catch (error) {
      setError(error);
    } finally{
      setIsLoadingResend(false)
    }
  };

  useEffect(() => {
    return () => {
      if (resendTimer) clearTimeout(resendTimer);
    };
  }, [resendTimer]);

  const [isShaking, setIsShaking] = useState(false);
  const shakeInput = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <dialog id="otp_modal" className="modal bg-black/60 backdrop-blur-sm">
      <div className="modal-box p-0 bg-transparent shadow-none min-w-50 max-w-md w-full overflow-visible">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative bg-neutral-950 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <div className="badge badge-soft absolute left-5 top-5 badge-neutral text-sm font-bold"><Info size={16}/>CHECK SPAM IF</div>
          
          <form method="dialog">
            <button className="absolute cursor-pointer right-5 top-5 text-neutral-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </form>

          <div className="flex flex-col items-center mb-8 mt-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
              <div className="relative w-16 h-16 bg-neutral-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 rounded-full border-4 border-neutral-950"
              >
                <Lock size={12} strokeWidth={3} />
              </motion.div>
            </div>

            <h3 className="text-2xl font-semibold text-center text-white tracking-tight">
              Verification Required
            </h3>
            
            <p className="text-neutral-400 flex flex-col gap-2 text-sm mt-2 text-center">
              Enter the 6-digit code sent to <br/>
              <span className="text-white font-medium  bg-white/10 px-2 py-0.5 rounded">{email}</span>
            </p>
          </div>

          <motion.div 
            animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative mb-8 w-full"
          >
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
              autoFocus
              autoComplete="one-time-code"
              maxLength={6}
            />
            <div className="flex justify-between gap-2">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    borderColor: otp[i] ? "rgba(255,255,255,0.4)" : error ? "rgba(220,38,38,0.5)" : "rgba(255,255,255,0.1)",
                    scale: otp.length === i ? 1.05 : 1,
                    backgroundColor: otp[i] ? "rgba(255,255,255,0.03)" : "transparent"
                  }}
                  className={`w-12 h-14 rounded-xl border flex items-center justify-center text-2xl font-medium transition-all duration-200 
                    ${otp.length === i ? "ring-2 ring-white/20 shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]" : ""}
                  `}
                >
                  <AnimatePresence mode="wait">
                    {otp[i] && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-white"
                      >
                        {otp[i]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!otp[i] && otp.length === i && (
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
            {error && (
               <div className="mt-3 mb-9 flex animate-pulse items-center justify-center gap-1">
               <Info size={16} className=" text-red-500 " />
                <motion.p 
                 initial={{ opacity: 0, y: -10 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 className="text-red-500 text-xs text-center font-medium"
               >
                 {error}
               </motion.p>
               </div>
            )}
          </motion.div>

          <button
            onClick={handleVerify}
            disabled={otp.length < 6 || isLoading}
            className="w-full bg-white text-black h-12 rounded-xl font-semibold text-sm hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span className="relative z-10">Verify & Proceed</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent w-1/2 -translate-x-full group-hover:animate-shimmer" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <button
              disabled={isLoadingResend}
              onClick={handleResend} 
              className="text-neutral-500 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={12} className={isLoadingResend ? "animate-spin" : ""} /> 
              Resend Code
            </button>
            {resendMessage && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-green-400 text-xs mt-2 font-medium"
              >
                {resendMessage}
              </motion.p>
            )}
          </div>

        </motion.div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SendotpModal;