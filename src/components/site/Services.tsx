import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calculator,
  Camera,
  Check,
  Fingerprint,
  Laptop,
  MessageCircle,
  Network,
  Printer,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SERVICES, waLink } from "@/lib/site-data";
import { useApp } from "@/lib/store";

const ICONS: Record<string, LucideIcon> = {
  Laptop,
  Network,
  Cctv: Camera,
  Fingerprint,
  Printer,
  Calculator,
  Wrench,
};

export default function Services() {
  const { openQuote } = useApp();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 sm:py-20 bg-background"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-30" />

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-xs font-bold tracking-[0.2em] text-brand-red uppercase">
            End-to-End IT Ecosystem
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
            Complete IT Supply, Setup &{" "}
            <span className="text-gradient-brand">Lifetime Support</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
            From a single high-speed SSD upgrade to a 50-workstation enterprise LAN, 4K CCTV
            surveillance, and GST accounting licenses — ICS Computer Store is Coimbatore's trusted IT
            engineering partner.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Laptop;
            return (
              <ServiceCard
                key={s.id}
                service={s}
                Icon={Icon}
                index={i}
                openQuote={openQuote}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="section-divider mt-16 sm:mt-20" />
    </section>
  );
}

function ServiceCard({
  service: s,
  Icon,
  index,
  openQuote,
}: {
  service: (typeof SERVICES)[number];
  Icon: LucideIcon;
  index: number;
  openQuote: (preset?: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-400 hover:shadow-[0_8px_40px_-12px_oklch(0.62_0.2_245/0.2)] hover:border-brand-blue/30 hover:-translate-y-2"
    >
      {/* Subtle gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-mesh opacity-0 transition-opacity duration-500 group-hover:opacity-40" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex size-13 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-lift transition-all duration-400 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_20px_50px_-12px_oklch(0.56_0.24_25/0.4)]">
            <Icon className="size-6" />
          </div>
          <span className="rounded-full bg-accent/60 border border-accent px-3.5 py-1 text-xs font-bold text-brand-blue">
            {s.startingPrice}
          </span>
        </div>

        <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold text-ink">{s.title}</h3>
        <p className="text-sm font-bold text-brand-red mt-0.5">{s.subtitle}</p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

        <ul className="mt-4 space-y-2.5 border-t border-border/40 pt-3.5">
          {s.points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink/90 font-medium">
              <Check className="mt-0.5 size-4 shrink-0 text-brand-blue" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-6 border-t border-border/40 pt-4">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Brands: <span className="font-semibold text-ink">{s.brands}</span>
        </p>

        <div className="mt-4 flex gap-2">
          <motion.button
            onClick={() => openQuote(s.title)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 rounded-full bg-slate-900 dark:bg-brand-blue py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-blue dark:hover:bg-brand-blue/90 hover:shadow-blue"
          >
            Book Service
          </motion.button>
          <a
            href={waLink(
              `Hi ICS Computer Store, I want to inquire about your ${s.title} service.`,
            )}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp inquiry for ${s.title}`}
            className="grid place-items-center rounded-full bg-gradient-brand px-3.5 text-white transition-all hover:scale-105 hover:shadow-lift"
          >
            <MessageCircle className="size-4.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
