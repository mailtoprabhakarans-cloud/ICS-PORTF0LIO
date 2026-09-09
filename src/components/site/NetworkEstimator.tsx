import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Building2,
  Calculator,
  Camera,
  Check,
  CheckCircle2,
  FileSpreadsheet,
  Fingerprint,
  HardDrive,
  MessageCircle,
  Network,
  Radio,
  Server,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { CONTACT, waLink } from "@/lib/site-data";
import { useApp } from "@/lib/store";

type SiteType = "home" | "retail" | "office" | "factory";

export default function NetworkEstimator() {
  const { openQuote } = useApp();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  const [siteType, setSiteType] = useState<SiteType>("office");
  const [cameraCount, setCameraCount] = useState<number>(8);
  const [cameraType, setCameraType] = useState<"4mp-colorvu" | "4k-ip">("4mp-colorvu");
  const [dataPoints, setDataPoints] = useState<number>(16);
  const [wifiAps, setWifiAps] = useState<number>(3);
  const [includeBiometrics, setIncludeBiometrics] = useState<boolean>(true);
  const [includeServerRack, setIncludeServerRack] = useState<boolean>(true);

  // Estimator price algorithm
  const cameraUnitPrice = cameraType === "4mp-colorvu" ? 4290 : 7490;
  const nvrPrice =
    cameraCount > 16 ? 18500 : cameraCount > 8 ? 12500 : cameraCount > 4 ? 7500 : 4500;
  const hddPrice = cameraCount > 16 ? 14500 : cameraCount > 8 ? 8900 : 4500; // WD Purple
  const totalCctv = cameraCount * cameraUnitPrice + (cameraCount > 0 ? nvrPrice + hddPrice : 0);

  const cablingPricePerPoint = 650; // Cat6 cable + IO box + patch cord + labellng
  const totalCabling = dataPoints * cablingPricePerPoint;

  const apUnitPrice = 8990; // Ubiquiti / Ruijie WiFi 6 AP
  const totalWifi = wifiAps * apUnitPrice;

  const poeSwitchPrice =
    cameraCount + dataPoints + wifiAps > 24
      ? 24500
      : cameraCount + dataPoints + wifiAps > 12
        ? 14500
        : 6500;

  const biometricsPrice = includeBiometrics ? 8490 : 0; // Face + Fingerprint Device
  const rackPrice = includeServerRack ? 9500 : 0; // 9U/12U Glass Wallmount Rack with PDU

  const estimatedHardwareTotal =
    totalCctv + totalCabling + totalWifi + poeSwitchPrice + biometricsPrice + rackPrice;
  const estimatedLaborAndTesting = Math.round(estimatedHardwareTotal * 0.12);
  const estimatedGrandTotal = estimatedHardwareTotal + estimatedLaborAndTesting;

  const getWhatsAppEstimatorText = () => {
    return `Hi ICS Technologies! I used your Network & CCTV Solution Estimator:\n\n• Site Type: ${siteType.toUpperCase()}\n• CCTV Cameras: ${cameraCount}x (${cameraType === "4mp-colorvu" ? "4MP ColorVu" : "4K Ultra IP"})\n• Network Cat6 Drops: ${dataPoints} Points\n• Wi-Fi 6 Access Points: ${wifiAps} Units\n• Biometrics: ${includeBiometrics ? "Yes" : "No"}\n• Server Rack & PoE Switch: ${includeServerRack ? "Yes" : "No"}\n\nEstimated Solution Cost: ~₹${estimatedGrandTotal.toLocaleString(
      "en-IN",
    )}\n\nPlease arrange an on-site survey and official quotation.`;
  };

  return (
    <section
      id="estimator"
      className="relative overflow-hidden py-16 sm:py-20 bg-background"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-40" />

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
        {/* Section Title */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-4 py-1.5 text-xs font-bold tracking-wider text-brand-blue uppercase">
            <Calculator className="size-3.5" /> Commercial & Home Solution Planner
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
            Networking & CCTV <span className="text-gradient-brand">Solution Estimator</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Configure your commercial office, showroom, school, or factory in Coimbatore. Get an
            immediate itemized hardware & deployment estimate.
          </p>
        </motion.div>

        {/* 2-Column Calculator Layout */}
        <div className="mt-10 sm:mt-12 grid gap-8 lg:grid-cols-12 2xl:gap-10">
          {/* Controls Side (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* 1. Property / Site Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-border/40 glass-card p-6 shadow-soft"
            >
              <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                1. Select Property Type
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { id: "home", label: "Home / Villa", icon: Building2 },
                  { id: "retail", label: "Retail Shop", icon: Server },
                  { id: "office", label: "Corporate Office", icon: Network },
                  { id: "factory", label: "Factory / Mill", icon: ShieldAlert },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setSiteType(item.id as SiteType);
                      if (item.id === "home") {
                        setCameraCount(4);
                        setDataPoints(4);
                        setWifiAps(1);
                        setIncludeBiometrics(false);
                      } else if (item.id === "factory") {
                        setCameraCount(16);
                        setDataPoints(24);
                        setWifiAps(4);
                        setIncludeBiometrics(true);
                      }
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-300 ${
                      siteType === item.id
                        ? "border-brand-blue bg-accent text-brand-blue shadow-[0_0_20px_oklch(0.62_0.2_245/0.15)] font-bold"
                        : "border-border/40 bg-surface text-ink hover:border-brand-blue/40"
                    }`}
                  >
                    <item.icon className={`size-6 transition-transform duration-300 ${siteType === item.id ? "scale-110" : ""}`} />
                    <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* 2. CCTV Cameras */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl border border-border/40 glass-card p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                  <Camera className="size-4.5 text-brand-red" /> 2. Surveillance CCTV Cameras (
                  {cameraCount} Cameras)
                </label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCameraType("4mp-colorvu")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      cameraType === "4mp-colorvu"
                        ? "bg-brand-red text-white shadow-sm"
                        : "bg-surface text-muted-foreground hover:text-ink"
                    }`}
                  >
                    4MP ColorVu Night
                  </button>
                  <button
                    onClick={() => setCameraType("4k-ip")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      cameraType === "4k-ip"
                        ? "bg-brand-red text-white shadow-sm"
                        : "bg-surface text-muted-foreground hover:text-ink"
                    }`}
                  >
                    4K Ultra HD
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="range"
                  min={0}
                  max={32}
                  step={2}
                  value={cameraCount}
                  onChange={(e) => setCameraCount(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>0 Cameras</span>
                  <span>8 Cameras (Standard)</span>
                  <span>16 Cameras</span>
                  <span>32 Cameras (Large Facility)</span>
                </div>
              </div>
            </motion.div>

            {/* 3. Cat6 Structured Cabling & Wi-Fi Access Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="rounded-3xl border border-border/40 glass-card p-6 shadow-soft"
            >
              <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                <Network className="size-4 text-brand-blue" /> 3. Cat6 Data Drops & Wi-Fi 6 Mesh
              </label>

              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-ink">
                    <span>Cat6 Workstation Drops</span>
                    <span className="font-bold text-brand-blue">{dataPoints} Points</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={64}
                    step={4}
                    value={dataPoints}
                    onChange={(e) => setDataPoints(Number(e.target.value))}
                    className="mt-2 w-full cursor-pointer"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Includes faceplate & testing
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-ink">
                    <span>Ubiquiti / Ruijie Wi-Fi APs</span>
                    <span className="font-bold text-brand-blue">{wifiAps} APs</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={wifiAps}
                    onChange={(e) => setWifiAps(Number(e.target.value))}
                    className="mt-2 w-full cursor-pointer"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Seamless roaming coverage
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 4. Add-on Infrastructure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-3xl border border-border/40 glass-card p-6 shadow-soft"
            >
              <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                4. Infrastructure Add-ons
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <motion.div
                  onClick={() => setIncludeBiometrics((v) => !v)}
                  whileTap={{ scale: 0.98 }}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all duration-300 ${
                    includeBiometrics
                      ? "border-brand-blue bg-accent text-brand-blue shadow-[0_0_15px_oklch(0.62_0.2_245/0.12)]"
                      : "border-border/40 bg-surface text-ink hover:border-brand-blue/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Fingerprint className="size-5" />
                    <div>
                      <p className="text-xs font-bold">Face / Biometric Attendance</p>
                      <p className="text-[10px] text-muted-foreground">
                        eSSL with HR software sync
                      </p>
                    </div>
                  </div>
                  <div
                    className={`grid size-5 place-items-center rounded-full border transition-all ${
                      includeBiometrics
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-border"
                    }`}
                  >
                    {includeBiometrics && <Check className="size-3" />}
                  </div>
                </motion.div>

                <motion.div
                  onClick={() => setIncludeServerRack((v) => !v)}
                  whileTap={{ scale: 0.98 }}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all duration-300 ${
                    includeServerRack
                      ? "border-brand-blue bg-accent text-brand-blue shadow-[0_0_15px_oklch(0.62_0.2_245/0.12)]"
                      : "border-border/40 bg-surface text-ink hover:border-brand-blue/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Server className="size-5" />
                    <div>
                      <p className="text-xs font-bold">Server Rack & Patch Dressing</p>
                      <p className="text-[10px] text-muted-foreground">
                        Glass door + cable manager
                      </p>
                    </div>
                  </div>
                  <div
                    className={`grid size-5 place-items-center rounded-full border transition-all ${
                      includeServerRack
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-border"
                    }`}
                  >
                    {includeServerRack && <Check className="size-3" />}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Solution Estimate Preview (5 cols) */}
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-3xl border border-border/40 glass-card p-6 shadow-soft">
              <div className="border-b border-border/40 pb-4">
                <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Estimated Total Investment
                </span>
                <motion.p
                  key={estimatedGrandTotal}
                  initial={{ scale: 1.05, color: "var(--brand-red)" }}
                  animate={{ scale: 1, color: "var(--brand-blue)" }}
                  transition={{ duration: 0.3 }}
                  className="font-display text-3xl font-extrabold text-brand-blue"
                >
                  ₹{estimatedGrandTotal.toLocaleString("en-IN")}
                </motion.p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Includes hardware supply, Cat6 cabling, PoE switch, configuration & 1-year AMC
                  support.
                </p>
              </div>

              {/* Itemized Breakdown Table */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">
                    CCTV ({cameraCount}x {cameraType === "4mp-colorvu" ? "4MP" : "4K"} + NVR + AV
                    HDD)
                  </span>
                  <span className="font-semibold text-ink">
                    ₹{totalCctv.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">
                    Cat6 Structured Cabling ({dataPoints} drops)
                  </span>
                  <span className="font-semibold text-ink">
                    ₹{totalCabling.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">
                    Enterprise Wi-Fi 6 APs ({wifiAps} units)
                  </span>
                  <span className="font-semibold text-ink">
                    ₹{totalWifi.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Smart PoE Switch Infrastructure</span>
                  <span className="font-semibold text-ink">
                    ₹{poeSwitchPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {includeBiometrics && (
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Biometric / Face Recognition</span>
                    <span className="font-semibold text-ink">
                      ₹{biometricsPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {includeServerRack && (
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Server Rack Cabinet & PDU</span>
                    <span className="font-semibold text-ink">
                      ₹{rackPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">
                    Installation, Fluke Testing & Commissioning
                  </span>
                  <span className="font-semibold text-ink">
                    ₹{estimatedLaborAndTesting.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Turnaround Estimate */}
              <div className="mt-5 rounded-2xl border border-border/40 bg-surface/60 p-3.5 text-xs">
                <div className="flex items-center gap-2 text-brand-blue font-bold">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Free On-Site Survey across Coimbatore within 24 Hours</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Our network engineers will visit your site, measure cabling runs, check RF
                  signals, and provide an exact blueprint.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <motion.a
                  href={waLink(getWhatsAppEstimatorText())}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lift transition-shadow hover:shadow-[0_20px_50px_-12px_oklch(0.5_0.2_160/0.4)]"
                >
                  <MessageCircle className="size-4" /> Send BOM via WhatsApp
                </motion.a>

                <motion.button
                  onClick={() =>
                    openQuote(
                      `Network/CCTV Estimation: ${siteType.toUpperCase()} with ${cameraCount} Cameras, ${dataPoints} Data Drops`,
                    )
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-full border border-border/60 bg-card py-3 text-xs font-bold text-foreground transition-all hover:bg-accent hover:border-brand-blue/60"
                >
                  Book Free Site Inspection
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="section-divider mt-16 sm:mt-20" />
    </section>
  );
}
