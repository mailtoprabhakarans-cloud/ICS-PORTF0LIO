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
  { label: "Store Components", href: "/#products", badge: "In Stock" },
  { label: "Custom PC Configurator", href: "/#builder", badge: "3D Rig" },
  { label: "Networking & CCTV", href: "/#services" },
  { label: "Cost Estimator", href: "/#estimator" },
  { label: "Chip-Level Lab", href: "/#repair-lab", badge: "BGA Lab" },
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
  { name: "Processors (AMD & Intel)", tag: "Ryzen 9000 & Core Ultra" },
  { name: "Graphics Cards (RTX 50/40)", tag: "GeForce & Radeon" },
  { name: "Motherboards & RAM", tag: "DDR5 / X870E / Z890" },
  { name: "Gen4/Gen5 NVMe SSDs", tag: "High Speed NVMe" },
  { name: "Hikvision 4K CCTV", tag: "ColorVu & IP Domes" },
  { name: "Cat6 Cabling & Racks", tag: "Enterprise Setup" },
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
    <footer ref={footerRef} className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-surface via-surface/95 to-background text-ink">
      {/* Ambient top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-25" />

      {/* Pre-Footer Action Banner */}
      <div className="relative border-b border-border/40 bg-card/50 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-12 2xl:px-16">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue shrink-0">
              <Zap className="size-5 text-brand-blue" />
            </div>
            <div>
              <h4 className="font-display text-sm sm:text-base font-bold text-ink">
                Need Custom PC Consultation or Enterprise Quotation?
              </h4>
              <p className="text-xs text-muted-foreground">
                Talk directly with certified hardware engineers in Coimbatore &amp; Nilgiris.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={CONTACT.phoneHref}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/90 hover:bg-surface px-4 py-2 text-xs font-bold text-ink shadow-xs transition-all hover:border-brand-blue hover:scale-[1.02]"
            >
              <Phone className="size-3.5 text-brand-red" />
              <span>{CONTACT.phone}</span>
            </a>
            <a
              href={waLink("Hi Infant Computer Store! I'd like a custom consultation.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="size-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 5-Column Grid */}
      <div className="relative mx-auto grid max-w-[1800px] gap-8 px-4 sm:px-6 lg:px-12 2xl:px-16 py-12 lg:py-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 2xl:gap-12">
        {/* Brand & Identity (4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="sm:col-span-2 lg:col-span-4 space-y-4"
        >
          <a href="#top" className="group inline-flex items-center gap-3.5">
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-border/80 shadow-xs transition-transform duration-300 group-hover:scale-105">
              <IcsLogo className="size-9 drop-shadow-xs" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="font-display text-2xl font-black tracking-tight text-brand-red">
                  ICS
                </span>
                <span className="font-display text-xl font-black tracking-tight text-ink uppercase">
                  COMPUTER STORE
                </span>
              </div>
              <p className="mt-1 text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
                Infant Computer Store · Est. 2007
              </p>
            </div>
          </a>

          {/* Core Specialization Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-blue">
              <Cpu className="size-3" /> IT Hardware &amp; PCs
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3" /> CCTV Surveillance
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <Zap className="size-3" /> Enterprise Networking
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
            Coimbatore and Nilgiris' premier hub for custom gaming PC rigs, enterprise networking, 4K CCTV surveillance, and specialized in-house chip-level motherboard diagnostics.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <MapPin className="size-3.5 text-brand-red shrink-0" />
            <span>Podanur HQ (Coimbatore) &amp; Ooty Branch</span>
          </div>

          <div className="flex gap-2.5 pt-1">
            {SOCIALS.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                aria-label={item.label}
                className="grid size-9 place-items-center rounded-xl border border-border/60 bg-card text-ink transition-colors hover:border-brand-blue hover:text-brand-blue shadow-xs"
              >
                <item.icon className="size-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-brand-blue" />
            <h4 className="font-display text-xs sm:text-sm font-bold tracking-wider text-ink uppercase">
              Quick Navigation
            </h4>
          </div>
          <ul className="mt-4 space-y-2.5">
            {QUICK.map((q) => (
              <li key={q.label}>
                <a
                  href={q.href}
                  className="group flex items-center justify-between text-xs sm:text-sm text-muted-foreground transition-all hover:text-brand-blue font-medium"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {q.label}
                  </span>
                  {q.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-blue/10 text-brand-blue">
                      {q.badge}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Policy Details (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-brand-red" />
            <h4 className="font-display text-xs sm:text-sm font-bold tracking-wider text-ink uppercase">
              Policy Details
            </h4>
          </div>
          <ul className="mt-4 space-y-2.5">
            {POLICIES.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  className="group flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground transition-all hover:text-brand-red font-medium"
                >
                  <ChevronRight className="size-3 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red" />
                  <span>{p.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Categories (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <h4 className="font-display text-xs sm:text-sm font-bold tracking-wider text-ink uppercase">
              Hardware Categories
            </h4>
          </div>
          <ul className="mt-4 space-y-2.5">
            {CATS.map((q) => (
              <li key={q.name}>
                <a
                  href="#products"
                  className="group block text-xs sm:text-sm text-muted-foreground transition-all hover:text-brand-blue font-medium"
                >
                  <span className="block group-hover:translate-x-1 transition-transform">
                    {q.name}
                  </span>
                  <span className="block text-[10px] text-muted-foreground/60 font-normal">
                    {q.tag}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Store Branches & Contact Hub (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sm:col-span-2 lg:col-span-2 space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-purple-500" />
            <h4 className="font-display text-xs sm:text-sm font-bold tracking-wider text-ink uppercase">
              Visit Our Stores
            </h4>
          </div>

          {/* Podanur HQ Card */}
          <div className="rounded-xl border border-border/60 bg-card/60 p-3 shadow-2xs hover:border-brand-red/40 transition-colors">
            <div className="flex items-center justify-between gap-1">
              <span className="flex items-center gap-1.5 font-bold text-ink text-xs">
                <MapPin className="size-3.5 text-brand-red shrink-0" />
                Podanur HQ
              </span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-brand-red/10 text-brand-red">
                HQ Lab
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
              240/A2B, Saradha Mill Rd, Podanur, Coimbatore – 641023
            </p>
            <a
              href="https://maps.app.goo.gl/bZ98isZoDcdCNU1y7"
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-bold text-brand-blue hover:underline"
            >
              <span>Get Directions</span>
              <ExternalLink className="size-2.5" />
            </a>
          </div>

          {/* Ooty Branch Card */}
          <div className="rounded-xl border border-border/60 bg-card/60 p-3 shadow-2xs hover:border-brand-blue/40 transition-colors">
            <div className="flex items-center justify-between gap-1">
              <span className="flex items-center gap-1.5 font-bold text-ink text-xs">
                <Store className="size-3.5 text-brand-blue shrink-0" />
                Ooty Branch
              </span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-brand-blue/10 text-brand-blue">
                Nilgiris
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
              Shop 1, ATC Complex, ATC Town Bus Stand, Ooty – 643001
            </p>
            <a
              href="/about#branches"
              className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-bold text-brand-blue hover:underline"
            >
              <span>View Branch Details</span>
              <ArrowRight className="size-2.5" />
            </a>
          </div>

          {/* Quick Contact Strip */}
          <div className="pt-1 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 text-brand-red shrink-0" />
              <a href={CONTACT.phoneHref} className="hover:text-brand-blue font-semibold text-ink">
                {CONTACT.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-brand-red shrink-0" />
              <span className="text-[11px]">Mon – Sat · 9:30 AM – 8:00 PM</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-border/50 bg-background/50">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-12 2xl:px-16 py-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Infant Computer Store (ICS). All Rights Reserved. (Since 2007)</p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 font-bold text-ink">
              <BadgeCheck className="size-4 text-emerald-500" /> GST Registered Dealer
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5 font-bold text-ink">
              <ShieldCheck className="size-4 text-brand-blue" /> Official Brand Warranty
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CreditCard className="size-4 text-indigo-500" /> UPI &amp; No-Cost EMI
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
