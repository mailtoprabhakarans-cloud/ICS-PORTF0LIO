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

const title = "ICS Computer Store | Custom Gaming PCs, Enterprise Networking & CCTV in Coimbatore";
const description =
  "ICS Computer Store (since 2007): Custom PC builds, RTX 50-Series, Ryzen CPUs, enterprise Cat6 networking, 4K CCTV surveillance, and in-house chip-level motherboard repair in Gandhipuram, Coimbatore.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
