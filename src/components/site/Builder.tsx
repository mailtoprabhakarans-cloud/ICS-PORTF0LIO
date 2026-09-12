import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Box,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Fan,
  Gauge,
  HardDrive,
  MemoryStick,
  MessageCircle,
  MonitorSmartphone,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  BUILD_PRESETS,
  BUILDER_CATALOG,
  CONTACT,
  waLink,
  type BuilderCategoryKey,
  type BuilderPart,
} from "@/lib/site-data";
import { useApp } from "@/lib/store";

const ICONS: Record<string, LucideIcon> = {
  Cpu,
  CircuitBoard,
  MonitorSmartphone,
  MemoryStick,
  HardDrive,
  Fan,
  Zap,
  Box,
};

const CATEGORIES_ORDER: BuilderCategoryKey[] = [
  "cpu",
  "motherboard",
  "gpu",
  "ram",
  "storage",
  "cooler",
  "psu",
  "case",
];

import { savePcBuildToBackend } from "@/lib/supabase-api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function Builder() {
  const { openQuote, addToCart } = useApp();
  const { user, openAuthModal } = useAuth();
  const [savingBuild, setSavingBuild] = useState(false);

  // Selected preset or custom selections
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-1440p");
  const [selectedParts, setSelectedParts] = useState<Record<BuilderCategoryKey, string>>(
    BUILD_PRESETS[1]!.parts,
  );

  // Active category being configured in accordion/drawer
  const [activeCategory, setActiveCategory] = useState<BuilderCategoryKey | null>("cpu");

  // Load a preset
  const applyPreset = (presetId: string) => {
    const preset = BUILD_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setSelectedParts(preset.parts);
    }
  };

  // Select a specific part
  const selectPart = (cat: BuilderCategoryKey, partId: string) => {
    setSelectedParts((prev) => ({ ...prev, [cat]: partId }));
    setSelectedPresetId("custom");
  };

  // Reset to default
  const resetToDefault = () => {
    applyPreset("preset-1440p");
  };

  // Calculate totals and metrics
  const activePartObjects: { cat: BuilderCategoryKey; part: BuilderPart }[] = CATEGORIES_ORDER.map(
    (cat) => {
      const partId = selectedParts[cat];
      const catConfig = BUILDER_CATALOG[cat];
      const found = catConfig.options.find((o) => o.id === partId) ?? catConfig.options[0]!;
      return { cat, part: found };
    },
  );

  const totalPrice = activePartObjects.reduce((sum, item) => sum + item.part.price, 0);
  const estimatedTdp = activePartObjects.reduce((sum, item) => {
    if (item.cat === "psu") return sum; // PSU provides power, doesn't draw TDP
    return sum + (item.part.tdp || 0);
  }, 50); // 50W base for fans/mobo chipset

  const selectedPsu = activePartObjects.find((i) => i.cat === "psu")?.part;
  const psuWattage = selectedPsu?.tdp || 650;
  const isPowerSufficient = psuWattage >= estimatedTdp + 100;

  // Selected CPU & Motherboard socket compatibility check
  const selectedCpu = activePartObjects.find((i) => i.cat === "cpu")?.part;
  const selectedMb = activePartObjects.find((i) => i.cat === "motherboard")?.part;
  const isSocketMatch =
    !selectedCpu?.socket || !selectedMb?.socket || selectedCpu.socket === selectedMb.socket;

  // Active preset FPS data or estimated
  const currentPreset = BUILD_PRESETS.find((p) => p.id === selectedPresetId);
  const fpsData = currentPreset
    ? currentPreset.fpsData
    : [
        { game: "Cyberpunk 2077 (1440p DLSS)", fps: 85 },
        { game: "GTA V (1440p Max)", fps: 130 },
        { game: "Valorant (1440p Competitive)", fps: 360 },
        { game: "Counter-Strike 2 (1440p)", fps: 180 },
      ];

  // WhatsApp formatted string
  const getWhatsAppBuildText = () => {
    const lines = activePartObjects.map(
      (item) =>
        `• ${BUILDER_CATALOG[item.cat].label}: ${item.part.name} (₹${item.part.price.toLocaleString("en-IN")})`,
    );
    return `Hi ICS Computer Store! I configured a custom PC build on your website:\n\n${lines.join(
      "\n",
    )}\n\nTotal Estimated Price: ₹${totalPrice.toLocaleString(
      "en-IN",
    )}\nEstimated Power Draw: ${estimatedTdp}W\n\nPlease confirm part availability, delivery time, and free assembly in Coimbatore.`;
  };

  const handleAddAllToCart = () => {
    activePartObjects.forEach((item) => {
      if (item.part.price > 0) {
        addToCart({
          id: `custom-build-${item.part.id}`,
          name: item.part.name,
          price: item.part.price,
          brand: item.part.brand,
        });
      }
    });
    toast.success("All 8 custom build components added to your cart!");
  };

  const handleSaveBuild = async () => {
    if (!user) {
      toast.info("Please sign in to save custom PC builds to your account");
      openAuthModal("signin");
      return;
    }

    setSavingBuild(true);
    const buildName =
      selectedPresetId !== "custom"
        ? currentPreset?.name || "Custom ICS Rig"
        : `Custom Rig (${selectedCpu?.name.split(" ")[0]} + ${selectedParts.gpu ? BUILDER_CATALOG.gpu.options.find(o => o.id === selectedParts.gpu)?.name : "GPU"})`;

    const res = await savePcBuildToBackend({
      userId: user.id,
      name: buildName,
      totalPrice,
      tdp: estimatedTdp,
      parts: selectedParts,
    });
    setSavingBuild(false);

    if (res.success) {
      toast.success("PC Build saved to your ICS account!", {
        description: "You can review and load saved builds in your Account Drawer.",
      });
    } else {
      toast.error("Failed to save build", { description: res.error });
    }
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id="builder" className="relative overflow-hidden py-16 sm:py-20 bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-30" />

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red/10 px-4 py-1.5 text-xs font-bold tracking-wider text-brand-red uppercase">
            <Sparkles className="size-3.5" /> Interactive PC Configurator
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
            Build your ultimate rig, <span className="text-gradient-brand">part by part</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Live compatibility check, wattage estimation, and instant Coimbatore store pricing.
            Every build comes with{" "}
            <strong>
              free professional assembly, cable management, and 24-hour stress testing
            </strong>
            .
          </p>
        </motion.div>

        {/* Preset Selector Pills */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2">
          {BUILD_PRESETS.map((preset) => (
            <motion.button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                selectedPresetId === preset.id
                  ? "bg-gradient-brand text-white shadow-lift ring-2 ring-brand-blue/40"
                  : "border border-border/60 bg-surface/80 text-foreground/90 hover:text-foreground hover:border-brand-blue/50 hover:bg-card"
              }`}
            >
              <span>{preset.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  selectedPresetId === preset.id
                    ? "bg-white/20 text-white"
                    : "bg-card border border-border/40 text-brand-blue dark:text-sky-400"
                }`}
              >
                ₹{(preset.approxTotal / 1000).toFixed(0)}k
              </span>
            </motion.button>
          ))}
          {selectedPresetId === "custom" && (
            <motion.button
              onClick={resetToDefault}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 rounded-full border border-dashed border-border/80 bg-surface/60 px-4 py-2 text-xs font-semibold text-foreground/80 hover:text-brand-red hover:border-brand-red"
            >
              <RotateCcw className="size-3" /> Reset
            </motion.button>
          )}
        </div>

        {/* Main 2-Column Workspace */}
        <div className="mt-8 sm:mt-10 grid gap-6 lg:grid-cols-12 2xl:gap-10">
          {/* Left Column: Interactive Slot Selector (7 cols) */}
          <div className="space-y-3 lg:col-span-7 2xl:col-span-7">
            {CATEGORIES_ORDER.map((catKey) => {
              const catConfig = BUILDER_CATALOG[catKey];
              const Icon = ICONS[catConfig.iconName] ?? Cpu;
              const currentSelectedId = selectedParts[catKey];
              const currentSelectedPart =
                catConfig.options.find((o) => o.id === currentSelectedId) ?? catConfig.options[0]!;
              const isOpen = activeCategory === catKey;

              return (
                <div
                  key={catKey}
                  className={`overflow-hidden rounded-2xl border transition-all duration-400 ${
                    isOpen
                      ? "border-brand-blue/50 glass-card shadow-[0_4px_30px_-8px_oklch(0.62_0.2_245/0.2)]"
                      : "border-border/40 bg-card/60 hover:border-brand-blue/20"
                  }`}
                >
                  {/* Slot Header */}
                  <button
                    onClick={() => setActiveCategory(isOpen ? null : catKey)}
                    className="flex w-full flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3.5 sm:p-4 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span
                        className={`grid size-9 sm:size-10 shrink-0 place-items-center rounded-xl transition-colors ${
                          isOpen
                            ? "bg-gradient-brand text-white shadow-lift"
                            : "bg-accent text-brand-blue"
                        }`}
                      >
                        <Icon className="size-4.5 sm:size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] sm:text-xs font-bold tracking-wider text-muted-foreground uppercase">
                          {catConfig.label}
                        </span>
                        <span className="block truncate text-xs sm:text-sm md:text-base font-bold text-ink">
                          {currentSelectedPart.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                      <span className="font-display text-sm sm:text-base md:text-lg font-bold text-brand-red">
                        {currentSelectedPart.price === 0
                          ? "Included"
                          : `₹${currentSelectedPart.price.toLocaleString("en-IN")}`}
                      </span>
                      <span className="rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 px-2.5 py-1 text-[11px] sm:text-xs font-bold text-brand-blue">
                        {isOpen ? "Close ▲" : "Change ▼"}
                      </span>
                    </div>
                  </button>

                  {/* Slot Options Drawer */}
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border bg-surface/50 p-2.5 sm:p-3.5"
                    >
                      <div className="grid gap-2 sm:gap-2.5">
                        {catConfig.options.map((opt) => {
                          const isSelected = opt.id === currentSelectedId;
                          return (
                            <div
                              key={opt.id}
                              onClick={() => selectPart(catKey, opt.id)}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer rounded-xl border p-3 sm:p-3.5 transition-all ${
                                isSelected
                                  ? "border-brand-blue bg-card shadow-sm ring-1 ring-brand-blue/30"
                                  : "border-border/60 bg-card/40 hover:border-brand-blue/40 hover:bg-card"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                  <span className="text-xs sm:text-sm font-bold text-ink">{opt.name}</span>
                                  {opt.tag && (
                                    <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-accent-foreground">
                                      {opt.tag}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-muted-foreground font-medium">
                                  <span>Brand: {opt.brand}</span>
                                  {opt.socket && <span>Socket: {opt.socket}</span>}
                                  {opt.tdp > 0 && catKey !== "psu" && <span>TDP: {opt.tdp}W</span>}
                                  {catKey === "psu" && <span>Capacity: {opt.tdp}W</span>}
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-border/40">
                                <span className="font-display text-xs sm:text-sm md:text-base font-bold text-ink">
                                  {opt.price === 0
                                    ? "Free"
                                    : `₹${opt.price.toLocaleString("en-IN")}`}
                                </span>
                                <div
                                  className={`grid size-5 sm:size-5.5 place-items-center rounded-full border ${
                                    isSelected
                                      ? "border-brand-blue bg-brand-blue text-white"
                                      : "border-border"
                                  }`}
                                >
                                  {isSelected && <CheckCircle2 className="size-3.5 sm:size-4" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Build Summary, Wattage, FPS & Checkout (5 cols) */}
          <div className="space-y-5 lg:col-span-5">
            {/* Price & Summary Card */}
            <div className="rounded-3xl border border-border/40 glass-card p-6 shadow-soft">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Build Total (8 Components)
                  </span>
                  <motion.p
                    key={totalPrice}
                    initial={{ scale: 1.06, color: "oklch(0.56 0.24 25)" }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="font-display text-3xl sm:text-4xl font-extrabold text-brand-red"
                  >
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </motion.p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Free Assembly
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">24-Hr Delivery</p>
                </div>
              </div>

              {/* Compatibility Diagnostics */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <CircuitBoard className="size-4.5 text-brand-blue" />
                    <span className="font-semibold text-ink">Socket Compatibility</span>
                  </div>
                  {isSocketMatch ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Compatible ({selectedCpu?.socket || "OK"})
                    </span>
                  ) : (
                    <span className="font-bold text-brand-red">
                      ⚠ Socket Mismatch ({selectedCpu?.socket} vs {selectedMb?.socket})
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4.5 text-amber-500" />
                    <span className="font-semibold text-ink">Estimated Power Draw</span>
                  </div>
                  <span className="font-bold text-ink">
                    ~{estimatedTdp}W / {psuWattage}W PSU
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-brand-blue" />
                    <span className="font-semibold text-ink">Testing & Warranty</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    24h Burn-In + 3Y Warranty
                  </span>
                </div>
              </div>

              {/* Estimated FPS Bar */}
              <div className="mt-5 rounded-2xl border border-border/40 bg-surface/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Gauge className="size-4 text-brand-blue" /> Estimated Gaming Performance
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    High Settings
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {fpsData.map((item) => (
                    <div key={item.game} className="text-xs">
                      <div className="flex justify-between font-medium text-ink">
                        <span>{item.game}</span>
                        <span className="font-bold text-brand-blue">{item.fps} FPS</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-border">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (item.fps / 300) * 100)}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <a
                  href={waLink(getWhatsAppBuildText())}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lift transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="size-4" /> Send Build to WhatsApp
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddAllToCart}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-slate-900 dark:bg-brand-blue py-2.5 text-xs font-semibold text-white transition-all hover:bg-brand-blue dark:hover:bg-brand-blue/90 hover:shadow-blue hover:scale-[1.02]"
                  >
                    <ShoppingCart className="size-3.5" /> Add to Cart
                  </button>

                  <button
                    onClick={handleSaveBuild}
                    disabled={savingBuild}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-border/60 bg-card py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:border-brand-blue/60"
                  >
                    <Sparkles className="size-3.5 text-amber-500" />
                    {savingBuild ? "Saving..." : "Save Rig"}
                  </button>
                </div>
              </div>
            </div>

            {/* Quality Guarantee Box */}
            <div className="rounded-2xl border border-border/40 bg-gradient-mesh p-4 text-xs">
              <p className="font-bold text-ink flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-brand-red" /> The ICS Computer Store Build Promise
              </p>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                Zero grey-market components. All parts carry official authorized manufacturer
                warranties in India. Includes free on-demand BIOS upgrades and lifetime technical
                phone support from our Coimbatore lab.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="section-divider mt-16 sm:mt-20" />
    </section>
  );
}
