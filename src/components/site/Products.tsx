import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Eye,
  GitCompareArrows,
  Heart,
  MessageCircle,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";
import { PRODUCTS, waLink, type Product } from "@/lib/site-data";
import { fetchAllProductsFromBackend } from "@/lib/supabase-api";
import { useApp } from "@/lib/store";

const TABS = [
  { id: "all", label: "All Items" },
  { id: "laptops", label: "Laptops & Care Packs" },
  { id: "hot", label: "Hot Selling" },
  { id: "new", label: "New Arrivals" },
  { id: "gaming", label: "Gaming Rigs" },
  { id: "enterprise", label: "Networking & CCTV" },
] as const;

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "laptops", label: "Laptops & Care Packs" },
  { id: "processors", label: "Processors" },
  { id: "gpus", label: "Graphics Cards" },
  { id: "motherboards", label: "Motherboards" },
  { id: "memory", label: "Memory (RAM)" },
  { id: "storage", label: "Storage (SSDs)" },
  { id: "cctv", label: "CCTV Cameras" },
  { id: "networking", label: "Networking" },
  { id: "monitors", label: "Monitors" },
];

export default function Products() {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    setQuickViewProduct,
  } = useApp();

  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [tab, setTab] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [visibleCount, setVisibleCount] = useState<number>(8);

  useEffect(() => {
    async function loadDbProducts() {
      const dbProds = await fetchAllProductsFromBackend();
      if (dbProds && dbProds.length > 0) {
        // Merge with static products so all items are represented
        const map = new Map<string, Product>();
        PRODUCTS.forEach((p) => map.set(p.id, p));
        dbProds.forEach((p) => map.set(p.id, p));
        setProductsList(Array.from(map.values()));
      }
    }
    loadDbProducts();
  }, []);

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setVisibleCount(8);
  };

  const handleCategoryChange = (newCat: string) => {
    setSelectedCategory(newCat);
    setVisibleCount(8);
  };

  // Filtering pipeline
  const filteredProducts = productsList.filter((p) => {
    // Tab filter
    if (tab !== "all") {
      if (tab === "laptops") {
        if (p.category !== "laptops") return false;
      } else if (p.tab !== tab) {
        return false;
      }
    }
    // Category filter
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    // Search filter
    if (searchTerm.trim().length > 0) {
      const q = searchTerm.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.specs.some((s) => s.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return b.reviewCount - a.reviewCount;
  });

  return (
    <section id="products" className="relative bg-surface py-16 sm:py-20 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-50" />

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-12 2xl:px-16">
        {/* Header Title & Controls */}
        <div ref={headerRef} className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-brand-red uppercase">
              <Sparkles className="size-3.5" />
              Online & In-Store Catalog
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
              Featured <span className="text-gradient-brand">Components & Systems</span>
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Official warranty, GST invoicing, and express delivery in Coimbatore.
            </p>
          </motion.div>

          {/* Primary Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-1.5 rounded-full border border-border/50 glass-card p-1.5 shadow-soft"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`relative rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  tab === t.id ? "text-white" : "text-ink hover:text-brand-blue"
                }`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="tabpill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gradient-brand shadow-lift"
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Filter Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/50 glass-card p-3 shadow-soft"
        >
          {/* Category Pills Slider */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-brand-blue text-white shadow-blue scale-105"
                    : "bg-surface border border-border/40 text-foreground/80 hover:text-foreground hover:bg-accent hover:border-brand-blue/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-1 sm:w-64 items-center rounded-full border border-border bg-surface px-3.5 py-2 text-sm transition-all focus-within:border-brand-blue/40 focus-within:shadow-blue">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(8);
                }}
                placeholder="Filter by name, brand…"
                className="w-full bg-transparent px-2.5 text-xs sm:text-sm text-ink outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")
                }
                className="rounded-full border border-border bg-surface px-3.5 py-2 text-xs sm:text-sm font-medium text-ink outline-none cursor-pointer"
              >
                <option value="featured">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-lg font-bold text-ink">No matching products found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
                setTab("all");
                setVisibleCount(8);
              }}
              className="mt-4 rounded-full bg-ink px-5 py-2 text-xs font-semibold text-white transition-all hover:scale-105"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.slice(0, visibleCount).map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    isInWishlist={isInWishlist}
                    toggleCompare={toggleCompare}
                    isInCompare={isInCompare}
                    setQuickViewProduct={setQuickViewProduct}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Show More / Show Less Controls */}
            {filteredProducts.length > 8 && (
              <div className="mt-10 flex flex-col items-center justify-center gap-3">
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  Showing <span className="font-bold text-ink">{Math.min(visibleCount, filteredProducts.length)}</span> of{" "}
                  <span className="font-bold text-brand-blue">{filteredProducts.length}</span> products
                </p>

                <div className="flex items-center gap-3">
                  {visibleCount < filteredProducts.length ? (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setVisibleCount((prev) => prev + 8)}
                      className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-8 py-3 text-sm font-bold text-white shadow-lift transition-all hover:shadow-blue"
                    >
                      <Sparkles className="size-4" /> Show More Products (
                      {filteredProducts.length - visibleCount} remaining)
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setVisibleCount(8)}
                      className="rounded-full border border-border/80 bg-surface px-6 py-2.5 text-xs sm:text-sm font-semibold text-ink transition-all hover:bg-accent"
                    >
                      Show Less ↑
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom divider */}
      <div className="section-divider mt-16 sm:mt-20" />
    </section>
  );
}

