import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  Headphones,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
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
    signInWithGoogle,
    resetPasswordForEmail,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(authModalMode || "signin");
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

  if (!isAuthModalOpen) return null;

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

        const { error, user } = await signUp(email, password, {
          full_name: fullName,
          phone: phoneNumber,
          company_name: companyName,
        });

        if (error) {
          setErrorMessage(error.message);
          toast.error("Sign up failed", { description: error.message });
        } else {
          if (!isSupabaseConfigured || user?.identities?.length !== 0) {
            toast.success("Account created successfully!", {
              description: "You are now signed in to ICS Computer Store.",
            });
          } else {
            setSuccessMessage("Please check your email for the confirmation link to activate your account.");
            toast.success("Verification email sent", {
              description: "Please check your inbox to confirm your account.",
            });
          }
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
        />

        {/* Crisp Modern White/Light Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] grid md:grid-cols-12"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="size-5" />
          </button>

          {/* LEFT HERO PANEL (Light Blue / Soft Slate Background) */}
          <div className="relative hidden md:flex md:col-span-5 flex-col justify-between p-8 bg-gradient-to-b from-blue-50/70 via-slate-50 to-indigo-50/50 border-r border-slate-100 overflow-hidden">
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
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-display text-xl font-black text-red-600">ICS</span>
                    <span className="font-display text-base font-extrabold text-slate-900 tracking-wider uppercase">
                      COMPUTER STORE
                    </span>
                  </div>
                  <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Podanur, Coimbatore
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 border border-blue-200 px-3 py-1 text-[11px] font-bold text-blue-700">
                  <Sparkles className="size-3 text-blue-600" /> Customer Portal
                </span>
                <h4 className="mt-3 font-display text-2xl font-black text-slate-900 leading-tight">
                  High Performance Hardware & Engineering.
                </h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Sign in to track custom PC builds, live chip-level motherboard lab tickets, and B2B GST tax invoices.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-1">
                {[
                  {
                    icon: Cpu,
                    title: "PC Configurator Sync",
                    desc: "Save and reload high-TDP gaming & workstation rigs.",
                  },
                  {
                    icon: Truck,
                    title: "Live Order Milestone Tracking",
                    desc: "From assembly QA stress tests to door delivery.",
                  },
                  {
                    icon: Wrench,
                    title: "Chip-Level Service Lab",
                    desc: "Inspect live diagnostic stages & thermal reports.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl bg-white/80 border border-slate-200/60 p-3 shadow-xs">
                    <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-600">
                      <item.icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="relative z-10 pt-6 border-t border-slate-200/70 flex items-center justify-between text-[11.5px] text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600" /> 256-Bit SSL Auth
              </span>
              <span className="text-slate-400 font-bold">EST. 2007</span>
            </div>
          </div>

          {/* RIGHT AUTH INTERACTION PANEL (Crisp White Form) */}
          <div className="md:col-span-7 flex flex-col justify-center p-6 sm:p-9 bg-white">
            {/* Header with segmented switch */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                  {mode === "signin"
                    ? "Welcome Back"
                    : mode === "signup"
                      ? "Create Your Account"
                      : "Reset Password"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {mode === "signin"
                    ? "Enter your credentials or continue with Google to access your dashboard."
                    : mode === "signup"
                      ? "Join ICS Computer Store for exclusive hardware pricing & order tracking."
                      : "Enter your registered email to receive a password reset link."}
                </p>
              </div>

              {/* Sleek Light Segmented Switch Tabs */}
              {mode !== "forgot" && (
                <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
                      mode === "signin"
                        ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                        : "text-slate-600 hover:text-slate-900"
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
                        ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Error / Success Alerts */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium"
                >
                  <AlertCircle className="size-4.5 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 font-medium"
                >
                  <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </motion.div>
              )}

              {/* Sign Up Fields */}
              {mode === "signup" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                      Full Name
                    </label>
                    <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                      <User className="size-4.5 text-slate-400 mr-3" />
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                        Phone Number
                      </label>
                      <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                        <Phone className="size-4 text-slate-400 mr-2.5" />
                        <input
                          required
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 98422 12345"
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                        Company (Optional)
                      </label>
                      <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                        <Building className="size-4 text-slate-400 mr-2.5" />
                        <input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enterprise / GST"
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                  Email Address
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                  <Mail className="size-4.5 text-slate-400 mr-3" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                    <Lock className="size-4.5 text-slate-400 mr-3" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Submit Button (Gradient Blue-Indigo) */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : mode === "signin" ? (
                  <>
                    <KeyRound className="size-4" /> Sign In to Account
                  </>
                ) : mode === "signup" ? (
                  <>
                    <ShieldCheck className="size-4" /> Create ICS Account
                  </>
                ) : (
                  <>
                    <Mail className="size-4" /> Send Reset Instructions
                  </>
                )}
              </motion.button>

              {/* Google Single Sign-On Button */}
              {mode !== "forgot" && (
                <>
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-slate-200" />
                    <span className="bg-white px-3 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Or continue with
                    </span>
                    <div className="w-full border-t border-slate-200" />
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
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 py-3 text-xs sm:text-sm font-bold text-slate-700 shadow-xs transition-all hover:border-slate-300"
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

              {/* Forgot password return link */}
              {mode === "forgot" && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    ← Back to Sign In
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
