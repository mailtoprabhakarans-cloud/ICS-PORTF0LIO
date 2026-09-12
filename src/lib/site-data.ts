export const CONTACT = {
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsapp: "919876543210",
  email: "infantcs.cbe@gmail.com",
  hours: "Mon – Sat · 9:30 AM – 8:00 PM (Sunday Closed)",
  status: "Open Now · Closes 8:00 PM",
  address: "240/A2B, Sarada Mill Rd, near Koushikha Hospital, Podanur, Coimbatore, Tamil Nadu 641023",
  landmark: "Near Koushikha Hospital, Sarada Mill Road, Podanur",
  mapUrl: "https://maps.app.goo.gl/bZ98isZoDcdCNU1y7",
  mapEmbedUrl: "https://maps.google.com/maps?q=240/A2B,%20Sarada%20Mill%20Rd,%20near%20Koushikha%20Hospital,%20Podanur,%20Coimbatore,%20Tamil%20Nadu%20641023&t=&z=16&ie=UTF8&iwloc=&output=embed",
};

export const waLink = (message: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

export type MegaColumn = { title: string; items: string[] };
export type MegaCategory = { label: string; columns: MegaColumn[] };

export const MEGA_MENU: MegaCategory[] = [
  {
    label: "Laptops & Care Packs",
    columns: [
      {
        title: "Gaming Laptops",
        items: [
          "ASUS TUF Gaming FX50H",
          "HP Victus 15 Gaming",
          "Lenovo LOQ / Legion",
        ],
      },
      {
        title: "Commercial & Everyday",
        items: [
          "Dell Inspiron 14 & 15",
          "HP 250 G9 Series",
          "HP Notebook 15-FD0465TU",
          "Lenovo V15 Gen3 & G4",
        ],
      },
      {
        title: "Warranty & Extensions",
        items: [
          "Lenovo Laptop ADP Care Pack (+2 Yrs)",
          "Dell Onsite Extended Warranty",
          "HP Care Pack Protection",
        ],
      },
    ],
  },
  {
    label: "Custom Cooling",
    columns: [
      { title: "DIY Cooling", items: ["Water Blocks", "Pumps & Reservoirs", "Fittings", "Fans"] },
      {
        title: "AIO Liquid Coolers",
        items: ["240mm ARGB", "280mm ARGB", "360mm LCD", "420mm Performance"],
      },
      {
        title: "Coolants & Tubing",
        items: ["Thermal Grizzly Paste", "Soft Tubing", "Hard PETG Tubing", "Radiators"],
      },
    ],
  },
  {
    label: "Processors",
    columns: [
      {
        title: "AMD Ryzen",
        items: [
          "Ryzen 9 9950X",
          "Ryzen 7 7800X3D",
          "Ryzen 7 9700X",
          "Ryzen 5 7600X",
          "Ryzen 5 5600X",
          "Threadripper Pro",
        ],
      },
      {
        title: "Intel Core",
        items: [
          "Core Ultra 9 285K",
          "Core Ultra 7 265K",
          "Core Ultra 5 245K",
          "Core i9 14900K",
          "Core i7 14700K",
          "Core i5 14400F",
        ],
      },
    ],
  },
  {
    label: "Graphics Cards",
    columns: [
      {
        title: "NVIDIA GeForce",
        items: ["RTX 5090", "RTX 5080", "RTX 5070 Ti", "RTX 4070 SUPER", "RTX 4060 Ti"],
      },
      { title: "AMD Radeon", items: ["RX 7900 XTX", "RX 7800 XT", "RX 7600 XT", "RX 6600"] },
      { title: "Workstation GPUs", items: ["NVIDIA RTX A4000", "RTX 4500 Ada", "Quadro T1000"] },
    ],
  },
  {
    label: "Motherboards",
    columns: [
      {
        title: "AMD Sockets",
        items: ["X870E Gaming", "X670E Pro", "B650 WiFi", "A620M Entry", "B550 AM4"],
      },
      {
        title: "Intel Sockets",
        items: ["Z890 Flagship", "Z790 Max", "B760M Gaming", "H610M Commercial"],
      },
      {
        title: "Form Factors",
        items: ["E-ATX Workstation", "Standard ATX", "Micro-ATX Compact", "Mini-ITX Small Form"],
      },
    ],
  },
  {
    label: "Storage & Memory",
    columns: [
      {
        title: "High-Speed RAM",
        items: [
          "DDR5 6400MHz RGB",
          "DDR5 6000MHz Low Profile",
          "DDR4 3600MHz Dual Kit",
          "SODIMM Laptop RAM",
        ],
      },
      {
        title: "NVMe SSDs",
        items: [
          "PCIe Gen5 12000MB/s",
          "PCIe Gen4 7450MB/s",
          "2TB / 4TB High Capacity",
          "M.2 Heatsink Editions",
        ],
      },
      {
        title: "Surveillance & NAS HDD",
        items: [
          "WD Purple 4TB/8TB",
          "Seagate SkyHawk",
          "IronWolf NAS HDD",
          "External Backup Drives",
        ],
      },
    ],
  },
  {
    label: "CCTV & Security",
    columns: [
      {
        title: "Surveillance Cameras",
        items: [
          "4MP ColorVu Night-Vision",
          "4K IP Dome & Bullet",
          "PTZ 360° Smart Auto-Tracking",
          "Solar 4G Remote Cameras",
        ],
      },
      {
        title: "Recording & Storage",
        items: [
          "8-Ch / 16-Ch 4K NVR",
          "PoE Network Switches",
          "Surveillance Server Racks",
          "HDMI Matrix & Splitters",
        ],
      },
      {
        title: "Biometrics & Access",
        items: [
          "Fingerprint + Face Attendance",
          "RFID Door Access Controllers",
          "Video Door Phone Intercom",
        ],
      },
    ],
  },
  {
    label: "Networking Solutions",
    columns: [
      {
        title: "Structured Cabling",
        items: [
          "D-Link Cat6 305M Spool",
          "Patch Panels & Keystone Jacks",
          "Server Rack Cabinets 4U-42U",
          "Cable Management Bars",
        ],
      },
      {
        title: "Enterprise Wireless",
        items: [
          "Ubiquiti UniFi WiFi 6/7 AP",
          "Aruba Instant On",
          "Ruijie Reyee Cloud Mesh",
          "Point-to-Point Long Range Wireless",
        ],
      },
      {
        title: "Managed Switches & Routers",
        items: [
          "24-Port Gigabit PoE+",
          "10G SFP+ Uplink Switches",
          "Load Balancing Multi-WAN Routers",
          "Firewall Appliances",
        ],
      },
    ],
  },
];

export type Product = {
  id: string;
  name: string;
  brand: string;
  category:
    | "laptops"
    | "processors"
    | "gpus"
    | "motherboards"
    | "memory"
    | "storage"
    | "networking"
    | "cctv"
    | "monitors"
    | "power";
  image?: string;
  images?: string[];
  specs: string[];
  fullSpecs?: Record<string, string>;
  price: number;
  mrp: number;
  tab: "hot" | "new" | "gaming" | "enterprise";
  rating: number;
  reviewCount: number;
  inStock: boolean;
  warranty: string;
  highlights: string[];
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "amd-7800x3d",
    name: "AMD Ryzen 7 7800X3D Gaming Processor",
    brand: "AMD",
    category: "processors",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    specs: ["8 Cores / 16 Threads", "AM5 Socket", "104MB 3D V-Cache", "Up to 5.0GHz"],
    fullSpecs: {
      "Cores / Threads": "8 / 16",
      "Base / Boost Clock": "4.2GHz / 5.0GHz",
      "Total L3 Cache": "96MB V-Cache (104MB Total)",
      TDP: "120W",
      "PCIe Version": "PCIe 5.0",
      "Memory Support": "DDR5 up to 5200 MT/s",
      "Integrated GPU": "AMD Radeon Graphics",
    },
    price: 34990,
    mrp: 42990,
    tab: "hot",
    rating: 5,
    reviewCount: 48,
    inStock: true,
    warranty: "3 Years Official AMD India Warranty",
    highlights: [
      "#1 Best Gaming CPU in the world",
      "3D V-Cache technology delivers ultra-low latency",
      "Unmatched power efficiency for gaming rigs",
    ],
    description:
      "The undisputed champion of gaming CPUs. With AMD 3D V-Cache architecture, it outpaces higher-priced chips in modern AAA games while consuming remarkably low power.",
  },
  {
    id: "msi-rtx-5070ti",
    name: "MSI GeForce RTX 5070 Ti 16GB Gaming Trio",
    brand: "MSI",
    category: "gpus",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    specs: ["16GB GDDR7", "PCIe 5.0", "Tri-Frozr 3 Cooling", "DLSS 4 & Ray Tracing"],
    fullSpecs: {
      VRAM: "16GB GDDR7 256-bit",
      "CUDA Cores": "8960 Cores",
      "Boost Clock": "2610 MHz",
      "Power Connectors": "1x 16-pin 12V-2x6",
      "Recommended PSU": "750W",
      Outputs: "3x DisplayPort 2.1, 1x HDMI 2.1b",
    },
    price: 82990,
    mrp: 94990,
    tab: "new",
    rating: 5,
    reviewCount: 19,
    inStock: true,
    warranty: "3 Years MSI India Replacement Warranty",
    highlights: [
      "Cutting-edge GDDR7 memory architecture",
      "Ultra-quiet TORX Fan 5.0 triple fan cooling",
      "Built-in anti-sag GPU support bracket included",
    ],
    description:
      "Built on NVIDIA's next-gen architecture, this powerhouse delivers configuration for 1440p and 4K ultra gaming frame rates with real-time neural rendering and generative AI acceleration.",
  },
  {
    id: "corsair-ddr5-32gb",
    name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    brand: "Corsair",
    category: "memory",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80",
    specs: ["32GB (2x16GB)", "6000MHz CL30", "AMD EXPO & Intel XMP 3.0", "Panoramic RGB"],
    fullSpecs: {
      Capacity: "32GB (2 x 16GB Dual Channel)",
      Speed: "DDR5-6000 MT/s",
      "Tested Latency": "CL30-36-36-76",
      Voltage: "1.35V",
      "Heat Spreader": "Anodized Aluminum",
      "Software Control": "Corsair iCUE Support",
    },
    price: 10499,
    mrp: 13999,
    tab: "hot",
    rating: 5,
    reviewCount: 62,
    inStock: true,
    warranty: "10 Years / Limited Lifetime Warranty",
    highlights: [
      "Low-latency CL30 optimal for AMD AM5 & Intel 14th Gen",
      "Dynamic ten-zone vibrant RGB lightbar",
      "Custom high-performance PCB for stable overclocking",
    ],
    description:
      "High-frequency DDR5 optimized for enthusiasts and gamers looking for plug-and-play EXPO/XMP profiles with tight timings and stunning customizable lighting.",
  },
  {
    id: "samsung-990-pro-2tb",
    name: "Samsung 990 PRO 2TB PCIe Gen4 NVMe M.2 SSD",
    brand: "Samsung",
    category: "storage",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    specs: ["2TB Capacity", "7,450 MB/s Read", "6,900 MB/s Write", "Nickel-Coated Controller"],
    fullSpecs: {
      Interface: "PCIe Gen 4.0 x4, NVMe 2.0",
      "Sequential Read": "Up to 7,450 MB/s",
      "Sequential Write": "Up to 6,900 MB/s",
      "Random Read": "Up to 1,400,000 IOPS",
      "TBW Endurance": "1200 TBW",
      "Form Factor": "M.2 2280",
    },
    price: 14990,
    mrp: 19999,
    tab: "hot",
    rating: 5,
    reviewCount: 37,
    inStock: true,
    warranty: "5 Years Samsung India Warranty",
    highlights: [
      "Near theoretical maximum speed for PCIe 4.0",
      "Samsung in-house Pascal controller with smart thermal guard",
      "Optimal for PS5 console expansion and heavy 4K editing",
    ],
    description:
      "Engineered for tech enthusiasts, hardcore gamers, and heavy-workload professionals wanting blazing-fast load times and consistent sustained bandwidth.",
  },
  {
    id: "asus-tuf-b650-plus",
    name: "ASUS TUF Gaming B650-PLUS WiFi Motherboard",
    brand: "ASUS",
    category: "motherboards",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    specs: ["AMD AM5 Socket", "PCIe 5.0 M.2", "WiFi 6 & 2.5GbE", "12+2 Power Stages"],
    fullSpecs: {
      Chipset: "AMD B650",
      Socket: "AM5 (Ryzen 7000/8000/9000 Ready)",
      "VRM Design": "12+2 DrMOS Power Stages (60A)",
      "Memory Slots": "4x DDR5 (Up to 128GB, 7600+ OC)",
      Storage: "3x M.2 Slots (1x PCIe 5.0 + 2x PCIe 4.0) + 4x SATA",
      Networking: "Realtek 2.5G LAN + WiFi 6 + Bluetooth 5.2",
      Audio: "Realtek 7.1 Surround Sound",
    },
    price: 17490,
    mrp: 21500,
    tab: "hot",
    rating: 4,
    reviewCount: 29,
    inStock: true,
    warranty: "3 Years ASUS India Direct Warranty",
    highlights: [
      "Military-grade TUF chokes and capacitors",
      "Massive VRM heatsinks with pre-mounted I/O shield",
      "USB 3.2 Gen 2x2 Type-C (20Gbps) rear port",
    ],
    description:
      "Rugged durability meets modern connectivity. Built with server-grade PCB and heavy-duty VRM components to run Ryzen 7 and Ryzen 9 CPUs at peak performance.",
  },
  {
    id: "intel-ultra-7-265k",
    name: "Intel Core Ultra 7 265K Desktop Processor",
    brand: "Intel",
    category: "processors",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: ["20 Cores (8P + 12E)", "LGA1851", "5.5GHz Boost", "Integrated NPU for AI"],
    fullSpecs: {
      "Total Cores / Threads": "20 Cores / 20 Threads",
      "Performance-core Boost": "Up to 5.5 GHz",
      "AI NPU Capability": "Intel AI Boost NPU",
      "Intel Smart Cache": "33 MB",
      "Base Power": "125W (Max Turbo 250W)",
      "PCIe Support": "PCIe 5.0 and PCIe 4.0",
    },
    price: 38990,
    mrp: 44990,
    tab: "new",
    rating: 5,
    reviewCount: 14,
    inStock: true,
    warranty: "3 Years Intel India Warranty",
    highlights: [
      "Built-in Neural Processing Unit (NPU) for local AI workloads",
      "Substantial power efficiency gains with Arrow Lake architecture",
      "Supports latest DDR5 memory up to 6400 MT/s native",
    ],
    description:
      "Next-gen desktop computing built on Intel Arrow Lake architecture with dedicated on-chip AI acceleration, ideal for content creators, coding, and multitasking.",
  },
  {
    id: "gigabyte-rtx-4070-super",
    name: "Gigabyte GeForce RTX 4070 SUPER Windforce OC 12G",
    brand: "Gigabyte",
    category: "gpus",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    specs: ["12GB GDDR6X", "DLSS 3.5 Frame Gen", "Windforce 3X Fans", "Metal Backplate"],
    fullSpecs: {
      "CUDA Cores": "7168",
      "Core Clock": "2505 MHz (Boost)",
      "Memory Clock": "21 Gbps GDDR6X",
      "Memory Bus": "192-bit",
      "Card Dimensions": "261 x 126 x 50 mm",
      "Recommended PSU": "650W",
    },
    price: 62990,
    mrp: 71990,
    tab: "gaming",
    rating: 5,
    reviewCount: 51,
    inStock: true,
    warranty: "3+1 Years Gigabyte India Extended Warranty",
    highlights: [
      "20% faster than standard RTX 4070",
      "Full support for Cyberpunk Ray Tracing Overdrive with DLSS 3.5",
      "Alternate spinning fans reduce turbulence and noise",
    ],
    description:
      "The sweet spot for 1440p high-refresh gaming and creative 3D rendering with revolutionary Ada Lovelace architecture and AV1 video encoding.",
  },
  {
    id: "hikvision-4mp-colorvu",
    name: "Hikvision 4MP ColorVu IP PoE Dome Camera",
    brand: "Hikvision",
    category: "cctv",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
    specs: [
      "4MP Super HD",
      "24/7 Full Color Night Vision",
      "Built-in Mic",
      "PoE & IP67 Weatherproof",
    ],
    fullSpecs: {
      Sensor: '1/1.8" Progressive Scan CMOS',
      Resolution: "2688 × 1520 @ 30fps",
      Lens: "2.8mm Ultra-Wide (112° FOV)",
      "Night Color Range": "Up to 30m Warm White LED",
      Compression: "H.265+ / H.265 / H.264",
      "Weather Resistance": "IP67 Water & Dust Resistant",
      Audio: "Built-in Noise Reduction Microphone",
    },
    price: 4290,
    mrp: 5600,
    tab: "enterprise",
    rating: 5,
    reviewCount: 83,
    inStock: true,
    warranty: "2 Years Hikvision India Direct Replacement",
    highlights: [
      "True vivid color imaging even in pitch black darkness (F1.0 super-aperture)",
      "AcuSense human and vehicle classification eliminates false alarms",
      "Audio recording with built-in high sensitivity microphone",
    ],
    description:
      "Top choice for Coimbatore commercial shops, warehouses, residential villas, and parking facilities demanding clear identification round the clock.",
  },
  {
    id: "dlink-24port-gigabit-switch",
    name: "D-Link 24-Port Gigabit Smart Managed PoE+ Switch",
    brand: "D-Link",
    category: "networking",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
    specs: [
      "24x Gigabit PoE+ Ports",
      "370W PoE Budget",
      "4x 10G SFP+ Uplinks",
      "Layer 2+ Management",
    ],
    fullSpecs: {
      "Total Ports": "24x 10/100/1000BASE-T PoE+ Ports",
      "Uplink Ports": "4x 10G SFP+ Optical Uplinks",
      "PoE Standard": "IEEE 802.3at / 802.3af (Up to 30W/port)",
      "Switching Capacity": "128 Gbps Non-Blocking",
      Management: "Web GUI, SNMP, VLAN, QoS, IGMP Snooping",
      "Form Factor": "19-inch 1U Rackmount",
    },
    price: 18990,
    mrp: 23500,
    tab: "enterprise",
    rating: 5,
    reviewCount: 22,
    inStock: true,
    warranty: "3 Years D-Link India Advance Replacement",
    highlights: [
      "Powers up to 24 CCTV cameras or WiFi APs without separate power adapters",
      "10G SFP+ uplinks ensure zero bottleneck to servers or NAS storage",
      "Surge protection up to 6kV on all Ethernet ports",
    ],
    description:
      "Heavy-duty backbone for modern business IT infrastructure, schools, hospitals, and smart offices across Coimbatore and Tiruppur industrial clusters.",
  },
  {
    id: "corsair-h150i-aio",
    name: "Corsair iCUE LINK H150i RGB 360mm Liquid CPU Cooler",
    brand: "Corsair",
    category: "power",
    image: "https://images.unsplash.com/photo-1618764400608-9e7115eabb74?w=600&auto=format&fit=crop&q=80",
    specs: ["360mm Radiator", "3x QX120 RGB Fans", "Single-Cable iCUE LINK", "Zero RPM Mode"],
    fullSpecs: {
      "Radiator Size": "397mm x 120mm x 27mm",
      "Cold Plate": "Split-flow copper with pre-applied XTM70 paste",
      "Fan Speed": "480 - 2400 RPM",
      Airflow: "63.1 CFM",
      "Socket Support": "Intel LGA 1851/1700, AMD AM5/AM4",
      Warranty: "5 Years Manufacturer Warranty",
    },
    price: 16490,
    mrp: 20990,
    tab: "gaming",
    rating: 5,
    reviewCount: 31,
    inStock: true,
    warranty: "5 Years Corsair India Warranty",
    highlights: [
      "Innovative single-cable daisy-chain system eliminates cable clutter",
      "Tames high-TDP processors (Ryzen 9 / Core i9) under heavy rendering",
      "Customizable RGB lighting and liquid temperature telemetry",
    ],
    description:
      "Premium cooling solution designed to keep high-end gaming and creator processors running at sustained boost clocks without thermal throttling.",
  },
  {
    id: "asus-rog-27-180hz-monitor",
    name: 'ASUS ROG Strix 27" 180Hz QHD Fast-IPS Gaming Monitor',
    brand: "ASUS",
    category: "monitors",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    specs: ["2560x1440 QHD", "180Hz Refresh / 1ms", "Fast-IPS Panel", "G-Sync & FreeSync"],
    fullSpecs: {
      "Screen Size": "27-inch Flat Screen",
      Resolution: "2560 x 1440 (2K QHD)",
      "Panel Type": "Fast IPS",
      "Refresh Rate": "180Hz Overclocked",
      "Response Time": "1ms (GTG)",
      "Color Gamut": "DCI-P3 95% & sRGB 130%",
      HDR: "DisplayHDR 400 Certified",
    },
    price: 24990,
    mrp: 31990,
    tab: "gaming",
    rating: 5,
    reviewCount: 44,
    inStock: true,
    warranty: "3 Years ASUS On-Site Warranty",
    highlights: [
      "Crystal sharp 1440p resolution with ultra-smooth 180Hz motion",
      "Factory calibrated color accuracy for video editing & design work",
      "Ergonomic stand with height, tilt, swivel, and 90° pivot adjustment",
    ],
    description:
      "The ideal balance of competitive esports speed and breathtaking visual fidelity with wide color gamut and HDR clarity.",
  },
  {
    id: "zotac-rtx-4060-twin",
    name: "ZOTAC Gaming GeForce RTX 4060 8GB Twin Edge",
    brand: "ZOTAC",
    category: "gpus",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80",
    specs: ["8GB GDDR6", "Compact Dual-Slot", "IceStorm 2.0 Cooling", "115W Low Power"],
    fullSpecs: {
      "CUDA Cores": "3072",
      "Engine Clock": "Boost: 2460 MHz",
      "Memory Clock": "17 Gbps",
      "Power Consumption": "115W (Runs on 500W PSU)",
      "Card Length": "221.4mm (Fits any compact case)",
    },
    price: 27990,
    mrp: 32990,
    tab: "gaming",
    rating: 4,
    reviewCount: 56,
    inStock: true,
    warranty: "3+2 Years ZOTAC India Warranty (5 Years Total)",
    highlights: [
      "Industry-leading 5 Years warranty on registration",
      "Ultra-efficient 115W power draw keeps electrical bills minimal",
      "Fits 99% of ITX and standard cases",
    ],
    description:
      "The ultimate 1080p high-FPS card for competitive games like Valorant, CS2, Fortnite, and GTA V with DLSS 3 support.",
  },
  {
    id: "asus-tuf-fx506hlhb",
    name: "ASUS FX50HLHB-HN356W TUF Gaming Laptop",
    brand: "ASUS",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["Intel Core i5", "8GB/16GB RAM", "512GB NVMe SSD", "15.6\" 144Hz FHD", "Windows 11 Home"],
    fullSpecs: {
      "Model Number": "FX50HLHB-HN356W",
      "Processor": "Intel Core i5 High-Performance",
      "Display": "15.6-inch FHD (1920x1080) 144Hz IPS-level Anti-Glare",
      "Memory": "8GB DDR4 (Expandable up to 32GB)",
      "Storage": "512GB PCIe 3.0 NVMe M.2 SSD",
      "Graphics": "Dedicated Gaming GPU",
      "Keyboard": "RGB Backlit Gaming Keyboard with WASD highlights",
      "OS": "Windows 11 Home 64-bit",
      "Durability": "MIL-STD-810H Military-Grade Toughness",
    },
    price: 52990,
    mrp: 64990,
    tab: "gaming",
    rating: 5,
    reviewCount: 42,
    inStock: true,
    warranty: "1 Year ASUS India On-Site Comprehensive Warranty",
    highlights: [
      "Military-grade MIL-STD-810H toughness and dual-fan cooling",
      "144Hz ultra-smooth IPS gaming panel for esports",
      "AURA Sync RGB backlit keyboard with numpad",
    ],
    description:
      "Geared for serious gaming and high-durability daily multitasking. Features military-grade standard testing, 144Hz IPS display, and comprehensive cooling system.",
  },
  {
    id: "dell-inspiron-147440",
    name: "DELL INSPIRON 14 7440 LAPTOP",
    brand: "Dell",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["Intel Core Processor", "14.0\" FHD+ 16:10", "16GB LPDDR5", "512GB SSD", "Windows 11 + MSO"],
    fullSpecs: {
      "Series": "Inspiron 14 7000 Series (7440)",
      "Display": "14.0-inch FHD+ (1920x1200) Anti-Glare 250nits Narrow Border",
      "Memory": "16GB High-Speed RAM",
      "Storage": "512GB M.2 PCIe NVMe Solid State Drive",
      "Chassis": "Premium Anodized Aluminum Sleek Design",
      "Keyboard": "Backlit Keyboard with Fingerprint Reader",
      "Software": "Windows 11 Home + MS Office Home & Student 2021",
      "Audio": "Waves MaxxAudio Pro Stereo Speakers",
    },
    price: 58990,
    mrp: 69990,
    tab: "hot",
    rating: 5,
    reviewCount: 28,
    inStock: true,
    warranty: "1 Year Dell India On-Site Premium Support",
    highlights: [
      "Sleek 14-inch compact aluminum chassis with 16:10 productivity display",
      "FHD AI webcam with temporal noise reduction & dual mics",
      "ExpressCharge gets up to 80% charge in just 60 minutes",
    ],
    description:
      "Modern, portable executive laptop with 16:10 aspect ratio for enhanced screen real estate. Built with sleek aluminum finish and exceptional battery stamina.",
  },
  {
    id: "dell-inspiron-15-3511",
    name: "DELL INSPIRON 15-3511 LAPTOP (I5-11/8/512/W11H/MSO/S)",
    brand: "Dell",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["Intel Core i5-11th Gen", "8GB RAM", "512GB NVMe SSD", "15.6\" FHD", "Win 11 + MS Office", "Silver"],
    fullSpecs: {
      "Model": "Inspiron 15 3511 (Silver)",
      "Processor": "Intel Core i5-1135G7 (Up to 4.2 GHz, 8MB Cache)",
      "RAM": "8GB DDR4 (Expandable to 16GB)",
      "Storage": "512GB M.2 PCIe NVMe SSD",
      "Display": "15.6-inch FHD (1920x1080) Anti-Glare LED Narrow Border",
      "Operating System": "Windows 11 Home Single Language",
      "Productivity Software": "Microsoft Office Home & Student 2021",
      "Lift Hinge": "Ergonomic lift hinge for typing comfort & airflow",
      "Color": "Platinum Silver Finish",
    },
    price: 46990,
    mrp: 56990,
    tab: "hot",
    rating: 5,
    reviewCount: 39,
    inStock: true,
    warranty: "1 Year Dell Onsite Hardware Service",
    highlights: [
      "Powered by Intel Core i5 with 512GB superfast SSD storage",
      "Pre-loaded with genuine lifetime Windows 11 & Microsoft Office 2021",
      "Ergonomic lift hinge design props up keyboard for effortless typing",
    ],
    description:
      "A proven workhorse for students, professionals, and home business users with full numpad, crisp 15.6\" anti-glare display, and genuine Microsoft Office suite.",
  },
  {
    id: "hp-250-g9",
    name: "HP 250 G9 LAPTOP (I3-12/8/512/DOS/SILVER/15.6/1YR)",
    brand: "HP",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["Intel Core i3-12th Gen", "8GB DDR4", "512GB SSD", "15.6\" HD/FHD", "DOS/FreeOS", "Asteroid Silver"],
    fullSpecs: {
      "Series": "HP 250 G9 Commercial Notebook",
      "Processor": "Intel Core i3-1215U (6 Cores, 8 Threads, up to 4.4 GHz)",
      "RAM": "8GB DDR4-3200 MHz RAM",
      "Storage": "512GB PCIe NVMe Value SSD",
      "Display": "15.6-inch Narrow bezel, anti-glare, 250 nits",
      "OS": "FreeDOS 3.0 (OS Installation Assistance Available)",
      "Color": "Asteroid Silver",
      "Weight": "Starting at 1.74 kg",
      "Ports": "1x USB Type-C, 2x USB Type-A, 1x HDMI 1.4b, 1x RJ-45 LAN",
    },
    price: 31990,
    mrp: 38990,
    tab: "enterprise",
    rating: 4,
    reviewCount: 31,
    inStock: true,
    warranty: "1 Year HP Commercial Onsite Warranty",
    highlights: [
      "Cost-effective commercial laptop with 12th Gen 6-Core processor",
      "Built-in Gigabit RJ-45 Ethernet port for reliable office networking",
      "Slim, lightweight chassis with thin bezel display",
    ],
    description:
      "Budget-friendly commercial laptop designed for business productivity, office desks, accounting software, and billing workstations with complete I/O port selection.",
  },
  {
    id: "hp-notebook-15-fd0465tu",
    name: "HP NOTEBOOK 15-FD0465TU LAPTOP",
    brand: "HP",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["Intel Core Processor", "8GB DDR4", "512GB SSD", "15.6\" FHD Micro-Edge", "Win 11 + MSO", "Natural Silver"],
    fullSpecs: {
      "Model Number": "15-FD0465TU",
      "Processor": "Intel Core Processor (High-efficiency Performance)",
      "Memory": "8GB DDR4 RAM",
      "Storage": "512GB PCIe NVMe M.2 SSD",
      "Display": "15.6-inch FHD (1920x1080) Micro-edge Anti-glare",
      "Camera": "HP True Vision 720p HD camera with temporal noise reduction",
      "OS & Office": "Windows 11 Home + MS Office Home & Student",
      "Battery": "3-cell 41 Wh Li-ion with Fast Charge Support",
    },
    price: 39990,
    mrp: 48990,
    tab: "new",
    rating: 5,
    reviewCount: 24,
    inStock: true,
    warranty: "1 Year HP India On-Site Warranty",
    highlights: [
      "Micro-edge anti-glare 15.6\" FHD screen with vibrant clarity",
      "HP Fast Charge powers up from 0 to 50% in approximately 45 minutes",
      "Dual array digital microphones with advanced noise cancellation",
    ],
    description:
      "Reliable, stylish daily driver featuring micro-edge display, smooth performance, fast boot times, and HP True Vision HD camera for video calls and remote work.",
  },
  {
    id: "hp-victus-15-fa1312tx",
    name: "HP VICTUS 15-FA1312TX GAMING LAPTOP",
    brand: "HP",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["Intel Core i5-13th Gen", "NVIDIA GeForce RTX GPU", "16GB DDR4", "512GB SSD", "15.6\" 144Hz FHD", "Mica Silver"],
    fullSpecs: {
      "Model": "Victus by HP Gaming Laptop 15-fa1312TX",
      "Processor": "Intel Core i5-13420H (Up to 4.6 GHz, 8 Cores, 12 Threads)",
      "Graphics": "NVIDIA GeForce RTX Dedicated Gaming Graphics",
      "Display": "15.6\" FHD (1920x1080) 144Hz 9ms IPS Micro-edge Anti-glare 250 nits",
      "Memory": "16GB DDR4-3200 MHz RAM",
      "Storage": "512GB PCIe Gen4 NVMe TLC M.2 SSD",
      "Audio": "Audio by B&O with Dual Speakers and HP Audio Boost",
      "Thermal System": "Updated thermal design with dual exhausts & wide airflow",
      "Color": "Mica Silver with Dark Chrome Logo",
    },
    price: 66990,
    mrp: 79990,
    tab: "gaming",
    rating: 5,
    reviewCount: 47,
    inStock: true,
    warranty: "1 Year HP Onsite Premium Gaming Warranty",
    highlights: [
      "13th Gen Intel Core i5 + NVIDIA GeForce RTX for AAA gaming & streaming",
      "144Hz high-refresh rate IPS screen with 9ms response time",
      "Tuned by B&O audio with OMEN Gaming Hub performance management",
    ],
    description:
      "Designed for high-FPS gaming and heavy 3D creative tasks. Packed with 13th Gen Intel Core processor, discrete NVIDIA RTX graphics, and an advanced cooling thermal solution.",
  },
  {
    id: "lenovo-v15-g4-amn",
    name: "LENOVO V15 G4 AMN LAPTOP",
    brand: "Lenovo",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["AMD Ryzen 3 / Athlon", "8GB LPDDR5", "512GB NVMe SSD", "15.6\" FHD Anti-Glare", "Business Black"],
    fullSpecs: {
      "Model Series": "Lenovo V15 G4 AMN (Business Edition)",
      "Processor": "AMD Ryzen 7000 Series Processor",
      "Memory": "8GB LPDDR5-5500 High-Speed RAM",
      "Storage": "512GB SSD M.2 2242 PCIe 4.0x4 NVMe",
      "Display": "15.6-inch FHD (1920x1080) TN 250nits Anti-glare",
      "Security": "Firmware TPM 2.0 & Camera Privacy Shutter",
      "Weight": "1.65 kg (Lightweight Portable)",
      "Battery": "Integrated 38Wh with Rapid Charge support",
    },
    price: 28990,
    mrp: 35990,
    tab: "enterprise",
    rating: 4,
    reviewCount: 22,
    inStock: true,
    warranty: "1 Year Lenovo Commercial Depot/Onsite Warranty",
    highlights: [
      "Ultra-modern LPDDR5 memory speed for snappy everyday business work",
      "Physical webcam privacy shutter for enhanced security",
      "Spill-resistant keyboard and MIL-SPEC durable construction",
    ],
    description:
      "High-value business notebook engineered for SMBs, schools, retail shops, and remote workers with AMD 7000-series efficiency and fast LPDDR5 RAM.",
  },
  {
    id: "lenovo-v15-gen3-iap",
    name: "LENOVO V15 GEN3 IAP LAPTOP",
    brand: "Lenovo",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["Intel Core i3-12th Gen", "8GB DDR4 (Up to 16GB)", "512GB SSD", "15.6\" FHD", "Iron Grey"],
    fullSpecs: {
      "Model Series": "Lenovo V15 G3 IAP",
      "Processor": "Intel Core i3-1215U (6C / 8T, P-core 1.2 / 4.4GHz, E-core 0.9 / 3.3GHz)",
      "Graphics": "Integrated Intel UHD Graphics",
      "Memory": "8GB Soldered DDR4-3200 + 1 SO-DIMM Slot Available",
      "Storage": "512GB SSD M.2 PCIe NVMe",
      "Display": "15.6-inch FHD (1920x1080) Anti-glare 250nits",
      "Connectivity": "Wi-Fi 6, 11ax 2x2 + BT5.1, RJ-45 Gigabit LAN",
      "Security": "Camera Privacy Shutter, Kensington Nano Slot",
    },
    price: 33490,
    mrp: 41990,
    tab: "enterprise",
    rating: 5,
    reviewCount: 35,
    inStock: true,
    warranty: "1 Year Lenovo Official Onsite Warranty",
    highlights: [
      "12th Gen Intel 6-Core processor handles heavy spreadsheets & browser tabs",
      "Dual storage support (M.2 SSD + 2.5\" HDD bay) for massive expansions",
      "Wi-Fi 6 wireless speed and dedicated Gigabit Ethernet port",
    ],
    description:
      "Versatile office notebook delivering excellent compute power with Intel 12th Gen multi-core architecture, expandable memory, and enterprise-level durability.",
  },
  {
    id: "lenovo-adp-carepack-2yr",
    name: "LENOVO LAPTOP ADP CARE PACK - ADD 2YR",
    brand: "Lenovo",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    ],
    specs: ["+2 Years Extension", "Accidental Damage Protection (ADP)", "100% Genuine Parts", "Coimbatore Onsite Support"],
    fullSpecs: {
      "Plan Type": "Lenovo Official 2-Year Extended Warranty + ADP",
      "Coverage Period": "Additional 2 Years (Total 3 Years Peace of Mind)",
      "ADP Inclusions": "Accidental Drops, Liquid Spills, Electrical Surges, Screen Cracks",
      "Service Delivery": "On-site Authorized Technician Support",
      "Replacement Parts": "100% Genuine Brand OEM Components",
      "Transferability": "Linked directly to device serial number in official Lenovo database",
    },
    price: 3499,
    mrp: 5999,
    tab: "enterprise",
    rating: 5,
    reviewCount: 68,
    inStock: true,
    warranty: "2 Years Official Lenovo ADP Warranty Policy",
    highlights: [
      "Complete protection against accidental drops, liquid spills, and motherboard surges",
      "Zero deductible charges on genuine parts replacement",
      "Activated directly on your Lenovo laptop serial number within 24 hours",
    ],
    description:
      "Official Lenovo Accidental Damage Protection (ADP) Care Pack. Upgrades your laptop warranty by +2 Years with doorstep on-site repair for liquid spills, drops, and electrical damage.",
  },
];