function ProductCard({
  product: p,
  index: i,
  addToCart,
  toggleWishlist,
  isInWishlist,
  toggleCompare,
  isInCompare,
  setQuickViewProduct,
}: {
  product: Product;
  index: number;
  addToCart: (item: { id: string; name: string; price: number; brand: string }) => void;
  toggleWishlist: (p: Product) => void;
  isInWishlist: (id: string) => boolean;
  toggleCompare: (p: Product) => void;
  isInCompare: (id: string) => boolean;
  setQuickViewProduct: (p: Product | null) => void;
}) {
  const isSaved = isInWishlist(p.id);
  const isComparing = isInCompare(p.id);
  const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const [addedToCart, setAddedToCart] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-40px" });

  const handleAddToCart = () => {
    addToCart({ id: p.id, name: p.name, price: p.price, brand: p.brand });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={cardInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-400 hover:shadow-[0_8px_40px_-12px_oklch(0.62_0.2_245/0.2)] hover:border-brand-blue/30 hover:-translate-y-1"
    >
      <div>
        {/* Top Visual Area */}
        <div
          onClick={() => setQuickViewProduct(p)}
          className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900/5 dark:bg-slate-950/40 cursor-pointer"
        >
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-mesh p-4">
              <span className="font-display text-4xl font-extrabold text-ink/15">
                {p.brand}
              </span>
            </div>
          )}

          {/* Multiple Angles indicator */}
          {p.images && p.images.length > 1 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
                📸 {p.images.length} Views
              </span>
            </div>
          )}

          {/* Subtle Gradient Shade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 transition-opacity duration-300 group-hover:from-black/60" />

          {/* Discount Badge */}
          <motion.span
            initial={{ scale: 0 }}
            animate={cardInView ? { scale: 1 } : {}}
            transition={{ delay: Math.min(i * 0.05, 0.3) + 0.2, type: "spring", stiffness: 400 }}
            className="absolute top-3 left-3 rounded-full bg-brand-red px-2.5 py-1 text-xs font-bold text-white shadow-md"
          >
            -{discountPercent}% OFF
          </motion.span>

          {/* Top Action Icons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {/* Compare Button */}
            <motion.button
              onClick={() => toggleCompare(p)}
              title={isComparing ? "Remove from comparison" : "Compare component"}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`rounded-full p-2 backdrop-blur-md shadow-sm transition-all ${
                isComparing
                  ? "bg-brand-blue text-white shadow-blue"
                  : "bg-card/90 text-foreground hover:text-brand-blue hover:bg-card"
              }`}
            >
              <GitCompareArrows className="size-4" />
            </motion.button>

            {/* Wishlist Button */}
            <motion.button
              onClick={() => toggleWishlist(p)}
              title={isSaved ? "Saved in wishlist" : "Add to wishlist"}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`rounded-full p-2 backdrop-blur-md shadow-sm transition-all ${
                isSaved
                  ? "bg-brand-red text-white shadow-[0_0_15px_oklch(0.56_0.24_25/0.3)]"
                  : "bg-card/90 text-foreground hover:text-brand-red hover:bg-card"
              }`}
            >
              <Heart className={`size-4 ${isSaved ? "fill-white" : ""}`} />
            </motion.button>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="rounded-md bg-black/50 backdrop-blur-md px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
              {p.category}
            </span>
          </div>

          {/* Quick View Button on Hover */}
          <button
            onClick={() => setQuickViewProduct(p)}
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-card/95 text-ink px-3 py-1 text-xs font-bold shadow-lift backdrop-blur transition-all duration-300 hover:bg-card hover:scale-105 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 border border-border/40"
          >
            <Eye className="size-3.5 text-brand-blue" /> Quick Specs
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold tracking-wider text-brand-blue uppercase">
              {p.brand}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground font-medium">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-ink">{p.rating}.0</span>
              <span>({p.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => setQuickViewProduct(p)}
            className="mt-2 line-clamp-2 min-h-12 cursor-pointer text-sm sm:text-base font-bold text-ink transition-colors hover:text-brand-blue leading-snug"
          >
            {p.name}
          </h3>

          {/* Specs Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.specs.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-lg bg-accent/60 border border-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Price & Action Buttons Area */}
      <div className="border-t border-border/40 p-4 sm:p-5 pt-3">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl sm:text-2xl font-bold text-brand-red">
            ₹{p.price.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            ₹{p.mrp.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 ${
              addedToCart
                ? "bg-emerald-600 shadow-[0_0_20px_oklch(0.5_0.2_160/0.3)]"
                : "bg-slate-900 dark:bg-brand-blue hover:bg-brand-blue dark:hover:bg-brand-blue/90 hover:shadow-blue hover:scale-[1.02]"
            }`}
          >
            {addedToCart ? (
              <>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  ✓
                </motion.span>{" "}
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" /> Add to Cart
              </>
            )}
          </motion.button>

          <a
            href={waLink(
              `Hi ICS Computer Store, I want to inquire about ${p.name} (₹${p.price.toLocaleString(
                "en-IN",
              )}). Is it available in your Gandhipuram store?`,
            )}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp inquiry for ${p.name}`}
            className="grid place-items-center rounded-full bg-gradient-brand px-3 text-white transition-all hover:scale-105 hover:shadow-lift"
          >
            <MessageCircle className="size-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
