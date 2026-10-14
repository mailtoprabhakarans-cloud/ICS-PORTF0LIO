import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  XCircle,
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
import { CONTACT, waLink } from "@/lib/site-data";

const title =
  "Policy Details | Shipping, Returns, Cancellations, Terms & Privacy — Infant Computer Store (ICS)";
const description =
  "Official store policies for Infant Computer Store (ICS) Coimbatore & Ooty. Includes Shipping Policy, Return & Refund Policy, Cancellation Policy, Terms & Conditions, and Privacy Policy.";
const siteUrl = "https://icsstore.in/policies";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "ICS Computer Store policies, Infant Computer Store shipping policy, return refund policy, cancellation policy, terms and conditions, privacy policy Coimbatore Ooty",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
    ],
    links: [{ rel: "canonical", href: siteUrl }],
  }),
  component: PoliciesPage,
});

type PolicyTab = "shipping" | "refund" | "cancellation" | "terms" | "privacy";

const TABS: { id: PolicyTab; label: string; icon: typeof Truck; tag: string }[] = [
  { id: "shipping", label: "Shipping Policy", icon: Truck, tag: "Delivery & Transit" },
  { id: "refund", label: "Return and Refund Policy", icon: RotateCcw, tag: "DOA & Warranty" },
  { id: "cancellation", label: "Cancellation Policy", icon: XCircle, tag: "Orders & Rigs" },
  { id: "terms", label: "Terms and Conditions", icon: Scale, tag: "Store Terms & Invoicing" },
  { id: "privacy", label: "Privacy Policy", icon: Shield, tag: "Data & Payments" },
];

