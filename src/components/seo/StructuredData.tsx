import { CONTACT } from "@/lib/site-data";

/**
 * All JSON-LD structured data for SEO — Google, Bing, and AI chatbots.
 * Renders multiple <script type="application/ld+json"> blocks.
 */

const SITE_URL = "https://icsstore.in";
const SITE_NAME = "ICS Computer Store";
const LOGO_URL = `${SITE_URL}/ics-logo.svg`;

/* ── LocalBusiness (ComputerStore) ────────────────────────────── */
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "ComputerStore",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  alternateName: "Infant Computer Store",
  description:
    "Coimbatore's premier computer store since 2007. Custom gaming PC builds, enterprise Cat6 networking, 4K CCTV surveillance, biometric access control, and in-house chip-level motherboard repair.",
  url: SITE_URL,
  logo: LOGO_URL,
  image: LOGO_URL,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  foundingDate: "2007",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Credit Card, Debit Card, Net Banking, EMI",
  address: {
    "@type": "PostalAddress",
    streetAddress: "240/A2B, Sarada Mill Rd, near Koushikha Hospital",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    postalCode: "641023",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 11.0004,
    longitude: 76.9559,
  },
  hasMap: CONTACT.mapUrl,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "20:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "132",
    bestRating: "5",
    worstRating: "1",
  },
  areaServed: [
    { "@type": "City", name: "Coimbatore" },
    { "@type": "City", name: "Tiruppur" },
    { "@type": "State", name: "Tamil Nadu" },
  ],
  makesOffer: [
    "Custom Gaming PC Assembly",
    "Enterprise Networking & Structured Cabling",
    "CCTV Surveillance Installation",
    "Chip-Level Motherboard Repair",
    "Biometric Access Control Systems",
    "IT Hardware & Software Sales",
    "Printer & Scanner Supply",
    "Accounting Software Licensing",
  ],
  sameAs: [
    // Add actual social profile URLs here when available
  ],
  keywords:
    "computer store coimbatore, gaming pc coimbatore, custom pc build coimbatore, cctv installation coimbatore, networking services coimbatore, laptop repair coimbatore, motherboard repair coimbatore, RTX 5070 coimbatore, RTX 5080 coimbatore",
};

/* ── Organization ─────────────────────────────────────────────── */
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "ICS Technologies",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 512,
    height: 512,
  },
  foundingDate: "2007",
  foundingLocation: {
    "@type": "Place",
    name: "Coimbatore, Tamil Nadu, India",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: CONTACT.phone,
    contactType: "customer service",
    availableLanguage: ["English", "Tamil"],
    areaServed: "IN",
  },
  sameAs: [],
};

/* ── WebSite (enables sitelinks search box) ───────────────────── */
const webSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/* ── BreadcrumbList ───────────────────────────────────────────── */
const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Computer Components",
      item: `${SITE_URL}/#products`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Custom PC Builder",
      item: `${SITE_URL}/#builder`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Networking & CCTV Services",
      item: `${SITE_URL}/#services`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Network Cost Estimator",
      item: `${SITE_URL}/#estimator`,
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Chip-Level Repair Lab",
      item: `${SITE_URL}/#repair-lab`,
    },
    {
      "@type": "ListItem",
      position: 7,
      name: "Store Info & Reviews",
      item: `${SITE_URL}/#store-info`,
    },
  ],
};

/* ── FAQPage (triggers "People Also Ask" rich snippet) ────────── */
const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is ICS Computer Store located in Coimbatore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ICS Computer Store is located at 240/A2B, Sarada Mill Rd, near Koushikha Hospital, Podanur, Coimbatore, Tamil Nadu 641023. We are open Monday to Saturday, 9:30 AM to 8:00 PM. You can reach us at +91 96266 44496.",
      },
    },
    {
      "@type": "Question",
      name: "Does ICS Computer Store offer custom gaming PC builds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer fully custom gaming PC builds with free assembly, professional cable management, and 24-hour AIDA64 & 3DMark stress testing. We carry the latest RTX 50-Series GPUs, Ryzen 9000 & Intel 14th/15th Gen processors, and all major brands like ASUS, MSI, Corsair, and Samsung.",
      },
    },
    {
      "@type": "Question",
      name: "Does ICS provide CCTV installation in Coimbatore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We provide end-to-end 4K CCTV surveillance installation using Hikvision, CP Plus, and Dahua cameras. Our packages start from ₹14,990 for a 4-camera kit with NVR, and include free site surveys across Coimbatore.",
      },
    },
    {
      "@type": "Question",
      name: "What networking services does ICS Computer Store offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide enterprise-grade Cat6/Cat6A structured cabling, server rack deployment, managed PoE switches, multi-WAN firewall routers, and seamless enterprise Wi-Fi using Ubiquiti UniFi and Ruijie. Free site surveys are available across Coimbatore.",
      },
    },
    {
      "@type": "Question",
      name: "Can ICS repair a dead laptop motherboard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our in-house chip-level repair lab handles dead motherboard diagnosis, BGA chip reballing, short-circuit trace repairs, capacitor replacement, BIOS reflashing, and display hinge rebuilding. Inspection starts at just ₹499.",
      },
    },
    {
      "@type": "Question",
      name: "Does ICS Computer Store provide GST invoices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. ICS Computer Store is a GST-registered dealer. All purchases include 100% genuine tax invoices with Input Tax Credit (ITC) benefit, making us the preferred vendor for businesses and corporates.",
      },
    },
    {
      "@type": "Question",
      name: "What are the top gaming PC components available at ICS Coimbatore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We stock the latest components including AMD Ryzen 7 7800X3D, Ryzen 9 9950X, Intel Core i9-14900K, NVIDIA RTX 5070 Ti, RTX 5080, Corsair DDR5 RAM, Samsung 990 Pro NVMe SSDs, and premium motherboards from ASUS, MSI, and Gigabyte — all at the lowest prices in Coimbatore.",
      },
    },
    {
      "@type": "Question",
      name: "Does ICS offer same-day delivery in Coimbatore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide same-day delivery across Coimbatore and Tiruppur for in-stock items. You can also visit our Podanur store to pick up products immediately.",
      },
    },
  ],
};

