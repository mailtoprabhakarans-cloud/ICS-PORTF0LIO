import {
  isSupabaseConfigured,
  supabase,
  type DbQuote,
  type DbRepairTicket,
} from "./supabase";
import { SAMPLE_TICKETS } from "./site-data";

// 1. QUOTES API
export async function submitQuoteToBackend(quote: {
  userId?: string | undefined;
  name: string;
  phone: string;
  email?: string | undefined;
  service: string;
  notes?: string | undefined;
}): Promise<{ success: boolean; data?: DbQuote | undefined; error?: string | undefined }> {
  if (!isSupabaseConfigured) {
    // Store in local storage history
    const localQuotes = JSON.parse(localStorage.getItem("ics_user_quotes") || "[]");
    const newQuote: DbQuote = {
      id: `quote-${Date.now()}`,
      user_id: quote.userId,
      customer_name: quote.name,
      phone: quote.phone,
      email: quote.email,
      service_category: quote.service,
      notes: quote.notes,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    localQuotes.unshift(newQuote);
    localStorage.setItem("ics_user_quotes", JSON.stringify(localQuotes));
    return { success: true, data: newQuote };
  }

  try {
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        user_id: quote.userId || null,
        customer_name: quote.name,
        phone: quote.phone,
        email: quote.email || null,
        service_category: quote.service,
        notes: quote.notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: data as DbQuote };
  } catch (err: any) {
    console.error("Supabase quote submission error:", err);
    return { success: false, error: err.message || "Failed to submit quote" };
  }
}

export async function fetchUserQuotes(userId: string): Promise<DbQuote[]> {
  if (!isSupabaseConfigured) {
    const localQuotes: DbQuote[] = JSON.parse(localStorage.getItem("ics_user_quotes") || "[]");
    return localQuotes.filter((q) => !q.user_id || q.user_id === userId);
  }

  try {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as DbQuote[]) || [];
  } catch (err) {
    console.error("Error fetching user quotes:", err);
    return [];
  }
}

// 2. REPAIR TICKETS API (Chip-Level Service, Laptops, Assembly)
const REPAIR_TICKETS_KEY = "ics_repair_tickets_list";

export function getLocalRepairTickets(): DbRepairTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REPAIR_TICKETS_KEY);
    if (raw) return JSON.parse(raw);
    const initial = Object.values(SAMPLE_TICKETS).map((s) => ({
      id: s.id,
      customer_name: s.customer,
      phone: "+91 98422 12345",
      device_name: s.device,
      issue_description: s.issue,
      status: s.status,
      estimated_delivery: s.estimatedDelivery,
      created_at: new Date().toISOString(),
      steps: s.steps,
    }));
    localStorage.setItem(REPAIR_TICKETS_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return [];
  }
}

export async function createRepairTicketInBackend(ticket: {
  userId?: string | undefined;
  customerName: string;
  phone: string;
  deviceName: string;
  issueDescription: string;
  estimatedCost?: number | undefined;
  estimatedDelivery?: string | undefined;
}): Promise<{ success: boolean; ticket?: DbRepairTicket | undefined; error?: string | undefined }> {
  const ticketId = `ICS-SRV-${Math.floor(1000 + Math.random() * 9000)}`;

  const defaultSteps = [
    { title: "Device Received & Checked-In", desc: "Inspection ticket recorded at Podanur Lab", completed: true, current: false },
    { title: "Chip-Level Diagnostics & QA", desc: "Motherboard power rail & component testing", completed: false, current: true },
    { title: "Component Rework / Repair", desc: "IC replacement, soldering, or BIOS reflash", completed: false, current: false },
    { title: "Stress & Thermal Testing", desc: "24-hr QA benchmark test", completed: false, current: false },
    { title: "Ready for Pickup", desc: "Service completed, ready at counter", completed: false, current: false },
    { title: "Delivered / Handed Over", desc: "Device handed over to customer & warranty active", completed: false, current: false },
  ];

  const newTicket: DbRepairTicket = {
    id: ticketId,
    user_id: ticket.userId,
    customer_name: ticket.customerName,
    phone: ticket.phone,
    device_name: ticket.deviceName,
    issue_description: ticket.issueDescription,
    status: "Checked-In · In Lab Diagnostics",
    estimated_delivery: ticket.estimatedDelivery || "Within 24-48 Hours",
    estimated_cost: ticket.estimatedCost,
    created_at: new Date().toISOString(),
    steps: defaultSteps,
  };

  const local = getLocalRepairTickets();
  local.unshift(newTicket);
  localStorage.setItem(REPAIR_TICKETS_KEY, JSON.stringify(local));

  if (!isSupabaseConfigured) {
    return { success: true, ticket: newTicket };
  }

  try {
    const { data, error } = await supabase
      .from("repair_tickets")
      .insert({
        id: newTicket.id,
        user_id: newTicket.user_id || null,
        customer_name: newTicket.customer_name,
        phone: newTicket.phone,
        device_name: newTicket.device_name,
        issue_description: newTicket.issue_description,
        status: newTicket.status,
        estimated_delivery: newTicket.estimated_delivery,
        estimated_cost: newTicket.estimated_cost,
        steps: newTicket.steps,
      })
      .select()
      .single();

    if (error) {
      return { success: true, ticket: newTicket };
    }
    return { success: true, ticket: data as DbRepairTicket };
  } catch (err: any) {
    return { success: true, ticket: newTicket };
  }
}