// Interactive Custom PC Builder Catalog
export type BuilderPart = {
  id: string;
  name: string;
  brand: string;
  price: number;
  tdp: number; // in watts
  socket?: string;
  formFactor?: string;
  speed?: string;
  capacity?: string;
  tag?: string;
};

export type BuilderCategoryKey =
  "cpu" | "cooler" | "motherboard" | "gpu" | "ram" | "storage" | "psu" | "case";

export const BUILDER_CATALOG: Record<
  BuilderCategoryKey,
  { label: string; iconName: string; required: boolean; options: BuilderPart[] }
> = {
  cpu: {
    label: "Processor (CPU)",
    iconName: "Cpu",
    required: true,
    options: [
      {
        id: "cpu-1",
        name: "AMD Ryzen 5 5600X (6C/12T, 4.6GHz)",
        brand: "AMD",
        price: 12490,
        tdp: 65,
        socket: "AM4",
        tag: "Budget King",
      },
      {
        id: "cpu-2",
        name: "Intel Core i5 14400F (10C/16T, 4.7GHz)",
        brand: "Intel",
        price: 17990,
        tdp: 65,
        socket: "LGA1700",
        tag: "Popular All-Rounder",
      },
      {
        id: "cpu-3",
        name: "AMD Ryzen 5 7600X (6C/12T, 5.3GHz)",
        brand: "AMD",
        price: 19490,
        tdp: 105,
        socket: "AM5",
        tag: "DDR5 Entry",
      },
      {
        id: "cpu-4",
        name: "AMD Ryzen 7 7800X3D (8C/16T, 3D V-Cache)",
        brand: "AMD",
        price: 34990,
        tdp: 120,
        socket: "AM5",
        tag: "Top Gaming Pick",
      },
      {
        id: "cpu-5",
        name: "Intel Core Ultra 7 265K (20C/20T, AI NPU)",
        brand: "Intel",
        price: 38990,
        tdp: 125,
        socket: "LGA1851",
        tag: "Creator & AI",
      },
      {
        id: "cpu-6",
        name: "AMD Ryzen 9 9950X (16C/32T, 5.7GHz)",
        brand: "AMD",
        price: 59990,
        tdp: 170,
        socket: "AM5",
        tag: "Workstation Beast",
      },
    ],
  },
  motherboard: {
    label: "Motherboard",
    iconName: "CircuitBoard",
    required: true,
    options: [
      {
        id: "mb-1",
        name: "MSI B550M PRO-VDH WiFi",
        brand: "MSI",
        price: 8990,
        tdp: 20,
        socket: "AM4",
        formFactor: "mATX",
        tag: "AM4 Value",
      },
      {
        id: "mb-2",
        name: "ASUS Prime B760M-A WiFi DDR5",
        brand: "ASUS",
        price: 13990,
        tdp: 25,
        socket: "LGA1700",
        formFactor: "mATX",
        tag: "Intel Gen14",
      },
      {
        id: "mb-3",
        name: "MSI B650M Gaming Plus WiFi",
        brand: "MSI",
        price: 14490,
        tdp: 25,
        socket: "AM5",
        formFactor: "mATX",
        tag: "AM5 Value",
      },
      {
        id: "mb-4",
        name: "ASUS TUF Gaming B650-PLUS WiFi",
        brand: "ASUS",
        price: 17490,
        tdp: 30,
        socket: "AM5",
        formFactor: "ATX",
        tag: "Enthusiast AM5",
      },
      {
        id: "mb-5",
        name: "Gigabyte Z890 AORUS Elite WiFi",
        brand: "Gigabyte",
        price: 28990,
        tdp: 35,
        socket: "LGA1851",
        formFactor: "ATX",
        tag: "Core Ultra Flagship",
      },
      {
        id: "mb-6",
        name: "ASRock X870 Pro RS WiFi",
        brand: "ASRock",
        price: 23990,
        tdp: 30,
        socket: "AM5",
        formFactor: "ATX",
        tag: "PCIe 5.0 AM5",
      },
    ],
  },
  gpu: {
    label: "Graphics Card (GPU)",
    iconName: "MonitorSmartphone",
    required: true,
    options: [
      {
        id: "gpu-0",
        name: "Integrated Graphics (No Dedicated GPU)",
        brand: "Default",
        price: 0,
        tdp: 0,
        tag: "Office / Casual",
      },
      {
        id: "gpu-1",
        name: "ZOTAC GeForce RTX 3050 6GB GDDR6",
        brand: "ZOTAC",
        price: 16990,
        tdp: 70,
        tag: "1080p Entry",
      },
      {
        id: "gpu-2",
        name: "ZOTAC GeForce RTX 4060 8GB Twin Edge",
        brand: "ZOTAC",
        price: 27990,
        tdp: 115,
        tag: "1080p Ultra High-FPS",
      },
      {
        id: "gpu-3",
        name: "Gigabyte GeForce RTX 4070 SUPER 12GB",
        brand: "Gigabyte",
        price: 62990,
        tdp: 220,
        tag: "1440p Ray Tracing Beast",
      },
      {
        id: "gpu-4",
        name: "MSI GeForce RTX 5070 Ti 16GB Trio",
        brand: "MSI",
        price: 82990,
        tdp: 285,
        tag: "4K & AI Next-Gen",
      },
      {
        id: "gpu-5",
        name: "ASUS ROG Strix RTX 5080 16GB GDDR7",
        brand: "ASUS",
        price: 124990,
        tdp: 360,
        tag: "Extreme 4K / VR",
      },
    ],
  },
  ram: {
    label: "Memory (RAM)",
    iconName: "MemoryStick",
    required: true,
    options: [
      {
        id: "ram-1",
        name: "16GB (1x16GB) Kingston Fury DDR4 3200MHz",
        brand: "Kingston",
        price: 3190,
        tdp: 5,
        capacity: "16GB",
        tag: "DDR4 Value",
      },
      {
        id: "ram-2",
        name: "32GB (2x16GB) Corsair Vengeance DDR4 3600",
        brand: "Corsair",
        price: 6490,
        tdp: 8,
        capacity: "32GB",
        tag: "DDR4 Dual Channel",
      },
      {
        id: "ram-3",
        name: "16GB (1x16GB) Crucial Pro DDR5 5600MHz",
        brand: "Crucial",
        price: 4490,
        tdp: 6,
        capacity: "16GB",
        tag: "DDR5 Standard",
      },
      {
        id: "ram-4",
        name: "32GB (2x16GB) Corsair Vengeance RGB DDR5 6000",
        brand: "Corsair",
        price: 10499,
        tdp: 10,
        capacity: "32GB",
        tag: "Sweet Spot EXPO",
      },
      {
        id: "ram-5",
        name: "64GB (2x32GB) G.Skill Trident Z5 RGB DDR5 6400",
        brand: "G.Skill",
        price: 21990,
        tdp: 15,
        capacity: "64GB",
        tag: "Creator & 3D Max",
      },
    ],
  },
  storage: {
    label: "Primary Storage (M.2 NVMe SSD)",
    iconName: "HardDrive",
    required: true,
    options: [
      {
        id: "ssd-1",
        name: "500GB Crucial P3 Plus PCIe 4.0 NVMe (5000 MB/s)",
        brand: "Crucial",
        price: 3490,
        tdp: 4,
        capacity: "500GB",
        tag: "Budget Fast",
      },
      {
        id: "ssd-2",
        name: "1TB Kingston KC3000 PCIe 4.0 (7000 MB/s)",
        brand: "Kingston",
        price: 6990,
        tdp: 6,
        capacity: "1TB",
        tag: "High Speed 1TB",
      },
      {
        id: "ssd-3",
        name: "1TB WD Black SN850X Gaming NVMe (7300 MB/s)",
        brand: "Western Digital",
        price: 8490,
        tdp: 7,
        capacity: "1TB",
        tag: "Hardcore Gaming",
      },
      {
        id: "ssd-4",
        name: "2TB Samsung 990 PRO Gen4 NVMe (7450 MB/s)",
        brand: "Samsung",
        price: 14990,
        tdp: 8,
        capacity: "2TB",
        tag: "Flagship 2TB",
      },
      {
        id: "ssd-5",
        name: "4TB Crucial T500 PCIe 4.0 NVMe",
        brand: "Crucial",
        price: 28990,
        tdp: 9,
        capacity: "4TB",
        tag: "Huge Storage",
      },
    ],
  },
  cooler: {
    label: "CPU Cooler",
    iconName: "Fan",
    required: true,
    options: [
      {
        id: "clr-1",
        name: "Stock Air Cooler (Included with CPU)",
        brand: "OEM",
        price: 0,
        tdp: 0,
        tag: "Standard Free",
      },
      {
        id: "clr-2",
        name: "DeepCool AG400 ARGB Single Tower (220W TDP)",
        brand: "DeepCool",
        price: 1990,
        tdp: 5,
        tag: "Best Air Value",
      },
      {
        id: "clr-3",
        name: "Thermalright Peerless Assassin 120 SE Dual Tower",
        brand: "Thermalright",
        price: 3990,
        tdp: 8,
        tag: "Heavy Duty Air",
      },
      {
        id: "clr-4",
        name: "DeepCool LE520 240mm ARGB Liquid AIO",
        brand: "DeepCool",
        price: 5490,
        tdp: 12,
        tag: "240mm Liquid",
      },
      {
        id: "clr-5",
        name: "Corsair iCUE LINK H150i 360mm ARGB Liquid AIO",
        brand: "Corsair",
        price: 16490,
        tdp: 18,
        tag: "360mm Premium AIO",
      },
    ],
  },
  psu: {
    label: "Power Supply Unit (SMPS)",
    iconName: "Zap",
    required: true,
    options: [
      {
        id: "psu-1",
        name: "DeepCool PK550D 550W 80+ Bronze",
        brand: "DeepCool",
        price: 3390,
        tdp: 550,
        tag: "550W Bronze",
      },
      {
        id: "psu-2",
        name: "Corsair CV650 650W 80+ Bronze Certified",
        brand: "Corsair",
        price: 4790,
        tdp: 650,
        tag: "650W Reliable",
      },
      {
        id: "psu-3",
        name: "MSI MAG A750GL 750W 80+ Gold PCIe 5.0 Fully Modular",
        brand: "MSI",
        price: 7990,
        tdp: 750,
        tag: "750W Gold ATX 3.0",
      },
      {
        id: "psu-4",
        name: "Corsair RM850e 850W 80+ Gold ATX 3.0 Full Modular",
        brand: "Corsair",
        price: 10490,
        tdp: 850,
        tag: "850W Gold Pro",
      },
      {
        id: "psu-5",
        name: "Corsair RM1000x 1000W 80+ Gold Fully Modular",
        brand: "Corsair",
        price: 16490,
        tdp: 1000,
        tag: "1000W Beast",
      },
    ],
  },
  case: {
    label: "Cabinet / PC Case",
    iconName: "Box",
    required: true,
    options: [
      {
        id: "case-1",
        name: "Ant Esports ICE-112 Mid-Tower Mesh (4x RGB Fans)",
        brand: "Ant Esports",
        price: 2990,
        tdp: 0,
        tag: "High Airflow Value",
      },
      {
        id: "case-2",
        name: "Montech Air 903 MAX (4x 140mm High-CFM Fans)",
        brand: "Montech",
        price: 5790,
        tdp: 0,
        tag: "Top Rated Airflow",
      },
      {
        id: "case-3",
        name: "NZXT H5 Flow Compact ATX Glass (Dual Fan)",
        brand: "NZXT",
        price: 7490,
        tdp: 0,
        tag: "Clean Aesthetic",
      },
      {
        id: "case-4",
        name: "Lian Li O11 Dynamic EVO Panoramic Dual-Chamber",
        brand: "Lian Li",
        price: 13990,
        tdp: 0,
        tag: "Showcase Glass",
      },
      {
        id: "case-5",
        name: "Corsair 5000D AIRFLOW Tempered Glass",
        brand: "Corsair",
        price: 14990,
        tdp: 0,
        tag: "Full-Size Modding",
      },
    ],
  },
};

