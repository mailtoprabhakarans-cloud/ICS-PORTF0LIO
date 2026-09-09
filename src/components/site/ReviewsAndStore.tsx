import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Car,
  Clock,
  CreditCard,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  Receipt,
  ShieldCheck,
  Star,
  Store,
  Users,
} from "lucide-react";
import { BRANDS, CONTACT, REVIEWS, waLink } from "@/lib/site-data";

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
  const storeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const reviewInView = useInView(reviewRef, { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <section id="store-info" className="relative py-16 sm:py-20 bg-surface overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
        {/* Testimonials Section */}
        <div ref={reviewRef}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={reviewInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs font-bold tracking-[0.2em] text-brand-red uppercase">
                Customer Testimonials
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
                Trusted by 5,000+ gamers & <span className="text-gradient-brand">businesses</span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={reviewInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-2.5 rounded-2xl border border-border/50 glass-card px-4 py-2.5 shadow-soft"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={reviewInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 400 }}
                  >
                    <Star className="size-4.5 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm font-bold text-ink">4.9 / 5.0 on Google</span>
              <span className="text-xs text-muted-foreground font-medium">(350+ Reviews)</span>
            </motion.div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REVIEWS.map((rev, idx) => (
              <motion.div
                key={rev.name}
                initial={{ opacity: 0, y: 28 }}
                animate={reviewInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col justify-between rounded-2xl border border-border/40 bg-card p-5 sm:p-6 shadow-sm transition-all duration-400 hover:shadow-[0_8px_40px_-12px_oklch(0.62_0.2_245/0.15)] hover:border-brand-blue/20 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="rounded-full bg-accent/60 border border-accent px-2.5 py-1 text-xs font-bold text-brand-blue">
                      {rev.tag}
                    </span>
                  </div>

                  <div className="mt-3.5 relative">
                    <span className="absolute -top-2 -left-1 text-4xl font-bold text-brand-blue/10 select-none">"</span>
                    <p className="text-sm sm:text-[14.5px] leading-relaxed text-muted-foreground italic pl-4">
                      {rev.comment}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-border/40 pt-3.5">
                  <p className="font-display text-sm font-bold text-ink">{rev.name}</p>
                  <p className="text-xs font-medium text-muted-foreground">{rev.role}</p>
                  <span className="text-xs text-muted-foreground/70">{rev.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Store Location, Interactive Map & Experience Box */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-border/40 glass-card shadow-soft">
          <div className="grid gap-8 p-6 lg:grid-cols-12 lg:p-10">
            {/* Store Information (6 cols) */}
            <div className="space-y-5 lg:col-span-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-blue uppercase">
                  <Store className="size-3.5" /> Podanur Experience Store
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                  Visit Us on Sarada Mill Road,{" "}
                  <span className="text-gradient-brand">Podanur, Coimbatore</span>
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Walk in to test custom gaming rigs, laptops, and networking gear, discuss surveillance
                  solutions with our engineers, or drop off devices for chip-level repair.
                </p>
              </div>

              {/* Store Details List */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-surface/60 p-3.5">
                  <MapPin className="mt-0.5 size-4.5 shrink-0 text-brand-red" />
                  <div>
                    <span className="font-bold text-ink text-sm">Store Address & Landmark:</span>
                    <p className="mt-0.5 text-muted-foreground font-medium text-xs sm:text-sm">{CONTACT.address}</p>
                    <p className="text-[11.5px] font-semibold text-brand-blue mt-1">📍 {CONTACT.landmark}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-surface/60 p-3">
                    <Clock className="size-4 shrink-0 text-brand-blue" />
                    <div>
                      <span className="font-bold text-ink">Working Hours:</span>
                      <p className="text-muted-foreground">{CONTACT.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-surface/60 p-3">
                    <Phone className="size-4 shrink-0 text-brand-red" />
                    <div>
                      <span className="font-bold text-ink">Direct Desk Phone:</span>
                      <a
                        href={CONTACT.phoneHref}
                        className="text-brand-blue font-semibold hover:underline block"
                      >
                        {CONTACT.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Amenities Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { icon: Car, label: "Customer Parking" },
                  { icon: Receipt, label: "GST Input Tax Invoices" },
                  { icon: CreditCard, label: "UPI & No-Cost EMI" },
                  { icon: ShieldCheck, label: "Authorized Warranty Support" },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="flex items-center gap-1.5 rounded-full border border-border/40 bg-surface/60 px-3 py-1.5 text-[11px] font-semibold text-ink transition-all hover:border-brand-blue/30 hover:shadow-sm"
                  >
                    <item.icon className="size-3.5 text-brand-blue" />
                    {item.label}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.a
                  href={CONTACT.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:shadow-blue"
                >
                  <MapPin className="size-4" /> Open in Google Maps
                  <ExternalLink className="size-3.5" />
                </motion.a>

                <motion.a
                  href={waLink(
                    "Hi ICS Technologies! I'm planning to visit your Podanur, Coimbatore store.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all"
                >
                  <MessageCircle className="size-4" /> WhatsApp Directions
                </motion.a>
              </div>
            </div>

            {/* Embedded Live Google Map & Stats (6 cols) */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-6">
              {/* Interactive Embedded Google Map */}
              <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-slate-900/10">
                <iframe
                  title="ICS Technologies Google Map Location"
                  src={CONTACT.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[15%] contrast-[105%] hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 z-10">
                  <a
                    href={CONTACT.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-ink px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur hover:scale-105 transition-transform"
                  >
                    <MapPin className="size-3.5 text-red-600" />
                    <span>Podanur, Coimbatore – 641023</span>
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
                    Custom PCs Built
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
                    Networks Deployed
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Brands Marquee */}
        <div className="mt-14">
          <p className="text-center text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Authorized Partner & Reseller Brands
          </p>
          <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="marquee-track flex w-max gap-4 hover:[animation-play-state:paused]">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <span
                  key={`${b}-${i}`}
                  className="grid h-14 w-36 shrink-0 place-items-center rounded-2xl border border-border/40 glass-card font-display text-sm font-bold text-ink/40 transition-all duration-300 hover:border-brand-blue/40 hover:text-brand-blue hover:shadow-sm shadow-sm"
                >
                  {b}
                </span>
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