export async function fetchAllRepairTicketsForAdmin(): Promise<DbRepairTicket[]> {
  if (!isSupabaseConfigured) {
    return getLocalRepairTickets();
  }

  try {
    const { data, error } = await supabase
      .from("repair_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocalRepairTickets();
    }
    return data as DbRepairTicket[];
  } catch {
    return getLocalRepairTickets();
  }
}

export async function updateRepairTicketStatusInBackend(
  ticketId: string,
  stepIndex: number, // 0 to 5
  statusText: string,
): Promise<{ success: boolean; error?: string | undefined }> {
  const DEFAULT_STEPS = [
    { title: "Device Checked-In", desc: "Inspection ticket recorded", completed: true, current: false },
    { title: "Chip-Level Diagnostics", desc: "Motherboard power rail inspection", completed: false, current: false },
    { title: "Component Rework", desc: "SMD replacement in progress", completed: false, current: false },
    { title: "Thermal & BIOS Test", desc: "Quality stress test", completed: false, current: false },
    { title: "Ready for Pickup", desc: "Ready at counter", completed: false, current: false },
    { title: "Delivered / Handed Over", desc: "Device handed over to customer & warranty active", completed: false, current: false },
  ];

  const local = getLocalRepairTickets();
  let found = local.find((t) => t.id === ticketId);
  
  if (!found) {
    // If not found in local yet, create from sample or placeholder
    const sample = SAMPLE_TICKETS[ticketId.toUpperCase()];
    if (sample) {
      found = {
        id: sample.id,
        customer_name: sample.customer,
        phone: "+91 98422 12345",
        device_name: sample.device,
        issue_description: sample.issue,
        status: sample.status,
        estimated_delivery: sample.estimatedDelivery,
        created_at: new Date().toISOString(),
        steps: [...sample.steps, { title: "Delivered / Handed Over", desc: "Handed over to customer", completed: false, current: false }],
      };
      local.unshift(found);
    }
  }

  if (found) {
    found.status = statusText;
    const baseSteps = found.steps && found.steps.length >= 5 ? found.steps : DEFAULT_STEPS;
    found.steps = baseSteps.map((step, idx) => ({
      ...step,
      completed: idx < stepIndex || (idx === stepIndex && stepIndex === baseSteps.length - 1),
      current: idx === stepIndex && stepIndex !== baseSteps.length - 1,
    }));
    localStorage.setItem(REPAIR_TICKETS_KEY, JSON.stringify(local));
  }

  if (!isSupabaseConfigured) return { success: true };

  try {
    if (found) {
      const { error } = await supabase
        .from("repair_tickets")
        .upsert({
          id: found.id,
          customer_name: found.customer_name,
          phone: found.phone,
          device_name: found.device_name,
          issue_description: found.issue_description,
          status: statusText,
          estimated_delivery: found.estimated_delivery,
          estimated_cost: found.estimated_cost,
          steps: found.steps,
        });
      if (error) {
        console.warn("Supabase repair ticket update error (local updated):", error);
      }
    }
    return { success: true };
  } catch (err: any) {
    return { success: true };
  }
}

