import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { lookupOrderById, lookupRepairTicket } from "@/lib/supabase-api";
import type { DbOrder, DbRepairTicket } from "@/lib/supabase";

export default function OrderTrackingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [orderQuery, setOrderQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState<DbOrder | null>(null);
  const [foundService, setFoundService] = useState<DbRepairTicket | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = orderQuery.trim().toUpperCase();
    if (!q) return;

    setLoading(true);
    setErrorMsg(null);
    setFoundOrder(null);
    setFoundService(null);

    // 1. Check Service Tickets first if ID starts with ICS-SRV or SRV
    if (q.includes("SRV") || q.includes("REP")) {
      const srvRes = await lookupRepairTicket(q);
      if (srvRes.success && srvRes.ticket) {
        setFoundService(srvRes.ticket);
        setLoading(false);
        return;
      }
    }

    // 2. Check Orders
    const res = await lookupOrderById(q);
    if (res.success && res.order) {
      setFoundOrder(res.order);
      setLoading(false);
      return;
    }

    // 3. Fallback check repair ticket
    const srvRes = await lookupRepairTicket(q);
    if (srvRes.success && srvRes.ticket) {
      setFoundService(srvRes.ticket);
      setLoading(false);
      return;
    }

    setLoading(false);
    setErrorMsg("No Order or Service Ticket found with this tracking ID.");
  };

  const PRODUCT_TRACKING_STEPS = [
    { step: 1, title: "Order Placed", desc: "Recorded at Podanur Store" },
    { step: 2, title: "Shipped", desc: "Packed & Dispatched with courier" },
    { step: 3, title: "Out for Delivery", desc: "Courier out for delivery" },
    { step: 4, title: "Delivered", desc: "Delivered & verified" },
  ];

  const SERVICE_TRACKING_STEPS = [
    { step: 1, title: "Service Booked", desc: "Device received at service lab" },
    { step: 2, title: "Assembly & Testing", desc: "Chip-level diagnostics & QA test" },
    { step: 3, title: "Ready for Pickup", desc: "Tested & packed for handover" },
    { step: 4, title: "Handover Complete", desc: "Delivered & warranty registered" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 grid place-items-center p-3 sm:p-6 overflow-y-auto">
        {/* Soft elegant backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
        />

        {/* Crisp Light Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)]"
        >
          {/* Header Banner (Soft Light Blue) */}
          <div className="relative bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50/60 px-6 sm:px-8 py-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Truck className="size-4" />
              </span>
              <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase">
                Public Order Tracking
              </span>
            </div>
            <h3 className="mt-2 font-display text-2xl font-black text-slate-900">
              Track Your Order & Delivery
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Enter your Order Number (e.g. ICS-ORD-9021) to check live assembly, QA testing, and dispatch milestones.
            </p>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Search Box & Content */}
          <div className="p-6 sm:p-8 space-y-5 bg-white">
            <form onSubmit={handleLookup} className="flex gap-2">
              <div className="flex flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                <Search className="size-4.5 text-slate-400 mr-2.5" />
                <input
                  required
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. ICS-ORD-9021"
                  className="w-full bg-transparent font-mono text-xs sm:text-sm font-bold text-slate-900 outline-none uppercase placeholder:font-sans placeholder:text-slate-400"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Track"}
              </motion.button>
            </form>

            {/* Error banner */}
            {errorMsg && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Order Progress Details */}
            {foundOrder && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-blue-600">
                        {foundOrder.id}
                      </span>
                      <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700">
                        {foundOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Customer: {foundOrder.customer_name} · {foundOrder.delivery_address}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-display text-base font-extrabold text-red-600">
                      ₹{Number(foundOrder.grand_total).toLocaleString("en-IN")}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {foundOrder.items.length} Component(s)
                    </span>
                  </div>
                </div>

                {/* Stepper Progress */}
                {(() => {
                  const isService = foundOrder.items.some(
                    (it) =>
                      it.name.toLowerCase().includes("repair") ||
                      it.name.toLowerCase().includes("service") ||
                      it.name.toLowerCase().includes("assembly"),
                  );
                  const activeSteps = isService ? SERVICE_TRACKING_STEPS : PRODUCT_TRACKING_STEPS;

                  return (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Truck className="size-3.5 text-blue-600" />
                          {isService ? "Service & Assembly Progress" : "Live Product Shipping Progress"}
                        </span>
                        <span className="text-[11px] font-semibold text-blue-600">
                          {foundOrder.estimated_delivery}
                        </span>
                      </div>

                      <div className="relative flex justify-between items-start pt-2">
                        <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                        <div
                          className="absolute top-3.5 left-4 h-0.5 bg-blue-600 -z-0 transition-all duration-500"
                          style={{
                            width: `${((foundOrder.tracking_step - 1) / (activeSteps.length - 1)) * 100}%`,
                          }}
                        />

                        {activeSteps.map((stepItem) => {
                          const isCompleted = stepItem.step <= foundOrder.tracking_step;
                          const isCurrent = stepItem.step === foundOrder.tracking_step;

                          return (
                            <div key={stepItem.step} className="flex flex-col items-center z-10 text-center max-w-[80px]">
                              <div
                                className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-all ${
                                  isCompleted
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-400"
                                } ${isCurrent ? "ring-4 ring-blue-600/20 animate-pulse" : ""}`}
                              >
                                {isCompleted ? <CheckCircle2 className="size-4" /> : stepItem.step}
                              </div>
                              <span
                                className={`mt-1.5 text-[10px] font-bold leading-tight ${isCurrent ? "text-blue-600" : isCompleted ? "text-slate-900" : "text-slate-400"}`}
                              >
                                {stepItem.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Items List */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                    Order Items:
                  </p>
                  {foundOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0"
                    >
                      <span className="font-semibold text-slate-800 truncate pr-2">
                        {item.name} (x{item.qty})
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900 shrink-0">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Service Ticket Progress Details */}
            {foundService && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-blue-600">
                        {foundService.id}
                      </span>
                      <span className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[10.5px] font-bold text-blue-700">
                        {foundService.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold mt-1">
                      💻 {foundService.device_name} · Customer: {foundService.customer_name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Issue: {foundService.issue_description}
                    </p>
                  </div>

                  {foundService.estimated_cost && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Est. Total</span>
                      <span className="font-display text-base font-extrabold text-red-600">
                        ₹{Number(foundService.estimated_cost).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* 5-Stage Service Stepper */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Truck className="size-3.5 text-blue-600" /> Lab Repair & Diagnostics Stage
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600">
                      {foundService.estimated_delivery}
                    </span>
                  </div>

                  <div className="relative flex justify-between items-start pt-2">
                    <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                    {(() => {
                      const completedCount = foundService.steps.filter((s) => s.completed).length;
                      const pct = Math.min(100, Math.max(0, (completedCount / (foundService.steps.length - 1)) * 100));
                      return (
                        <div
                          className="absolute top-3.5 left-4 h-0.5 bg-blue-600 -z-0 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      );
                    })()}

                    {foundService.steps.map((st, idx) => (
                      <div key={idx} className="flex flex-col items-center z-10 text-center max-w-[75px]">
                        <div
                          className={`grid size-7 place-items-center rounded-full text-xs font-bold transition-all ${
                            st.completed
                              ? "bg-emerald-600 text-white shadow-sm"
                              : st.current
                              ? "bg-blue-600 text-white shadow-sm ring-4 ring-blue-600/20 animate-pulse"
                              : "border border-slate-200 bg-white text-slate-400"
                          }`}
                        >
                          {st.completed ? <CheckCircle2 className="size-4" /> : idx + 1}
                        </div>
                        <span
                          className={`mt-1.5 text-[9.5px] font-bold leading-tight ${
                            st.current
                              ? "text-blue-600"
                              : st.completed
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
