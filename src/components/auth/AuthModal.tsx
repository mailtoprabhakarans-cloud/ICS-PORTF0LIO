import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MailCheck,
  Phone,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useAuth, type AuthModalMode } from "@/lib/auth-context";
import { isSupabaseConfigured } from "@/lib/supabase";
import IcsLogo from "../site/IcsLogo";
import { toast } from "sonner";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
    verifyOtp,
    resendOtp,
    signInWithGoogle,
    resetPasswordForEmail,
  } = useAuth();

  const [mode, setMode] = useState<AuthModalMode>(authModalMode || "signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  // OTP State (Supports 6 to 8 Digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState<number>(45);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync mode when authModalMode opens
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [authModalMode, isAuthModalOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (mode === "otp" && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [mode, resendCountdown]);

  if (!isAuthModalOpen) return null;

  // Handle segmented OTP digit input
  const handleOtpDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance to next box if digit entered
    if (digit && index < 7) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    pasted.split("").forEach((ch, idx) => {
      if (idx < 8) newDigits[idx] = ch;
    });
    setOtpDigits(newDigits);

    const focusIndex = Math.min(pasted.length, 7);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || loading) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await resendOtp(email);
      if (error) {
        setErrorMessage(error.message);
        toast.error("Failed to resend code", { description: error.message });
      } else {
        setResendCountdown(45);
        toast.success("New verification code sent!", {
          description: `Check ${email} for your 6-digit OTP.`,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message);
          toast.error("Sign in failed", { description: error.message });
        } else {
          toast.success("Welcome back to ICS Computer Store!", {
            description: `Signed in as ${email}`,
          });
        }
      } else if (mode === "signup") {
        if (password.length < 6) {
          setErrorMessage("Password must be at least 6 characters long.");
          setLoading(false);
          return;
        }

        // Validate optional GST format if provided
        if (gstNumber.trim()) {
          const cleanGst = gstNumber.trim().toUpperCase();
          if (cleanGst.length < 15) {
            setErrorMessage("GSTIN number must be 15 characters long.");
            setLoading(false);
            return;
          }
        }

        const { error, demoOtp } = await signUp(email, password, {
          full_name: fullName,
          phone: phoneNumber,
          company_name: companyName,
          gst_number: gstNumber.toUpperCase().trim(),
        });

        if (error) {
          setErrorMessage(error.message);
          if (
            error.message.toLowerCase().includes("already exists") ||
            error.message.toLowerCase().includes("already registered")
          ) {
            toast.warning("Account Already Exists", {
              description: "This email is already registered. Please sign in instead.",
            });
          } else {
            toast.error("Account registration failed", { description: error.message });
          }
        } else {
          setMode("otp");
          setResendCountdown(45);
          setOtpDigits(["", "", "", "", "", "", "", ""]);
          toast.success("Verification code sent!", {
            description: `Please enter the verification code sent to ${email}.`,
          });
          setTimeout(() => {
            otpInputRefs.current[0]?.focus();
          }, 200);
        }
      } else if (mode === "otp") {
        const fullOtp = otpDigits.join("").trim();
        if (fullOtp.length < 6) {
          setErrorMessage("Please enter the complete verification code from your email.");
          setLoading(false);
          return;
        }

        const { error } = await verifyOtp(email, fullOtp, {
          full_name: fullName,
          phone: phoneNumber,
          company_name: companyName,
          gst_number: gstNumber.toUpperCase().trim(),
        });

        if (error) {
          setErrorMessage(error.message);
          toast.error("Verification failed", { description: error.message });
        } else {
          toast.success("Email verified successfully!", {
            description: `Welcome to ICS Computer Store, ${fullName || email}!`,
          });
        }
      } else if (mode === "forgot") {
        const { error } = await resetPasswordForEmail(email);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage("Password reset link has been sent to your email.");
          toast.success("Password Reset Sent", {
            description: "Check your inbox for password reset instructions.",
          });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 grid place-items-center p-3 sm:p-6 overflow-y-auto">
        {/* Soft elegant backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-all"
        />

        {/* Crisp Modern White/Dark Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl grid md:grid-cols-12"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="size-5" />
          </button>

          {/* LEFT HERO PANEL */}
          <div className="relative hidden md:flex md:col-span-5 flex-col justify-between p-8 bg-gradient-to-b from-blue-50/80 via-slate-50 to-indigo-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {/* Ambient Soft Glows */}
            <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 size-56 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12 size-56 rounded-full bg-red-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <div className="size-11 shrink-0 drop-shadow-sm">
                  <IcsLogo className="size-11" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5 leading-none">
                    <span className="font-display text-xl font-black text-red-600">ICS</span>
                    <span className="font-display text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                      COMPUTER STORE
                    </span>
                  </div>
                  <p className="text-[9.5px] font-bold text-blue-950 dark:text-sky-400 uppercase tracking-[0.06em] mt-1 whitespace-nowrap">
                    IT HARDWARE &amp; SOFTWARE | CCTV &amp; SECURITY | NETWORKING
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/90 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-3 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                  <Sparkles className="size-3 text-blue-600 dark:text-blue-400" /> Customer &amp; B2B Portal
                </span>
                <h4 className="mt-3 font-display text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  High Performance Hardware &amp; Engineering.
                </h4>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sign in to track custom PC builds, live chip-level motherboard lab tickets, and B2B GST tax invoices with 18% ITC credit.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-1">
                {[
                  {
                    icon: Receipt,
                    title: "B2B GST Tax Invoicing",
                    desc: "Claim 18% Input Tax Credit (ITC) on all enterprise purchases.",
                  },
                  {
                    icon: Cpu,
                    title: "Custom PC Configurator Sync",
                    desc: "Save and reload high-TDP gaming & workstation rigs.",
                  },
                  {
                    icon: Truck,
                    title: "Live Order Milestone Tracking",
                    desc: "From assembly QA stress tests to door delivery in Coimbatore.",
                  },
                  {
                    icon: Wrench,
                    title: "Chip-Level Service Lab",
                    desc: "Inspect live diagnostic stages & thermal reports.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 p-3 shadow-xs"
                  >
                    <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">
                      <item.icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="relative z-10 pt-6 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11.5px] text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" /> 256-Bit SSL Auth
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">EST. 2007</span>
            </div>
          </div>

          {/* RIGHT AUTH INTERACTION PANEL */}
          <div className="md:col-span-7 flex flex-col justify-center p-6 sm:p-9 bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Header with segmented switch */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {mode === "signin"
                    ? "Welcome Back"
                    : mode === "signup"
                      ? "Create Business / User Account"
                      : mode === "otp"
                        ? "Verify Email Address"
                        : "Reset Password"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {mode === "signin"
                    ? "Enter your credentials or continue with Google to access your dashboard."
                    : mode === "signup"
                      ? "Join ICS Computer Store for exclusive hardware pricing, GST invoicing & order tracking."
                      : mode === "otp"
                        ? `Enter the 6-digit OTP sent to ${email} to verify and activate your account.`
                        : "Enter your registered email to receive a password reset link."}
                </p>
              </div>

              {/* Segmented Switch Tabs (Sign In vs Sign Up) */}
              {mode !== "forgot" && mode !== "otp" && (
                <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/70 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
                      mode === "signin"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
                      mode === "signup"
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Error / Success Alerts */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-3.5 text-xs text-red-700 dark:text-red-300 font-medium"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="size-4.5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-relaxed">{errorMessage}</p>
                      {errorMessage.toLowerCase().includes("already") && (
                        <div className="mt-2.5 pt-2 border-t border-red-200/60 dark:border-red-900/40 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-red-600 dark:text-red-400 font-normal">Already have an account?</span>
                          <button
                            type="button"
                            onClick={() => {
                              setMode("signin");
                              setErrorMessage(null);
                            }}
                            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                          >
                            Sign In Now →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium"
                >
                  <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{successMessage}</span>
                </motion.div>
              )}

              {/* MODE: SIGN UP (Full Name, Phone, Company, GST, Email, Password) */}
              {mode === "signup" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                      Full Name *
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                      <User className="size-4.5 text-slate-400 mr-3 shrink-0" />
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                      Phone Number *
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                      <Phone className="size-4 text-slate-400 mr-2.5 shrink-0" />
                      <input
                        required
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98422 12345"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Company Name & GST Section */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                          Company Name
                        </label>
                        <span className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                          B2B Invoicing
                        </span>
                      </div>
                      <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                        <Building className="size-4 text-slate-400 mr-2.5 shrink-0" />
                        <input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Acme Tech / Studio"
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                          GST Number
                        </label>
                        <span className="text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          18% ITC Credit
                        </span>
                      </div>
                      <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                        <Receipt className="size-4 text-slate-400 mr-2.5 shrink-0" />
                        <input
                          maxLength={15}
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                          placeholder="33AAAAA0000A1Z5"
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-mono font-medium tracking-wide uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field with OTP Notice */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                        Email Address *
                      </label>
                      <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium">
                        OTP code will be sent here
                      </span>
                    </div>
                    <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                      <Mail className="size-4.5 text-slate-400 mr-3 shrink-0" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                        Password *
                      </label>
                      <span className="text-[9.5px] text-slate-500 dark:text-slate-400">
                        Min. 6 characters
                      </span>
                    </div>
                    <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                      <Lock className="size-4.5 text-slate-400 mr-3 shrink-0" />
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* MODE: SIGN IN */}
              {mode === "signin" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                      Email Address
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                      <Mail className="size-4.5 text-slate-400 mr-3 shrink-0" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                      <Lock className="size-4.5 text-slate-400 mr-3 shrink-0" />
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* MODE: EMAIL OTP VERIFICATION */}
              {mode === "otp" && (
                <div className="space-y-5 py-2">
                  <div className="rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white shrink-0 shadow-sm">
                        <MailCheck className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Email Confirmation Sent
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                          Enter 6-digit code sent to <strong className="text-blue-600 dark:text-blue-400">{email}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Segmented OTP Input (Supports 6 to 8 Digits) */}
                  <div>
                    <label className="mb-2 block text-center text-xs font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                      Enter Verification Code
                    </label>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          className="size-9 sm:size-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono text-lg sm:text-xl font-black text-slate-900 dark:text-white outline-none transition-all focus:border-blue-600 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-600/15"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend OTP & Change Email Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setErrorMessage(null);
                      }}
                      className="inline-flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <ArrowLeft className="size-3.5" /> Change Email / Edit Info
                    </button>

                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      {resendCountdown > 0 ? (
                        <span>
                          Resend code in <strong className="text-slate-800 dark:text-slate-200 font-bold">{resendCountdown}s</strong>
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={loading}
                          onClick={handleResendOtp}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all flex items-center gap-1"
                        >
                          <RotateCcw className="size-3.5" /> Resend OTP Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE: FORGOT PASSWORD */}
              {mode === "forgot" && (
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                    Registered Email Address
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600/15">
                    <Mail className="size-4.5 text-slate-400 mr-3 shrink-0" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Primary Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : mode === "signin" ? (
                  <>
                    <KeyRound className="size-4" /> Sign In to Account
                  </>
                ) : mode === "signup" ? (
                  <>
                    <MailCheck className="size-4" /> Create Account &amp; Verify Email OTP
                  </>
                ) : mode === "otp" ? (
                  <>
                    <ShieldCheck className="size-4" /> Verify Email &amp; Activate Account
                  </>
                ) : (
                  <>
                    <Mail className="size-4" /> Send Reset Instructions
                  </>
                )}
              </motion.button>

              {/* Google Single Sign-On Button (Available in signin & signup) */}
              {(mode === "signin" || mode === "signup") && (
                <>
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    <span className="bg-white dark:bg-slate-900 px-3 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Or continue with
                    </span>
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>

                  <motion.button
                    type="button"
                    onClick={async () => {
                      setErrorMessage(null);
                      setLoading(true);
                      const { error } = await signInWithGoogle();
                      setLoading(false);
                      if (error) {
                        setErrorMessage(error.message);
                        toast.error("Google sign-in failed", { description: error.message });
                      }
                    }}
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                  >
                    <svg className="size-4.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </motion.button>
                </>
              )}

              {/* Back to Sign In link */}
              {(mode === "forgot" || mode === "otp") && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMessage(null);
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="size-3.5" /> Back to Sign In
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
