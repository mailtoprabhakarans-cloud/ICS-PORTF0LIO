import React from "react";

export type BrandItem = {
  name: string;
  category: string;
};

export const PARTNER_BRANDS: BrandItem[] = [
  { name: "Intel", category: "Core & Xeon Processors" },
  { name: "AMD", category: "Ryzen CPUs & Radeon GPUs" },
  { name: "NVIDIA", category: "GeForce RTX 50/40 Series" },
  { name: "ASUS", category: "ROG Motherboards & Laptops" },
  { name: "MSI", category: "Gaming Motherboards & GPUs" },
  { name: "Gigabyte", category: "AORUS Hardware & Displays" },
  { name: "ZOTAC", category: "GeForce Gaming GPUs" },
  { name: "Corsair", category: "DDR5 RAM, PSUs & AIO Coolers" },
  { name: "Hikvision", category: "4K ColorVu CCTV & NVRs" },
  { name: "D-Link", category: "Cat6 Structured Cabling" },
  { name: "Western Digital", category: "Black NVMe & Purple HDDs" },
  { name: "Samsung", category: "990 Pro SSDs & Curvature Monitors" },
  { name: "Crucial", category: "DDR5 Memory & Micron SSDs" },
  { name: "Ubiquiti", category: "UniFi Cloud WiFi 7 APs" },
  { name: "Epson", category: "EcoTank InkTank Printers" },
  { name: "eSSL", category: "Biometric & Access Systems" },
  { name: "Dell", category: "Inspiron & XPS Commercial" },
  { name: "HP", category: "Victus & Enterprise Desktops" },
  { name: "Lenovo", category: "Legion Gaming & ThinkPads" },
];

