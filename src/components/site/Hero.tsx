import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Cpu, ShieldCheck, Sparkles, Truck, Wrench, Zap } from "lucide-react";
import heroComponents from "@/assets/hero-components.jpg";
import heroBuild from "@/assets/hero-pcbuild.jpg";
import heroNetwork from "@/assets/hero-network.jpg";
import { useApp } from "@/lib/store";

const SLIDES = [
  {
    tag: "Next-Gen Hardware",
    title: "RTX 50-Series & Ryzen 9000 Ready",
    sub: "100% genuine components from Intel, AMD, ASUS, MSI, Corsair & Samsung with official brand warranty. Lowest prices in Coimbatore.",
    img: heroComponents,
    action: "Shop Components",
    href: "#products",
    badge: "In Stock at Gandhipuram",
  },
  {
    tag: "Custom PC Configurator",
    title: "Precision Builds by Certified Engineers",
    sub: "Pick your budget and workload. We engineer, assemble, cable-manage, and run 24-hour AIDA64 & 3DMark stress tests — free assembly on every rig.",
    img: heroBuild,
    action: "Configure Your PC",
    href: "#builder",
    badge: "Free Assembly & BIOS Tuning",
  },
  {
    tag: "Enterprise IT & Security",
    title: "Cat6 Cabling, Cloud Wi-Fi & 4K CCTV",
    sub: "End-to-end structured cabling, Ubiquiti mesh Wi-Fi, Hikvision ColorVu surveillance, and biometrics for offices, factories and luxury homes.",
    img: heroNetwork,
    action: "Estimate Network & CCTV",
    href: "#estimator",
    badge: "Free Coimbatore Site Survey",
  },
];

const STATS = [
  { icon: ShieldCheck, title: "18+", suffix: "Years", desc: "Serving Coimbatore since 2007", end: 18 },
  { icon: Truck, title: "Same-Day", suffix: "Delivery", desc: "Across Coimbatore & Tiruppur", end: 0 },
  { icon: Wrench, title: "Chip-Level", suffix: "Lab", desc: "BGA Rework & Board Repairs", end: 0 },
  { icon: Cpu, title: "5,000+", suffix: "PCs Built", desc: "Zero-bottleneck guarantee", end: 5000 },
];

const TICKERS = [
  "🔥 RTX 5070 Ti & 5080 in stock",
  "⚡ Free 24-Hour Stress Testing on every Custom PC",
  "🛡️ 100% Genuine Tax Invoice with Input Tax Credit (ITC)",
  "📍 Gandhipuram Store open Mon–Sat 9:30 AM to 8:00 PM",
  "🛠️ Chip-Level Motherboard Diagnostic Lab",
];

// Animated counter hook
function useCounter(end: number, duration: number = 2000, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!shouldStart || end === 0 || hasStarted.current) return;
    hasStarted.current = true;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, shouldStart]);

  return count;
}