export type BuildPreset = {
  id: string;
  name: string;
  badge: string;
  description: string;
  targetResolution: string;
  approxTotal: number;
  parts: Record<BuilderCategoryKey, string>;
  fpsData: { game: string; fps: number }[];
};

export const BUILD_PRESETS: BuildPreset[] = [
  {
    id: "preset-esports",
    name: "1080p Esports Starter",
    badge: "Budget Esports Beast",
    description:
      "Flawless 1080p high-refresh gaming for Valorant, CS2, GTA V, and everyday university coding/design.",
    targetResolution: "1080p Ultra (120+ FPS)",
    approxTotal: 49990,
    parts: {
      cpu: "cpu-1",
      motherboard: "mb-1",
      gpu: "gpu-1",
      ram: "ram-1",
      storage: "ssd-1",
      cooler: "clr-1",
      psu: "psu-1",
      case: "case-1",
    },
    fpsData: [
      { game: "Valorant (1080p High)", fps: 280 },
      { game: "Counter-Strike 2 (1080p)", fps: 165 },
      { game: "GTA V (1080p Very High)", fps: 110 },
      { game: "Cyberpunk 2077 (1080p Med)", fps: 65 },
    ],
  },
  {
    id: "preset-1440p",
    name: "1440p High-FPS Dominator",
    badge: "Most Popular Rig",
    description:
      "The sweet-spot DDR5 setup for butter-smooth 1440p gaming with DLSS 3.5 frame generation and video streaming.",
    targetResolution: "1440p Ultra (100+ FPS)",
    approxTotal: 96990,
    parts: {
      cpu: "cpu-3",
      motherboard: "mb-3",
      gpu: "gpu-2",
      ram: "ram-4",
      storage: "ssd-2",
      cooler: "clr-2",
      psu: "psu-2",
      case: "case-2",
    },
    fpsData: [
      { game: "Cyberpunk 2077 (1440p Ray Tracing)", fps: 95 },
      { game: "Call of Duty: Warzone (1440p)", fps: 145 },
      { game: "Black Myth: Wukong (1440p High)", fps: 88 },
      { game: "Valorant (1440p Max)", fps: 420 },
    ],
  },
  {
    id: "preset-4k-enthusiast",
    name: "4K Ultra Gaming & AI Rig",
    badge: "Ultimate Enthusiast",
    description:
      "Top-tier gaming processor paired with RTX 5070 Ti 16GB, liquid cooling, and ultra-fast PCIe Gen4 storage.",
    targetResolution: "4K UHD Max (90+ FPS)",
    approxTotal: 184990,
    parts: {
      cpu: "cpu-4",
      motherboard: "mb-4",
      gpu: "gpu-4",
      ram: "ram-4",
      storage: "ssd-4",
      cooler: "clr-5",
      psu: "psu-4",
      case: "case-4",
    },
    fpsData: [
      { game: "Cyberpunk 2077 (4K Path Tracing DLSS)", fps: 112 },
      { game: "Forza Horizon 5 (4K Extreme)", fps: 145 },
      { game: "Red Dead Redemption 2 (4K Ultra)", fps: 108 },
      { game: "Local AI (Stable Diffusion XL)", fps: 28 },
    ],
  },
  {
    id: "preset-workstation",
    name: "Architect & 3D CAD Workstation",
    badge: "Professional Creator",
    description:
      "Equipped for Revit, AutoCAD, SolidWorks, Unreal Engine 5, Blender 4K render farms, and heavy multitasking.",
    targetResolution: "Multi-Monitor 4K Rendering",
    approxTotal: 198990,
    parts: {
      cpu: "cpu-5",
      motherboard: "mb-5",
      gpu: "gpu-3",
      ram: "ram-5",
      storage: "ssd-4",
      cooler: "clr-5",
      psu: "psu-4",
      case: "case-5",
    },
    fpsData: [
      { game: "Blender 4K BMW Render", fps: 190 },
      { game: "Premiere Pro 4K 10-bit Timeline", fps: 120 },
      { game: "Unreal Engine 5 Real-Time Viewport", fps: 85 },
      { game: "AutoCAD 3D Orbit & Pan", fps: 165 },
    ],
  },
];

