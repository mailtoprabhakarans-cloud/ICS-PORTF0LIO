import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Building,
  Car,
  CheckCircle2,
  Clock,
  CornerDownRight,
  Cpu,
  CreditCard,
  ExternalLink,
  Flame,
  Globe,
  HeartHandshake,
  Layers,
  MapPin,
  MessageCircle,
  Microchip,
  Phone,
  Receipt,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import Header from "@/components/site/Header";
import Footer, { WhatsAppFab } from "@/components/site/Footer";
import QuoteModal from "@/components/site/QuoteModal";
import QuickViewModal from "@/components/site/QuickViewModal";
import CompareModal from "@/components/site/CompareModal";
import WishlistDrawer from "@/components/site/WishlistDrawer";
import AuthModal from "@/components/auth/AuthModal";
import UserAccountDrawer from "@/components/auth/UserAccountDrawer";
import { Toaster } from "sonner";
import StructuredData from "@/components/seo/StructuredData";
import { AppProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth-context";
import {
  BRANCHES,
  BRANDS,
  CONTACT,
  GOOGLE_BUSINESS_STATS,
  REVIEWS,
  type StoreBranch,
  waLink,
} from "@/lib/site-data";

const title =
  "About Us | INFANT COMPUTER STORE (ICS) Coimbatore & Ooty — IT Hardware, Custom PCs & CCTV Since 2007";
const description =
  "Discover the story of Infant Computer Store (ICS), founded in 2007. Verified Google Business locations in Podanur (Coimbatore) and Ooty (Nilgiris). Trusted by 5,000+ customers for genuine PC parts, chip-level repair, and networking.";
const siteUrl = "https://icsstore.in/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "About Infant Computer Store, ICS Computer Store Coimbatore, Infant Computer Store Podanur, Infant Computer Store Ooty, PC shop since 2007, chip level laptop repair Coimbatore, Google reviews Infant Computer Store",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:site_name", content: "ICS Computer Store" },
    ],
    links: [{ rel: "canonical", href: siteUrl }],
  }),
  component: AboutPage,
});

function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

const TIMELINE = [
  {
    year: "2007",
    title: "Foundation of Infant Computer Store",
    desc: "Established on Saradha Mill Road in Podanur, Coimbatore, with a dedicated team providing laptop sales, computer peripherals, and trustworthy hardware repair.",
    icon: Sparkles,
  },
  {
    year: "2012",
    title: "Dedicated Chip-Level Diagnostic Lab",
    desc: "Invested in high-precision micro-soldering stations, BGA rework machines, and oscilloscope test benches to fix shorted motherboards without expensive board replacements.",
    icon: Wrench,
  },
  {
    year: "2017",
    title: "Expansion to Ooty, Nilgiris",
    desc: "Opened our second verified branch at ATC Complex, ATC Town Bus Stand, Ooty, delivering prompt IT equipment, resort surveillance solutions, and school IT labs.",
    icon: Store,
  },
  {
    year: "2021",
    title: "Direct Brand Partnerships & Enterprise Networks",
    desc: "Formed direct distribution ties with Intel, AMD, ASUS, MSI, Hikvision, and D-Link. Scaled into large commercial structured Cat6 cabling, NVR deployments, and enterprise AMCs.",
    icon: Award,
  },
  {
    year: "2025+",
    title: "Next-Gen Gaming & AI Workstations",
    desc: "Serving 5,000+ enthusiastic gamers and enterprise corporations with RTX 50-Series GPUs, Ryzen 9000 CPUs, custom liquid cooling loops, and same-day turnaround.",
    icon: Cpu,
  },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Genuine with Brand Warranty",
    desc: "Every processor, GPU, motherboard, and surveillance camera is backed by official manufacturer warranty and valid GST tax invoices with input credit.",
  },
  {
    icon: Microchip,
    title: "In-House Chip-Level Lab",
    desc: "We diagnose shorted power rails, blown capacitors, and damaged BIOS chips at the component level, saving our clients up to 70% compared to full board replacements.",
  },
  {
    icon: Server,
    title: "Turnkey Enterprise CCTV & Networking",
    desc: "From 4-camera home security to 64-channel 4K ColorVu IP systems and multi-rack enterprise structured cabling across Coimbatore, Tiruppur, and the Nilgiris.",
  },
  {
    icon: HeartHandshake,
    title: "Customer-First Transparent Service",
    desc: "No hidden charges, honest component advice suited to your budget and workload, plus free pre-delivery stress testing on every custom PC build.",
  },
];

