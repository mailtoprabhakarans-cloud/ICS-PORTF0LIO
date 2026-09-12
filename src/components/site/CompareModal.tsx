import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, ShoppingCart, Trash2, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { waLink } from "@/lib/site-data";

export default function CompareModal() {
  const { compareList, toggleCompare, clearCompare, isCompareOpen, setIsCompareOpen, addToCart } =
    useApp();

  if (!isCompareOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 grid place-items-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCompareOpen(false)}
          className="absolute inset-0 bg-ink/40 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl p-6 shadow-soft md:p-8"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-brand-red uppercase">
                Side-by-Side
              </span>
              <h3 className="font-display text-2xl font-bold text-ink">
                Component <span className="text-gradient-brand">Comparison</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {compareList.length > 0 && (
                <button
                  onClick={clearCompare}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-brand-red"
                >
                  <Trash2 className="size-3.5" /> Clear All
                </button>
              )}
              <button
                onClick={() => setIsCompareOpen(false)}
                aria-label="Close compare"
                className="rounded-full p-2 text-ink hover:bg-accent"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {compareList.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-lg font-bold text-ink">
                No components selected for comparison
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Click the compare icon on any product card in the store to compare up to 3 items
                side-by-side.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {compareList.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 sm:p-5"
                >
                  <div>
                    {/* Product Thumbnail */}
                    <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-slate-900/10">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center bg-gradient-soft font-bold text-ink/30 text-lg">
                          {p.brand}
                        </div>
                      )}
                      <button
                        onClick={() => toggleCompare(p)}
                        aria-label="Remove from compare"
                        className="absolute top-2 right-2 rounded-full bg-card/80 p-1.5 text-muted-foreground hover:text-brand-red backdrop-blur"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand-blue uppercase">
                        {p.brand}
                      </span>
                    </div>

                    <h4 className="mt-2 line-clamp-2 min-h-12 text-sm sm:text-base font-bold text-ink leading-snug">
                      {p.name}
                    </h4>

                    <div className="mt-2.5">
                      <span className="font-display text-2xl font-bold text-brand-red">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2.5 border-t border-border pt-3.5">
                      <div className="text-xs sm:text-sm">
                        <span className="font-semibold text-muted-foreground">Category:</span>{" "}
                        <span className="font-bold text-ink uppercase">{p.category}</span>
                      </div>
                      <div className="text-xs sm:text-sm">
                        <span className="font-semibold text-muted-foreground">Warranty:</span>{" "}
                        <span className="text-ink font-medium">{p.warranty}</span>
                      </div>
                      <div className="text-xs sm:text-sm">
                        <span className="font-semibold text-muted-foreground">Specs:</span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {p.specs.map((s) => (
                            <span
                              key={s}
                              className="rounded-md bg-card px-2.5 py-1 text-xs font-medium text-ink shadow-sm"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 border-t border-border pt-3.5">
                    <button
                      onClick={() => {
                        addToCart({ id: p.id, name: p.name, price: p.price, brand: p.brand });
                        setIsCompareOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lift"
                    >
                      <ShoppingCart className="size-4" /> Add to Cart
                    </button>
                    <a
                      href={waLink(
                        `Hi ICS Computer Store, I'm comparing ${p.name}. Can you provide final pricing?`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-xs sm:text-sm font-semibold text-ink hover:text-brand-blue"
                    >
                      <MessageCircle className="size-4" /> Inquire Price
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
