import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Store,
  Youtube,
} from "lucide-react";
import { CONTACT, waLink } from "@/lib/site-data";
import IcsLogo from "./IcsLogo";

const QUICK = [
  { label: "Store Components", href: "/#products" },
  { label: "Custom PC Configurator", href: "/#builder" },
  { label: "Networking & CCTV", href: "/#services" },
  { label: "Cost Estimator", href: "/#estimator" },
  { label: "Chip-Level Lab", href: "/#repair-lab" },
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
  "Processors (AMD & Intel)",
  "Graphics Cards (RTX 50/40)",
  "Motherboards & RAM",
  "Gen4/Gen5 NVMe SSDs",
  "Hikvision 4K CCTV",
  "Cat6 Cabling & Racks",
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const inView = useInView(footerRef, { once: true, margin: "-60px" });

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-border/40 bg-surface">
      {/* Ambient gradient mesh */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="relative mx-auto grid max-w-[1800px] gap-8 px-4 sm:px-6 lg:px-12 2xl:px-16 py-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 2xl:gap-10">
        {/* Brand & About (4 of 12 columns) */}
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
                <span className="font-display text-2xl font-black tracking-tight text-red-600 dark:text-red-500">
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

          {/* Core Specialization Badges */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span className="inline-flex items-center rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-blue">
              IT Hardware &amp; PCs
            </span>
            <span className="inline-flex items-center rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              CCTV Surveillance
            </span>
            <span className="inline-flex items-center rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Enterprise Networking
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
            Coimbatore &amp; Nilgiris' premier hub for custom gaming PC rigs, enterprise networking, 4K CCTV surveillance, and specialized in-house chip-level motherboard diagnostics.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <MapPin className="size-3.5 text-brand-red shrink-0" />
            <span>Podanur HQ (Coimbatore) &amp; Ooty Branch</span>
          </div>

          <div className="flex gap-2.5 pt-1">
            {SOCIALS.map((item, i) => (
              <motion.a
                key={i}
                href="#top"
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                aria-label={item.label}
                className="grid size-9 place-items-center rounded-full border border-border/60 bg-card text-ink transition-colors hover:border-brand-blue hover:text-brand-blue shadow-xs"
              >
                <item.icon className="size-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <h4 className="font-display text-sm font-bold tracking-wider text-ink uppercase">
            Quick Navigation
          </h4>
          <ul className="mt-4 space-y-2.5">
            {QUICK.map((q) => (
              <li key={q.label}>
                <a
                  href={q.href}
                  className="link-underline text-sm text-muted-foreground transition-colors hover:text-brand-red font-medium"
                >
                  {q.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Policy Details (In between Quick Navigation and Hardware Categories) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <h4 className="font-display text-sm font-bold tracking-wider text-ink uppercase">
            Policy Details
          </h4>
          <ul className="mt-4 space-y-2.5">
            {POLICIES.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  className="link-underline text-sm text-muted-foreground transition-colors hover:text-brand-blue font-medium"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h4 className="font-display text-sm font-bold tracking-wider text-ink uppercase">
            Hardware Categories
          </h4>
          <ul className="mt-4 space-y-2.5">
            {CATS.map((q) => (
              <li key={q}>
                <a
                  href="#products"
                  className="link-underline text-sm text-muted-foreground transition-colors hover:text-brand-blue font-medium"
                >
                  {q}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Store Contact & Location */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sm:col-span-2 lg:col-span-2"
        >
          <h4 className="font-display text-sm font-bold tracking-wider text-ink uppercase">
            Visit Our Store
          </h4>
          <ul className="mt-4 space-y-3.5 text-xs sm:text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4.5 shrink-0 text-brand-red" />
              <div>
                <p className="font-semibold text-ink">Podanur HQ (Coimbatore):</p>
                <span className="text-xs">{CONTACT.address}</span>
              </div>
            </li>

            <li className="flex gap-2.5">
              <Store className="mt-0.5 size-4.5 shrink-0 text-brand-blue" />
              <div>
                <p className="font-semibold text-ink">Ooty Branch (Nilgiris):</p>
                <span className="text-xs">Shop No: 1, ATC Complex, ATC Town Bus Stand, Ooty – 643001</span>
                <a
                  href="/about#branches"
                  className="block mt-1 font-bold text-brand-blue hover:underline text-xs"
                >
                  View Both Branch Maps &amp; Details →
                </a>
              </div>
            </li>

            <li className="flex gap-2.5 items-center">
              <Phone className="size-4.5 shrink-0 text-brand-red" />
              <a href={CONTACT.phoneHref} className="hover:text-brand-blue font-semibold text-ink">
                {CONTACT.phone}
              </a>
            </li>

            <li className="flex gap-2.5 items-center">
              <Mail className="size-4.5 shrink-0 text-brand-red" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-brand-blue font-medium">
                {CONTACT.email}
              </a>
            </li>

            <li className="flex gap-2.5 items-center">
              <Clock className="size-4.5 shrink-0 text-brand-red" />
              <span className="font-medium">{CONTACT.hours}</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-border/40">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-12 2xl:px-16 py-6 text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ICS Computer Store. All Rights Reserved. (Since 2007)</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-ink">
              <Sparkles className="size-3.5 text-brand-red" /> GST Registered Dealer
            </span>
            <span>·</span>
            <span className="font-medium">Podanur, Coimbatore – 641023</span>
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
