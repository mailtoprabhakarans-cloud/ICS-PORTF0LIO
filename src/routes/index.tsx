import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Builder from "@/components/site/Builder";
import Products from "@/components/site/Products";
import Services from "@/components/site/Services";
import NetworkEstimator from "@/components/site/NetworkEstimator";
import RepairLab from "@/components/site/RepairLab";
import ReviewsAndStore from "@/components/site/ReviewsAndStore";
import QuoteModal from "@/components/site/QuoteModal";
import QuickViewModal from "@/components/site/QuickViewModal";
import CompareModal from "@/components/site/CompareModal";
import WishlistDrawer from "@/components/site/WishlistDrawer";
import Footer, { WhatsAppFab } from "@/components/site/Footer";
import { AppProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth-context";
import AuthModal from "@/components/auth/AuthModal";
import UserAccountDrawer from "@/components/auth/UserAccountDrawer";
import { Toaster } from "sonner";
import StructuredData from "@/components/seo/StructuredData";

const title =
  "ICS Computer Store Coimbatore | Custom Gaming PCs, CCTV, Networking & Repair Since 2007";
const description =
  "Buy genuine RTX 50-series GPUs, Ryzen 9000 CPUs, custom gaming PCs, enterprise Cat6 networking & 4K Hikvision CCTV at ICS Computer Store Coimbatore. Chip-level motherboard repair lab. GST invoices. Since 2007.";
const keywords = [
  "computer store coimbatore",
  "gaming pc coimbatore",
  "custom pc build coimbatore",
  "cctv installation coimbatore",
  "networking services coimbatore",
  "laptop repair coimbatore",
  "motherboard repair coimbatore",
  "RTX 5070 Ti coimbatore",
  "RTX 5080 coimbatore",
  "Ryzen 7800X3D coimbatore",
  "Ryzen 9 9950X coimbatore",
  "gaming laptop coimbatore",
  "Cat6 cabling coimbatore",
  "Hikvision CCTV coimbatore",
  "computer repair near me coimbatore",
  "PC build under 50000",
  "best computer store coimbatore",
  "enterprise networking coimbatore",
  "CCTV camera installation coimbatore",
  "chip level repair coimbatore",
  "ICS computer store",
  "Infant Computer Store",
  "custom gaming PC Tamil Nadu",
  "structured cabling coimbatore",
  "biometric attendance coimbatore",
  "printer repair coimbatore",
  "Tally Prime dealer coimbatore",
  "gaming pc under 1 lakh coimbatore",
  "computer shop gandhipuram",
  "computer shop podanur",
  "IT hardware dealer coimbatore",
  "genuine computer parts coimbatore",
].join(", ");
const siteUrl = "https://icsstore.in";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: keywords },

      /* ── Open Graph ────────────────────────────────────── */
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:site_name", content: "ICS Computer Store" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:image", content: `${siteUrl}/ics-logo.svg` },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { property: "og:image:alt", content: "ICS Computer Store Logo" },

      /* ── Twitter Card ──────────────────────────────────── */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${siteUrl}/ics-logo.svg` },
      { name: "twitter:image:alt", content: "ICS Computer Store — Coimbatore" },
    ],
    links: [{ rel: "canonical", href: siteUrl }],
  }),
  component: Index,
});

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-brand z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}

function Index() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
          <StructuredData />
          <ScrollProgress />
          <Header />
          <main>
            <Hero />
            <Builder />
            <Products />
            <Services />
            <NetworkEstimator />
            <RepairLab />
            <ReviewsAndStore />
          </main>
          <Footer />
          <WhatsAppFab />

          {/* Global Dialogs, Auth & Drawers */}
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

