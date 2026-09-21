import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  FileText,
  Heart,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Receipt,
  RotateCcw,
  Save,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useApp } from "@/lib/store";
import { fetchUserQuotes, fetchUserPcBuilds, fetchUserOrders } from "@/lib/supabase-api";
import type { DbOrder } from "@/lib/supabase";
import { toast } from "sonner";

export default function UserAccountDrawer() {
  const { user, profile, isAccountDrawerOpen, closeAccountDrawer, signOut, updateProfile } =
    useAuth();
  const { wishlist, openQuote, addToCart } = useApp();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "quotes" | "builds">("orders");

  // Profile Edit State
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [company, setCompany] = useState(profile?.company_name || "");
  const [gst, setGst] = useState(profile?.gst_number || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [isSaving, setIsSaving] = useState(false);

  // User orders, quotes & builds history
  const [userOrders, setUserOrders] = useState<DbOrder[]>([]);
  const [userQuotes, setUserQuotes] = useState<any[]>([]);
  const [userBuilds, setUserBuilds] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setCompany(profile.company_name || "");
      setGst(profile.gst_number || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  useEffect(() => {
    if (user && isAccountDrawerOpen) {
      setLoadingHistory(true);
      Promise.all([
        fetchUserOrders(user.id),
        fetchUserQuotes(user.id),
        fetchUserPcBuilds(user.id),
      ]).then(([orders, quotes, builds]) => {
        setUserOrders(orders);
        setUserQuotes(quotes);
        setUserBuilds(builds);
        setLoadingHistory(false);
      });
    }
  }, [user, isAccountDrawerOpen]);

  if (!isAccountDrawerOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await updateProfile({
      full_name: fullName,
      phone,
      company_name: company,
      gst_number: gst,
      address,
    });
    setIsSaving(false);
    if (error) {
      toast.error("Failed to update profile", { description: error.message });
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  const PRODUCT_TRACKING_STEPS = [
    { step: 1, title: "Order Placed", desc: "Recorded at Podanur Store" },
    { step: 2, title: "Shipped", desc: "Packed & Dispatched with tracking" },
    { step: 3, title: "Out for Delivery", desc: "Courier out for delivery" },
    { step: 4, title: "Delivered", desc: "Package delivered to customer" },
  ];

  const SERVICE_TRACKING_STEPS = [
    { step: 1, title: "Service Booked", desc: "Device received at service lab" },
    { step: 2, title: "Assembly & Testing", desc: "Chip-level diagnostics & QA test" },
    { step: 3, title: "Ready for Pickup / Out", desc: "Tested & packed for handover" },
    { step: 4, title: "Handover Complete", desc: "Delivered & warranty registered" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAccountDrawer}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
        />

        {/* Drawer Window */}
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="relative z-10 flex h-full w-full max-w-lg flex-col bg-card shadow-soft border-l border-border/60"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-surface/50 p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-gradient-brand text-white font-display text-lg font-black shadow-lift">
                {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  {profile?.full_name || "Customer Account"}
                </h3>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <button
              onClick={closeAccountDrawer}
              aria-label="Close drawer"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border/40 bg-surface/30 px-3 pt-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {[
              { id: "orders", label: `My Orders & Tracking (${userOrders.length})`, icon: Package },
              { id: "profile", label: "My Profile", icon: User },
              { id: "quotes", label: `Quotes (${userQuotes.length})`, icon: Receipt },
              { id: "builds", label: `Saved Rigs (${userBuilds.length})`, icon: Cpu },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-brand-blue text-brand-blue"
                    : "border-transparent text-muted-foreground hover:text-ink"
                }`}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* 1. ORDERS TAB WITH LIVE TRACKING PROGRESS */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface border border-border">
                      <Package className="size-7 text-brand-blue" />
                    </div>
                    <p className="mt-3 font-display text-base font-bold text-ink">No Order History Found</p>
                    <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                      Items you add to cart and place will appear here with live tracking progress.
                    </p>
                  </div>
                ) : (
                  userOrders.map((order) => {
                    const currentStepNum = order.tracking_step || 1;
                    const isService =
                      order.items.some((it) => it.name.toLowerCase().includes("repair") || it.name.toLowerCase().includes("service") || it.name.toLowerCase().includes("assembly"));
                    const activeSteps = isService ? SERVICE_TRACKING_STEPS : PRODUCT_TRACKING_STEPS;

                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-border/60 bg-surface/60 p-4 space-y-3 shadow-xs"
                      >
                        {/* Order Header */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-xs font-bold text-brand-blue">
                                {order.id}
                              </span>
                              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                {order.status === "Assembled & Tested" ? (isService ? "Assembly & Testing" : "Shipped") : order.status}
                              </span>
                              {order.payment_id ? (
                                <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                  Paid (Razorpay)
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                  {order.payment_method?.includes("Cash") ? "COD" : "Pay on Handover"}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-display text-sm font-extrabold text-brand-red">
                              ₹{Number(order.grand_total).toLocaleString("en-IN")}
                            </span>
                            <span className="block text-[10px] text-muted-foreground">
                              {order.items.length} item(s)
                            </span>
                          </div>
                        </div>

                        {/* LIVE TRACKING PROGRESS BAR */}
                        <div className="rounded-xl border border-border/40 bg-card/60 p-3.5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                              <Truck className="size-3.5 text-brand-blue" />
                              {isService ? "Service & Assembly Progress" : "Live Product Shipping Tracking"}
                            </span>
                            <span className="text-[10.5px] font-semibold text-brand-blue">
                              {order.estimated_delivery}
                            </span>
                          </div>

                          {/* Progress Stepper */}
                          <div className="relative flex justify-between items-start pt-1">
                            {/* Horizontal line */}
                            <div className="absolute top-3 left-4 right-4 h-0.5 bg-border -z-0" />
                            <div
                              className="absolute top-3 left-4 h-0.5 bg-brand-blue -z-0 transition-all duration-500"
                              style={{
                                width: `${((currentStepNum - 1) / (activeSteps.length - 1)) * 100}%`,
                              }}
                            />

                            {activeSteps.map((stepItem) => {
                              const isCompleted = stepItem.step <= currentStepNum;
                              const isCurrent = stepItem.step === currentStepNum;

                              return (
                                <div key={stepItem.step} className="flex flex-col items-center z-10 text-center max-w-[75px]">
                                  <div
                                    className={`grid size-6 place-items-center rounded-full text-[10px] font-bold transition-all ${
                                      isCompleted
                                        ? "bg-brand-blue text-white shadow-lift"
                                        : "border border-border bg-card text-muted-foreground"
                                    } ${isCurrent ? "ring-4 ring-brand-blue/20 animate-pulse" : ""}`}
                                  >
                                    {isCompleted ? <CheckCircle2 className="size-3.5" /> : stepItem.step}
                                  </div>
                                  <span className={`mt-1 text-[9.5px] font-bold leading-tight ${isCurrent ? "text-brand-blue" : isCompleted ? "text-ink" : "text-muted-foreground"}`}>
                                    {stepItem.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                            Purchased Components:
                          </p>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0"
                            >
                              <div className="min-w-0 flex-1 pr-2">
                                <span className="font-semibold text-ink truncate block">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  Qty: {item.qty} · {item.brand || "ICS"}
                                </span>
                              </div>
                              <span className="font-mono text-xs font-bold text-ink shrink-0">
                                ₹{(item.price * item.qty).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Reorder / Contact Support */}
                        <div className="flex gap-2 pt-2">
                          <a
                            href={`https://wa.me/919626644496?text=${encodeURIComponent(`Hi ICS Computer Store, I want to check status on order #${order.id}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            <MessageCircle className="size-3.5" /> WhatsApp Support
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="rounded-2xl border border-border/50 bg-surface/40 p-4 space-y-3">
                  <span className="text-[11px] font-bold tracking-wider text-brand-blue uppercase flex items-center gap-1.5">
                    <User className="size-3.5" /> Personal & Business Details
                  </span>

                  <div>
                    <label className="block text-[10.5px] font-bold text-muted-foreground uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Ramesh Kumar"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-muted-foreground uppercase mb-1">
                      Phone Number (for Order Updates & WhatsApp)
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputCls}
                      placeholder="+91 98422 12345"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10.5px] font-bold text-muted-foreground uppercase mb-1">
                        Company Name
                      </label>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className={inputCls}
                        placeholder="Company / Firm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-muted-foreground uppercase mb-1">
                        GSTIN (Tax Invoices)
                      </label>
                      <input
                        value={gst}
                        onChange={(e) => setGst(e.target.value)}
                        className={inputCls}
                        placeholder="33AAAAA0000A1Z5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-muted-foreground uppercase mb-1">
                      Delivery Address (Coimbatore & Tamil Nadu)
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={inputCls}
                      placeholder="Building, Street, Landmark, Pin code..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand py-3 text-xs font-bold text-white shadow-lift transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Save className="size-3.5" />
                  {isSaving ? "Saving Updates..." : "Save Profile Details"}
                </button>
              </form>
            )}

            {/* 3. QUOTES TAB */}
            {activeTab === "quotes" && (
              <div className="space-y-3">
                {userQuotes.length === 0 ? (
                  <div className="py-16 text-center">
                    <Receipt className="mx-auto size-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-semibold text-ink">No Quote Requests Yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Request custom quotes on PC builds or CCTV projects and track them here.
                    </p>
                    <button
                      onClick={() => {
                        closeAccountDrawer();
                        openQuote();
                      }}
                      className="mt-4 rounded-full bg-brand-blue px-5 py-2 text-xs font-bold text-white shadow-blue"
                    >
                      Request a Quote
                    </button>
                  </div>
                ) : (
                  userQuotes.map((q) => (
                    <div
                      key={q.id}
                      className="rounded-2xl border border-border/60 bg-surface/60 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-ink">{q.service_category}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            q.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{q.notes || "Standard proforma quote request"}</p>
                      <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                        <span>Submitted on {new Date(q.created_at).toLocaleDateString()}</span>
                        <span className="font-bold text-brand-blue">ICS Podanur</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 4. SAVED RIGS TAB */}
            {activeTab === "builds" && (
              <div className="space-y-3">
                {userBuilds.length === 0 ? (
                  <div className="py-16 text-center">
                    <Cpu className="mx-auto size-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-semibold text-ink">No Saved PC Builds</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Use our PC Configurator to assemble high-performance rigs and save them to your account.
                    </p>
                  </div>
                ) : (
                  userBuilds.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-border/60 bg-surface/60 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-ink">{b.build_name}</span>
                        <span className="font-display text-sm font-extrabold text-brand-red">
                          ₹{Number(b.total_price).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Estimated Power: {b.estimated_tdp || "~450"}W · 3Y Warranty Assembly
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer with Sign Out */}
          <div className="border-t border-border/50 bg-surface/60 p-4">
            <button
              onClick={signOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 transition-colors hover:bg-red-500 hover:text-white"
            >
              <LogOut className="size-4" /> Sign Out
            </button>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}

const inputCls =
  "w-full rounded-xl border border-border/70 bg-card px-3.5 py-2 text-xs text-ink outline-none transition-all placeholder:text-muted-foreground focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
