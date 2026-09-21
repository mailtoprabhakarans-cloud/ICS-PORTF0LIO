import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Building,
  CheckCircle2,
  Cpu,
  Edit2,
  KeyRound,
  Lock,
  Mail,
  Package,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  User,
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
  fetchAllProductsFromBackend,
  saveProduct,
  deleteProduct,
  fetchAllRepairTicketsForAdmin,
  createRepairTicketInBackend,
  updateRepairTicketStatusInBackend,
} from "@/lib/supabase-api";
import { PRODUCTS, type Product } from "@/lib/site-data";
import { useAuth, AuthProvider } from "@/lib/auth-context";
import { AppProvider } from "@/lib/store";
import type { DbOrder, DbQuote, DbRepairTicket, UserProfile } from "@/lib/supabase";
import IcsLogo from "@/components/site/IcsLogo";
import { Toaster, toast } from "sonner";
import {
  verifyAdminPin,
  getAdminLockoutStatus,
  recordFailedAdminPinAttempt,
  resetAdminPinAttempts,
} from "@/lib/security";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal | ICS Computer Store Management Hub" }],
  }),
  component: AdminPageWrapper,
});

function AdminPageWrapper() {
  return (
    <AuthProvider>
      <AppProvider>
        <AdminDashboard />
        <Toaster richColors position="top-right" />
      </AppProvider>
    </AuthProvider>
  );
}