export async function lookupRepairTicket(
  ticketId: string,
): Promise<{ success: boolean; ticket?: DbRepairTicket | undefined; error?: string | undefined }> {
  const normalizedId = ticketId.trim().toUpperCase();

  const local = getLocalRepairTickets();
  const localFound = local.find((t) => t.id.toUpperCase() === normalizedId);
  if (localFound) {
    return { success: true, ticket: localFound };
  }

  if (!isSupabaseConfigured) {
    const sample = SAMPLE_TICKETS[normalizedId];
    if (sample) {
      return {
        success: true,
        ticket: {
          id: sample.id,
          customer_name: sample.customer,
          phone: "+91 98422 12345",
          device_name: sample.device,
          issue_description: sample.issue,
          status: sample.status,
          estimated_delivery: sample.estimatedDelivery,
          created_at: new Date().toISOString(),
          steps: sample.steps,
        },
      };
    }
    return { success: false, error: "Ticket ID not found" };
  }

  try {
    // Try secure RPC function first
    try {
      const rpcRes = await (supabase.rpc as any)("track_repair_ticket_secure", {
        target_ticket_id: normalizedId,
      });
      if (!rpcRes.error && rpcRes.data) {
        return { success: true, ticket: rpcRes.data as DbRepairTicket };
      }
    } catch {
      // fallback
    }

    const { data, error } = await supabase
      .from("repair_tickets")
      .select("*")
      .eq("id", normalizedId)
      .single();

    if (error || !data) {
      const sample = SAMPLE_TICKETS[normalizedId];
      if (sample) {
        return {
          success: true,
          ticket: {
            id: sample.id,
            customer_name: sample.customer,
            phone: "+91 98422 12345",
            device_name: sample.device,
            issue_description: sample.issue,
            status: sample.status,
            estimated_delivery: sample.estimatedDelivery,
            created_at: new Date().toISOString(),
            steps: sample.steps,
          },
        };
      }
      return { success: false, error: "Ticket not found" };
    }

    return { success: true, ticket: data as DbRepairTicket };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to lookup ticket" };
  }
}

