// Security utility for input sanitization, rate-limiting, and admin authentication hardening

const MAX_PIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds
const STORAGE_KEY_ATTEMPTS = "ics_admin_auth_attempts";
const STORAGE_KEY_LOCKOUT_UNTIL = "ics_admin_lockout_until";

/**
 * Strips script tags, HTML tags, and dangerous characters from user input
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>'"`;]/g, "") // Strip potential script/injection chars
    .trim();
}

/**
 * Validates and sanitizes a phone number to only contain digits, spaces, hyphens, and leading plus
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== "string") return "";
  const cleaned = phone.replace(/[^\d+\-\s()]/g, "").trim();
  return cleaned.slice(0, 20);
}

/**
 * Verifies if the admin security PIN matches the configured secret
 */
export function verifyAdminPin(inputPin: string): boolean {
  const configuredPin =
    (typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env["VITE_ADMIN_PIN"] as string | undefined)
      : undefined) || "ICS@Admin#Coimbatore2026";

  if (!inputPin) return false;
  return inputPin.trim() === configuredPin.trim();
}

/**
 * Checks if admin authentication is currently locked out due to excessive failed attempts
 */
export function getAdminLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  if (typeof window === "undefined") {
    return { isLocked: false, remainingSeconds: 0 };
  }

  const lockoutUntil = parseInt(sessionStorage.getItem(STORAGE_KEY_LOCKOUT_UNTIL) || "0", 10);
  const now = Date.now();

  if (lockoutUntil > now) {
    const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }

  // Lockout expired
  if (lockoutUntil > 0) {
    sessionStorage.removeItem(STORAGE_KEY_LOCKOUT_UNTIL);
    sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);
  }

  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Records a failed PIN attempt. Returns lockout status.
 */
export function recordFailedAdminPinAttempt(): { isLocked: boolean; remainingSeconds: number } {
  if (typeof window === "undefined") {
    return { isLocked: false, remainingSeconds: 0 };
  }

  const currentAttempts = parseInt(sessionStorage.getItem(STORAGE_KEY_ATTEMPTS) || "0", 10) + 1;
  sessionStorage.setItem(STORAGE_KEY_ATTEMPTS, currentAttempts.toString());

  if (currentAttempts >= MAX_PIN_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    sessionStorage.setItem(STORAGE_KEY_LOCKOUT_UNTIL, lockoutUntil.toString());
    return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Resets admin PIN attempt counters on successful login
 */
export function resetAdminPinAttempts(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);
  sessionStorage.removeItem(STORAGE_KEY_LOCKOUT_UNTIL);
}