function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<PolicyTab>("shipping");

  // Read URL query param ?tab=... or hash #...
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const tabParam = url.searchParams.get("tab") as PolicyTab | null;
      const hashParam = url.hash.replace("#", "") as PolicyTab | null;
      const target = tabParam || hashParam;

      if (target && ["shipping", "refund", "cancellation", "terms", "privacy"].includes(target)) {
        setActiveTab(target);
      }
    }
  }, []);

  const handleTabChange = (tab: PolicyTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
          <StructuredData />
          <Header />

          <main className="relative overflow-hidden">
            {/* Ambient background decoration */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-radial from-brand-blue/15 via-transparent to-transparent blur-3xl opacity-60" />

            {/* Breadcrumb Navigation */}
            <section className="border-b border-border/40 bg-surface/50 py-3 text-xs text-muted-foreground">
              <div className="mx-auto flex max-w-[1800px] items-center gap-2 px-4 sm:px-6 lg:px-12 2xl:px-16">
                <Link to="/" className="hover:text-brand-blue transition-colors flex items-center gap-1 font-medium">
                  <ArrowLeft className="size-3.5" /> Back to Store
                </Link>
                <span>/</span>
                <span className="font-semibold text-ink">Policy Details</span>
                <span>/</span>
                <span className="text-brand-blue font-bold capitalize">
                  {TABS.find((t) => t.id === activeTab)?.label}
                </span>
              </div>
            </section>

            {/* Page Header */}
            <section className="py-12 sm:py-16 border-b border-border/40 bg-card/40">
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 text-xs font-bold text-brand-blue uppercase tracking-wider">
                    <ShieldCheck className="size-3.5 text-brand-red" />
                    <span>Customer Protection &amp; Compliance</span>
                  </div>

                  <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
                    Store Policy <span className="text-gradient-brand">Details</span>
                  </h1>

                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Transparent operational, shipping, refund, and warranty guidelines for{" "}
                    <strong className="text-ink font-semibold">INFANT COMPUTER STORE (ICS)</strong> across our Podanur (Coimbatore) and Ooty (Nilgiris) branches.
                  </p>
                </div>

                {/* Tabs Bar */}
                <div className="mt-8 flex flex-wrap gap-2 pt-2 border-t border-border/40">
                  {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                          isActive
                            ? "bg-brand-blue text-white shadow-md scale-102"
                            : "bg-surface border border-border/60 text-muted-foreground hover:text-ink hover:border-brand-blue/30"
                        }`}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Policy Content Body */}
            <section className="py-12 sm:py-16">
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
                <div className="grid gap-10 lg:grid-cols-12">
                  {/* Left Column: Policy Details (8 cols) */}
                  <div className="lg:col-span-8">
                    {/* 1. SHIPPING POLICY */}
                    {activeTab === "shipping" && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-3xl border border-border/50 bg-card p-6 sm:p-10 shadow-soft space-y-8"
                      >
                        <div className="border-b border-border/40 pb-5">
                          <span className="text-xs font-bold tracking-widest text-brand-blue uppercase">
                            Delivery &amp; Transit Logistics
                          </span>
                          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
                            Shipping Policy
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Last Updated: October 2026 · Applies to all online, telephone, and store-despatched orders
                          </p>
                        </div>

                        {/* Point 1: Store Pickup */}
                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <MapPin className="size-5 text-brand-red" />
                            1. In-Store Pickup (Free &amp; Ready in 2 Hours)
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Customers can opt for instant self-pickup from either of our two verified Google Business branches:
                          </p>
                          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground pl-2 space-y-1">
                            <li>
                              <strong className="text-ink">Podanur HQ (Coimbatore):</strong> 240/A2B, Saradha Mill Road, Near Koushikha Hospital (Mon – Sat: 9:30 AM – 8:00 PM).
                            </li>
                            <li>
                              <strong className="text-ink">Ooty Branch (Nilgiris):</strong> Shop No: 1, ATC Complex, ATC Town Bus Stand (Mon – Sat: 10:00 AM – 7:30 PM).
                            </li>
                          </ul>
                          <p className="text-xs text-muted-foreground bg-surface/70 border border-border/40 p-3 rounded-xl">
                            💡 For in-store pickups, please bring your Order Confirmation SMS/WhatsApp and a valid Government ID or GST invoice copy.
                          </p>
                        </div>

                        {/* Point 2: Delivery Timelines */}
                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <Clock className="size-5 text-brand-blue" />
                            2. Doorstep Delivery Timelines &amp; Coverage
                          </h3>
                          <div className="overflow-x-auto rounded-2xl border border-border/40">
                            <table className="w-full text-left text-xs sm:text-sm">
                              <thead className="bg-surface/80 text-ink font-bold border-b border-border/40">
                                <tr>
                                  <th className="p-3.5">Destination Zone</th>
                                  <th className="p-3.5">Estimated Delivery</th>
                                  <th className="p-3.5">Courier Partner</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/40 text-muted-foreground">
                                <tr>
                                  <td className="p-3.5 font-medium text-ink">Coimbatore City &amp; Suburbs</td>
                                  <td className="p-3.5">Same-Day / Next-Day (Within 24 Hours)</td>
                                  <td className="p-3.5">ICS Express Courier / Direct Store Delivery</td>
                                </tr>
                                <tr>
                                  <td className="p-3.5 font-medium text-ink">Tamil Nadu (Tiruppur, Erode, Salem, Chennai, Madurai)</td>
                                  <td className="p-3.5">1 – 2 Business Days</td>
                                  <td className="p-3.5">Bluedart / Professional / DTDC Express</td>
                                </tr>
                                <tr>
                                  <td className="p-3.5 font-medium text-ink">Nilgiris District (Ooty, Coonoor, Kotagiri)</td>
                                  <td className="p-3.5">Next-Day Delivery via Ooty ATC Branch</td>
                                  <td className="p-3.5">Direct Nilgiris Van / DTDC</td>
                                </tr>
                                <tr>
                                  <td className="p-3.5 font-medium text-ink">Rest of South India &amp; All-India</td>
                                  <td className="p-3.5">3 – 5 Business Days</td>
                                  <td className="p-3.5">Bluedart Air / Delhivery Express</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Point 3: Safe Packaging */}
                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <ShieldCheck className="size-5 text-emerald-600" />
                            3. High-Value Packaging &amp; Transit Insurance
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Delicate electronics such as graphics cards (RTX 50/40 series), CPUs, motherboards, curved monitors, and pre-built custom liquid gaming rigs are packed using industrial anti-static bubble wrap, dual-wall corrugated cartons, and custom internal expanding foam to immobilize heavy GPUs during transit. Full transit insurance coverage applies.
                          </p>
                        </div>

                        {/* Point 4: Tracking */}
                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <Truck className="size-5 text-brand-blue" />
                            4. Consignment Tracking
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Once your order is despatched, you will receive an automated WhatsApp &amp; SMS notification with the consignment Airway Bill (AWB) number. You can also track your shipment live using the <strong className="text-ink">"Track Order"</strong> button on our top bar.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* 2. RETURN AND REFUND POLICY */}
                    {activeTab === "refund" && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-3xl border border-border/50 bg-card p-6 sm:p-10 shadow-soft space-y-8"
                      >
                        <div className="border-b border-border/40 pb-5">
                          <span className="text-xs font-bold tracking-widest text-brand-red uppercase">
                            Returns, Replacements &amp; Refunds
                          </span>
                          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
                            Return and Refund Policy
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Governed by official IT hardware manufacturer service policies and fair trade guidelines
                          </p>
                        </div>

                        {/* Point 1: 7-Day Window */}
                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <RotateCcw className="size-5 text-brand-red" />
                            1. 7-Day Dead On Arrival (DOA) &amp; Transit Damage Guarantee
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            If any component or system arrives physically damaged or is Dead On Arrival (DOA) within 7 days of delivery, Infant Computer Store will provide an <strong className="text-ink">immediate one-to-one brand replacement</strong> at zero additional cost.
                          </p>
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                            <strong>⚠️ Mandatory Unboxing Video Requirement:</strong> To safeguard against courier tampering and transit mishandling, customers are kindly requested to record a continuous unboxing video of outer packaging and seals before powering on.
                          </div>
                        </div>

                        {/* Point 2: Non-Returnable Items */}
                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <ShieldAlert className="size-5 text-brand-blue" />
                            2. Non-Returnable Circumstances
                          </h3>
                          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground pl-2 space-y-1.5">
                            <li>Physical damage caused by user mishandling, bent CPU socket pins, liquid spills, or electrical surges.</li>
                            <li>Opened software licenses, activated digital product keys (such as Windows, Office, Tally Prime, Antivirus).</li>
                            <li>Consumables that have been unsealed (thermal paste tubes, liquid coolants, printer toner cartridges).</li>
                            <li>Products with tampered or removed brand serial number barcodes.</li>
                          </ul>
                        </div>

                        {/* Point 3: Official Brand Warranty */}
                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <ShieldCheck className="size-5 text-emerald-600" />
                            3. Manufacturer Brand Warranty &amp; Chip-Level Support
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            All products sold by Infant Computer Store carry 100% genuine manufacturer warranties (typically 3 to 5 years for Intel/AMD CPUs, ASUS/MSI/Gigabyte motherboards and GPUs, WD/Seagate SSDs, and Hikvision CCTV). After the initial 7-day DOA window, warranty claims are serviced either through official brand authorized service centers or via our in-house chip-level lab desk in Podanur.
                          </p>
                        </div>

                        {/* Point 4: Refund Timeline */}
                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <CreditCard className="size-5 text-brand-blue" />
                            4. Refund Processing &amp; Modes
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Approved refunds are credited back to the original source of payment within <strong className="text-ink">5 to 7 working days</strong>:
                          </p>
                          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground pl-2 space-y-1">
                            <li><strong className="text-ink">UPI / Net Banking / Debit Card:</strong> 2 to 4 business days.</li>
                            <li><strong className="text-ink">Credit Card / No-Cost EMI:</strong> 5 to 7 business days as per issuing bank billing cycle.</li>
                            <li><strong className="text-ink">Store Cash / Cheque Purchases:</strong> Immediate store credit or bank NEFT transfer.</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {/* 3. CANCELLATION POLICY */}
                    {activeTab === "cancellation" && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-3xl border border-border/50 bg-card p-6 sm:p-10 shadow-soft space-y-8"
                      >
                        <div className="border-b border-border/40 pb-5">
                          <span className="text-xs font-bold tracking-widest text-brand-blue uppercase">
                            Order Modifications &amp; Retractions
                          </span>
                          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
                            Cancellation Policy
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Guidelines for cancelling standard orders and custom-built PC rigs
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <CheckCircle2 className="size-5 text-emerald-600" />
                            1. Cancellation of Standard Hardware &amp; Accessories
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Standard orders (CPUs, RAM, SSDs, peripheral mice, keyboards, Wi-Fi routers) can be cancelled at <strong className="text-ink">zero penalty</strong> before the parcel has been despatched from our Podanur or Ooty warehouse (normally within 12–24 hours of placing the order).
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <RefreshCcw className="size-5 text-brand-red" />
                            2. Custom Gaming PC &amp; Workstation Builds
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Because custom gaming rigs involve unsealing sealed component packaging, precision chassis assembly, custom wiring, liquid loop filling, and a 24-hour thermal stress benchmark:
                          </p>
                          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground pl-2 space-y-1.5">
                            <li><strong className="text-ink">Prior to Assembly Initiation:</strong> 100% full refund.</li>
                            <li><strong className="text-ink">After Assembly &amp; Unsealing of Specific Parts:</strong> Cancellation is subject to a nominal 5% to 10% re-boxing / bench fee to account for opened retail packaging.</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                            <HelpCircle className="size-5 text-brand-blue" />
                            3. How to Request Cancellation
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            To cancel an order, simply contact our helpline or WhatsApp with your Order ID:
                          </p>
                          <div className="flex flex-wrap gap-3 pt-1">
                            <a
                              href={`tel:${CONTACT.phoneHref}`}
                              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface px-4 py-2 text-xs font-bold text-ink hover:text-brand-blue"
                            >
                              <Phone className="size-3.5 text-brand-red" />
                              {CONTACT.phone}
                            </a>
                            <a
                              href={waLink("Hi Infant Computer Store, I would like to request order cancellation for Order ID: ")}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-700"
                            >
                              WhatsApp Order Desk
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* 4. TERMS AND CONDITIONS */}
                    {activeTab === "terms" && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-3xl border border-border/50 bg-card p-6 sm:p-10 shadow-soft space-y-8"
                      >
                        <div className="border-b border-border/40 pb-5">
                          <span className="text-xs font-bold tracking-widest text-brand-blue uppercase">
                            Legal &amp; Operational Agreement
                          </span>
                          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
                            Terms and Conditions
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Operating under Indian Law · Jurisdiction: Coimbatore, Tamil Nadu
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                            1. Entity Information &amp; Acceptance
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            These Terms and Conditions govern the sale of IT hardware, networking equipment, CCTV surveillance, chip-level diagnostics, and AMC services by <strong className="text-ink">INFANT COMPUTER STORE</strong> (operating trade brand <strong className="text-ink">ICS COMPUTER STORE</strong>, established 2007). By placing an order via our website, WhatsApp, email, or in-store counter, you agree to be bound by these terms.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                            2. Pricing, Invoicing &amp; GST Compliance
                          </h3>
                          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground pl-2 space-y-1.5">
                            <li>All product prices displayed on icsstore.in include Goods and Services Tax (GST) unless explicitly noted otherwise.</li>
                            <li>Every transaction is accompanied by an authentic computer-generated GST tax invoice featuring our registered GSTIN. Commercial B2B clients can provide their GSTIN during checkout to claim input tax credit (ITC).</li>
                            <li>Due to global semiconductor and GPU market volatility, quotations issued remain valid for 48 hours unless otherwise agreed in writing.</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                            3. Repair Lab Diagnostics &amp; Custody
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            For devices deposited in our Podanur Chip-Level Repair Lab:
                          </p>
                          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground pl-2 space-y-1">
                            <li>Customers must back up personal data prior to motherboard rework or OS reinstallation. While ICS takes utmost precautions, we are not liable for pre-existing hard drive bad sectors or corrupted storage media.</li>
                            <li>Repaired devices must be collected within 60 days of completion notification.</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                            4. Jurisdiction &amp; Dispute Resolution
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Any disputes, claims, or legal actions arising in connection with orders or services rendered shall be subject to the exclusive jurisdiction of the competent courts in <strong className="text-ink">Coimbatore, Tamil Nadu, India</strong>.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* 5. PRIVACY POLICY */}
                    {activeTab === "privacy" && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-3xl border border-border/50 bg-card p-6 sm:p-10 shadow-soft space-y-8"
                      >
                        <div className="border-b border-border/40 pb-5">
                          <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">
                            Data Security &amp; Privacy Standards
                          </span>
                          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
                            Privacy Policy
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Committed to securing your personal, payment, and enterprise identity
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                            1. Information We Collect
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            We collect only the essential information required to fulfill orders, deliver custom PC builds, and provide warranty support:
                          </p>
                          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground pl-2 space-y-1">
                            <li>Customer Name, Delivery Address, Pincode, Contact Phone Number, and Email Address.</li>
                            <li>Company Name and GSTIN (for B2B tax invoice generation).</li>
                            <li>Device serial numbers and technical specs for repair tracking and warranty registration.</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                            2. 100% Secure Payment Processing
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            All online payments on icsstore.in are routed through RBI-licensed payment aggregators (Cashfree, Razorpay). <strong className="text-ink">Infant Computer Store NEVER stores or has access to your sensitive Credit Card numbers, Debit Card PINs, or CVV codes.</strong> All transmission occurs over TLS 1.3 256-bit encryption.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                            3. No Third-Party Data Selling
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            We do not sell, rent, trade, or disclose your contact details to third-party telemarketers or advertisers. Your phone number is strictly used for order updates, courier tracking, and customer support.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                            4. Contacting the Grievance Officer
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            For any privacy inquiries or to request data modification, contact:
                          </p>
                          <p className="text-xs text-muted-foreground bg-surface/70 border border-border/40 p-3 rounded-xl font-medium">
                            Privacy &amp; Compliance Desk: <a href="mailto:info@icsstore.in" className="text-brand-blue font-bold hover:underline">info@icsstore.in</a> · Phone: {CONTACT.phone}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column: Quick Help & Verified Locations (4 cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Customer Support Card */}
                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
                          <Phone className="size-5" />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-ink">Need Immediate Assistance?</h4>
                          <p className="text-xs text-muted-foreground">Our desk is open Mon – Sat</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <a
                          href={CONTACT.phoneHref}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/40 hover:border-brand-blue/40 font-semibold text-ink"
                        >
                          <span>Direct Phone:</span>
                          <span className="text-brand-blue">{CONTACT.phone}</span>
                        </a>

                        <a
                          href={`mailto:${CONTACT.email}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/40 hover:border-brand-blue/40 font-semibold text-ink"
                        >
                          <span>Email Support:</span>
                          <span className="text-brand-blue">{CONTACT.email}</span>
                        </a>

                        <a
                          href={waLink("Hi Infant Computer Store, I have a question regarding store policies.")}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition-all"
                        >
                          <HelpCircle className="size-4" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Both Verified Branches Pill Box */}
                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <h4 className="font-display text-sm font-bold text-ink">100% Google Verified Branches</h4>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-surface border border-border/40 space-y-1">
                          <p className="font-bold text-ink text-sm">Podanur HQ (Coimbatore)</p>
                          <p className="text-muted-foreground text-[11.5px]">{CONTACT.address}</p>
                          <p className="text-brand-blue text-[11px] font-semibold">📍 Near Koushikha Hospital</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-surface border border-border/40 space-y-1">
                          <p className="font-bold text-ink text-sm">Ooty Branch (Nilgiris)</p>
                          <p className="text-muted-foreground text-[11.5px]">Shop No: 1, ATC Complex, ATC Town Bus Stand</p>
                          <p className="text-brand-blue text-[11px] font-semibold">📍 Udhagamandalam – 643001</p>
                        </div>
                      </div>

                      <Link
                        to="/about"
                        className="block text-center text-xs font-bold text-brand-blue hover:underline pt-1"
                      >
                        Read Full 18-Year Store Story →
                      </Link>
                    </div>
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
