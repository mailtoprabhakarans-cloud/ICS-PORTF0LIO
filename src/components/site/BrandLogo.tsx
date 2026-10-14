import React from "react";

export type BrandItem = {
  name: string;
  category: string;
  logo: string;
};

export const PARTNER_BRANDS: BrandItem[] = [
  { name: "Intel", category: "Core & Xeon Processors", logo: "/brands/intel.svg" },
  { name: "AMD", category: "Ryzen CPUs & Radeon GPUs", logo: "/brands/amd.svg" },
  { name: "NVIDIA", category: "GeForce RTX 50/40 Series", logo: "/brands/nvidia.svg" },
  { name: "ASUS", category: "ROG Motherboards & Laptops", logo: "/brands/asus.svg" },
  { name: "MSI", category: "Gaming Motherboards & GPUs", logo: "/brands/msi.svg" },
  { name: "Gigabyte", category: "AORUS Hardware & Displays", logo: "/brands/gigabyte.svg" },
  { name: "ZOTAC", category: "GeForce Gaming GPUs", logo: "/brands/zotac.svg" },
  { name: "Corsair", category: "DDR5 RAM, PSUs & Coolers", logo: "/brands/corsair.svg" },
  { name: "Hikvision", category: "4K ColorVu CCTV & NVRs", logo: "/brands/hikvision.svg" },
  { name: "D-Link", category: "Cat6 Structured Cabling", logo: "/brands/dlink.svg" },
  { name: "Western Digital", category: "Black NVMe & Purple HDDs", logo: "/brands/westerndigital.svg" },
  { name: "Samsung", category: "990 Pro SSDs & Displays", logo: "/brands/samsung.svg" },
  { name: "Crucial", category: "DDR5 Memory & Micron SSDs", logo: "/brands/crucial.png" },
  { name: "Ubiquiti", category: "UniFi Cloud WiFi 7 APs", logo: "/brands/ubiquiti.svg" },
  { name: "Epson", category: "EcoTank InkTank Printers", logo: "/brands/epson.svg" },
  { name: "eSSL", category: "Biometric & Access Systems", logo: "/brands/essl.png" },
  { name: "Dell", category: "Inspiron & XPS Commercial", logo: "/brands/dell.svg" },
  { name: "HP", category: "Victus & Enterprise Desktops", logo: "/brands/hp.svg" },
  { name: "Lenovo", category: "Legion Gaming & ThinkPads", logo: "/brands/lenovo.svg" },
];

export function BrandLogo({
  brand,
  className = "max-h-7 max-w-[125px] w-auto h-auto object-contain",
}: {
  brand: string;
  className?: string;
}) {
  const norm = brand.trim().toLowerCase();
  const item = PARTNER_BRANDS.find((b) => b.name.toLowerCase() === norm);
  const src = item ? item.logo : `/brands/${norm.replace(/\s+/g, "")}.svg`;

  return (
    <img
      src={src}
      alt={`${brand} Official Logo`}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        // Fallback in case of image load delay
        const target = e.currentTarget;
        target.style.display = "none";
        const parent = target.parentElement;
        if (parent && !parent.querySelector(".fallback-brand-text")) {
          const span = document.createElement("span");
          span.className = "fallback-brand-text font-display font-black text-xs text-ink uppercase";
          span.innerText = brand;
          parent.appendChild(span);
        }
      }}
    />
  );
}