export type Service = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  points: string[];
  brands: string;
  startingPrice: string;
};

export const SERVICES: Service[] = [
  {
    id: "pc-laptop",
    icon: "Laptop",
    title: "Personal Computers & Laptops",
    subtitle: "Desktops, Workstations & Gaming Upgrades",
    desc: "Genuine laptops, customized high-performance desktop towers, RAM/SSD speed-up upgrades, and OS migrations.",
    points: [
      "Custom gaming rigs with cable management & stress tests",
      "Business & student laptops from HP, Dell, ASUS, Acer",
      "Instant RAM (DDR4/DDR5) and NVMe SSD speed boosts",
      "Clean OS installation, drivers, and software tune-up",
    ],
    brands: "HP · Dell · Lenovo · ASUS · Acer",
    startingPrice: "Diagnostics from ₹299",
  },
  {
    id: "networking",
    icon: "Network",
    title: "Enterprise Networking Solutions",
    subtitle: "Structured Cabling & Cloud Wi-Fi Rollouts",
    desc: "Robust local area networks, Cat6/Cat6A structured cabling, server racks, managed PoE switches, and multi-floor Wi-Fi.",
    points: [
      "Cat6/Fiber structured cabling with fluke testing",
      "Managed PoE switches & Multi-WAN firewall routers",
      "Seamless roaming enterprise Wi-Fi (UniFi / Ruijie)",
      "Server rack deployment, patch cord dressing & tagging",
    ],
    brands: "D-Link · Ubiquiti UniFi · Ruijie · Cisco · Schneider",
    startingPrice: "Site Survey Free across Coimbatore",
  },
  {
    id: "cctv",
    icon: "Cctv",
    title: "CCTV Surveillance & Security",
    subtitle: "24/7 Color Night-Vision & Mobile Streaming",
    desc: "High-definition camera setups for factories, retail stores, apartments, and private residences with remote phone viewing.",
    points: [
      "4MP / 4K ColorVu IP cameras with crystal night vision",
      "8 / 16 / 32 Channel NVR / DVR with cloud backup",
      "Live remote mobile streaming on iOS & Android apps",
      "Annual Maintenance Contracts (AMC) with quick response",
    ],
    brands: "Hikvision · CP Plus · Prama · Dahua · EZVIZ",
    startingPrice: "4-Camera Kit from ₹14,990",
  },
  {
    id: "biometrics",
    icon: "Fingerprint",
    title: "Biometrics & Access Control",
    subtitle: "Attendance Automation & Smart Door Locks",
    desc: "Touchless face-recognition attendance machines, biometric door controllers, electromagnetic locks, and payroll integration.",
    points: [
      "Face recognition, fingerprint & RFID smart card readers",
      "Direct integration with HR & payroll software",
      "Magnetic door access controllers for server rooms & labs",
      "Video door phone intercoms for offices & villas",
    ],
    brands: "eSSL · Realtime · Godrej · ZKTeco",
    startingPrice: "Biometric Device from ₹4,490",
  },
  {
    id: "printers",
    icon: "Printer",
    title: "Printers, Scanners & Consumables",
    subtitle: "Ink Tank, Laser Multifunction & Barcode Hardware",
    desc: "Cost-effective ink tank and heavy-duty commercial laser printers, high-resolution document scanners, and genuine supplies.",
    points: [
      "Low per-page cost EcoTank & MegaTank MFP printers",
      "High-speed monochrome & color laser printers",
      "Barcode printers & handheld scanners for retail billing",
      "Original ink bottles, laser toners, and cartridge refills",
    ],
    brands: "Epson · Canon · Brother · HP · TVS-E",
    startingPrice: "Ink Tank MFPs from ₹10,990",
  },
  {
    id: "software",
    icon: "Calculator",
    title: "Accounting & ERP Business Software",
    subtitle: "GST Invoicing, Inventory & Multi-Branch Sync",
    desc: "Authorized partner for Busy Accounting, Tally Prime, and Microsoft licenses with complete onboarding and GST setup.",
    points: [
      "Busy Accounting & Tally Prime authorized licenses",
      "GST e-way bill & e-invoicing ready setup",
      "Data migration from legacy systems with zero data loss",
      "Staff operator training & annual software support",
    ],
    brands: "Busy · Tally · Microsoft 365 · Quick Heal",
    startingPrice: "Single User License from ₹7,200",
  },
  {
    id: "chip-level",
    icon: "Wrench",
    title: "In-House Chip-Level Repair Lab",
    subtitle: "BGA Rework, Short Tracing & Board Micro-Soldering",
    desc: "Specialized clean lab with digital microscopes, IR BGA rework stations, and oscilloscope for motherboard and laptop repairs.",
    points: [
      "Dead laptop / desktop motherboard trace diagnosis",
      "BGA chip reballing for GPUs and processor chipsets",
      "Broken display hinge rebuilding & screen replacement",
      "Short-circuit repairs, capacitor swaps & BIOS reflashing",
    ],
    brands: "All Major Laptop & Motherboard Brands",
    startingPrice: "Chip Inspection from ₹499",
  },
];

