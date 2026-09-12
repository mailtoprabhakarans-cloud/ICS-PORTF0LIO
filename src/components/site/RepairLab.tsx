import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Microscope,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { type RepairStep, SAMPLE_TICKETS, waLink } from "@/lib/site-data";
import { useApp } from "@/lib/store";

type TicketInfo = {
  id: string;
  customer: string;
  device: string;
  issue: string;
  status: string;
  date: string;
  estimatedDelivery: string;
  steps: RepairStep[];
};

const LAB_FEATURES = [
  {
    icon: Microscope,
    title: "Optical & Thermal Short Diagnostics",
    desc: "Infrared thermal imaging to locate microscopic motherboard shorts (19V rail, 3.3V/5V standby) down to individual SMD capacitors.",
  },
  {
    icon: Cpu,
    title: "BGA Rework & Reballing Station",
    desc: "Industrial-grade dark infrared BGA rework station for safe desoldering, reballing, and replacement of GPU chips, PCH, and CPUs.",
  },
  {
    icon: Layers,
    title: "BIOS / EC Chip Reprogramming",
    desc: "Direct SPI flash programmer to recover corrupted UEFI BIOS, clean ME regions, and unlock password-locked enterprise laptops.",
  },
  {
    icon: Wrench,
    title: "Structural Hinge & Chassis Rebuilding",
    desc: "Restoration of cracked laptop casings, broken hinge mounting studs with threaded brass inserts for permanent factory strength.",
  },
];

import { lookupRepairTicket } from "@/lib/supabase-api";
import { useAuth } from "@/lib/auth-context";

