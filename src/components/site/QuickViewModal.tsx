import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  Maximize2,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { createOrderInBackend } from "@/lib/supabase-api";
import { waLink } from "@/lib/site-data";
import { toast } from "sonner";

export default function QuickViewModal() {
  const { user, profile } = useAuth();
  const {
    quickViewProduct: p,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    openQuote,
  } = useApp();

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImgIdx(0);
    setIsZoomed(false);
  }, [p?.id]);

  if (!p) return null;

  const inWishlist = isInWishlist(p.id);
  const gallery = p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
  const currentImg = gallery[activeImgIdx] || p.image;

  const nextImage = () => {
    if (gallery.length <= 1) return;
    setActiveImgIdx((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (gallery.length <= 1) return;
    setActiveImgIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 grid place-items-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="absolute inset-0 bg-ink/50 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border/60 bg-card/95 backdrop-blur-2xl shadow-soft"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            aria-label="Close product preview"
            className="absolute top-4 right-4 z-20 rounded-full bg-card/90 p-2 text-ink shadow-md backdrop-blur transition-transform hover:scale-110 hover:bg-accent"
          >
            <X className="size-5" />
          </button>

          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-12 md:gap-8">
            {/* Visual preview & Multi-angle Carousel side (6 cols) */}
            <div className="flex flex-col gap-3.5 md:col-span-6">
              <div className="relative h-72 sm:h-80 md:h-[370px] w-full overflow-hidden rounded-2xl border border-border/60 bg-slate-900/10 dark:bg-slate-950/60 shadow-inner group">
                {currentImg ? (
                  <motion.img
                    key={currentImg}
                    src={currentImg}
                    alt={`${p.name} - View ${activeImgIdx + 1}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-110 cursor-zoom-in"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-soft p-6">
                    <span className="font-display text-5xl font-black text-ink/20">{p.brand}</span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white shadow-md">
                    Save {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                  </span>
                  <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    {p.brand}
                  </span>
                </div>

                {/* Left/Right Carousel Controls */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 grid size-9 place-items-center rounded-full bg-card/85 text-ink shadow-lift backdrop-blur transition-transform hover:scale-110 hover:bg-card active:scale-95"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 grid size-9 place-items-center rounded-full bg-card/85 text-ink shadow-lift backdrop-blur transition-transform hover:scale-110 hover:bg-card active:scale-95"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                )}

                {/* Multi-angle pill count */}
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="flex items-center gap-1.5 rounded-md bg-black/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                    <Sparkles className="size-3 text-amber-400" />
                    {gallery.length > 1 ? `Angle ${activeImgIdx + 1} of ${gallery.length}` : p.category}
                  </span>
                </div>
              </div>

              {/* Multi-angle Flipkart/Amazon style Interactive Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                  {gallery.map((imgUrl, idx) => (
                    <button
                      key={imgUrl + idx}
                      onClick={() => setActiveImgIdx(idx)}
                      aria-label={`View angle ${idx + 1}`}
                      className={`relative size-16 sm:size-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 bg-card p-1 ${
                        activeImgIdx === idx
                          ? "border-brand-blue shadow-blue scale-105"
                          : "border-border/60 hover:border-brand-blue/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover rounded-lg"
                      />
                      {activeImgIdx === idx && (
                        <div className="absolute inset-0 bg-brand-blue/10 pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Warranty Strip */}
              <div className="rounded-xl border border-border/50 bg-surface/80 p-3 shadow-xs">
                <div className="flex items-center gap-2 text-brand-blue text-xs sm:text-sm">
                  <ShieldCheck className="size-4.5 shrink-0 text-brand-red" />
                  <span className="font-semibold">{p.warranty}</span>
                </div>
              </div>
            </div>

            {/* Product details side (6 cols) */}
            <div className="flex flex-col justify-between md:col-span-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`size-4 ${
                        idx < p.rating ? "fill-amber-400 text-amber-400" : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">({p.reviewCount} verified reviews)</span>
              </div>

              <h2 className="mt-2 font-display text-xl sm:text-2xl font-bold text-ink leading-snug">{p.name}</h2>

              <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-3xl font-extrabold text-brand-red">
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
                <span className="text-base text-muted-foreground line-through">
                  ₹{p.mrp.toLocaleString("en-IN")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
                  Indicative Demo Price
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Available in Store
                </span>
              </div>

              {/* Development Pricing Warning */}
              <div className="mt-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-950 dark:text-amber-200">
                <p className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                  <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
                  Catalog Notice: Provisional Pricing
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90">
                  Prices shown on this preview site are sample placeholder rates. To receive the <strong>authentic current live price &amp; official GST quotation</strong>, please request a quote below.
                </p>
              </div>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">{p.description}</p>

              {/* Highlights */}
              <div className="mt-4 space-y-2">
                {p.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-ink">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-blue" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Specs Table */}
              {p.fullSpecs && (
                <div className="mt-5 rounded-2xl border border-border bg-surface p-4 text-xs sm:text-sm">
                  <p className="mb-2.5 font-bold tracking-wider text-muted-foreground uppercase text-xs">
                    Technical Specifications
                  </p>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(p.fullSpecs).map(([key, val]) => (
                      <div key={key} className="border-b border-border/50 pb-1.5">
                        <dt className="text-xs text-muted-foreground">{key}</dt>
                        <dd className="font-semibold text-ink">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {/* Primary CTA: Request Real Price Quote */}
                <button
                  onClick={() => {
                    const name = p.name;
                    setQuickViewProduct(null);
                    openQuote(
                      `Real Price Quotation Request for: ${name} (ID: ${p.id}). Please send me your authentic current price and GST invoice quote.`,
                    );
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 py-3 text-sm font-extrabold text-slate-950 shadow-lift transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <FileText className="size-4 text-slate-950" /> Request Real Price Quote
                </button>

                <button
                  onClick={() => {
                    addToCart({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      brand: p.brand,
                    });
                    setQuickViewProduct(null);
                  }}
                  className="flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingCart className="size-4" /> Add to Cart
                </button>

                <a
                  href={waLink(
                    `Hi ICS Computer Store, I am viewing "${p.name}" on your preview website (indicative ₹${p.price.toLocaleString("en-IN")}). Please send me your REAL / ACTUAL price quotation and store availability.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp for Real Price"
                  className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white dark:text-emerald-400"
                >
                  <MessageCircle className="size-4" />
                </a>

                <button
                  onClick={() => toggleWishlist(p)}
                  aria-label="Wishlist toggle"
                  className={`rounded-full border p-3 transition-colors ${
                    inWishlist
                      ? "border-brand-red bg-brand-red/10 text-brand-red"
                      : "border-border text-muted-foreground hover:text-brand-red"
                  }`}
                >
                  <Heart className={`size-5 ${inWishlist ? "fill-brand-red" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
