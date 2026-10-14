import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building,
  Car,
  CheckCircle2,
  Clock,
  CornerDownRight,
  CreditCard,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  Receipt,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
} from "lucide-react";
import {
  BRANCHES,
  BRANDS,
  CONTACT,
  GOOGLE_BUSINESS_STATS,
  REVIEWS,
  type StoreBranch,
  waLink,
} from "@/lib/site-data";
import { BrandLogo, PARTNER_BRANDS } from "./BrandLogo";

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

function AnimatedNumber({ end, suffix = "", inView }: { end: number; suffix?: string; inView: boolean }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || end === 0) return;
    started.current = true;
    const duration = 2000;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, inView]);

  return (
    <span>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function ReviewsAndStore() {
  const reviewRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const reviewInView = useInView(reviewRef, { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const [activeBranchId, setActiveBranchId] = useState<string>("podanur");
  const activeBranch: StoreBranch =
    BRANCHES.find((b) => b.id === activeBranchId) || BRANCHES[0];

  return (
    <section id="store-info" className="relative py-16 sm:py-24 bg-surface overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
        {/* Testimonials Section Header */}
        <div ref={reviewRef}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={reviewInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-brand-blue uppercase tracking-wider">
                  <GoogleIcon className="size-3.5" /> Google Business Reviews
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="size-3.5" /> 100% Verified
                </span>
              </div>
              <h2 className="mt-2.5 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
                Real Customer Reviews &amp; <span className="text-gradient-brand">Feedback</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Direct testimonials from our verified Google Business Profile for{" "}
                <span className="font-semibold text-ink">INFANT COMPUTER STORE</span> in Podanur (Coimbatore) and Ooty (Nilgiris).
              </p>
            </motion.div>

            {/* Google Rating Badge & Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={reviewInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-border/50 glass-card px-4 py-2.5 shadow-soft">
                <GoogleIcon className="size-5 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-ink">
                      {GOOGLE_BUSINESS_STATS.rating}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Google Rating ({GOOGLE_BUSINESS_STATS.totalReviews}+ reviews)
                  </p>
                </div>
              </div>

              <a
                href={CONTACT.googleReviewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card hover:bg-surface px-4 py-2.5 text-xs font-bold text-ink transition-all hover:border-brand-blue/40 shadow-sm"
              >
                <GoogleIcon className="size-3.5" />
                <span>Review on Google</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
            </motion.div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((rev, idx) => (
              <motion.div
                key={rev.name}
                initial={{ opacity: 0, y: 28 }}
                animate={reviewInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col justify-between rounded-2xl border border-border/40 bg-card p-5 sm:p-6 shadow-sm transition-all duration-400 hover:shadow-[0_8px_40px_-12px_oklch(0.62_0.2_245/0.15)] hover:border-brand-blue/30 hover:-translate-y-1"
              >
                <div>
                  {/* Card Header: Avatar + User Info + Google Badge */}
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

                  {/* Rating Stars + Category Tag */}
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

                  {/* Review Text */}
                  <div className="mt-3.5 relative">
                    <span className="absolute -top-3 -left-1 text-4xl font-bold text-brand-blue/10 select-none">
                      "
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground italic pl-3.5">
                      {rev.comment}
                    </p>
                  </div>
                </div>

                {/* Owner Reply Box (if present, like for Saritha Sar) */}
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
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dual Branch Showcase: Podanur HQ + Ooty Branch */}
        <div className="mt-16 sm:mt-20 overflow-hidden rounded-3xl border border-border/40 glass-card shadow-soft">
          {/* Branch Selection Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-surface/70 px-6 py-4 lg:px-10">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-brand-blue uppercase">
                Google Business Profile Locations
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink mt-0.5">
                Our 100% Verified Store Branches
              </h3>
            </div>

            {/* Branch Switcher Tabs */}
            <div className="flex items-center gap-2 rounded-2xl bg-card border border-border/50 p-1 shadow-xs">
              {BRANCHES.map((b) => {
                const isActive = b.id === activeBranchId;
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBranchId(b.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-brand-blue text-white shadow-sm"
                        : "text-muted-foreground hover:text-ink hover:bg-surface"
                    }`}
                  >
                    <Store className="size-3.5" />
                    <span>{b.city}</span>
                    {b.isHQ && (
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-black ${
                          isActive ? "bg-white/20 text-white" : "bg-brand-blue/10 text-brand-blue"
                        }`}
                      >
                        HQ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-12 lg:p-10">
            {/* Active Branch Information (6 cols) */}
            <div className="space-y-5 lg:col-span-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5" /> Verified Google Business
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue">
                    {activeBranch.badge}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                  {activeBranch.name}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {activeBranch.tagline}
                </p>
              </div>

              {/* Details List */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-surface/60 p-3.5">
                  <MapPin className="mt-0.5 size-4.5 shrink-0 text-brand-red" />
                  <div>
                    <span className="font-bold text-ink text-sm">Store Address &amp; Landmark:</span>
                    <p className="mt-0.5 text-muted-foreground font-medium text-xs sm:text-sm">
                      {activeBranch.fullAddress}
                    </p>
                    <p className="text-[11.5px] font-semibold text-brand-blue mt-1">
                      📍 Landmark: {activeBranch.landmark}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-surface/60 p-3">
                    <Clock className="size-4 shrink-0 text-brand-blue" />
                    <div>
                      <span className="font-bold text-ink">Store Hours:</span>
                      <p className="text-muted-foreground">{activeBranch.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-surface/60 p-3">
                    <Phone className="size-4 shrink-0 text-brand-red" />
                    <div>
                      <span className="font-bold text-ink">Store Phone:</span>
                      <a
                        href={activeBranch.phoneHref}
                        className="text-brand-blue font-semibold hover:underline block"
                      >
                        {activeBranch.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Amenities Chips */}
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

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.a
                  href={activeBranch.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all"
                >
                  <MapPin className="size-4" /> Open in Google Maps
                  <ExternalLink className="size-3.5" />
                </motion.a>

                <motion.a
                  href={waLink(
                    `Hi Infant Computer Store! I am inquiring about products and services at your ${activeBranch.city} branch.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all"
                >
                  <MessageCircle className="size-4" /> WhatsApp Us
                </motion.a>
              </div>
            </div>

            {/* Embedded Live Google Map & Stats (6 cols) */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-6">
              <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-slate-900/10">
                <iframe
                  key={activeBranch.id}
                  title={`${activeBranch.name} Google Map Location`}
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

              {/* Stats Bar */}
              <div ref={statsRef} className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="rounded-xl border border-border/40 bg-card/80 p-3 text-center transition-all hover:shadow-sm"
                >
                  <span className="font-display text-2xl font-bold text-brand-red">
                    <AnimatedNumber end={5000} suffix="+" inView={statsInView} />
                  </span>
                  <p className="text-[11px] text-muted-foreground font-semibold">
                    Custom PCs Built Since 2007
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="rounded-xl border border-border/40 bg-card/80 p-3 text-center transition-all hover:shadow-sm"
                >
                  <span className="font-display text-2xl font-bold text-brand-blue">
                    <AnimatedNumber end={1200} suffix="+" inView={statsInView} />
                  </span>
                  <p className="text-[11px] text-muted-foreground font-semibold">
                    Networks &amp; CCTV Deployed
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured About Us CTA Banner */}
        <div className="mt-12 rounded-3xl border border-brand-blue/30 bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-purple-900/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue">
              <Sparkles className="size-3.5" /> 18+ Years of Engineering Excellence
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
              Discover the Infant Computer Store (ICS) Story
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Learn how we grew from a passionate hardware repair shop in Coimbatore in 2007 into Tamil Nadu's trusted gaming PC builder and enterprise IT solutions partner.
            </p>
          </div>
          <a
            href="/about"
            className="shrink-0 flex items-center gap-2 rounded-full bg-brand-blue hover:bg-blue-700 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:gap-3"
          >
            <span>Read Full About Us Story</span>
            <ArrowRight className="size-4" />
          </a>
        </div>

        {/* Partner Brands Marquee */}
        <div className="mt-14">
          <p className="text-center text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Authorized Partner &amp; Reseller Brands
          </p>
          <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="marquee-track flex w-max gap-4 hover:[animation-play-state:paused] py-3">
              {[...PARTNER_BRANDS, ...PARTNER_BRANDS].map((b, i) => (
                <div
                  key={`${b.name}-${i}`}
                  className="group flex h-[82px] w-44 sm:w-48 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-2.5 shadow-xs transition-all duration-300 hover:border-brand-blue/50 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-9 w-full items-center justify-center">
                    <BrandLogo
                      brand={b.name}
                      className="max-h-7 max-w-[125px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate max-w-full text-center">
                    {b.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="section-divider mt-16 sm:mt-20" />
    </section>
  );
}