// 3. SAVED PC BUILDS API
export async function savePcBuildToBackend(build: {
  userId: string;
  name: string;
  totalPrice: number;
  tdp?: number | undefined;
  parts: Record<string, any>;
}): Promise<{ success: boolean; error?: string | undefined }> {
  if (!isSupabaseConfigured) {
    const localBuilds = JSON.parse(localStorage.getItem("ics_user_builds") || "[]");
    localBuilds.unshift({
      id: `build-${Date.now()}`,
      user_id: build.userId,
      build_name: build.name,
      total_price: build.totalPrice,
      estimated_tdp: build.tdp,
      parts: build.parts,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("ics_user_builds", JSON.stringify(localBuilds));
    return { success: true };
  }

  try {
    const { error } = await supabase.from("pc_builds").insert({
      user_id: build.userId,
      build_name: build.name,
      total_price: build.totalPrice,
      estimated_tdp: build.tdp,
      parts: build.parts,
    });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchUserPcBuilds(userId: string) {
  if (!isSupabaseConfigured) {
    const localBuilds = JSON.parse(localStorage.getItem("ics_user_builds") || "[]");
    return localBuilds.filter((b: any) => b.user_id === userId);
  }

  try {
    const { data, error } = await supabase
      .from("pc_builds")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching builds:", err);
    return [];
  }
}

// 4. ORDERS & CART HISTORY API (User specific with live tracking)
export async function createOrderInBackend(order: {
  userId?: string | undefined;
  customerName: string;
  phone: string;
  email?: string | undefined;
  deliveryAddress?: string | undefined;
  items: { id: string; name: string; price: number; qty: number; brand?: string | undefined }[];
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  paymentMethod?: string | undefined;
  paymentId?: string | undefined;
  paymentStatus?: "Paid" | "Pending" | "Failed" | string | undefined;
  razorpayOrderId?: string | undefined;
}): Promise<{ success: boolean; order?: import("./supabase").DbOrder; error?: string | undefined }> {
  const orderId = `ICS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: import("./supabase").DbOrder = {
    id: orderId,
    user_id: order.userId,
    customer_name: order.customerName,
    phone: order.phone,
    email: order.email,
    delivery_address: order.deliveryAddress,
    items: order.items,
    subtotal: order.subtotal,
    gst_amount: order.gstAmount,
    grand_total: order.grandTotal,
    payment_method: order.paymentMethod || "Razorpay Online (UPI/Cards)",
    payment_id: order.paymentId,
    payment_status: order.paymentStatus || (order.paymentId ? "Paid" : "Pending"),
    razorpay_order_id: order.razorpayOrderId,
    status: "Order Placed",
    tracking_step: 1,
    estimated_delivery: "Within 24 Hours in Coimbatore",
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    const localOrders: import("./supabase").DbOrder[] = JSON.parse(
      localStorage.getItem("ics_user_orders") || "[]",
    );
    localOrders.unshift(newOrder);
    localStorage.setItem("ics_user_orders", JSON.stringify(localOrders));
    return { success: true, order: newOrder };
  }

  try {
    const insertPayload: Record<string, any> = {
      id: newOrder.id,
      user_id: newOrder.user_id || null,
      customer_name: newOrder.customer_name,
      phone: newOrder.phone,
      email: newOrder.email || null,
      delivery_address: newOrder.delivery_address || null,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      gst_amount: newOrder.gst_amount,
      grand_total: newOrder.grand_total,
      payment_method: newOrder.payment_method,
      payment_id: newOrder.payment_id || null,
      payment_status: newOrder.payment_status || "Pending",
      status: newOrder.status,
      tracking_step: newOrder.tracking_step,
      estimated_delivery: newOrder.estimated_delivery,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.warn("Supabase orders insert warning (fallback to local):", error.message);
      // Fallback save locally if table not migrated yet
      const localOrders: import("./supabase").DbOrder[] = JSON.parse(
        localStorage.getItem("ics_user_orders") || "[]",
      );
      localOrders.unshift(newOrder);
      localStorage.setItem("ics_user_orders", JSON.stringify(localOrders));
      return { success: true, order: newOrder };
    }

    return { success: true, order: data as import("./supabase").DbOrder };
  } catch (err: any) {
    console.error("Order creation error:", err);
    return { success: false, error: err.message || "Failed to create order" };
  }
}

export async function fetchUserOrders(userId: string): Promise<import("./supabase").DbOrder[]> {
  if (!isSupabaseConfigured) {
    const localOrders: import("./supabase").DbOrder[] = JSON.parse(
      localStorage.getItem("ics_user_orders") || "[]",
    );
    return localOrders.filter((o) => o.user_id === userId);
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback check local storage
      const localOrders: import("./supabase").DbOrder[] = JSON.parse(
        localStorage.getItem("ics_user_orders") || "[]",
      );
      const userLocal = localOrders.filter((o) => o.user_id === userId);
      return userLocal;
    }

    return (data as import("./supabase").DbOrder[]) || [];
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return [];
  }
}

// 5. PUBLIC & ADMIN ORDER TRACKING API
export async function lookupOrderById(
  orderId: string,
): Promise<{ success: boolean; order?: import("./supabase").DbOrder; error?: string }> {
  const normId = orderId.trim().toUpperCase();

  if (!isSupabaseConfigured) {
    const localOrders: import("./supabase").DbOrder[] = JSON.parse(
      localStorage.getItem("ics_user_orders") || "[]",
    );
    const found = localOrders.find((o) => o.id.toUpperCase() === normId);
    if (found) return { success: true, order: found };

    // Dynamic mock for any entered tracking ID
    return {
      success: true,
      order: {
        id: normId,
        customer_name: "Customer Order",
        phone: "+91 98422 12345",
        delivery_address: "Podanur, Coimbatore",
        items: [
          { id: "custom-pc", name: "Custom Gaming PC Build (RTX 5070 Ti + Ryzen 7)", price: 124990, qty: 1, brand: "ICS" },
        ],
        subtotal: 124990,
        gst_amount: 22498,
        grand_total: 147488,
        payment_method: "Store UPI",
        status: "Assembled & Tested",
        tracking_step: 2,
        estimated_delivery: "Today, 6:00 PM",
        created_at: new Date().toISOString(),
      },
    };
  }

  try {
    // Try secure RPC function first
    try {
      const rpcRes = await (supabase.rpc as any)("track_order_secure", {
        target_order_id: normId,
      });
      if (!rpcRes.error && rpcRes.data) {
        return { success: true, order: rpcRes.data as import("./supabase").DbOrder };
      }
    } catch {
      // fallback
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", normId)
      .single();

    if (error || !data) {
      const localOrders: import("./supabase").DbOrder[] = JSON.parse(
        localStorage.getItem("ics_user_orders") || "[]",
      );
      const found = localOrders.find((o) => o.id.toUpperCase() === normId);
      if (found) return { success: true, order: found };
      return { success: false, error: "Order not found" };
    }

    return { success: true, order: data as import("./supabase").DbOrder };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to lookup order" };
  }
}

export async function fetchAllOrdersForAdmin(): Promise<import("./supabase").DbOrder[]> {
  if (!isSupabaseConfigured) {
    return JSON.parse(localStorage.getItem("ics_user_orders") || "[]");
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return JSON.parse(localStorage.getItem("ics_user_orders") || "[]");
    }
    return (data as import("./supabase").DbOrder[]) || [];
  } catch (err) {
    return [];
  }
}

export async function updateOrderStatusInBackend(
  orderId: string,
  status: import("./supabase").DbOrder["status"],
  trackingStep: number,
): Promise<{ success: boolean; error?: string }> {
  // Update local storage
  const localOrders: import("./supabase").DbOrder[] = JSON.parse(
    localStorage.getItem("ics_user_orders") || "[]",
  );
  const updatedLocal = localOrders.map((o) =>
    o.id === orderId ? { ...o, status, tracking_step: trackingStep } : o,
  );
  localStorage.setItem("ics_user_orders", JSON.stringify(updatedLocal));

  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status, tracking_step: trackingStep })
      .eq("id", orderId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchAllQuotesForAdmin(): Promise<import("./supabase").DbQuote[]> {
  if (!isSupabaseConfigured) {
    return JSON.parse(localStorage.getItem("ics_user_quotes") || "[]");
  }

  try {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return JSON.parse(localStorage.getItem("ics_user_quotes") || "[]");
    return (data as import("./supabase").DbQuote[]) || [];
  } catch (err) {
    return [];
  }
}

export async function updateQuoteStatusInBackend(
  quoteId: string,
  status: "pending" | "in_review" | "quoted" | "completed" | "cancelled",
): Promise<{ success: boolean; error?: string }> {
  const localQuotes: import("./supabase").DbQuote[] = JSON.parse(
    localStorage.getItem("ics_user_quotes") || "[]",
  );
  const updatedLocal = localQuotes.map((q) => (q.id === quoteId ? { ...q, status } : q));
  localStorage.setItem("ics_user_quotes", JSON.stringify(updatedLocal));

  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase.from("quotes").update({ status }).eq("id", quoteId);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 6. PRODUCT MANAGEMENT (CRUD for Admin)
const PRODUCTS_STORAGE_KEY = "ics_custom_products_list";

export function getCustomProducts(): import("./site-data").Product[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function fetchAllProductsFromBackend(): Promise<import("./site-data").Product[]> {
  if (!isSupabaseConfigured) {
    return getCustomProducts();
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return getCustomProducts();
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      image: item.image,
      images: Array.isArray(item.images) ? item.images : [],
      specs: Array.isArray(item.specs) ? item.specs : [],
      fullSpecs: typeof item.full_specs === "object" ? item.full_specs : {},
      price: Number(item.price),
      mrp: Number(item.mrp),
      tab: item.tab || "hot",
      rating: Number(item.rating) || 5,
      reviewCount: Number(item.review_count) || 10,
      inStock: Boolean(item.in_stock),
      warranty: item.warranty || "3 Years Official India Warranty",
      highlights: Array.isArray(item.highlights) ? item.highlights : [],
      description: item.description || "",
    }));
  } catch {
    return getCustomProducts();
  }
}

export async function saveProduct(
  product: import("./site-data").Product,
): Promise<{ success: boolean; error?: string }> {
  // Local store sync
  const current = getCustomProducts();
  const exists = current.findIndex((p) => p.id === product.id);
  if (exists >= 0) {
    current[exists] = product;
  } else {
    current.unshift(product);
  }
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(current));

  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      image: product.image,
      images: product.images || [],
      specs: product.specs || [],
      full_specs: product.fullSpecs || {},
      price: product.price,
      mrp: product.mrp,
      tab: product.tab || "hot",
      rating: product.rating || 5,
      review_count: product.reviewCount || 10,
      in_stock: product.inStock ?? true,
      warranty: product.warranty || "3 Years Official India Warranty",
      highlights: product.highlights || [],
      description: product.description || "",
    };

    const { error } = await supabase.from("products").upsert(payload);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Error upserting product to Supabase:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  const current = getCustomProducts();
  const filtered = current.filter((p) => p.id !== productId);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));

  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting product from Supabase:", err);
    return { success: false, error: err.message };
  }
}

// 7. USER MANAGEMENT (Profiles for Admin)
export async function fetchAllUsersForAdmin(): Promise<import("./supabase").UserProfile[]> {
  if (!isSupabaseConfigured) {
    const localUsers = JSON.parse(localStorage.getItem("ics_demo_users_list") || "[]");
    if (localUsers.length === 0) {
      return [
        {
          id: "usr-101",
          full_name: "Ramesh Kumar",
          email: "ramesh.k@gmail.com",
          phone: "+91 98422 12345",
          company_name: "Kumar Tech Works",
          gst_number: "33AAAAA0000A1Z5",
          city: "Coimbatore",
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: "usr-102",
          full_name: "Ananya S.",
          email: "ananya.dev@outlook.com",
          phone: "+91 97890 54321",
          city: "Coimbatore",
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];
    }
    return localUsers;
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as import("./supabase").UserProfile[];
  } catch (err) {
    return [];
  }
}

export async function updateUserProfileByAdmin(
  userId: string,
  updates: Partial<import("./supabase").UserProfile>,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}



