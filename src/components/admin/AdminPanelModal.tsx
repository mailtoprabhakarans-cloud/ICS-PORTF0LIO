import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  Cpu,
  Edit2,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  User,
  UserCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import {
  fetchAllOrdersForAdmin,
  fetchAllQuotesForAdmin,
  fetchAllUsersForAdmin,
  updateOrderStatusInBackend,
  updateQuoteStatusInBackend,
  getCustomProducts,
  saveProduct,
  deleteProduct,
} from "@/lib/supabase-api";
import { PRODUCTS, type Product } from "@/lib/site-data";
import { useAuth } from "@/lib/auth-context";
import type { DbOrder, DbQuote, UserProfile } from "@/lib/supabase";
import { toast } from "sonner";

// Default admin PIN passcode for instant authentication
const ADMIN_SECURITY_PIN = "admin123";

export default function AdminPanelModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, profile } = useAuth();

  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<"orders" | "products" | "users" | "quotes" | "overview">("orders");

  // Orders, Quotes, Users & Products State
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [quotes, setQuotes] = useState<DbQuote[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  // Product Add/Edit Modal Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [prodCategory, setProdCategory] = useState<Product["category"]>("processors");
  const [prodPrice, setProdPrice] = useState("");
  const [prodMrp, setProdMrp] = useState("");
  const [prodSpecs, setProdSpecs] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodWarranty, setProdWarranty] = useState("");
  const [prodImage, setProdImage] = useState("");

  const refreshData = async () => {
    setLoading(true);
    const [fetchedOrders, fetchedQuotes, fetchedUsers] = await Promise.all([
      fetchAllOrdersForAdmin(),
      fetchAllQuotesForAdmin(),
      fetchAllUsersForAdmin(),
    ]);
    setOrders(fetchedOrders);
    setQuotes(fetchedQuotes);
    setUsers(fetchedUsers);

    // Merge base products with custom products
    const custom = getCustomProducts();
    const map = new Map<string, Product>();
    PRODUCTS.forEach((p) => map.set(p.id, p));
    custom.forEach((p) => map.set(p.id, p));
    setAllProducts(Array.from(map.values()));

    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (profile?.is_admin) {
        setIsAuthenticated(true);
      }
      refreshData();
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_SECURITY_PIN || pinInput.trim() === "1234") {
      setIsAuthenticated(true);
      setPinError(false);
      toast.success("Admin access granted");
    } else {
      setPinError(true);
      toast.error("Incorrect Admin PIN");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: DbOrder["status"],
    trackingStep: number,
  ) => {
    const res = await updateOrderStatusInBackend(orderId, newStatus, trackingStep);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, tracking_step: trackingStep } : o)),
      );
      toast.success(`Order #${orderId} updated to: ${newStatus}`);
    } else {
      toast.error("Failed to update status", { description: res.error });
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: DbQuote["status"]) => {
    const res = await updateQuoteStatusInBackend(quoteId, newStatus);
    if (res.success) {
      setQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q)));
      toast.success("Quote status updated!");
    } else {
      toast.error("Failed to update quote status");
    }
  };

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName("");
    setProdBrand("");
    setProdCategory("processors");
    setProdPrice("");
    setProdMrp("");
    setProdSpecs("8 Cores, AM5, High Performance");
    setProdDesc("Premium high-performance computing component with official manufacturer warranty.");
    setProdWarranty("3 Years Official India Warranty");
    setProdImage("https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80");
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdCategory(p.category);
    setProdPrice(String(p.price));
    setProdMrp(String(p.mrp));
    setProdSpecs(p.specs.join(", "));
    setProdDesc(p.description || "");
    setProdWarranty(p.warranty || "3 Years Official Warranty");
    setProdImage(p.image || "");
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingProduct ? editingProduct.id : `prod-${Date.now()}`;
    const newProd: Product = {
      id,
      name: prodName,
      brand: prodBrand || "ICS",
      category: prodCategory,
      price: Number(prodPrice) || 999,
      mrp: Number(prodMrp) || Number(prodPrice) * 1.2,
      specs: prodSpecs.split(",").map((s) => s.trim()).filter(Boolean),
      description: prodDesc,
      warranty: prodWarranty,
      image: prodImage || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      tab: "hot",
      rating: 5,
      reviewCount: 12,
      inStock: true,
      highlights: ["100% Genuine Sealed Stock", "Official Distributor Warranty"],
    };

    saveProduct(newProd);
    toast.success(editingProduct ? "Product updated successfully!" : "New product added to store!");
    setIsProductFormOpen(false);
    refreshData();
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      setAllProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Product removed from catalog");
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Order Placed").length;
  const inProgressOrders = orders.filter((o) => o.status === "Assembled & Tested").length;
  const outForDelivery = orders.filter((o) => o.status === "Out for Delivery").length;

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      o.phone.includes(filterQuery) ||
      o.status.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(filterQuery)),
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 grid place-items-center p-2 sm:p-4 overflow-y-auto">
        {/* Soft elegant backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
        />

        {/* 1. CREDENTIAL / PIN LOGIN GATE */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 text-slate-900 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="size-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                <Lock className="size-7" />
              </div>
              <h3 className="font-display text-2xl font-black text-slate-900">
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-500">
                Enter your administrative credentials or Security PIN to access store management.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                  Admin Passcode / PIN
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                  <KeyRound className="size-4.5 text-slate-400 mr-2.5" />
                  <input
                    required
                    type="password"
                    autoFocus
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter PIN (Default: admin123)"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium"
                  />
                </div>
                {pinError && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    Incorrect Passcode. Default is <span className="font-mono font-bold">admin123</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <ShieldCheck className="size-4" /> Unlock Admin Panel
              </button>

              <p className="text-center text-[11px] text-slate-400">
                Default Master PIN: <code className="font-bold text-slate-600">admin123</code> or <code className="font-bold text-slate-600">1234</code>
              </p>
            </form>
          </motion.div>
        ) : (
          /* 2. AUTHENTICATED ADMIN DASHBOARD */
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative z-10 max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] flex flex-col"
          >
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50/60 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-black text-slate-900">
                      ICS Enterprise Admin Hub
                    </h3>
                    <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700">
                      Authenticated Master
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Product catalog CRUD, customer profiles, order milestone tracking, and quotes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshData}
                  disabled={loading}
                  title="Refresh database records"
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
                >
                  <RefreshCw className={`size-4.5 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close admin panel"
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="border-b border-slate-200/80 bg-slate-50/50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1 shadow-xs overflow-x-auto">
                {[
                  { id: "orders", label: `Orders (${orders.length})`, icon: Package },
                  { id: "products", label: `Products CRUD (${allProducts.length})`, icon: Tag },
                  { id: "users", label: `Users (${users.length})`, icon: Users },
                  { id: "quotes", label: `Quotes (${quotes.length})`, icon: Receipt },
                  { id: "overview", label: "Financials", icon: Activity },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                      activeTab === t.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <t.icon className="size-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Action and Search */}
              <div className="flex items-center gap-2">
                {activeTab === "products" && (
                  <button
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
                  >
                    <Plus className="size-3.5" /> Add Product
                  </button>
                )}

                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs shadow-xs focus-within:border-blue-600">
                  <Search className="size-3.5 text-slate-400 mr-2" />
                  <input
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search records…"
                    className="w-40 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {/* TAB 1: ORDERS & TRACKING */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-center">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                        Total Orders
                      </span>
                      <p className="font-display text-2xl font-black text-slate-900">{orders.length}</p>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-center">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-700">
                        Pending
                      </span>
                      <p className="font-display text-2xl font-black text-amber-700">
                        {pendingOrders}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 text-center">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-700">
                        Testing / QA
                      </span>
                      <p className="font-display text-2xl font-black text-blue-700">
                        {inProgressOrders}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-center">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">
                        Dispatched
                      </span>
                      <p className="font-display text-2xl font-black text-emerald-700">
                        {outForDelivery}
                      </p>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="py-16 text-center">
                      <Package className="mx-auto size-10 text-slate-300" />
                      <p className="mt-2 text-sm font-semibold text-slate-900">No Orders Found</p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 space-y-3.5 transition-all hover:border-blue-300 shadow-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-blue-600">
                                {order.id}
                              </span>
                              <span className="rounded-full bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[10.5px] font-bold uppercase">
                                {order.status} (Step {order.tracking_step || 1}/4)
                              </span>
                            </div>
                            <p className="text-xs text-slate-800 font-semibold mt-1">
                              {order.customer_name} · 📞 {order.phone}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              📍 {order.delivery_address || "Coimbatore Store Pickup"}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="font-display text-lg font-black text-red-600">
                              ₹{Number(order.grand_total).toLocaleString("en-IN")}
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              Subtotal: ₹{Number(order.subtotal).toLocaleString("en-IN")} + GST
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-1 bg-white rounded-xl p-3 border border-slate-200/80 text-xs">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between py-0.5">
                              <span className="font-medium text-slate-800">
                                • {it.name} (Qty: {it.qty})
                              </span>
                              <span className="font-bold text-slate-900">
                                ₹{(it.price * it.qty).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* ADVANCE TRACKING CONTROLS */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                          <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <Truck className="size-3.5 text-blue-600" /> Advance Milestone:
                          </span>

                          {(() => {
                            const isService = order.items.some(
                              (it) =>
                                it.name.toLowerCase().includes("repair") ||
                                it.name.toLowerCase().includes("service") ||
                                it.name.toLowerCase().includes("assembly"),
                            );

                            return (
                              <div className="flex flex-wrap gap-1.5">
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Order Placed", 1)}
                                  className={`rounded-xl px-3 py-1 text-[11px] font-bold transition-all ${
                                    order.tracking_step === 1
                                      ? "bg-amber-500 text-white shadow-xs"
                                      : "border border-slate-200 bg-white text-slate-600"
                                  }`}
                                >
                                  1. Placed
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateOrderStatus(
                                      order.id,
                                      isService ? "Assembled & Tested" : "Shipped",
                                      2,
                                    )
                                  }
                                  className={`rounded-xl px-3 py-1 text-[11px] font-bold transition-all ${
                                    order.tracking_step === 2
                                      ? "bg-blue-600 text-white shadow-xs"
                                      : "border border-slate-200 bg-white text-slate-600"
                                  }`}
                                >
                                  {isService ? "2. Assembly & Testing" : "2. Shipped"}
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Out for Delivery", 3)}
                                  className={`rounded-xl px-3 py-1 text-[11px] font-bold transition-all ${
                                    order.tracking_step === 3
                                      ? "bg-indigo-600 text-white shadow-xs"
                                      : "border border-slate-200 bg-white text-slate-600"
                                  }`}
                                >
                                  3. Out for Delivery
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Delivered", 4)}
                                  className={`rounded-xl px-3 py-1 text-[11px] font-bold transition-all ${
                                    order.tracking_step === 4
                                      ? "bg-emerald-600 text-white shadow-xs"
                                      : "border border-slate-200 bg-white text-slate-600"
                                  }`}
                                >
                                  4. Delivered
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: PRODUCTS CRUD MANAGEMENT */}
              {activeTab === "products" && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                              {prod.brand} · {prod.category}
                            </span>
                            <span className="text-xs font-bold text-emerald-600">In Stock</span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{prod.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{prod.specs.join(" · ")}</p>

                          <div className="pt-2 flex items-baseline gap-2">
                            <span className="font-display text-base font-black text-red-600">
                              ₹{prod.price.toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{prod.mrp.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Edit / Delete Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-slate-100 mt-3">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <Edit2 className="size-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: USER MANAGEMENT */}
              {activeTab === "users" && (
                <div className="space-y-3">
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Customer Name</th>
                          <th className="px-4 py-3">Email Address</th>
                          <th className="px-4 py-3">Phone</th>
                          <th className="px-4 py-3">Company / GST</th>
                          <th className="px-4 py-3">City</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/60">
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              {u.full_name || "Customer User"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{u.email}</td>
                            <td className="px-4 py-3 text-slate-600">{u.phone || "—"}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {u.company_name || u.gst_number || "Retail Individual"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{u.city || "Coimbatore"}</td>
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                                Active Customer
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: QUOTES */}
              {activeTab === "quotes" && (
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm text-slate-900">{quote.customer_name}</span>
                          <span className="text-xs text-slate-500 ml-2">📞 {quote.phone}</span>
                        </div>
                        <div className="flex gap-1">
                          {(["pending", "in_review", "quoted", "completed"] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateQuoteStatus(quote.id, st)}
                              className={`rounded-lg px-2.5 py-1 text-[10.5px] font-bold uppercase transition-all ${
                                quote.status === st
                                  ? "bg-blue-600 text-white shadow-xs"
                                  : "border border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-blue-600">{quote.service_category}</p>
                      <p className="text-xs text-slate-500">{quote.notes || "No notes specified."}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/60 p-6">
                    <span className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                      Commercial Summary
                    </span>
                    <h4 className="mt-1 font-display text-3xl font-black text-slate-900">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Total gross order volume across Coimbatore retail and enterprise clients.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 3. PRODUCT ADD / EDIT MODAL DRAWER */}
        <AnimatePresence>
          {isProductFormOpen && (
            <div className="fixed inset-0 z-80 grid place-items-center p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsProductFormOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsProductFormOpen(false)}
                  className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X className="size-5" />
                </button>

                <h3 className="font-display text-2xl font-black text-slate-900">
                  {editingProduct ? "Edit Product Catalog Entry" : "Add New Store Product"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specify hardware specifications, retail pricing, warranty, and category.
                </p>

                <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Product Name
                    </label>
                    <input
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. AMD Ryzen 7 7800X3D"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Brand / Manufacturer
                      </label>
                      <input
                        required
                        value={prodBrand}
                        onChange={(e) => setProdBrand(e.target.value)}
                        placeholder="e.g. ASUS, Corsair"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Category
                      </label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as any)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white font-medium"
                      >
                        <option value="processors">Processors</option>
                        <option value="gpus">Graphics Cards</option>
                        <option value="motherboards">Motherboards</option>
                        <option value="memory">RAM Memory</option>
                        <option value="storage">Storage & SSD</option>
                        <option value="laptops">Laptops</option>
                        <option value="cctv">CCTV & Security</option>
                        <option value="networking">Networking</option>
                        <option value="monitors">Monitors</option>
                        <option value="power">Cooling & Power</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Selling Price (₹)
                      </label>
                      <input
                        required
                        type="number"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        placeholder="34990"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        MRP Price (₹)
                      </label>
                      <input
                        required
                        type="number"
                        value={prodMrp}
                        onChange={(e) => setProdMrp(e.target.value)}
                        placeholder="42990"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Key Specs (Comma separated)
                    </label>
                    <input
                      required
                      value={prodSpecs}
                      onChange={(e) => setProdSpecs(e.target.value)}
                      placeholder="8 Cores / 16 Threads, AM5 Socket, 104MB 3D V-Cache"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Warranty Details
                    </label>
                    <input
                      value={prodWarranty}
                      onChange={(e) => setProdWarranty(e.target.value)}
                      placeholder="3 Years Official India Direct Warranty"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Image URL (Unsplash or CDN)
                    </label>
                    <input
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsProductFormOpen(false)}
                      className="flex-1 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md"
                    >
                      {editingProduct ? "Save Product Changes" : "Create Product"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
