// Razorpay Payment Gateway Client Integration for ICS Technologies

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayFailedResponse) => void) => void;
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

interface RazorpayFailedResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
  };
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Dynamically loads the Razorpay checkout.js script if not already present
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout script.");
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

/**
 * Returns the Razorpay public key ID from environment variables,
 * or a placeholder test key for development verification.
 */
export function getRazorpayKeyId(): string {
  const envKey =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env["VITE_RAZORPAY_KEY_ID"] as string | undefined)
      : undefined;

  // If user has supplied their Razorpay Key ID in .env
  if (envKey && envKey.trim() && !envKey.includes("placeholder")) {
    return envKey.trim();
  }

  // Fallback demo/test key indicator
  return "rzp_test_ICSComputerStore";
}

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id?: string | undefined;
  razorpay_signature?: string | undefined;
};

export type RazorpayPaymentOptions = {
  amount: number; // in Indian Rupees (₹)
  orderId?: string | undefined; // internal order tracking ID e.g. ICS-ORD-1234
  customerName: string;
  email?: string | undefined;
  phone: string;
  description?: string | undefined;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss?: (() => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
};

/**
 * Opens the official Razorpay Checkout Modal
 */
export async function openRazorpayCheckout({
  amount,
  orderId,
  customerName,
  email,
  phone,
  description = "ICS Computer Hardware & Services Order",
  onSuccess,
  onDismiss,
  onError,
}: RazorpayPaymentOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    const err = new Error(
      "Unable to connect to Razorpay payment gateway. Please check your internet connection.",
    );
    onError?.(err);
    return;
  }

  const key = getRazorpayKeyId();
  const amountInPaise = Math.round(amount * 100);

  const options: Record<string, unknown> = {
    key: key,
    amount: amountInPaise,
    currency: "INR",
    name: "ICS Technologies",
    description: `${description} (${orderId || "Instant Order"})`,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=120&auto=format&fit=crop&q=80",
    prefill: {
      name: customerName,
      email: email || "customer@icstech.in",
      contact: phone,
    },
    notes: {
      merchant_order_id: orderId || "",
      store_location: "Podanur, Coimbatore, Tamil Nadu",
    },
    theme: {
      color: "#2563eb", // ICS brand royal blue
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
      escape: true,
      backdropclose: false,
    },
    handler: (response: RazorpaySuccessResponse) => {
      onSuccess(response);
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response: RazorpayFailedResponse) => {
      const errorMsg =
        response.error?.description ||
        response.error?.reason ||
        "Payment was declined or cancelled.";
      onError?.(new Error(errorMsg));
    });
    rzp.open();
  } catch (err: unknown) {
    console.error("Razorpay initiation error:", err);
    onError?.(err instanceof Error ? err : new Error("Failed to open Razorpay modal"));
  }
}
