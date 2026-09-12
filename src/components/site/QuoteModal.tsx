import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Receipt,
  Send,
  Sparkles,
  User,
  Wrench,
  X,
} from "lucide-react";
import { CONTACT, SERVICE_TYPES, waLink } from "@/lib/site-data";
import { useApp } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { submitQuoteToBackend } from "@/lib/supabase-api";
import IcsLogo from "./IcsLogo";
import { toast } from "sonner";

export default function QuoteModal() {
  const { isQuoteOpen, quotePreset, closeQuote } = useApp();
  const { user, profile } = useAuth();

  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState(SERVICE_TYPES[0]!);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isQuoteOpen) {
      setSent(false);
      if (profile) {
        if (profile.full_name) setName(profile.full_name);
        if (profile.phone) setPhone(profile.phone);
        if (profile.email) setEmail(profile.email);
      } else if (user?.email) {
        setEmail(user.email);
      }

      if (quotePreset) {
        setNotes(quotePreset);
        const match = SERVICE_TYPES.find((s) =>
          quotePreset.toLowerCase().includes(s.split(" ")[0]!.toLowerCase()),
        );
        if (match) setService(match);
      }
    }
  }, [isQuoteOpen, quotePreset, profile, user]);

  if (!isQuoteOpen) return null;

  const handleWhatsAppSend = async () => {
    // Save to Supabase backend
    await submitQuoteToBackend({
      userId: user?.id,
      name: name || "Customer",
      phone: phone || "Not specified",
      email: email || undefined,
      service,
      notes,
    });

    const msg = `Hi ICS Computer Store! Here is my quote request:\n\n• Name: ${name || "Customer"}\n• Phone: ${phone || "Not specified"}\n• Service Required: ${service}\n• Notes / Spec: ${notes || "Standard Inquiry"}\n\nPlease share availability & quotation.`;
    window.open(waLink(msg), "_blank");
    setSent(true);
    toast.success("Quote sent & saved to your account!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await submitQuoteToBackend({
      userId: user?.id,
      name,
      phone,
      email: email || undefined,
      service,
      notes,
    });

    setSubmitting(false);
    if (res.success) {
      setSent(true);
      toast.success("Quote request submitted successfully!");
    } else {
      toast.error("Failed to submit request", { description: res.error });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 grid place-items-center p-3 sm:p-6 overflow-y-auto">
        {/* Soft elegant backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuote}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
        />

        {/* Clean Light Modal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)]"
        >
          {/* Header Banner (Soft Light Blue Gradient) */}
          <div className="relative bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50/60 px-6 sm:px-8 py-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Receipt className="size-4" />
              </span>
              <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase">
                ICS Computer Store · Quotation Desk
              </span>
            </div>
            <h3 className="mt-2 font-display text-2xl font-black text-slate-900">
              Request a Custom Quote
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Share your requirement — our Coimbatore engineering team responds with verified proforma pricing within 2 hours.
            </p>

            <button
              onClick={closeQuote}
              aria-label="Close modal"
              className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid place-items-center gap-3 px-6 py-14 text-center bg-white"
            >
              <div className="size-16 rounded-3xl bg-emerald-100 text-emerald-600 grid place-items-center">
                <CheckCircle2 className="size-8" />
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">Quote Request Received!</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Our sales engineer will review your configuration and reach out via phone/WhatsApp with official pricing.
              </p>
              <button
                onClick={closeQuote}
                className="mt-4 rounded-2xl bg-blue-600 px-8 py-3 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-blue-700"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8 bg-white">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full Name">
                  <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                    <User className="size-4 text-slate-400 mr-2.5" />
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                      placeholder="e.g. Ramesh Kumar"
                    />
                  </div>
                </Field>

                <Field label="Phone Number">
                  <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                    <Phone className="size-4 text-slate-400 mr-2.5" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </Field>
              </div>

              <Field label="Email Address">
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                  <Mail className="size-4 text-slate-400 mr-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                    placeholder="name@company.com"
                  />
                </div>
              </Field>

              <Field label="Service / Product Category">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 font-medium"
                >
                  {SERVICE_TYPES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Requirement Specifications / Notes">
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 font-medium"
                  placeholder="Specify parts, office size, or laptop model issue…"
                />
              </Field>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="size-4" /> Send to WhatsApp
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  <Send className="size-4" /> {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