export function BrandLogo({
  brand,
  className = "h-7 w-auto max-w-[130px]",
}: {
  brand: string;
  className?: string;
}) {
  const norm = brand.trim().toLowerCase();

  // 1. INTEL
  if (norm.includes("intel")) {
    return (
      <svg
        viewBox="0 0 130 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Intel Logo"
      >
        <g fill="#0068B5">
          {/* i */}
          <rect x="12" y="7" width="5.5" height="5" rx="1" />
          <rect x="12" y="14" width="5.5" height="15" rx="1" />
          {/* n */}
          <path d="M23 14h5v2.5c1.5-2 3.8-2.8 6.2-2.8 5.2 0 8.8 3.5 8.8 9v6.3h-5.5v-5.8c0-3-1.4-4.5-4-4.5-2.6 0-5 1.8-5 5v5.3H23V14z" />
          {/* t */}
          <path d="M47 18h-3.8v-4h3.8V10h5.2v4h4.8v4H52v6.5c0 1.5.7 2.2 2 2.2h2.8v4.2h-4.4c-4 0-5.6-1.7-5.6-5.2V18z" />
          {/* e */}
          <path d="M60 21.5c.2-5 3.8-8.5 8.8-8.5 5.2 0 8.8 3.8 8.8 9.3v1.6H65.2c.4 2.8 2.4 4.5 5.2 4.5 2.2 0 4-.8 5-2.3l3.6 2.5c-1.9 2.7-5.1 4-8.8 4-6 0-10.2-4.4-10.2-11.1zm12.4-1.5c-.3-2.3-1.8-4-4-4s-3.8 1.6-4.1 4h8.1z" />
          {/* l */}
          <rect x="82" y="6" width="5.5" height="23" rx="1" />
        </g>
        {/* Intel cyan spark */}
        <path
          d="M93 7c-1.8 2.2-2.8 4.5-2.8 6.5s1 4.3 2.8 6.5c1.8-2.2 2.8-4.5 2.8-6.5s-1-4.3-2.8-6.5z"
          fill="#00C7FD"
        />
      </svg>
    );
  }

  // 2. AMD
  if (norm.includes("amd")) {
    return (
      <svg
        viewBox="0 0 130 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="AMD Logo"
      >
        {/* AMD Arrow Chevron symbol */}
        <g transform="translate(6, 4)">
          <path fill="#ED1C24" d="M0 0h28v28H0z" rx="3" />
          <path fill="#FFFFFF" d="M14 0l14 14L14 28 0 14z" />
          <path fill="#ED1C24" d="M14 6l8 8-8 8-8-8z" />
        </g>
        {/* AMD Typography */}
        <text
          x="42"
          y="25"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="0.08em"
          fill="currentColor"
        >
          AMD
        </text>
      </svg>
    );
  }

  // 3. NVIDIA
  if (norm.includes("nvidia")) {
    return (
      <svg
        viewBox="0 0 140 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="NVIDIA Logo"
      >
        {/* NVIDIA Claw emblem */}
        <g transform="translate(4, 5)">
          <path
            fill="#76B900"
            d="M17.5 2C9.5 2 3 8.5 3 16.5c0 6.2 3.9 11.5 9.4 13.6-1-1.9-1.7-4.1-1.7-6.4 0-7 5.7-12.7 12.7-12.7 2.7 0 5.2.9 7.3 2.3C28 7.5 23 2 17.5 2zm0 6.3c-4.5 0-8.2 3.7-8.2 8.2 0 4 2.8 7.2 6.5 8-1.7-2-2.7-4.8-2.7-7.6 0-6.2 4.3-11.4 10.1-12.7-1.7-.5-3.6-.9-5.7-.9z"
          />
        </g>
        <text
          x="42"
          y="24"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="0.06em"
          fill="currentColor"
        >
          NVIDIA
        </text>
      </svg>
    );
  }

  // 4. ASUS
  if (norm.includes("asus")) {
    return (
      <svg
        viewBox="0 0 130 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="ASUS Logo"
      >
        <text
          x="65"
          y="25"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="0.14em"
          fill="#00539B"
        >
          ASUS
        </text>
        {/* Subtle ASUS horizontal line segment cut */}
        <line x1="12" y1="18" x2="118" y2="18" stroke="currentColor" strokeWidth="1.8" opacity="0.25" />
      </svg>
    );
  }

  // 5. MSI
  if (norm.includes("msi")) {
    return (
      <svg
        viewBox="0 0 130 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="MSI Logo"
      >
        <text
          x="12"
          y="25"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="0.05em"
          fill="currentColor"
        >
          msi
        </text>
        {/* Red dragon shield emblem */}
        <g transform="translate(76, 5)">
          <path
            d="M13 0l13 5v9c0 8-6 15-13 18C6 29 0 22 0 14V5l13-5z"
            fill="#E60012"
          />
          <path
            d="M9 10c1.5-2 4-2.5 6-1 2 1.5 2.5 4 1 6l-3.5 4-1.5-3.5 2-2.5c.8-1 .5-2-.5-2.5-1-.5-2.2-.2-2.8.8l-1.7 2.2L9 10z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    );
  }

  // 6. GIGABYTE
  if (norm.includes("gigabyte")) {
    return (
      <svg
        viewBox="0 0 140 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Gigabyte Logo"
      >
        <text
          x="10"
          y="24"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="19"
          letterSpacing="0.04em"
          fill="#005596"
        >
          GIGABYTE
        </text>
        {/* Aorus Orange Wing Triangle Accent */}
        <polygon points="122,8 132,18 122,18" fill="#FF6A00" />
      </svg>
    );
  }

  // 7. ZOTAC
  if (norm.includes("zotac")) {
    return (
      <svg
        viewBox="0 0 130 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="ZOTAC Logo"
      >
        {/* ZOTAC yellow-orange circular icon */}
        <circle cx="20" cy="18" r="13" fill="#FFB800" />
        <path d="M10 15h20v2.5H10zM10 19h20v2.5H10z" fill="#1C1C1E" />
        {/* ZOTAC text */}
        <text
          x="42"
          y="25"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="19"
          letterSpacing="0.08em"
          fill="currentColor"
        >
          ZOTAC
        </text>
      </svg>
    );
  }

  // 8. CORSAIR
  if (norm.includes("corsair")) {
    return (
      <svg
        viewBox="0 0 140 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Corsair Logo"
      >
        {/* 3 Corsair Gold Sails */}
        <g fill="#EAA827" transform="translate(6, 4)">
          <path d="M10 2c-2.5 6-6 11-9 13.5 5-.8 9-3 12-6.5-1-2.5-2-5-3-7z" />
          <path d="M14 3c1.5 5 4 8.5 7 11-4 .8-8 .8-11-.8 1.5-3 2.5-6.5 4-10.2z" />
          <path d="M12 14c-2.5 4-5.5 7-9 8.5 4 0 7-1.5 10-4-1-1.5-1-3-1-4.5z" />
          <path d="M14 15c1.5 3 3 5.5 5.5 7-3 0-6-.5-8.5-1.5 1-1.5 2-3.5 3-5.5z" />
        </g>
        <text
          x="38"
          y="24"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="0.14em"
          fill="currentColor"
        >
          CORSAIR
        </text>
      </svg>
    );
  }

  // 9. HIKVISION
  if (norm.includes("hikvision")) {
    return (
      <svg
        viewBox="0 0 140 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Hikvision Logo"
      >
        <text
          x="10"
          y="25"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="21"
          letterSpacing="-0.02em"
          fill="#E60012"
        >
          HIK
        </text>
        <text
          x="51"
          y="25"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="21"
          letterSpacing="-0.02em"
          fill="currentColor"
        >
          VISION
        </text>
        <circle cx="126" cy="14" r="2.8" fill="#E60012" />
      </svg>
    );
  }

  // 10. D-LINK
  if (norm.includes("d-link") || norm === "dlink") {
    return (
      <svg
        viewBox="0 0 130 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="D-Link Logo"
      >
        <text
          x="12"
          y="25"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="23"
          letterSpacing="-0.03em"
          fill="#009A44"
        >
          D-Link
        </text>
        <circle cx="56" cy="11" r="3.2" fill="#009A44" />
      </svg>
    );
  }

  // 11. WESTERN DIGITAL
  if (norm.includes("western") || norm.includes("wd")) {
    return (
      <svg
        viewBox="0 0 150 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Western Digital Logo"
      >
        {/* WD blue square */}
        <rect x="6" y="5" width="26" height="26" rx="5" fill="#005195" />
        <text
          x="11"
          y="24"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="15"
          fill="#FFFFFF"
        >
          WD
        </text>
        <text
          x="40"
          y="17"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="11"
          fill="currentColor"
        >
          Western
        </text>
        <text
          x="40"
          y="29"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="11"
          fill="currentColor"
        >
          Digital
        </text>
      </svg>
    );
  }

  // 12. SAMSUNG (FIXED: wide viewBox, text centered, zero clipping!)
  if (norm.includes("samsung")) {
    return (
      <svg
        viewBox="0 0 150 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Samsung Logo"
      >
        <text
          x="75"
          y="24"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="0.08em"
          fill="#1428A0"
        >
          SAMSUNG
        </text>
      </svg>
    );
  }

  // 13. CRUCIAL
  if (norm.includes("crucial")) {
    return (
      <svg
        viewBox="0 0 130 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Crucial Logo"
      >
        <circle cx="18" cy="18" r="11" fill="none" stroke="#005A9C" strokeWidth="3.5" />
        <path d="M18 7a11 11 0 0 1 9 4.5l-3.5 2.5a6.5 6.5 0 0 0-5.5-3.5z" fill="#00A3E0" />
        <text
          x="36"
          y="24"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="18"
          letterSpacing="-0.01em"
          fill="#005A9C"
        >
          crucial
        </text>
      </svg>
    );
  }

  // 14. UBIQUITI (FIXED: wide viewBox, generous spacing, zero clipping!)
  if (norm.includes("ubiquiti") || norm.includes("unifi")) {
    return (
      <svg
        viewBox="0 0 150 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Ubiquiti Logo"
      >
        {/* Ubiquiti ring emblem */}
        <g transform="translate(8, 6)">
          <circle cx="12" cy="12" r="11" fill="none" stroke="#006FFF" strokeWidth="3.5" />
          <circle cx="12" cy="12" r="4.5" fill="#006FFF" />
        </g>
        <text
          x="40"
          y="24"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="16"
          letterSpacing="0.06em"
          fill="currentColor"
        >
          UBIQUITI
        </text>
      </svg>
    );
  }

  // 15. EPSON
  if (norm.includes("epson")) {
    return (
      <svg
        viewBox="0 0 130 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Epson Logo"
      >
        <text
          x="65"
          y="26"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="0.05em"
          fill="#003399"
        >
          EPSON
        </text>
      </svg>
    );
  }

  // 16. eSSL
  if (norm.includes("essl")) {
    return (
      <svg
        viewBox="0 0 120 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="eSSL Logo"
      >
        <circle cx="18" cy="18" r="12" fill="#E60000" />
        <text
          x="12"
          y="23"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="15"
          fill="#FFFFFF"
        >
          e
        </text>
        <text
          x="36"
          y="26"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="23"
          letterSpacing="0.04em"
          fill="#003399"
        >
          SSL
        </text>
      </svg>
    );
  }

  // 17. DELL (FIXED: larger, cleaner, properly proportioned)
  if (norm.includes("dell")) {
    return (
      <svg
        viewBox="0 0 120 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Dell Logo"
      >
        <circle cx="20" cy="18" r="14" stroke="#007DB8" strokeWidth="2.8" fill="none" />
        <text
          x="10"
          y="23"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="14"
          fill="#007DB8"
        >
          D
        </text>
        <text
          x="44"
          y="25"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="20"
          letterSpacing="0.06em"
          fill="#007DB8"
        >
          DELL
        </text>
      </svg>
    );
  }

  // 18. HP
  if (norm === "hp" || norm.includes("hewlett")) {
    return (
      <svg
        viewBox="0 0 100 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="HP Logo"
      >
        <circle cx="32" cy="18" r="15" fill="#0096D6" />
        <path
          fill="#FFFFFF"
          d="M28 8l-2 19h3.8l1.1-10h3.2c3 0 5.2-1.5 5.8-4.5.5-3.5-1.5-4.5-4.5-4.5H28zm8.5 4l-2 15h3.8l1-8h2.8c2.5 0 4-1.2 4.5-3.5.5-2.8-1-3.5-3.5-3.5h-6.6z"
        />
        <text
          x="54"
          y="25"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="20"
          fill="currentColor"
        >
          HP
        </text>
      </svg>
    );
  }

  // 19. LENOVO (FIXED: well-padded, centered white text on red badge)
  if (norm.includes("lenovo")) {
    return (
      <svg
        viewBox="0 0 120 36"
        className={className}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Lenovo Logo"
      >
        <rect x="6" y="6" width="108" height="24" rx="4" fill="#E2231A" />
        <text
          x="60"
          y="23"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="16"
          letterSpacing="0.08em"
          fill="#FFFFFF"
        >
          Lenovo
        </text>
      </svg>
    );
  }

  // Fallback
  return (
    <div className="flex items-center justify-center font-display font-bold text-sm tracking-wide text-ink">
      <span>{brand}</span>
    </div>
  );
}
