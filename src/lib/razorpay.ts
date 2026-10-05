// Cashfree Payment Gateway Adapter (formerly Razorpay)
// Forwards checkout and legacy exports directly to Cashfree integration

import {
  openCashfreeCheckout,
  CashfreeSuccessResponse,
  CashfreePaymentOptions,
  getCashfreeAppId,
  loadCashfreeScript,
} from "./cashfree";

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id?: string | undefined;
  razorpay_signature?: string | undefined;
};

export type RazorpayPaymentOptions = {
  amount: number;
  orderId?: string | undefined;
  customerName: string;
  email?: string | undefined;
  phone: string;
  description?: string | undefined;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss?: (() => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
};

export function loadRazorpayScript(): Promise<boolean> {
  return loadCashfreeScript();
}

export function getRazorpayKeyId(): string {
  return getCashfreeAppId();
}

/**
 * Adapter that forwards Razorpay checkout calls to Cashfree
 */
export async function openRazorpayCheckout({
  amount,
  orderId,
  customerName,
  email,
  phone,
  description,
  onSuccess,
  onDismiss,
  onError,
}: RazorpayPaymentOptions): Promise<void> {
  return openCashfreeCheckout({
    amount,
    orderId,
    customerName,
    email,
    phone,
    description,
    onSuccess: (res: CashfreeSuccessResponse) => {
      onSuccess({
        razorpay_payment_id: res.payment_id,
        razorpay_order_id: String(res.cf_order_id || res.order_id),
      });
    },
    onDismiss,
    onError,
  });
}
