import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  GitCompareArrows,
  Heart,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sun,
  Truck,
  User,
  X,
} from "lucide-react";
import IcsLogo from "./IcsLogo";
import { CONTACT, MEGA_MENU, PRODUCTS, type Product } from "@/lib/site-data";
import { useApp } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { createOrderInBackend } from "@/lib/supabase-api";
import type { DbOrder } from "@/lib/supabase";
import { toast } from "sonner";
import AdminPanelModal from "../admin/AdminPanelModal";
import OrderTrackingModal from "./OrderTrackingModal";

const NAV_LINKS = [
  { label: "Store", href: "#products" },
  { label: "PC Configurator", href: "#builder" },
  { label: "Networking & CCTV", href: "#services" },
  { label: "Solution Estimator", href: "#estimator" },
  { label: "Chip-Level Lab", href: "#repair-lab" },
  { label: "Reviews & Store", href: "#store-info" },
];

export default function Header() {
  const {
    theme,
    toggleTheme,
    cartCount,
    cartTotal,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    compareList,
    setIsCompareOpen,
    setQuickViewProduct,
    openQuote,
  } = useApp();

  const { user, profile, openAuthModal, openAccountDrawer } = useAuth();

  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.specs.some((s) => s.toLowerCase().includes(q)),
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="bg-slate-950 text-xs sm:text-sm text-slate-200 transition-colors py-2 border-b border-white/10">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-2 px-4 sm:px-6 lg:px-12 2xl:px-16">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a
              href={CONTACT.phoneHref}
              className="group flex items-center gap-1.5 text-slate-200 transition-colors hover:text-neon-cyan"
            >
              <Phone className="size-4 text-brand-blue transition-transform group-hover:scale-110" />
              <span className="font-semibold">{CONTACT.phone}</span>
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="hidden items-center gap-1.5 text-slate-300 transition-colors hover:text-neon-cyan sm:flex"
            >
              <Mail className="size-4 text-brand-blue" />
              <span>{CONTACT.email}</span>
            </a>
            <span className="hidden items-center gap-1.5 md:flex text-slate-300">
              <Clock className="size-4 text-brand-blue" />
              <span>{CONTACT.hours}</span>
            </span>
          </div>

            <div className="flex items-center gap-3">
              {/* Public Order Tracking Button */}
              <button
                onClick={() => setIsTrackingOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 text-xs font-semibold transition-colors"
              >
                <Truck className="size-3.5 text-brand-blue" />
                <span>Track Order</span>
              </button>

              {/* Separate Admin Portal Link */}
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs font-bold transition-colors"
              >
                <ShieldCheck className="size-3.5 text-indigo-400" />
                <span>Admin Panel</span>
              </a>

              <a
                href={CONTACT.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 lg:inline-flex hover:bg-emerald-500/30 transition-colors"
              >
                <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                Podanur, Coimbatore
              </a>
              <span className="flex items-center gap-1.5 rounded-full bg-gradient-brand px-3.5 py-1 text-xs font-bold tracking-wide text-white shadow-lift animate-pulse-subtle">
                <Sparkles className="size-3.5" /> SINCE 2007
              </span>
            </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`transition-all duration-300 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 ${
          scrolled ? "shadow-md" : "shadow-xs"
        }`}
      >
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3 sm:gap-6 px-3 sm:px-6 lg:px-12 2xl:px-16 py-2.5 sm:py-3.5">
          {/* Logo & Brand Name */}
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-3 select-none transition-opacity hover:opacity-95"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 320 }}
              className="shrink-0 drop-shadow-sm"
            >
              <IcsLogo className="size-12 sm:size-13 lg:size-14" />
            </motion.div>
            <div className="flex flex-col justify-center shrink-0">
              <div className="flex items-baseline leading-none font-sans">
                <span className="text-2xl sm:text-[26px] lg:text-[28px] font-black tracking-tight text-[#DC1424]">
                  ICS
                </span>
                <span className="ml-1.5 text-xl sm:text-[23px] lg:text-[25px] font-black tracking-tight text-slate-950 dark:text-white uppercase">
                  COMPUTER STORE
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 mt-1 font-sans text-[8px] sm:text-[9.5px] lg:text-[10.5px] font-extrabold tracking-[0.04em] text-[#002060] dark:text-sky-300 uppercase whitespace-nowrap">
                <span>IT HARDWARE &amp; SOFTWARE</span>
                <span className="text-slate-300 dark:text-slate-600 font-light px-0.5">|</span>
                <span>CCTV &amp; SECURITY</span>
                <span className="text-slate-300 dark:text-slate-600 font-light px-0.5">|</span>
                <span>NETWORKING</span>
              </div>
            </div>
          </a>

          {/* Interactive Live Search Bar (Desktop) */}
          <div className="relative mx-3 hidden max-w-xl flex-1 items-center xl:max-w-2xl lg:flex">
            <div
              className={`flex w-full items-center rounded-full border transition-all duration-200 ${
                searchFocused
                  ? "border-blue-600 ring-4 ring-blue-600/15 bg-white dark:bg-slate-950 shadow-sm"
                  : "border-slate-200/90 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 px-4 py-1.5 sm:py-2">
                <Search
                  className={`size-4 shrink-0 transition-colors ${
                    searchFocused ? "text-blue-600" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-ink outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                  placeholder="Search RTX 50-Series, Ryzen, Laptops, 4K CCTV, Networking..."
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="text-slate-400 hover:text-ink transition-colors p-1"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const firstMatch = searchResults[0];
                    if (firstMatch) {
                      setQuickViewProduct(firstMatch);
                      setSearchQuery("");
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  <Search className="size-3.5" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Live Autocomplete Dropdown — Solid Opaque Card (No Bleed-Through) */}
            <AnimatePresence>
              {searchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.99 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 z-[100] mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2.5"
                >
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
                    <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                      Suggested Products ({searchResults.length})
                    </p>
                    <span className="text-[10px] text-slate-400">Click to view product</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.map((prod, idx) => (
                      <motion.div
                        key={prod.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onMouseDown={() => {
                          setQuickViewProduct(prod);
                          setSearchQuery("");
                        }}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/60"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="size-11 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-1 shrink-0 border border-slate-200/80 dark:border-slate-700/60"
                          />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase shrink-0">
                                {prod.category}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {prod.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {prod.specs.join(" · ")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-display text-sm font-bold text-red-600 dark:text-red-400">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </span>
                          {prod.mrp && prod.mrp > prod.price && (
                            <span className="block text-[10px] text-slate-400 line-through">
                              ₹{prod.mrp.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Icons Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle (Circular & Minimal) */}
            <motion.button
              onClick={toggleTheme}
              aria-label="Toggle Light and Dark Mode"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex size-9 sm:size-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {theme === "dark" ? (
                <Sun className="size-4 sm:size-4.5 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="size-4 sm:size-4.5 text-slate-700 dark:text-slate-300" />
              )}
            </motion.button>

            {/* Wishlist */}
            <motion.button
              aria-label="Wishlist"
              title="View Wishlist"
              onClick={() => setIsWishlistOpen(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative flex size-9 sm:size-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Heart className="size-4.5 stroke-[1.8]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                  {wishlist.length}
                </span>
              )}
            </motion.button>

            {/* Compare (Desktop) */}
            <motion.button
              aria-label="Compare"
              title="Compare Products"
              onClick={() => setIsCompareOpen(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="hidden md:flex relative size-9 sm:size-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-blue transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <GitCompareArrows className="size-4.5 stroke-[1.8]" />
              {compareList.length > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-brand-blue text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                  {compareList.length}
                </span>
              )}
            </motion.button>

            {/* Cart with Badge */}
            <motion.button
              aria-label="Cart"
              title="Shopping Cart"
              onClick={() => setIsCartOpen(true)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative flex size-9 sm:size-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <ShoppingCart className="size-4.5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900 shadow-xs animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* User Account / Sign In */}
            {user ? (
              <motion.button
                aria-label="Account"
                title={`Logged in as ${profile?.full_name || user.email}`}
                onClick={openAccountDrawer}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-850 py-1.5 pr-3 pl-1.5 text-xs font-bold text-ink hover:border-brand-blue transition-all"
              >
                <div className="flex size-6 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-black text-white shadow-xs">
                  {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[85px] truncate font-bold">
                  {profile?.full_name?.split(" ")[0] || "Account"}
                </span>
              </motion.button>
            ) : (
              <motion.button
                aria-label="Sign In"
                title="Sign In or Create Account"
                onClick={() => openAuthModal("signin")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-850 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-2xs"
              >
                <User className="size-3.5 stroke-[2] text-brand-blue" />
                <span className="hidden md:inline font-bold">Sign In</span>
              </motion.button>
            )}

            {/* Primary High-Conversion CTA: Get a Quote */}
            <motion.button
              onClick={() => openQuote()}
              whileHover={{ scale: 1.04, y: -0.5 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wide text-white shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/35 transition-all uppercase"
            >
              <Sparkles className="size-3.5" />
              <span>Get a Quote</span>
            </motion.button>

            {/* Mobile Menu Trigger */}
            <motion.button
              className="rounded-lg p-1.5 sm:p-2 text-ink xl:hidden hover:bg-accent transition-colors"
              aria-label="Menu"
              onClick={() => setMobile((v) => !v)}
              whileTap={{ scale: 0.9 }}
            >
              {mobile ? <X className="size-5 sm:size-6" /> : <Menu className="size-5 sm:size-6" />}
            </motion.button>
          </div>
        </div>

        {/* Desktop Nav + Mega Menu */}
        <nav
          className="mx-auto hidden max-w-[1800px] items-center overflow-x-auto px-4 sm:px-6 lg:px-12 2xl:px-16 xl:flex [&::-webkit-scrollbar]:hidden"
          onMouseLeave={() => setOpen(null)}
        >
          {MEGA_MENU.map((cat) => (
            <div
              key={cat.label}
              className="static shrink-0"
              onMouseEnter={() => setOpen(cat.label)}
            >
              <button
                className={`flex items-center gap-1.5 border-b-2 px-3.5 py-3.5 text-sm sm:text-[14.5px] font-semibold whitespace-nowrap transition-all duration-300 ${
                  open === cat.label
                    ? "border-brand-red text-brand-red font-bold"
                    : "border-transparent text-foreground/80 hover:text-brand-blue dark:hover:text-sky-400"
                }`}
              >
                {cat.label}
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${open === cat.label ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          ))}
          <span className="mx-3 h-5 w-px shrink-0 bg-border/60" />
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-underline shrink-0 px-3.5 py-3.5 text-sm sm:text-[14.5px] font-semibold whitespace-nowrap text-brand-blue dark:text-sky-400 transition-colors hover:text-brand-red dark:hover:text-red-400"
            >
              {l.label}
            </a>
          ))}

          {/* Mega Menu Dropdown — 100% Solid Opaque (No Bleed-Through in Light or Dark Mode) */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.99 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-x-0 top-full z-50 border-t border-slate-200 dark:border-slate-800 shadow-2xl"
              >
                <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
                  <div className="rounded-b-3xl border border-t-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl">
                    <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-8 rounded-full bg-gradient-brand" />
                        <h3 className="font-display text-base font-black tracking-wider text-slate-900 dark:text-white uppercase">
                          {open}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Official Store Catalog
                      </span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                      {MEGA_MENU.find((c) => c.label === open)?.columns.map((col) => (
                        <div key={col.title}>
                          <p className="mb-3 text-xs font-black tracking-wider text-red-600 dark:text-red-400 uppercase">
                            {col.title}
                          </p>
                          <ul className="space-y-2">
                            {col.items.map((item) => (
                              <li key={item}>
                                <a
                                  href="#products"
                                  onClick={() => setOpen(null)}
                                  className="group inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700 transition-all duration-200 group-hover:w-3.5 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 shrink-0" />
                                  <span>{item}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="hidden rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 p-5 lg:block">
                        <p className="font-display text-base font-bold text-slate-900 dark:text-white">
                          Need custom advice?
                        </p>
                        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Our in-house engineers spec components tailored to your workload.
                        </p>
                        <button
                          onClick={() => {
                            setOpen(null);
                            openQuote(`Inquiry: ${open}`);
                          }}
                          className="mt-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
                        >
                          Talk to an expert
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Mobile Navigation Drawer (100% Solid in Light & Dark Mode) */}
        <AnimatePresence>
          {mobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3 max-h-[75vh] overflow-y-auto">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Quick Navigation
                  </p>
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setMobile(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {MEGA_MENU.map((cat) => (
                      <a
                        key={cat.label}
                        href="#products"
                        onClick={() => setMobile(false)}
                        className="rounded-lg bg-slate-50 dark:bg-slate-800/80 p-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {cat.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Admin Panel Modal */}
      <AdminPanelModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Public Order Tracking Modal */}
      <OrderTrackingModal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />
    </header>
  );
}

function IconBtn({
  children,
  label,
  count,
  onClick,
  title,
}: {
  children: React.ReactNode;
  label: string;
  count: number;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <motion.button
      aria-label={label}
      title={title}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative rounded-full p-2.5 text-ink transition-colors hover:bg-accent hover:text-brand-blue"
    >
      {children}
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute top-0.5 right-0.5 grid size-4.5 place-items-center rounded-full bg-brand-red text-[10px] font-bold text-white shadow-sm"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, cartTotal, clearCart, openQuote } =
    useApp();
  const { user, profile, openAccountDrawer } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "details" | "confirmed">("cart");
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash / Card on Delivery (Coimbatore)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<DbOrder | null>(null);

  // Sync with user profile on open
  useEffect(() => {
    if (isCartOpen) {
      setCheckoutStep("cart");
      if (profile) {
        if (profile.full_name) setCustName(profile.full_name);
        if (profile.phone) setCustPhone(profile.phone);
        if (profile.address) setCustAddress(profile.address);
      }
      if (user?.email) {
        setCustEmail(user.email);
      }
    }
  }, [isCartOpen, profile, user]);

  const gstEstimate = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + gstEstimate;

  const handleConfirmInAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) {
      toast.error("Please fill in your Name and Phone number");
      return;
    }

    setIsSubmitting(true);
    const res = await createOrderInBackend({
      userId: user?.id,
      customerName: custName.trim(),
      phone: custPhone.trim(),
      email: custEmail.trim() || user?.email,
      deliveryAddress: custAddress.trim() || "Store Pickup in Podanur, Coimbatore",
      items: cart,
      subtotal: cartTotal,
      gstAmount: gstEstimate,
      grandTotal: grandTotal,
      paymentMethod: paymentMethod,
    });
    setIsSubmitting(false);

    if (res.success && res.order) {
      setCreatedOrder(res.order);
      setCheckoutStep("confirmed");
      clearCart();
      toast.success("Order Placed Successfully in App!", {
        description: `Tracking ID: ${res.order.id}`,
      });
    } else {
      toast.error("Failed to place order", { description: res.error });
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white text-slate-900 shadow-2xl border-l border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/70">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-600">
                  <ShoppingCart className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black text-slate-900">
                    {checkoutStep === "cart" && `Shopping Cart (${cart.length})`}
                    {checkoutStep === "details" && "Order & Delivery Details"}
                    {checkoutStep === "confirmed" && "Order Confirmed!"}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {checkoutStep === "cart" && "Review your items and proceed to buy"}
                    {checkoutStep === "details" && "Enter your contact and address details"}
                    {checkoutStep === "confirmed" && "Recorded live in database"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Step 1: Cart Items List */}
            {checkoutStep === "cart" && (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-5 bg-white">
                  {cart.length === 0 ? (
                    <div className="py-24 text-center">
                      <ShoppingCart className="mx-auto size-12 text-slate-300" />
                      <p className="mt-3 text-base font-bold text-slate-900">Your cart is empty</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Explore our components, laptops, or custom PCs to add items.
                      </p>
                    </div>
                  ) : (
                    cart.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * i }}
                        className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 transition-all hover:bg-slate-50"
                      >
                        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700">
                          {item.brand || "ICS"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="mt-0.5 text-xs font-extrabold text-red-600">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-xs">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="px-2.5 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-slate-900">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="px-2.5 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors ml-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <span className="font-display text-sm font-black text-slate-900">
                          ₹{(item.price * item.qty).toLocaleString("en-IN")}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="space-y-3 border-t border-slate-200 bg-slate-50/50 p-5">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Estimated GST (18% Input Credit)</span>
                        <span>₹{gstEstimate.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                        <span>Total Payable</span>
                        <span className="font-display text-lg font-black text-red-600">
                          ₹{grandTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Buy Now In-App Order Button */}
                    <button
                      onClick={() => setCheckoutStep("details")}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.01]"
                    >
                      <Sparkles className="size-4" /> Buy Now (Enter Order Details)
                    </button>

                    {/* Send Quote via WhatsApp Button */}
                    <button
                      onClick={() => {
                        const whatsappMessage = `Hi ICS Computer Store! Please send me an official quotation for the following cart items:\n\n${cart
                          .map(
                            (item, i) =>
                              `${i + 1}. ${item.name} (Qty: ${item.qty}) - ₹${(item.price * item.qty).toLocaleString("en-IN")}`,
                          )
                          .join(
                            "\n",
                          )}\n\nSubtotal: ₹${cartTotal.toLocaleString("en-IN")}\nEstimated GST (18%): ₹${gstEstimate.toLocaleString("en-IN")}\nGrand Total: ₹${grandTotal.toLocaleString("en-IN")}\n\nPlease share the formal quotation PDF / availability.`;
                        window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 text-xs font-bold transition-all shadow-xs"
                    >
                      <Phone className="size-3.5 text-emerald-600" /> Send Quotation via WhatsApp
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Customer Details Form (In-App Order) */}
            {checkoutStep === "details" && (
              <form onSubmit={handleConfirmInAppOrder} className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5">
                    <span className="text-xs font-bold text-blue-800">Order Summary:</span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {cart.length} item(s) · Grand Total: <span className="font-bold text-slate-900">₹{grandTotal.toLocaleString("en-IN")}</span> (incl. GST)
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Anand Kumar"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+91 98422 12345"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Delivery / Store Pickup Address
                    </label>
                    <textarea
                      rows={2}
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      placeholder="Door no, Street, Area, Coimbatore pincode (or Store Pickup)"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white font-medium"
                    >
                      <option value="Cash / Card on Delivery (Coimbatore)">Cash / Card on Delivery (Coimbatore)</option>
                      <option value="UPI / QR Code (GooglePay/PhonePe)">UPI / QR Code on Handover</option>
                      <option value="Store Desk Payment (Podanur, Coimbatore)">Store Desk Pickup & Pay</option>
                      <option value="Direct Bank NEFT / RTGS (B2B Tax Invoice)">Direct Bank NEFT / RTGS (B2B Invoice)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 space-y-2 border-t border-slate-200 mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-4" />
                    {isSubmitting ? "Recording Order in Database..." : "Confirm & Place Order Now"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
                  >
                    ← Back to Cart Items
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Order Placed Confirmation */}
            {checkoutStep === "confirmed" && createdOrder && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white space-y-4">
                <div className="size-16 rounded-3xl bg-emerald-100 text-emerald-600 grid place-items-center">
                  <CheckCircle2 className="size-8" />
                </div>
                <h4 className="font-display text-2xl font-black text-slate-900">Order Placed Successfully!</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Your order has been recorded into the live database. You can track progress in real-time.
                </p>

                <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Order Tracking ID:</span>
                    <span className="font-mono font-bold text-blue-600">{createdOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Customer:</span>
                    <span className="font-semibold text-slate-900">{createdOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Total Amount:</span>
                    <span className="font-bold text-red-600">₹{Number(createdOrder.grand_total).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold uppercase">Estimated Delivery:</span>
                    <span className="font-semibold text-emerald-700">{createdOrder.estimated_delivery}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2 w-full">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      if (user) {
                        openAccountDrawer();
                      }
                    }}
                    className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md"
                  >
                    View in My Orders & Live Tracking
                  </button>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full rounded-2xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