function AdminDashboard() {
  const { profile } = useAuth();

  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const [activeTab, setActiveTab] = useState<"orders" | "services" | "products" | "users" | "quotes" | "overview">("orders");

  // Orders, Quotes, Users, Services & Products State
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [services, setServices] = useState<DbRepairTicket[]>([]);
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

  // Service Ticket Add Form State
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [srvCustomerName, setSrvCustomerName] = useState("");
  const [srvPhone, setSrvPhone] = useState("");
  const [srvDeviceName, setSrvDeviceName] = useState("");
  const [srvIssue, setSrvIssue] = useState("");
  const [srvEstCost, setSrvEstCost] = useState("");
  const [srvEstDelivery, setSrvEstDelivery] = useState("Within 24 Hours");

  const refreshData = async () => {
    setLoading(true);
    const [fetchedOrders, fetchedServices, fetchedQuotes, fetchedUsers, fetchedProducts] = await Promise.all([
      fetchAllOrdersForAdmin(),
      fetchAllRepairTicketsForAdmin(),
      fetchAllQuotesForAdmin(),
      fetchAllUsersForAdmin(),
      fetchAllProductsFromBackend(),
    ]);
    setOrders(fetchedOrders);
    setServices(fetchedServices);
    setQuotes(fetchedQuotes);
    setUsers(fetchedUsers);

    // Merge base products with DB products
    const map = new Map<string, Product>();
    PRODUCTS.forEach((p) => map.set(p.id, p));
    fetchedProducts.forEach((p) => map.set(p.id, p));
    setAllProducts(Array.from(map.values()));

    setLoading(false);
  };

  // Check lockout on mount and tick countdown
  useEffect(() => {
    const status = getAdminLockoutStatus();
    if (status.isLocked) {
      setLockoutSeconds(status.remainingSeconds);
    }
  }, []);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Authenticate automatically if signed-in profile has admin flag
  useEffect(() => {
    if (profile?.is_admin) {
      setIsAuthenticated(true);
    }
  }, [profile]);

  // SECURE: Fetch sensitive business & customer data ONLY after authentication is verified
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lockout = getAdminLockoutStatus();
    if (lockout.isLocked) {
      setLockoutSeconds(lockout.remainingSeconds);
      toast.error(`Security Lockout: Please wait ${lockout.remainingSeconds}s before trying again.`);
      return;
    }

    if (verifyAdminPin(pinInput)) {
      resetAdminPinAttempts();
      setIsAuthenticated(true);
      setPinError(false);
      setLockoutSeconds(0);
      toast.success("Admin identity verified");
    } else {
      const attemptRes = recordFailedAdminPinAttempt();
      setPinError(true);
      if (attemptRes.isLocked) {
        setLockoutSeconds(attemptRes.remainingSeconds);
        toast.error(`3 incorrect attempts! Admin access locked for 60 seconds.`);
      } else {
        toast.error("Incorrect Admin Security PIN");
      }
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

  // Service Ticket Actions
  const handleCreateServiceTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvCustomerName || !srvPhone || !srvDeviceName) {
      toast.error("Please fill in Customer Name, Phone and Device Model");
      return;
    }

    const res = await createRepairTicketInBackend({
      customerName: srvCustomerName,
      phone: srvPhone,
      deviceName: srvDeviceName,
      issueDescription: srvIssue || "Diagnostics & General Service",
      estimatedCost: Number(srvEstCost) || undefined,
      estimatedDelivery: srvEstDelivery,
    });

    if (res.success && res.ticket) {
      toast.success("Service Call Created Successfully!", {
        description: `Tracking ID: ${res.ticket.id} generated for customer.`,
      });
      setIsServiceFormOpen(false);
      setSrvCustomerName("");
      setSrvPhone("");
      setSrvDeviceName("");
      setSrvIssue("");
      setSrvEstCost("");
      refreshData();
    } else {
      toast.error("Failed to create service ticket", { description: res.error });
    }
  };

  const handleUpdateServiceStep = async (
    ticketId: string,
    stepIdx: number,
    statusText: string,
  ) => {
    // Optimistic immediate UI update in state
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id !== ticketId) return srv;
        const updatedSteps = (srv.steps || []).map((step, idx) => ({
          ...step,
          completed: idx < stepIdx || (idx === stepIdx && stepIdx === 4),
          current: idx === stepIdx && stepIdx !== 4,
        }));
        return { ...srv, status: statusText, steps: updatedSteps };
      }),
    );

    const res = await updateRepairTicketStatusInBackend(ticketId, stepIdx, statusText);
    if (res.success) {
      toast.success(`Service #${ticketId} updated to: ${statusText}`);
    } else {
      toast.error("Failed to update service status");
      refreshData();
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

  const handleSaveProduct = async (e: React.FormEvent) => {
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

    const res = await saveProduct(newProd);
    if (res.success) {
      toast.success(editingProduct ? "Product updated in database!" : "New product saved to database!");
      setIsProductFormOpen(false);
      refreshData();
    } else {
      toast.error("Failed to save product in database", { description: res.error });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await deleteProduct(productId);
      if (res.success) {
        setAllProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Product removed from database catalog");
      } else {
        toast.error("Failed to delete product", { description: res.error });
      }
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

  // 1. PIN LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[28px] border border-slate-200 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
              <Lock className="size-8" />
            </div>
            <h2 className="font-display text-2xl font-black text-slate-900">
              ICS Admin Control Portal
            </h2>
            <p className="text-xs text-slate-500">
              Enter master credentials or PIN to access this standalone dashboard.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                Admin Security PIN
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/15">
                <KeyRound className="size-4.5 text-slate-400 mr-2.5" />
                <input
                  required
                  type="password"
                  autoFocus
                  disabled={lockoutSeconds > 0}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder={lockoutSeconds > 0 ? `Locked for ${lockoutSeconds}s` : "Enter Admin Security PIN"}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-medium disabled:opacity-50"
                />
              </div>
              {lockoutSeconds > 0 ? (
                <p className="mt-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200/80 rounded-xl p-2.5">
                  🔒 Security Lockout Active: Too many failed PIN attempts. Wait <span className="font-bold">{lockoutSeconds} seconds</span> to retry.
                </p>
              ) : pinError ? (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                  Incorrect Security PIN. Attempts are rate-limited.
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="size-4" /> Unlock Admin Panel
            </button>

            <a
              href="/"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors pt-2"
            >
              <ArrowLeft className="size-3.5" /> Back to Main Website
            </a>
          </form>
        </div>
      </div>
    );
  }

  // 2. STANDALONE ADMIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3">
              <IcsLogo className="size-10" />
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-display text-xl font-black text-red-600">ICS</span>
                  <span className="font-display text-base font-extrabold text-slate-900 tracking-wider uppercase">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
                  Management Hub
                </span>
              </div>
            </a>

            <span className="hidden md:inline rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700">
              Live Database Connected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Store Front
            </a>

            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors shadow-xs"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1700px] mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: "orders", label: `Product Orders (${orders.length})`, icon: Package },
              { id: "services", label: `Service Calls / Repair (${services.length})`, icon: Wrench },
              { id: "products", label: `Products Catalog (${allProducts.length})`, icon: Tag },
              { id: "users", label: `Customer Users (${users.length})`, icon: Users },
              { id: "quotes", label: `Quotes & Proformas (${quotes.length})`, icon: Receipt },
              { id: "overview", label: "Financial Metrics", icon: Activity },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === t.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "services" && (
              <button
                onClick={() => setIsServiceFormOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm"
              >
                <Plus className="size-4" /> Create Service Call
              </button>
            )}

            {activeTab === "products" && (
              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm"
              >
                <Plus className="size-4" /> Add Product
              </button>
            )}

            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus-within:border-blue-600 focus-within:bg-white">
              <Search className="size-3.5 text-slate-400 mr-2" />
              <input
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search entries…"
                className="w-44 bg-transparent text-xs text-slate-900 outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex-1">
          {/* TAB 1: ORDERS & TRACKING */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Total Orders
                  </span>
                  <p className="font-display text-3xl font-black text-slate-900 mt-1">{orders.length}</p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Pending Action
                  </span>
                  <p className="font-display text-3xl font-black text-amber-700 mt-1">{pendingOrders}</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    Testing / QA
                  </span>
                  <p className="font-display text-3xl font-black text-blue-700 mt-1">{inProgressOrders}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Dispatched / Delivered
                  </span>
                  <p className="font-display text-3xl font-black text-emerald-700 mt-1">{outForDelivery}</p>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-20 text-center">
                  <Package className="mx-auto size-12 text-slate-300" />
                  <p className="mt-3 font-display text-lg font-bold text-slate-900">No Orders Found</p>
                  <p className="text-xs text-slate-500">Customer orders will appear here for live milestone status updates.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-base font-bold text-blue-600">
                            {order.id}
                          </span>
                          <span className="rounded-full bg-blue-100 text-blue-700 border border-blue-200 px-3 py-0.5 text-xs font-bold uppercase">
                            {order.status} (Milestone {order.tracking_step || 1}/4)
                          </span>
                          {order.payment_id ? (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
                              ✓ Paid via Razorpay ({order.payment_id})
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-xs font-bold">
                              ⏳ {order.payment_method || "Payment on Handover"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-800 font-semibold mt-1">
                          {order.customer_name} · 📞 {order.phone} {order.email ? `· ✉️ ${order.email}` : ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          📍 {order.delivery_address || "Coimbatore Store Pickup"} · Mode: <span className="font-medium text-slate-700">{order.payment_method}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-display text-xl font-black text-red-600">
                          ₹{Number(order.grand_total).toLocaleString("en-IN")}
                        </span>
                        <span className="block text-xs text-slate-500">
                          Subtotal: ₹{Number(order.subtotal).toLocaleString("en-IN")} + 18% GST
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5 bg-white rounded-2xl p-4 border border-slate-200 text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                          <span className="font-medium text-slate-800">
                            • {it.name} (Qty: {it.qty})
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            ₹{(it.price * it.qty).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ADVANCE TRACKING CONTROLS */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                        <Truck className="size-4 text-blue-600" /> Advance Milestone:
                      </span>

                      {(() => {
                        const isService = order.items.some(
                          (it) =>
                            it.name.toLowerCase().includes("repair") ||
                            it.name.toLowerCase().includes("service") ||
                            it.name.toLowerCase().includes("assembly"),
                        );

                        return (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "Order Placed", 1)}
                              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                                order.tracking_step === 1
                                  ? "bg-amber-500 text-white shadow-sm"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                                order.tracking_step === 2
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {isService ? "2. Assembly & Testing" : "2. Shipped"}
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "Out for Delivery", 3)}
                              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                                order.tracking_step === 3
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              3. Out for Delivery
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "Delivered", 4)}
                              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                                order.tracking_step === 4
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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

          {/* TAB 1.5: SERVICES & REPAIR CALLS */}
          {activeTab === "services" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div>
                  <h4 className="font-bold text-sm text-blue-900">Chip-Level Service & Laptop Repair Jobs</h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Generate service tickets for laptops/PCs brought by customers. Customers can check live progress using their tracking ID.
                  </p>
                </div>
                <button
                  onClick={() => setIsServiceFormOpen(true)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm shrink-0"
                >
                  + New Service Ticket
                </button>
              </div>

              {services.length === 0 ? (
                <div className="py-20 text-center">
                  <Wrench className="mx-auto size-12 text-slate-300" />
                  <p className="mt-3 font-display text-lg font-bold text-slate-900">No Service Calls Recorded</p>
                  <p className="text-xs text-slate-500">Create a ticket when a customer drops off a laptop, PC, or printer for repair.</p>
                </div>
              ) : (
                services.map((srv) => (
                  <div
                    key={srv.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-base font-bold text-blue-600">
                            {srv.id}
                          </span>
                          <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-3 py-0.5 text-xs font-bold uppercase">
                            {srv.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          💻 {srv.device_name} · <span className="font-semibold text-slate-700">Customer: {srv.customer_name}</span> (📞 {srv.phone})
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Issue: {srv.issue_description} · Estimated: {srv.estimated_delivery}
                        </p>
                      </div>

                      {srv.estimated_cost && (
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Est. Cost</span>
                          <span className="font-display text-lg font-black text-red-600">
                            ₹{Number(srv.estimated_cost).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Milestone Advancement Buttons */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                        <Wrench className="size-3.5 text-blue-600" /> Update Service Stage:
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {[
                          { idx: 0, label: "1. Checked-In", status: "Checked-In · Lab Received" },
                          { idx: 1, label: "2. Diagnostics & QA", status: "In Progress · Lab Diagnostics" },
                          { idx: 2, label: "3. Component Rework", status: "Component Rework in Progress" },
                          { idx: 3, label: "4. Stress Test & BIOS", status: "Thermal & Stress Testing" },
                          { idx: 4, label: "5. Ready for Pickup", status: "Ready for Pickup at Podanur Lab" },
                          { idx: 5, label: "6. Delivered", status: "Delivered / Handover Complete" },
                        ].map((st) => {
                          const currentStepIdx = (srv.steps || []).findIndex((s) => s.current);
                          const isCurrent = currentStepIdx === st.idx || (currentStepIdx === -1 && srv.status === st.status);
                          const isDone = (srv.steps && srv.steps[st.idx]?.completed) || (currentStepIdx > st.idx) || (currentStepIdx === -1 && srv.status.toLowerCase().includes("delivered") && st.idx <= 5);

                          return (
                            <button
                              key={st.idx}
                              type="button"
                              onClick={() => handleUpdateServiceStep(srv.id, st.idx, st.status)}
                              className={`rounded-xl p-2.5 text-xs font-bold text-center transition-all cursor-pointer ${
                                isCurrent
                                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-600/30 font-extrabold scale-[1.02]"
                                  : isDone
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold"
                                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                              }`}
                            >
                              {st.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10.5px] font-bold text-blue-700 uppercase">
                          {prod.brand} · {prod.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">In Stock</span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{prod.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{prod.specs.join(" · ")}</p>

                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="font-display text-lg font-black text-red-600">
                          ₹{prod.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{prod.mrp.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

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
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Customer Name</th>
                      <th className="px-4 py-3.5">Email Address</th>
                      <th className="px-4 py-3.5">Phone</th>
                      <th className="px-4 py-3.5">Company / GST</th>
                      <th className="px-4 py-3.5">City</th>
                      <th className="px-4 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3.5 font-semibold text-slate-900">
                          {u.full_name || "Customer User"}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{u.email}</td>
                        <td className="px-4 py-3.5 text-slate-600">{u.phone || "—"}</td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {u.company_name || u.gst_number || "Retail Individual"}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{u.city || "Coimbatore"}</td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold">
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
                    <div className="flex gap-1.5">
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

          {/* TAB 5: FINANCIALS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/60 p-8">
                <span className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                  Commercial Revenue Volume
                </span>
                <h3 className="mt-2 font-display text-4xl font-black text-slate-900">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Gross calculated revenue across B2B enterprise networking & retail gaming PC orders.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Add / Edit Modal Drawer */}
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

      {/* Service Call Creation Modal Drawer */}
      <AnimatePresence>
        {isServiceFormOpen && (
          <div className="fixed inset-0 z-80 grid place-items-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsServiceFormOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsServiceFormOpen(false)}
                className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-2xl bg-blue-100 text-blue-600 grid place-items-center">
                  <Wrench className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-black text-slate-900">
                    Create Service Ticket / Call
                  </h3>
                  <p className="text-xs text-slate-500">
                    Register a laptop, PC, printer, or motherboard repair job.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateServiceTicket} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Customer Name *
                    </label>
                    <input
                      required
                      value={srvCustomerName}
                      onChange={(e) => setSrvCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={srvPhone}
                      onChange={(e) => setSrvPhone(e.target.value)}
                      placeholder="+91 98422 12345"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Device / Laptop Model *
                  </label>
                  <input
                    required
                    value={srvDeviceName}
                    onChange={(e) => setSrvDeviceName(e.target.value)}
                    placeholder="e.g. Dell Inspiron 15 (i5-1235U) / Custom Gaming PC"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Issue Description / Complaint
                  </label>
                  <textarea
                    rows={2}
                    value={srvIssue}
                    onChange={(e) => setSrvIssue(e.target.value)}
                    placeholder="e.g. No display, Motherboard shorted, Overheating, Blue Screen error"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Estimated Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={srvEstCost}
                      onChange={(e) => setSrvEstCost(e.target.value)}
                      placeholder="1850"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Est. Delivery / Turnaround
                    </label>
                    <input
                      value={srvEstDelivery}
                      onChange={(e) => setSrvEstDelivery(e.target.value)}
                      placeholder="Tomorrow, 5:00 PM"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsServiceFormOpen(false)}
                    className="flex-1 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md"
                  >
                    Create Service Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
