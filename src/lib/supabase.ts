import { createClient } from "@supabase/supabase-js";

// Read environment variables (supports VITE_SUPABASE_*, SUPABASE_PUBLISHABLE_KEY, etc.)
const envUrl =
  (typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) ||
      (import.meta.env["SUPABASE_URL"] as string | undefined)
    : undefined) || "https://ljwomirkdqrpnvhfsliz.supabase.co";

const envKey =
  (typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) ||
      (import.meta.env["SUPABASE_PUBLISHABLE_KEY"] as string | undefined)
    : undefined) || "sb_publishable_W_r1T6g3StxRUkF7Z0RTNA_IbQl9osX";

const supabaseUrl = envUrl || "https://ljwomirkdqrpnvhfsliz.supabase.co";
const supabaseAnonKey = envKey || "sb_publishable_W_r1T6g3StxRUkF7Z0RTNA_IbQl9osX";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder"),
);

// Create Supabase Client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | undefined;
  company_name?: string | undefined;
  gst_number?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  avatar_url?: string | undefined;
  is_admin?: boolean | undefined;
  created_at?: string | undefined;
};

export type DbQuote = {
  id: string;
  user_id?: string | undefined;
  customer_name: string;
  phone: string;
  email?: string | undefined;
  service_category: string;
  notes?: string | undefined;
  status: "pending" | "in_review" | "quoted" | "completed" | "cancelled";
  estimated_amount?: number | undefined;
  created_at: string;
};

export type DbRepairTicket = {
  id: string;
  user_id?: string | undefined;
  customer_name: string;
  phone: string;
  device_name: string;
  issue_description: string;
  status: string;
  estimated_delivery: string;
  estimated_cost?: number | undefined;
  created_at: string;
  steps: {
    title: string;
    desc: string;
    completed: boolean;
    current?: boolean;
  }[];
};

export type DbOrder = {
  id: string;
  user_id?: string | undefined;
  customer_name: string;
  phone: string;
  email?: string | undefined;
  delivery_address?: string | undefined;
  items: {
    id: string;
    name: string;
    price: number;
    qty: number;
    brand?: string | undefined;
  }[];
  subtotal: number;
  gst_amount: number;
  grand_total: number;
  payment_method: string;
  payment_id?: string | undefined;
  payment_status?: "Paid" | "Pending" | "Failed" | string | undefined;
  razorpay_order_id?: string | undefined;
  status: "Order Placed" | "Shipped" | "Assembled & Tested" | "Out for Delivery" | "Delivered" | "Cancelled";
  tracking_step: number;
  estimated_delivery: string;
  created_at: string;
};

