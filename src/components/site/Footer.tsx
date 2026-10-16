import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  Clock,
  Cpu,
  CreditCard,
  ExternalLink,
  Facebook,
  FileText,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Receipt,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Wrench,
  Youtube,
  Zap,
} from "lucide-react";
import { CONTACT, waLink } from "@/lib/site-data";
import IcsLogo from "./IcsLogo";

const QUICK = [
  { label: "Store Components", href: "/#products" },
  { label: "Custom PC Configurator", href: "/#builder" },
  { label: "Networking & CCTV Solutions", href: "/#services" },
  { label: "Instant Cost Estimator", href: "/#estimator" },
  { label: "Chip-Level Diagnostic Lab", href: "/#repair-lab" },
  { label: "About Us & Verified Branches", href: "/about" },
];

const POLICIES = [
  { label: "Shipping Policy", href: "/policies?tab=shipping" },
  { label: "Return and Refund Policy", href: "/policies?tab=refund" },
  { label: "Cancellation Policy", href: "/policies?tab=cancellation" },
  { label: "Terms and Conditions", href: "/policies?tab=terms" },
  { label: "Privacy Policy", href: "/policies?tab=privacy" },
];

const CATS = [
  { name: "Processors (AMD & Intel)", desc: "Ryzen 9000 & Core Ultra" },
  { name: "Graphics Cards (RTX 50/40)", desc: "NVIDIA GeForce & AMD Radeon" },
  { name: "Motherboards & RAM", desc: "DDR5 / X870E / Z890 Gaming" },
  { name: "NVMe SSDs & Storage", desc: "PCIe Gen4 / Gen5 Blazing Fast" },
  { name: "Hikvision 4K CCTV", desc: "ColorVu Night Vision & IP Domes" },
  { name: "Enterprise Networking", desc: "Cat6 Cabling, Wi-Fi 7 & Racks" },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, { once: true, margin: "-60px" });

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-surface via-surface/95 to-background text-ink"
    >
      {/* Subtle top ambient line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-20" />

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16 pt-12 pb-14">
        {/* ============================================================== */}
        {/* SECTION 1: Dual Branch Store Hub Cards & Direct Hotline        */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-12 border-b border-border/50"
        >
          {/* Card 1: Podanur HQ */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 shadow-xs hover:border-brand-red/40 hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-brand-red">
                  <MapPin className="size-3" /> Podanur HQ (Coimbatore)
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">Main Experience Lab</span>
              </div>
              <h5 className="mt-3 font-display text-sm font-bold text-ink">
                INFANT COMPUTER STORE
              </h5>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                240/A2B, Saradha Mill Rd, Near Koushikha Hospital, Podanur, Coimbatore – 641023
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/40">
              <a
                href="https://maps.app.goo.gl/bZ98isZoDcdCNU1y7"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
              >
                <Navigation className="size-3" />
                <span>Open in Google Maps</span>
                <ExternalLink className="size-2.5" />
              </a>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                ● Open Mon–Sat
              </span>
            </div>
          </div>

          {/* Card 2: Ooty Branch */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 shadow-xs hover:border-brand-blue/40 hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-brand-blue">
                  <Store className="size-3" /> Ooty Branch (Nilgiris)
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">Regional Store</span>
              </div>
              <h5 className="mt-3 font-display text-sm font-bold text-ink">
                INFANT COMPUTER STORE
              </h5>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Shop No: 1, ATC Complex, ATC Town Bus Stand, Ooty – 643001, Tamil Nadu
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/40">
              <a
                href="/about#branches"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
              >
                <span>View Branch Details</span>
                <ArrowRight className="size-3" />
              </a>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                ● 10:00 AM – 7:30 PM
              </span>
            </div>
          </div>

          {/* Card 3: Direct Hotline & WhatsApp Consultation */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 shadow-xs hover:border-emerald-500/40 hover:shadow-sm transition-all sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <Phone className="size-3" /> Direct Support Hotline
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">Instant Quotes</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <a
                  href={CONTACT.phoneHref}
                  className="font-display text-lg sm:text-xl font-black text-ink hover:text-brand-red transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Email: <a href={`mailto:${CONTACT.email}`} className="text-ink hover:underline">{CONTACT.email}</a>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40">
              <a
                href={waLink("Hi Infant Computer Store! I would like to inquire about products and services.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="size-3.5" />
                <span>Chat on WhatsApp (Immediate Reply)</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* SECTION 2: 4 Balanced Columns (Brand, Navigation, Policies, Cats) */}
        {/* ============================================================== */}
        <div className="grid gap-8 pt-12 sm:grid-cols-2 lg:grid-cols-12 2xl:gap-12">
          {/* Column 1: Brand & Identity (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sm:col-span-2 lg:col-span-4 space-y-4"
          >
            <a href="#top" className="group inline-flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-border/80 shadow-xs transition-transform duration-300 group-hover:scale-105">
                <IcsLogo className="size-8 drop-shadow-xs" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5 leading-none">
                  <span className="font-display text-2xl font-black tracking-tight text-brand-red">
                    ICS
                  </span>
                  <span className="font-display text-lg font-black tracking-tight text-ink uppercase">
                    COMPUTER STORE
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
                  Infant Computer Store · Est. 2007
                </p>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Coimbatore and Nilgiris' premier destination for precision custom gaming rigs, enterprise networking, 4K CCTV surveillance, and specialized in-house chip-level motherboard lab diagnostics.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-ink">Connect With Us:</span>
              <div className="flex gap-2">
                {SOCIALS.map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2, scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label={item.label}
                    className="grid size-8 place-items-center rounded-lg border border-border/60 bg-card text-ink transition-colors hover:border-brand-blue hover:text-brand-blue shadow-2xs"
                  >
                    <item.icon className="size-3.5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 2: Quick Navigation (2.5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="sm:col-span-1 lg:col-span-2"
          >
            <h4 className="font-display text-xs sm:text-sm font-bold tracking-wider text-ink uppercase flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-brand-blue" />
              Quick Navigation
            </h4>
            <ul className="mt-4 space-y-2.5">
              {QUICK.map((q) => (
                <li key={q.label}>
                  <a
                    href={q.href}
                    className="group flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground transition-all hover:text-brand-blue font-medium"
                  >
                    <ChevronRight className="size-3 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                    <span>{q.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Policy Details (2.5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sm:col-span-1 lg:col-span-3"
          >
            <h4 className="font-display text-xs sm:text-sm font-bold tracking-wider text-ink uppercase flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-brand-red" />
              Policy Details
            </h4>
            <ul className="mt-4 space-y-2.5">
              {POLICIES.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    className="group flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground transition-all hover:text-brand-red font-medium"
                  >
                    <ChevronRight className="size-3 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red" />
                    <span>{p.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Hardware Categories (3 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <h4 className="font-display text-xs sm:text-sm font-bold tracking-wider text-ink uppercase flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Hardware Categories
            </h4>
            <ul className="mt-4 space-y-2.5">
              {CATS.map((q) => (
                <li key={q.name}>
                  <a
                    href="#products"
                    className="group block text-xs sm:text-sm text-muted-foreground transition-all hover:text-brand-blue font-medium"
                  >
                    <span className="block text-ink/90 group-hover:text-brand-blue group-hover:translate-x-1 transition-all">
                      {q.name}
                    </span>
                    <span className="block text-[10.5px] text-muted-foreground/70 font-normal">
                      {q.desc}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 3: Bottom Legal & Trust Bar                            */}
      {/* ============================================================== */}
      <div className="relative border-t border-border/50 bg-background/60">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-12 2xl:px-16 py-5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Infant Computer Store (ICS). All Rights Reserved. (Since 2007)</p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 font-bold text-ink">
              <BadgeCheck className="size-3.5 text-emerald-500" /> GST Registered Dealer
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1.5 font-bold text-ink">
              <ShieldCheck className="size-3.5 text-brand-blue" /> Official Brand Warranty
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CreditCard className="size-3.5 text-indigo-500" /> UPI &amp; No-Cost EMI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <motion.a
      href={waLink("Hi ICS Computer Store! I'd like to ask a query regarding products and services.")}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="group fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full bg-emerald-600 py-3.5 pr-5 pl-4 text-white shadow-[0_8px_30px_oklch(0.5_0.2_160/0.4)] transition-shadow hover:shadow-[0_12px_40px_oklch(0.5_0.2_160/0.5)]"
      aria-label="Chat on WhatsApp"
    >
      <span className="relative grid place-items-center text-white pulse-ring">
        <MessageCircle className="relative size-5" />
      </span>
      <span className="max-w-0 overflow-hidden text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:max-w-40">
        Chat with Expert
      </span>
    </motion.a>
  );
}