export const BRANDS = [
  "Intel",
  "AMD",
  "ASUS",
  "MSI",
  "Gigabyte",
  "ZOTAC",
  "Corsair",
  "Hikvision",
  "D-Link",
  "Epson",
  "Western Digital",
  "Samsung",
  "Crucial",
  "Ubiquiti",
  "eSSL",
];

export const SERVICE_TYPES = [
  "Store Order / Components",
  "Custom Gaming PC Build",
  "Networking Setup (Office / Commercial)",
  "CCTV Surveillance Installation",
  "Chip-Level Motherboard / Laptop Repair",
  "Annual Maintenance Contract (AMC)",
  "Biometric Attendance & Access Control",
  "Printers & Consumables Supply",
];

// Customer Testimonials
export type Review = {
  name: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  tag: string;
};

export const REVIEWS: Review[] = [
  {
    name: "Karthik Subramanian",
    role: "Software Architect, Peelamedu, Coimbatore",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Ordered a high-end Ryzen 7 7800X3D + RTX 4070 SUPER build. The team at ICS assembled it flawlessly with top-tier cable management. They stress-tested it for 24 hours before handing it over. Best PC shop in Coimbatore hands down!",
    tag: "Custom PC Build",
  },
  {
    name: "Dr. Anand Natarajan",
    role: "Managing Director, Textile Mill, Tiruppur",
    rating: 5,
    date: "1 month ago",
    comment:
      "ICS Computer Store setup our 3-floor office network with 16 Hikvision ColorVu cameras and D-Link 24-Port PoE switches. Structured cabling is neat and their mobile viewing setup works seamlessly.",
    tag: "Networking & CCTV",
  },
  {
    name: "Suresh Babu",
    role: "Graphic Designer & Video Creator, RS Puram",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "My Dell gaming laptop motherboard was declared dead by the official service center. ICS Computer Store diagnosed a shorted capacitor and fixed it at their chip-level lab in just 24 hours at a fraction of the cost.",
    tag: "Chip-Level Repair",
  },
  {
    name: "Priyanka Chandrasekar",
    role: "Operations Head, Logistics Firm, Gandhipuram",
    rating: 5,
    date: "2 months ago",
    comment:
      "We rely on ICS for all our office IT supplies, printer toner refills, and biometrics. Always prompt, 100% genuine tax invoices, and friendly technicians. Truly 18+ years of trust.",
    tag: "Enterprise IT AMC",
  },
];