/* ── Service schemas ──────────────────────────────────────────── */
const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Custom PC Assembly",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "City", name: "Coimbatore" },
    description:
      "Custom gaming PC and workstation assembly with free cable management, BIOS tuning, and 24-hour stress testing. RTX 50-Series and Ryzen 9000 builds available.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "0",
      description: "Free assembly with every component purchase",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Enterprise Networking & Structured Cabling",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "City", name: "Coimbatore" },
    description:
      "Cat6/Cat6A structured cabling, server rack deployment, managed PoE switches, multi-WAN firewall routers, and Ubiquiti UniFi enterprise Wi-Fi installation.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      description: "Free site survey across Coimbatore",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "CCTV Surveillance Installation",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "City", name: "Coimbatore" },
    description:
      "4K ColorVu IP cameras, 8/16/32 channel NVR/DVR, live remote mobile streaming, and AMC packages using Hikvision, CP Plus, and Dahua.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "14990",
      description: "4-Camera starter kit from ₹14,990",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Chip-Level Motherboard & Laptop Repair",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "City", name: "Coimbatore" },
    description:
      "In-house chip-level repair lab with digital microscopes, IR BGA rework stations, and oscilloscopes. Dead motherboard diagnosis, BGA reballing, short-circuit repairs, and BIOS reflashing.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "499",
      description: "Chip inspection from ₹499",
    },
  },
];

/* ── Top Product schemas ──────────────────────────────────────── */
const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AMD Ryzen 7 7800X3D Gaming Processor",
    brand: { "@type": "Brand", name: "AMD" },
    description:
      "The undisputed champion of gaming CPUs with 3D V-Cache technology. 8 Cores / 16 Threads, up to 5.0GHz boost clock, 104MB total cache.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "34990",
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE_URL}/#business` },
      priceValidUntil: "2027-03-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "48",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "MSI GeForce RTX 5070 Ti 16GB Gaming Trio",
    brand: { "@type": "Brand", name: "MSI" },
    description:
      "Next-gen GPU with 16GB GDDR7, PCIe 5.0, Tri-Frozr 3 cooling, DLSS 4 and real-time ray tracing for 1440p and 4K ultra gaming.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "82990",
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE_URL}/#business` },
      priceValidUntil: "2027-03-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "19",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Corsair Vengeance RGB 32GB DDR5 6000MHz",
    brand: { "@type": "Brand", name: "Corsair" },
    description:
      "High-frequency DDR5 memory kit (2x16GB) with CL30 latency, AMD EXPO & Intel XMP 3.0 support, and panoramic RGB lighting.",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "10499",
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE_URL}/#business` },
      priceValidUntil: "2027-03-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "62",
    },
  },
];

/* ── Review schemas ───────────────────────────────────────────── */
const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business-reviews`,
  name: SITE_NAME,
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Karthik Subramanian" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Ordered a high-end Ryzen 7 7800X3D + RTX 4070 SUPER build. The team at ICS assembled it flawlessly with top-tier cable management. They stress-tested it for 24 hours before handing it over. Best PC shop in Coimbatore hands down!",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Dr. Anand Natarajan" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "ICS Computer Store setup our 3-floor office network with 16 Hikvision ColorVu cameras and D-Link 24-Port PoE switches. Structured cabling is neat and their mobile viewing setup works seamlessly.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Suresh Babu" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "My Dell gaming laptop motherboard was declared dead by the official service center. ICS Computer Store diagnosed a shorted capacitor and fixed it at their chip-level lab in just 24 hours at a fraction of the cost.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Priyanka Chandrasekar" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "We rely on ICS for all our office IT supplies, printer toner refills, and biometrics. Always prompt, 100% genuine tax invoices, and friendly technicians. Truly 18+ years of trust.",
    },
  ],
};

export default function StructuredData() {
  const allSchemas = [
    localBusiness,
    organization,
    webSite,
    breadcrumb,
    faqPage,
    ...serviceSchemas,
    ...productSchemas,
    reviewSchema,
  ];

  return (
    <>
      {allSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