function AboutPage() {
  const [activeBranchId, setActiveBranchId] = useState<string>("podanur");
  const activeBranch: StoreBranch =
    BRANCHES.find((b) => b.id === activeBranchId) || BRANCHES[0];

  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
          <StructuredData />
          <Header />

          <main className="relative overflow-hidden">
            {/* Ambient background decoration */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-radial from-brand-blue/15 via-transparent to-transparent blur-3xl opacity-60" />

            {/* Breadcrumb & Navigation */}
            <section className="border-b border-border/40 bg-surface/50 py-3 text-xs text-muted-foreground">
              <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-4 sm:px-6 lg:px-12 2xl:px-16">
                <Link to="/" className="hover:text-brand-blue transition-colors flex items-center gap-1 font-medium">
                  <ArrowLeft className="size-3.5" /> Back to Store
                </Link>
                <span>/</span>
                <span className="font-semibold text-ink">About Infant Computer Store (ICS)</span>
              </div>
            </section>

            {/* Hero Section */}
            <section className="relative py-16 sm:py-24">
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
                <div className="max-w-4xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 px-3.5 py-1 text-xs font-bold text-brand-blue uppercase tracking-wider">
                    <Sparkles className="size-3.5 text-brand-red" />
                    <span>Established 2007 · 18+ Years of Engineering Trust</span>
                  </div>

                  <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight leading-[1.1]">
                    Crafting Elite Rigs &amp; Enterprise IT with{" "}
                    <span className="text-gradient-brand">Uncompromising Integrity</span>
                  </h1>

                  <p className="mt-5 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                    <strong className="text-ink font-semibold">INFANT COMPUTER STORE (ICS)</strong> began in 2007 as a passionate hardware lab on Saradha Mill Road, Podanur, Coimbatore. Over nearly two decades, we have grown into Tamil Nadu's premier hub for custom gaming PCs, high-frequency trader workstations, chip-level laptop diagnostics, and commercial CCTV &amp; Cat6 networking.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href="#branches"
                      className="inline-flex items-center gap-2 rounded-full bg-brand-blue hover:bg-blue-700 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:scale-105"
                    >
                      <MapPin className="size-4" /> Explore Our Branches
                    </a>
                    <a
                      href="#google-reviews"
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card hover:bg-surface px-6 py-3.5 text-xs sm:text-sm font-bold text-ink shadow-sm transition-all"
                    >
                      <GoogleIcon className="size-4" /> Real Google Reviews ({GOOGLE_BUSINESS_STATS.rating} ★)
                    </a>
                  </div>
                </div>

                {/* Key Numbers Grid */}
                <div className="mt-14 grid gap-4 grid-cols-2 md:grid-cols-4">
                  {[
                    { number: "2007", label: "Year Founded", sub: "18+ Years in Business" },
                    { number: "5,000+", label: "Custom PCs Built", sub: "Tested & Stress-Checked" },
                    { number: "1,200+", label: "Networks & CCTV Deployed", sub: "Offices, Mills & Resorts" },
                    { number: "4.9 ★", label: "Google Business Rating", sub: "350+ Verified Reviews" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-border/40 bg-card/80 p-5 sm:p-6 backdrop-blur shadow-xs hover:border-brand-blue/30 transition-all"
                    >
                      <span className="font-display text-3xl sm:text-4xl font-extrabold text-brand-blue">
                        {stat.number}
                      </span>
                      <p className="mt-2 text-sm font-bold text-ink">{stat.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Core Values / Why Choose Us */}
            <section className="py-16 bg-surface/50 border-y border-border/40">
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-red uppercase">
                    The Infant Computer Store Difference
                  </span>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-ink">
                    Why Thousands of Customers Rely on Us
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                    Built upon four core pillars that ensure long-lasting hardware reliability and peace of mind.
                  </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {PILLARS.map((pillar, i) => (
                    <div
                      key={i}
                      className="group flex flex-col justify-between rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand-blue/40 hover:-translate-y-1 hover:shadow-soft"
                    >
                      <div>
                        <div className="grid size-12 place-items-center rounded-2xl bg-brand-blue/10 text-brand-blue mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                          <pillar.icon className="size-6" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-ink">{pillar.title}</h3>
                        <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Interactive Timeline: 18-Year Legacy */}
            <section className="py-20">
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">
                    Our 18-Year Journey
                  </span>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-ink">
                    From a Local Repair Workbench to Regional IT Leaders
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                    A timeline of milestone growth, technical evolution, and persistent customer dedication.
                  </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-5">
                  {TIMELINE.map((item, i) => (
                    <div
                      key={item.year}
                      className="relative flex flex-col justify-between rounded-2xl border border-border/40 bg-card p-6 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-2xl font-black text-brand-red">
                            {item.year}
                          </span>
                          <item.icon className="size-5 text-brand-blue" />
                        </div>
                        <h3 className="mt-3 font-display text-base font-bold text-ink leading-snug">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dual Store Locations Section */}
            <section id="branches" className="py-20 bg-surface/60 border-t border-border/40">
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" /> 100% Google Verified
                      </span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Two Strategic Branches
                      </span>
                    </div>
                    <h2 className="mt-2.5 font-display text-3xl sm:text-4xl font-bold text-ink">
                      Visit Our Physical Locations in Tamil Nadu
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-xl">
                      Experience our demo gaming stations, consult face-to-face with engineers, or drop off hardware for express chip-level repair.
                    </p>
                  </div>

                  {/* Branch switcher */}
                  <div className="flex items-center gap-2 rounded-2xl bg-card border border-border/50 p-1 shadow-xs">
                    {BRANCHES.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setActiveBranchId(b.id)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          activeBranchId === b.id
                            ? "bg-brand-blue text-white shadow-sm"
                            : "text-muted-foreground hover:text-ink"
                        }`}
                      >
                        <Store className="size-3.5" />
                        <span>{b.city}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Branch Details Display */}
                <div className="mt-10 overflow-hidden rounded-3xl border border-border/40 glass-card shadow-soft">
                  <div className="grid gap-8 p-6 lg:grid-cols-12 lg:p-10">
                    <div className="space-y-5 lg:col-span-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue">
                            {activeBranch.badge}
                          </span>
                          {activeBranch.isHQ && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-600 px-2.5 py-1 text-xs font-black uppercase">
                              HQ Flagship
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                          {activeBranch.name}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {activeBranch.tagline}
                        </p>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-surface/60 p-4">
                          <MapPin className="mt-0.5 size-5 shrink-0 text-brand-red" />
                          <div>
                            <span className="font-bold text-ink text-sm">Official Address:</span>
                            <p className="mt-1 text-muted-foreground font-medium text-xs sm:text-sm leading-relaxed">
                              {activeBranch.fullAddress}
                            </p>
                            <p className="text-xs font-semibold text-brand-blue mt-1.5">
                              📍 Landmark: {activeBranch.landmark}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-surface/60 p-3.5">
                            <Clock className="size-4.5 shrink-0 text-brand-blue" />
                            <div>
                              <span className="font-bold text-ink">Operating Hours:</span>
                              <p className="text-muted-foreground mt-0.5">{activeBranch.hours}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-surface/60 p-3.5">
                            <Phone className="size-4.5 shrink-0 text-brand-red" />
                            <div>
                              <span className="font-bold text-ink">Desk Phone:</span>
                              <a
                                href={activeBranch.phoneHref}
                                className="text-brand-blue font-semibold hover:underline block mt-0.5"
                              >
                                {activeBranch.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {[
                          { icon: Car, label: "Customer Parking" },
                          { icon: Receipt, label: "GST Tax Invoices" },
                          { icon: CreditCard, label: "UPI & No-Cost EMI" },
                          { icon: ShieldCheck, label: "Official Brand Warranty" },
                        ].map((item) => (
                          <span
                            key={item.label}
                            className="flex items-center gap-1.5 rounded-full border border-border/40 bg-surface/60 px-3 py-1.5 text-[11px] font-semibold text-ink"
                          >
                            <item.icon className="size-3.5 text-brand-blue" />
                            {item.label}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-3">
                        <a
                          href={activeBranch.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all"
                        >
                          <MapPin className="size-4" /> Open in Google Maps
                          <ExternalLink className="size-3.5" />
                        </a>

                        <a
                          href={waLink(
                            `Hi Infant Computer Store! I'm planning to visit your ${activeBranch.city} branch.`,
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all"
                        >
                          <MessageCircle className="size-4" /> WhatsApp Us
                        </a>
                      </div>
                    </div>

                    {/* Live Embedded Map */}
                    <div className="flex flex-col justify-between gap-4 lg:col-span-6">
                      <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-slate-900/10">
                        <iframe
                          key={activeBranch.id}
                          title={`${activeBranch.name} Location Map`}
                          src={activeBranch.mapEmbedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={true}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full grayscale-[10%] contrast-[105%] hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <a
                            href={activeBranch.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-ink px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur hover:scale-105 transition-transform"
                          >
                            <MapPin className="size-3.5 text-red-600" />
                            <span>{activeBranch.city}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Google Business Customer Testimonials */}
            <section id="google-reviews" className="py-20">
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-brand-blue uppercase">
                        <GoogleIcon className="size-3.5" /> Google Business Reviews
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        ⭐️ 4.9 Rating (350+ Reviews)
                      </span>
                    </div>
                    <h2 className="mt-2.5 font-display text-3xl sm:text-4xl font-bold text-ink">
                      Real Customer Feedback &amp; Experiences
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-xl">
                      Read authentic reviews from clients who purchased laptops, custom PCs, or had boards repaired at Infant Computer Store.
                    </p>
                  </div>

                  <a
                    href={CONTACT.googleReviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card hover:bg-surface px-5 py-3 text-xs font-bold text-ink shadow-sm transition-all hover:border-brand-blue/40"
                  >
                    <GoogleIcon className="size-4" />
                    <span>Write a Google Review</span>
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                  </a>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {REVIEWS.map((rev) => (
                    <div
                      key={rev.name}
                      className="flex flex-col justify-between rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand-blue/30 hover:shadow-soft"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`grid size-10 place-items-center rounded-full font-display font-bold text-sm shadow-sm ${
                                rev.avatarColor || "bg-brand-blue text-white"
                              }`}
                            >
                              {rev.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-display text-sm font-bold text-ink leading-snug">
                                {rev.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[11px] font-medium text-muted-foreground">
                                  {rev.date}
                                </span>
                                {rev.location && (
                                  <>
                                    <span className="text-muted-foreground/40 text-[10px]">·</span>
                                    <span className="text-[11px] text-muted-foreground/80">
                                      {rev.location}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <GoogleIcon className="size-3" /> Verified
                          </span>
                        </div>

                        <div className="mt-3.5 flex items-center justify-between">
                          <div className="flex gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="rounded-full bg-accent/60 border border-accent px-2.5 py-0.5 text-[11px] font-bold text-brand-blue">
                            {rev.tag}
                          </span>
                        </div>

                        <div className="mt-3.5 relative">
                          <span className="absolute -top-3 -left-1 text-4xl font-bold text-brand-blue/10 select-none">
                            "
                          </span>
                          <p className="text-sm leading-relaxed text-muted-foreground italic pl-3.5">
                            {rev.comment}
                          </p>
                        </div>
                      </div>

                      {rev.ownerReply && (
                        <div className="mt-4 rounded-xl border border-border/50 bg-surface/70 p-3 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            <CornerDownRight className="size-3.5 text-brand-blue" />
                            <span>Response from owner (Infant Computer Store)</span>
                          </div>
                          <p className="mt-1 text-muted-foreground text-[11.5px] italic pl-5">
                            "{rev.ownerReply.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Authorized Partner Brands */}
            <section className="py-14 border-t border-border/40 bg-surface/40">
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16 text-center">
                <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  Authorized Hardware Partners &amp; Tier-1 Distributors
                </p>
                <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
                  <div className="marquee-track flex w-max gap-4 hover:[animation-play-state:paused]">
                    {[...BRANDS, ...BRANDS].map((b, i) => (
                      <span
                        key={`${b}-${i}`}
                        className="grid h-14 w-36 shrink-0 place-items-center rounded-2xl border border-border/40 glass-card font-display text-sm font-bold text-ink/40 transition-all duration-300 hover:border-brand-blue/40 hover:text-brand-blue shadow-sm"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
          <WhatsAppFab />

          {/* Global Dialogs & Drawers */}
          <QuoteModal />
          <QuickViewModal />
          <CompareModal />
          <WishlistDrawer />
          <AuthModal />
          <UserAccountDrawer />
          <Toaster richColors position="top-right" />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}
