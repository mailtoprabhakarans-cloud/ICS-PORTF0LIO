import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, ShoppingCart, Trash2, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { waLink } from "@/lib/site-data";

export default function WishlistDrawer() {
  const { wishlist, toggleWishlist, isWishlistOpen, setIsWishlistOpen, addToCart } = useApp();

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-md"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-card/95 backdrop-blur-xl shadow-soft border-l border-border/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-brand-red fill-brand-red" />
                <h3 className="font-display text-lg font-bold text-ink">
                  Saved Items ({wishlist.length})
                </h3>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                aria-label="Close wishlist"
                className="rounded-full p-2 text-ink hover:bg-accent"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {wishlist.length === 0 ? (
                <div className="py-20 text-center">
                  <Heart className="mx-auto size-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-semibold text-ink">Your wishlist is empty</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click the heart icon on any component or peripheral to save it for later.
                  </p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col rounded-xl border border-border bg-surface p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-brand-blue uppercase">
                          {item.brand}
                        </span>
                        <p className="text-xs font-semibold text-ink">{item.name}</p>
                      </div>
                      <button
                        onClick={() => toggleWishlist(item)}
                        aria-label="Remove item"
                        className="text-muted-foreground hover:text-brand-red"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-display text-sm font-bold text-brand-red">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            brand: item.brand,
                          });
                        }}
                        className="flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-white transition-transform hover:scale-105"
                      >
                        <ShoppingCart className="size-3" /> Move to Cart
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="border-t border-border p-4">
                <a
                  href={waLink(
                    `Hi ICS Computer Store, here is my saved wishlist from your website:\n\n${wishlist
                      .map((p, i) => `${i + 1}. ${p.name} - ₹${p.price.toLocaleString("en-IN")}`)
                      .join("\n")}\n\nPlease check stock and final package discount.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lift transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="size-4" /> Share Wishlist via WhatsApp
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