export default function RepairLab() {
  const { openQuote } = useApp();
  const { user } = useAuth();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const [ticketInput, setTicketInput] = useState("ICS-8821");
  const [activeTicket, setActiveTicket] = useState<TicketInfo | null>(
    SAMPLE_TICKETS["ICS-8821"] ?? null,
  );
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = ticketInput.trim().toUpperCase();
    if (!query) return;

    setLoadingTicket(true);
    const res = await lookupRepairTicket(query);
    setLoadingTicket(false);

    if (res.success && res.ticket) {
      setActiveTicket({
        id: res.ticket.id,
        customer: res.ticket.customer_name,
        device: res.ticket.device_name,
        issue: res.ticket.issue_description,
        status: res.ticket.status,
        date: "Checked In",
        estimatedDelivery: res.ticket.estimated_delivery || "Within 24 Hours",
        steps: (res.ticket.steps || []).map((s) => ({
          title: s.title,
          desc: s.desc,
          completed: Boolean(s.completed),
          current: Boolean(s.current),
        })),
      });
    }
    setHasSearched(true);
  };

  return (
    <section
      id="repair-lab"
      className="relative overflow-hidden py-16 sm:py-20 bg-surface"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-30" />

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red/10 px-4 py-1.5 text-xs font-bold tracking-wider text-brand-red uppercase">
            <Wrench className="size-3.5" /> In-House Micro-Electronics Lab
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
            Chip-Level Repair & <span className="text-gradient-brand">Diagnostics</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Don't replace a ₹30,000 motherboard for a ₹50 blown capacitor. Our certified lab
            engineers revive dead laptops, gaming motherboards, and power supplies.
          </p>
        </motion.div>

        {/* 4 Feature Grid */}
        <div className="mt-10 sm:mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LAB_FEATURES.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-border/40 bg-card p-5 shadow-sm transition-all duration-400 hover:shadow-[0_8px_40px_-12px_oklch(0.62_0.2_245/0.2)] hover:border-brand-blue/30 hover:-translate-y-2"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-lift transition-all duration-400 group-hover:scale-110 group-hover:-rotate-6">
                <feat.icon className="size-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{feat.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Live Repair Ticket Tracker Demo */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-border/40 glass-card shadow-soft">
          <div className="grid gap-8 p-6 lg:grid-cols-12 lg:p-10">
            {/* Left Side: Ticket Search & Quick Links (5 cols) */}
            <div className="space-y-5 lg:col-span-5">
              <div>
                <span className="text-xs font-bold tracking-wider text-brand-blue uppercase">
                  Service Tracking Portal
                </span>
                <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-ink">
                  Track Your Repair Status
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Enter your ICS Job Sheet / Service Ticket number to see live diagnostic steps and
                  estimated handover time.
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleLookup} className="flex gap-2">
                <div className="flex flex-1 items-center rounded-full border border-border bg-surface px-4 py-2.5 text-sm transition-all focus-within:border-brand-blue/50 focus-within:shadow-blue">
                  <Search className="size-4.5 text-muted-foreground" />
                  <input
                    value={ticketInput}
                    onChange={(e) => setTicketInput(e.target.value)}
                    placeholder="e.g. ICS-8821"
                    className="w-full bg-transparent px-2.5 font-mono text-sm font-bold text-ink outline-none uppercase"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-gradient-brand px-7 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lift"
                >
                  Track
                </motion.button>
              </form>

              {/* Sample Ticket Pills */}
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground font-medium">Try Demo Tickets:</span>
                {["ICS-8821", "ICS-8822"].map((tid) => (
                  <button
                    key={tid}
                    onClick={() => {
                      setTicketInput(tid);
                      setActiveTicket(SAMPLE_TICKETS[tid] ?? null);
                      setHasSearched(true);
                    }}
                    className="rounded-lg border border-border bg-surface px-2.5 py-1 font-mono text-xs font-bold text-brand-blue hover:border-brand-blue transition-colors"
                  >
                    {tid}
                  </button>
                ))}
              </div>

              {/* Book a Service CTA */}
              <div className="rounded-2xl border border-border/40 bg-gradient-mesh p-4 text-xs">
                <p className="font-bold text-ink flex items-center gap-1.5">
                  <PhoneCall className="size-4 text-brand-red" /> Need an urgent board diagnosis?
                </p>
                <p className="mt-1 text-muted-foreground">
                  Walk in directly to our Gandhipuram store or book a pickup in Coimbatore.
                </p>
                <div className="mt-3 flex gap-2">
                  <motion.button
                    onClick={() => openQuote("Chip-Level Laptop Repair")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-slate-900 dark:bg-brand-blue px-4 py-2 text-[11px] font-semibold text-white"
                  >
                    Book Diagnostic
                  </motion.button>
                  <a
                    href={waLink(
                      "Hi ICS Computer Store, I need urgent chip-level motherboard repair for my laptop.",
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border bg-card px-4 py-2 text-[11px] font-semibold text-ink hover:text-brand-blue transition-colors"
                  >
                    WhatsApp Tech Desk
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side: Active Ticket Milestone Timeline (7 cols) */}
            <div className="rounded-2xl border border-border/40 bg-surface/50 p-6 lg:col-span-7">
              {activeTicket && (
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-brand-red">
                          #{activeTicket.id}
                        </span>
                        <span className="rounded-full bg-accent/60 border border-accent px-2.5 py-0.5 text-[11px] font-bold text-brand-blue">
                          {activeTicket.status}
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-base font-bold text-ink">
                        {activeTicket.device}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Customer: {activeTicket.customer} · Checked-in: {activeTicket.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-muted-foreground block">Ready By</span>
                      <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {activeTicket.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  {/* Step Timeline */}
                  <div className="mt-6 space-y-4">
                    {activeTicket.steps.map((step: RepairStep, idx: number) => (
                      <motion.div
                        key={step.title}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 relative flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 + 0.1, type: "spring", stiffness: 400 }}
                            className={`grid size-7 place-items-center rounded-full text-xs font-bold ${
                              step.completed
                                ? "bg-emerald-500 text-white shadow-[0_0_12px_oklch(0.5_0.2_160/0.3)]"
                                : step.current
                                  ? "bg-gradient-brand text-white ring-4 ring-brand-blue/20 animate-pulse shadow-[0_0_15px_oklch(0.62_0.2_245/0.3)]"
                                  : "border border-border bg-card text-muted-foreground"
                            }`}
                          >
                            {step.completed ? <CheckCircle2 className="size-4" /> : idx + 1}
                          </motion.div>
                          {idx < activeTicket.steps.length - 1 && (
                            <div
                              className={`h-7 w-0.5 mt-1 ${
                                step.completed ? "bg-emerald-500" : "bg-border"
                              }`}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 pb-1">
                          <p
                            className={`text-xs font-bold ${
                              step.current
                                ? "text-brand-blue font-extrabold"
                                : step.completed
                                  ? "text-ink"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="section-divider mt-16 sm:mt-20" />
    </section>
  );
}
