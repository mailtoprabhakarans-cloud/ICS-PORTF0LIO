import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./site-data";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  brand?: string | undefined;
  spec?: string | undefined;
};

interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  compareList: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  quotePreset: string | undefined;
  isQuoteOpen: boolean;
  openQuote: (preset?: string) => void;
  closeQuote: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const CART_STORAGE_KEY = "ics_user_cart_items";
const WISHLIST_STORAGE_KEY = "ics_user_wishlist_items";

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme management
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("ics_theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("ics_theme", next);
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  // Cart state - Starts empty and loads only items the current user added
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist user-added cart items
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "qty">, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id: string) => wishlist.some((p) => p.id === id);

  // Compare state
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
    setIsCompareOpen(true);
  };

  const isInCompare = (id: string) => compareList.some((p) => p.id === id);
  const clearCompare = () => setCompareList([]);

  // Quick View & Quote
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quotePreset, setQuotePreset] = useState<string | undefined>();

  const openQuote = (preset?: string) => {
    setQuotePreset(preset);
    setIsQuoteOpen(true);
  };

  const closeQuote = () => {
    setIsQuoteOpen(false);
    setQuotePreset(undefined);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        compareList,
        toggleCompare,
        isInCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        quickViewProduct,
        setQuickViewProduct,
        isQuoteOpen,
        quotePreset,
        openQuote,
        closeQuote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