export default function Hero() {
  const { openQuote } = useApp();
  const [i, setI] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  // Mouse parallax for image card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-200, 200], [4, -4]);
  const rotateY = useTransform(mouseX, [-200, 200], [-4, 4]);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const tickerTimer = setInterval(() => setTickerIdx((v) => (v + 1) % TICKERS.length), 4000);
    return () => clearInterval(tickerTimer);
  }, []);

  const slide = SLIDES[i] ?? SLIDES[0]!;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-soft">
      {/* Ambient Floating Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 size-[28rem] rounded-full bg-brand-red/10 blur-3xl" style={{ animation: "orbFloat1 18s ease-in-out infinite" }} />
        <div className="absolute -right-20 top-1/4 size-[32rem] rounded-full bg-brand-blue/12 blur-3xl" style={{ animation: "orbFloat2 22s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-1/3 size-[24rem] rounded-full bg-neon-cyan/8 blur-3xl" style={{ animation: "orbFloat1 15s ease-in-out infinite reverse" }} />
      </div>

      {/* Dot grid pattern overlay */}
      <div className="absolute inset-0 grid-dots opacity-40" />

      {/* Top Live Ticker Ribbon */}
      <div className="relative border-b border-border/40 glass-card">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12 2xl:px-16 py-2.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full bg-brand-red/10 px-3 py-1 font-bold text-brand-red uppercase text-xs">
              <Zap className="size-3.5" /> Live
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIdx}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="font-semibold text-ink truncate"
              >
                {TICKERS[tickerIdx]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="hidden items-center gap-4 text-muted-foreground font-medium md:flex">
            <span>GST Compliant</span>
            <span className="size-1 rounded-full bg-brand-blue" />
            <span>Zero No-Cost EMI Options</span>
            <span className="size-1 rounded-full bg-brand-red" />
            <span>Direct Brand Service Support</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[1800px] items-center gap-10 lg:gap-14 2xl:gap-20 px-4 sm:px-6 lg:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 2xl:py-28 lg:grid-cols-12">
        {/* Left Column: Hero Copy & Actions */}
        <div className="lg:col-span-7 2xl:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap items-center gap-2.5"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 glass-card px-4 py-1.5 text-xs sm:text-sm font-bold tracking-wider text-brand-blue uppercase shadow-soft">
                  <span className="relative grid size-2.5 place-items-center text-brand-red pulse-ring">
                    <span className="size-2.5 rounded-full bg-brand-red" />
                  </span>
                  {slide.tag}
                </span>

                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="rounded-full bg-neon-cyan/10 border border-neon-cyan/20 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-neon-cyan"
                >
                  {slide.badge}
                </motion.span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] 2xl:text-[5rem] font-bold leading-[1.06] tracking-tight text-ink"
              >
                {slide.title.split(" ").slice(0, -2).join(" ")}{" "}
                <span className="text-gradient-brand">{slide.title.split(" ").slice(-2).join(" ")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-5 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed"
              >
                {slide.sub}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <a
              href={slide.href}
              className="animate-shine group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-brand px-9 py-4.5 text-sm sm:text-base font-semibold text-white shadow-lift transition-all duration-300 hover:scale-105 hover:shadow-[0_24px_60px_-16px_oklch(0.56_0.24_25/0.5)] active:scale-95"
            >
              {slide.action}
              <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>

            <button
              onClick={() => openQuote("Hero Inquiry")}
              className="group inline-flex items-center gap-2 rounded-full border border-ink/10 glass-card px-8 py-4.5 text-sm sm:text-base font-semibold text-ink shadow-soft transition-all duration-300 hover:border-brand-blue/40 hover:text-brand-blue hover:shadow-blue hover:scale-[1.02]"
            >
              <Sparkles className="size-4 opacity-0 -ml-2 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0 text-brand-blue" />
              Request Custom Quote
            </button>
          </motion.div>

          {/* Slide Indicator Bars */}
          <div className="mt-9 flex gap-2.5">
            {SLIDES.map((s, idx) => (
              <button
                key={s.tag}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className="relative h-2.5 overflow-hidden rounded-full bg-border/80 transition-all duration-500"
                style={{ width: idx === i ? 56 : 18 }}
              >
                {idx === i && (
                  <motion.div
                    layoutId="hero-indicator"
                    className="absolute inset-0 rounded-full bg-gradient-brand shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Trust Value Badges Grid */}
          <div ref={statsRef} className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-4 2xl:gap-5">
            {STATS.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={statsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.1 * idx + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl border border-border/60 glass-card p-4 sm:p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-soft hover:border-brand-blue/30"
              >
                <s.icon className="size-6 text-brand-blue transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]" />
                <p className="mt-2.5 text-sm sm:text-base font-bold text-ink">{s.title}</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Hero Visual Feature Box */}
        <div className="relative lg:col-span-5 2xl:col-span-5">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
            style={{ rotateX, rotateY, perspective: 800 }}
            className="animate-float relative overflow-hidden rounded-3xl border border-border/40 glass-card p-3 sm:p-4 shadow-soft"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={slide.img}
                src={slide.img}
                alt={slide.title}
                width={1600}
                height={912}
                initial={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.6 }}
                className="h-[280px] w-full rounded-2xl object-cover sm:h-[400px] lg:h-[460px] 2xl:h-[540px]"
              />
            </AnimatePresence>

            {/* Overlay gradient */}
            <div className="pointer-events-none absolute inset-3 sm:inset-4 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Float Highlight Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="absolute -bottom-2 -left-2 rounded-2xl border border-border/40 glass-card-strong p-4 sm:p-5 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Coimbatore Exclusive
                  </p>
                  <p className="font-display text-sm sm:text-base font-bold text-ink">
                    Free Assembly & Diagnostics
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 z-10 hidden rounded-xl border border-border/40 glass-card px-3 py-2 shadow-soft lg:flex items-center gap-2"
          >
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-ink">In Stock Now</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom section divider */}
      <div className="section-divider" />
    </section>
  );
}