// Repair tracker milestones simulation
export type RepairStep = {
  title: string;
  desc: string;
  completed: boolean;
  current: boolean;
};

export const SAMPLE_TICKETS: Record<
  string,
  {
    id: string;
    customer: string;
    device: string;
    issue: string;
    status: string;
    date: string;
    estimatedDelivery: string;
    steps: RepairStep[];
  }
> = {
  "ICS-8821": {
    id: "ICS-8821",
    customer: "Vignesh R.",
    device: "ASUS ROG Zephyrus G14 (2023)",
    issue: "No Display / Power LED Blinking / Short Circuit",
    status: "In Progress · Micro-Soldering Lab",
    date: "Today, 10:15 AM",
    estimatedDelivery: "Tomorrow, 4:00 PM",
    steps: [
      {
        title: "Device Checked-In",
        desc: "Inspection completed, ticket generated at Gandhipuram store",
        completed: true,
        current: false,
      },
      {
        title: "Chip-Level Lab Diagnostics",
        desc: "Motherboard traced under thermal microscope; 19V rail short identified",
        completed: true,
        current: false,
      },
      {
        title: "Component Replacement",
        desc: "Replacing shorted MOSFET & high-frequency decoupling capacitor",
        completed: false,
        current: true,
      },
      {
        title: "Thermal Repasting & BIOS Test",
        desc: "Applying Arctic MX-6 paste and running BIOS diagnostic loop",
        completed: false,
        current: false,
      },
      {
        title: "24-Hr Stress & QA Ready",
        desc: "3DMark stress test pass; notified customer for store pickup",
        completed: false,
        current: false,
      },
    ],
  },
  "ICS-8822": {
    id: "ICS-8822",
    customer: "Kavitha M.",
    device: "Lenovo ThinkPad E14 Gen 4",
    issue: "Broken Left Display Hinge & Bezel Crack",
    status: "Ready for Pickup",
    date: "Yesterday, 2:30 PM",
    estimatedDelivery: "Ready Now",
    steps: [
      {
        title: "Device Checked-In",
        desc: "Physical condition documented with customer signature",
        completed: true,
        current: false,
      },
      {
        title: "Structural Disassembly",
        desc: "Display panel extracted carefully without tearing ribbon cable",
        completed: true,
        current: false,
      },
      {
        title: "Hinge Reinforcement",
        desc: "Brass anchor inserts embedded with high-strength industrial bond",
        completed: true,
        current: false,
      },
      {
        title: "Reassembly & Torque Tuning",
        desc: "Smooth opening torque tested 50+ times without chassis strain",
        completed: true,
        current: false,
      },
      {
        title: "Quality Check & Ready",
        desc: "Cleaned, sanitized, and packed for customer handover",
        completed: true,
        current: false,
      },
    ],
  },
};
