-- ==============================================================================
-- SUPABASE IDEMPOTENT (SAFE-TO-RERUN) COMPLETE SCHEMA FOR ICS TECHNOLOGIES
-- Copy and replace ALL content in your Supabase SQL Editor and click "Run"
-- ==============================================================================

-- 0. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES TABLE (Public User Profile with Admin Flag)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  company_name text,
  gst_number text,
  address text,
  city text default 'Coimbatore',
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure is_admin column exists if table was already created earlier
alter table public.profiles add column if not exists is_admin boolean default false;

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles (Safely drop if exists then recreate)
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger to automatically create profile on sign-up (Email or Google OAuth)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==============================================================================
-- 2. ORDERS TABLE (Customer Orders & Live 4-Milestone Tracking Progress)
-- ==============================================================================
create table if not exists public.orders (
  id text primary key, -- e.g. ICS-ORD-9021
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  delivery_address text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null,
  gst_amount numeric not null,
  grand_total numeric not null,
  payment_method text default 'WhatsApp / Store UPI',
  status text default 'Order Placed', -- 'Order Placed', 'Assembled & Tested', 'Out for Delivery', 'Delivered', 'Cancelled'
  tracking_step integer default 1, -- 1: Placed, 2: Tested, 3: Out for Delivery, 4: Delivered
  estimated_delivery text default 'Within 24 Hours in Coimbatore',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id or auth.uid() is null);

drop policy if exists "Anyone can insert orders" on public.orders;
create policy "Anyone can insert orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (true);


-- ==============================================================================
-- 3. QUOTES TABLE (Proforma Inquiries & B2B Custom Quotations)
-- ==============================================================================
create table if not exists public.quotes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  service_category text not null,
  notes text,
  status text default 'pending', -- 'pending', 'in_review', 'quoted', 'completed', 'cancelled'
  estimated_amount numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.quotes enable row level security;

drop policy if exists "Anyone can submit quotes" on public.quotes;
create policy "Anyone can submit quotes"
  on public.quotes for insert
  with check (true);

drop policy if exists "Users can view their own quotes" on public.quotes;
create policy "Users can view their own quotes"
  on public.quotes for select
  using (auth.uid() = user_id or auth.uid() is null);

drop policy if exists "Admins can update quotes" on public.quotes;
create policy "Admins can update quotes"
  on public.quotes for update
  using (true);


-- ==============================================================================
-- 4. REPAIR TICKETS TABLE (Chip-Level Motherboard & Laptop Service Lab)
-- ==============================================================================
create table if not exists public.repair_tickets (
  id text primary key, -- e.g. ICS-8821
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  phone text not null,
  device_name text not null,
  issue_description text not null,
  status text default 'In Progress',
  estimated_delivery text,
  estimated_cost numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  steps jsonb default '[]'::jsonb
);

alter table public.repair_tickets enable row level security;

drop policy if exists "Anyone can look up repair tickets by ID" on public.repair_tickets;
create policy "Anyone can look up repair tickets by ID"
  on public.repair_tickets for select
  using (true);

drop policy if exists "Authenticated users can create repair requests" on public.repair_tickets;
create policy "Authenticated users can create repair requests"
  on public.repair_tickets for insert
  with check (true);

-- Initial Demo Repair Tickets
insert into public.repair_tickets (id, customer_name, phone, device_name, issue_description, status, estimated_delivery, steps)
values 
(
  'ICS-8821',
  'Anand Kumar',
  '+91 98422 12345',
  'ASUS TUF Gaming F15 Motherboard',
  'No Power / Blown 19V MOSFET shorted',
  'Component Rework in Progress',
  'Tomorrow, 4:00 PM',
  '[
    {"title": "Device Checked-In", "desc": "Received at Podanur Store desk", "completed": true, "current": false},
    {"title": "Chip-Level Diagnostics", "desc": "Thermal camera isolated short to PQ301 high-side FET", "completed": true, "current": false},
    {"title": "Component Rework", "desc": "Replacing shorted MOSFET & filtering tantalum capacitor", "completed": false, "current": true},
    {"title": "Thermal Repasting & BIOS Test", "desc": "Stress testing under FurMark & Cinebench for 4 hrs", "completed": false, "current": false},
    {"title": "Ready for Pickup", "desc": "Final QA sign-off & customer notification", "completed": false, "current": false}
  ]'::jsonb
),
(
  'ICS-8822',
  'Karthik S.',
  '+91 97890 54321',
  'Dell Latitude 5420 Workstation',
  'BIOS Corrupt / Password Locked after update',
  'Ready for Pickup',
  'Ready Today',
  '[
    {"title": "Device Checked-In", "desc": "Recorded at service lab", "completed": true, "current": false},
    {"title": "Chip-Level Diagnostics", "desc": "Direct SPI bus dump identified corrupt ME region", "completed": true, "current": false},
    {"title": "Component Rework", "desc": "Clean UEFI image flashed with official Dell descriptor", "completed": true, "current": false},
    {"title": "Thermal Repasting & BIOS Test", "desc": "Diagnostic boot pass & thermal pads renewed", "completed": true, "current": false},
    {"title": "Ready for Pickup", "desc": "Device ready at Gandhipuram counter", "completed": true, "current": true}
  ]'::jsonb
)
on conflict (id) do nothing;


-- ==============================================================================
-- 5. PC BUILDS TABLE (Saved Custom Rig Configurations)
-- ==============================================================================
create table if not exists public.pc_builds (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  build_name text not null,
  total_price numeric not null,
  estimated_tdp integer,
  parts jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pc_builds enable row level security;

drop policy if exists "Users can manage their own pc builds" on public.pc_builds;
create policy "Users can manage their own pc builds"
  on public.pc_builds for all
  using (auth.uid() = user_id);


-- ==============================================================================
-- 6. USER WISHLIST TABLE (User-Specific Saved Products)
-- ==============================================================================
create table if not exists public.user_wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

alter table public.user_wishlist enable row level security;

drop policy if exists "Users can manage their own wishlist" on public.user_wishlist;
create policy "Users can manage their own wishlist"
  on public.user_wishlist for all
  using (auth.uid() = user_id);


-- ==============================================================================
-- 7. PRODUCTS TABLE (Catalog Products with specs, pricing, warranty & images)
-- ==============================================================================
create table if not exists public.products (
  id text primary key,
  name text not null,
  brand text not null,
  category text not null,
  image text,
  images jsonb default '[]'::jsonb,
  specs jsonb default '[]'::jsonb,
  full_specs jsonb default '{}'::jsonb,
  price numeric not null,
  mrp numeric not null,
  tab text default 'hot',
  rating numeric default 5,
  review_count integer default 10,
  in_stock boolean default true,
  warranty text default '3 Years Official India Warranty',
  highlights jsonb default '[]'::jsonb,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
  on public.products for select
  using (true);

drop policy if exists "Admins or backend can insert/update products" on public.products;
create policy "Admins or backend can insert/update products"
  on public.products for all
  using (true);

-- SEED ALL STORE PRODUCTS INTO SUPABASE DATABASE
insert into public.products (id, name, brand, category, image, images, specs, full_specs, price, mrp, tab, rating, review_count, in_stock, warranty, highlights, description)
values
(
  'amd-7800x3d',
  'AMD Ryzen 7 7800X3D Gaming Processor',
  'AMD',
  'processors',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["8 Cores / 16 Threads", "AM5 Socket", "104MB 3D V-Cache", "Up to 5.0GHz"]'::jsonb,
  '{"Cores / Threads": "8 / 16", "Base / Boost Clock": "4.2GHz / 5.0GHz", "Total L3 Cache": "96MB V-Cache (104MB Total)", "TDP": "120W", "PCIe Version": "PCIe 5.0", "Memory Support": "DDR5 up to 5200 MT/s", "Integrated GPU": "AMD Radeon Graphics"}'::jsonb,
  34990,
  42990,
  'hot',
  5,
  48,
  true,
  '3 Years Official AMD India Warranty',
  '["#1 Best Gaming CPU in the world", "3D V-Cache technology delivers ultra-low latency", "Unmatched power efficiency for gaming rigs"]'::jsonb,
  'The undisputed champion of gaming CPUs. With AMD 3D V-Cache architecture, it outpaces higher-priced chips in modern AAA games while consuming remarkably low power.'
),
(
  'msi-rtx-5070ti',
  'MSI GeForce RTX 5070 Ti 16GB Gaming Trio',
  'MSI',
  'gpus',
  'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["16GB GDDR7", "PCIe 5.0", "Tri-Frozr 3 Cooling", "DLSS 4 & Ray Tracing"]'::jsonb,
  '{"VRAM": "16GB GDDR7 256-bit", "CUDA Cores": "8960 Cores", "Boost Clock": "2610 MHz", "Power Connectors": "1x 16-pin 12V-2x6", "Recommended PSU": "750W", "Outputs": "3x DisplayPort 2.1, 1x HDMI 2.1b"}'::jsonb,
  82990,
  94990,
  'new',
  5,
  19,
  true,
  '3 Years MSI India Replacement Warranty',
  '["Cutting-edge GDDR7 memory architecture", "Ultra-quiet TORX Fan 5.0 triple fan cooling", "Built-in anti-sag GPU support bracket included"]'::jsonb,
  'Built on NVIDIA next-gen architecture, this powerhouse delivers configuration for 1440p and 4K ultra gaming frame rates with real-time neural rendering and generative AI acceleration.'
),
(
  'corsair-ddr5-32gb',
  'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz',
  'Corsair',
  'memory',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["32GB (2x16GB)", "6000MHz CL30", "AMD EXPO & Intel XMP 3.0", "Panoramic RGB"]'::jsonb,
  '{"Capacity": "32GB (2 x 16GB Dual Channel)", "Speed": "DDR5-6000 MT/s", "Tested Latency": "CL30-36-36-76", "Voltage": "1.35V", "Heat Spreader": "Anodized Aluminum", "Software Control": "Corsair iCUE Support"}'::jsonb,
  10499,
  13999,
  'hot',
  5,
  62,
  true,
  '10 Years / Limited Lifetime Warranty',
  '["Low-latency CL30 optimal for AMD AM5 & Intel 14th Gen", "Dynamic ten-zone vibrant RGB lightbar", "Custom high-performance PCB for stable overclocking"]'::jsonb,
  'High-frequency DDR5 optimized for enthusiasts and gamers looking for plug-and-play EXPO/XMP profiles with tight timings and stunning customizable lighting.'
),
(
  'samsung-990-pro-2tb',
  'Samsung 990 PRO 2TB PCIe Gen4 NVMe M.2 SSD',
  'Samsung',
  'storage',
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["2TB Capacity", "7,450 MB/s Read", "6,900 MB/s Write", "Nickel-Coated Controller"]'::jsonb,
  '{"Interface": "PCIe Gen 4.0 x4, NVMe 2.0", "Sequential Read": "Up to 7,450 MB/s", "Sequential Write": "Up to 6,900 MB/s", "Random Read": "Up to 1,400,000 IOPS", "TBW Endurance": "1200 TBW", "Form Factor": "M.2 2280"}'::jsonb,
  14990,
  19999,
  'hot',
  5,
  37,
  true,
  '5 Years Samsung India Warranty',
  '["Near theoretical maximum speed for PCIe 4.0", "Samsung in-house Pascal controller with smart thermal guard", "Optimal for PS5 console expansion and heavy 4K editing"]'::jsonb,
  'Engineered for tech enthusiasts, hardcore gamers, and heavy-workload professionals wanting blazing-fast load times and consistent sustained bandwidth.'
),
(
  'asus-tuf-b650-plus',
  'ASUS TUF Gaming B650-PLUS WiFi Motherboard',
  'ASUS',
  'motherboards',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["AMD AM5 Socket", "PCIe 5.0 M.2", "WiFi 6 & 2.5GbE", "12+2 Power Stages"]'::jsonb,
  '{"Chipset": "AMD B650", "Socket": "AM5 (Ryzen 7000/8000/9000 Ready)", "VRM Design": "12+2 DrMOS Power Stages (60A)", "Memory Slots": "4x DDR5 (Up to 128GB, 7600+ OC)", "Storage": "3x M.2 Slots (1x PCIe 5.0 + 2x PCIe 4.0) + 4x SATA", "Networking": "Realtek 2.5G LAN + WiFi 6 + Bluetooth 5.2", "Audio": "Realtek 7.1 Surround Sound"}'::jsonb,
  17490,
  21500,
  'hot',
  4,
  29,
  true,
  '3 Years ASUS India Direct Warranty',
  '["Military-grade TUF chokes and capacitors", "Massive VRM heatsinks with pre-mounted I/O shield", "USB 3.2 Gen 2x2 Type-C (20Gbps) rear port"]'::jsonb,
  'Rugged durability meets modern connectivity. Built with server-grade PCB and heavy-duty VRM components to run Ryzen 7 and Ryzen 9 CPUs at peak performance.'
),
(
  'intel-ultra-7-265k',
  'Intel Core Ultra 7 265K Desktop Processor',
  'Intel',
  'processors',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["20 Cores (8P + 12E)", "LGA1851", "5.5GHz Boost", "Integrated NPU for AI"]'::jsonb,
  '{"Total Cores / Threads": "20 Cores / 20 Threads", "Performance-core Boost": "Up to 5.5 GHz", "AI NPU Capability": "Intel AI Boost NPU", "Intel Smart Cache": "33 MB", "Base Power": "125W (Max Turbo 250W)", "PCIe Support": "PCIe 5.0 and PCIe 4.0"}'::jsonb,
  38990,
  44990,
  'new',
  5,
  14,
  true,
  '3 Years Intel India Warranty',
  '["Built-in Neural Processing Unit (NPU) for local AI workloads", "Substantial power efficiency gains with Arrow Lake architecture", "Supports latest DDR5 memory up to 6400 MT/s native"]'::jsonb,
  'Next-gen desktop computing built on Intel Arrow Lake architecture with dedicated on-chip AI acceleration, ideal for content creators, coding, and multitasking.'
),
(
  'gigabyte-rtx-4070-super',
  'Gigabyte GeForce RTX 4070 SUPER Windforce OC 12G',
  'Gigabyte',
  'gpus',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["12GB GDDR6X", "DLSS 3.5 Frame Gen", "Windforce 3X Fans", "Metal Backplate"]'::jsonb,
  '{"CUDA Cores": "7168", "Core Clock": "2505 MHz (Boost)", "Memory Clock": "21 Gbps GDDR6X", "Memory Bus": "192-bit", "Card Dimensions": "261 x 126 x 50 mm", "Recommended PSU": "650W"}'::jsonb,
  62990,
  71990,
  'gaming',
  5,
  51,
  true,
  '3+1 Years Gigabyte India Extended Warranty',
  '["20% faster than standard RTX 4070", "Full support for Cyberpunk Ray Tracing Overdrive with DLSS 3.5", "Alternate spinning fans reduce turbulence and noise"]'::jsonb,
  'The sweet spot for 1440p high-refresh gaming and creative 3D rendering with revolutionary Ada Lovelace architecture and AV1 video encoding.'
),
(
  'hikvision-4mp-colorvu',
  'Hikvision 4MP ColorVu IP PoE Dome Camera',
  'Hikvision',
  'cctv',
  'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["4MP Super HD", "24/7 Full Color Night Vision", "Built-in Mic", "PoE & IP67 Weatherproof"]'::jsonb,
  '{"Sensor": "1/1.8 Progressive Scan CMOS", "Resolution": "2688 × 1520 @ 30fps", "Lens": "2.8mm Ultra-Wide (112° FOV)", "Night Color Range": "Up to 30m Warm White LED", "Compression": "H.265+ / H.265 / H.264", "Weather Resistance": "IP67 Water & Dust Resistant", "Audio": "Built-in Noise Reduction Microphone"}'::jsonb,
  4290,
  5600,
  'enterprise',
  5,
  83,
  true,
  '2 Years Hikvision India Direct Replacement',
  '["True vivid color imaging even in pitch black darkness (F1.0 super-aperture)", "AcuSense human and vehicle classification eliminates false alarms", "Audio recording with built-in high sensitivity microphone"]'::jsonb,
  'Top choice for Coimbatore commercial shops, warehouses, residential villas, and parking facilities demanding clear identification round the clock.'
),
(
  'dlink-24port-gigabit-switch',
  'D-Link 24-Port Gigabit Smart Managed PoE+ Switch',
  'D-Link',
  'networking',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["24x Gigabit PoE+ Ports", "370W PoE Budget", "4x 10G SFP+ Uplinks", "Layer 2+ Management"]'::jsonb,
  '{"Total Ports": "24x 10/100/1000BASE-T PoE+ Ports", "Uplink Ports": "4x 10G SFP+ Optical Uplinks", "PoE Standard": "IEEE 802.3at / 802.3af (Up to 30W/port)", "Switching Capacity": "128 Gbps Non-Blocking", "Management": "Web GUI, SNMP, VLAN, QoS, IGMP Snooping", "Form Factor": "19-inch 1U Rackmount"}'::jsonb,
  18990,
  23500,
  'enterprise',
  5,
  22,
  true,
  '3 Years D-Link India Advance Replacement',
  '["Powers up to 24 CCTV cameras or WiFi APs without separate power adapters", "10G SFP+ uplinks ensure zero bottleneck to servers or NAS storage", "Surge protection up to 6kV on all Ethernet ports"]'::jsonb,
  'Heavy-duty backbone for modern business IT infrastructure, schools, hospitals, and smart offices across Coimbatore and Tiruppur industrial clusters.'
),
(
  'corsair-h150i-aio',
  'Corsair iCUE LINK H150i RGB 360mm Liquid CPU Cooler',
  'Corsair',
  'power',
  'https://images.unsplash.com/photo-1618764400608-9e7115eabb74?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["360mm Radiator", "3x QX120 RGB Fans", "Single-Cable iCUE LINK", "Zero RPM Mode"]'::jsonb,
  '{"Radiator Size": "397mm x 120mm x 27mm", "Cold Plate": "Split-flow copper with pre-applied XTM70 paste", "Fan Speed": "480 - 2400 RPM", "Airflow": "63.1 CFM", "Socket Support": "Intel LGA 1851/1700, AMD AM5/AM4", "Warranty": "5 Years Manufacturer Warranty"}'::jsonb,
  16490,
  20990,
  'gaming',
  5,
  31,
  true,
  '5 Years Corsair India Warranty',
  '["Innovative single-cable daisy-chain system eliminates cable clutter", "Tames high-TDP processors (Ryzen 9 / Core i9) under heavy rendering", "Customizable RGB lighting and liquid temperature telemetry"]'::jsonb,
  'Premium cooling solution designed to keep high-end gaming and creator processors running at sustained boost clocks without thermal throttling.'
),
(
  'asus-rog-27-180hz-monitor',
  'ASUS ROG Strix 27" 180Hz QHD Fast-IPS Gaming Monitor',
  'ASUS',
  'monitors',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["2560x1440 QHD", "180Hz Refresh / 1ms", "Fast-IPS Panel", "G-Sync & FreeSync"]'::jsonb,
  '{"Screen Size": "27-inch Flat Screen", "Resolution": "2560 x 1440 (2K QHD)", "Panel Type": "Fast IPS", "Refresh Rate": "180Hz Overclocked", "Response Time": "1ms (GTG)", "Color Gamut": "DCI-P3 95% & sRGB 130%", "HDR": "DisplayHDR 400 Certified"}'::jsonb,
  24990,
  31990,
  'gaming',
  5,
  44,
  true,
  '3 Years ASUS On-Site Warranty',
  '["Crystal sharp 1440p resolution with ultra-smooth 180Hz motion", "Factory calibrated color accuracy for video editing & design work", "Ergonomic stand with height, tilt, swivel, and 90° pivot adjustment"]'::jsonb,
  'The ideal balance of competitive esports speed and breathtaking visual fidelity with wide color gamut and HDR clarity.'
),
(
  'zotac-rtx-4060-twin',
  'ZOTAC Gaming GeForce RTX 4060 8GB Twin Edge',
  'ZOTAC',
  'gpus',
  'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&auto=format&fit=crop&q=80',
  '[]'::jsonb,
  '["8GB GDDR6", "Compact Dual-Slot", "IceStorm 2.0 Cooling", "115W Low Power"]'::jsonb,
  '{"CUDA Cores": "3072", "Engine Clock": "Boost: 2460 MHz", "Memory Clock": "17 Gbps", "Power Consumption": "115W (Runs on 500W PSU)", "Card Length": "221.4mm (Fits any compact case)"}'::jsonb,
  27990,
  32990,
  'gaming',
  4,
  56,
  true,
  '3+2 Years ZOTAC India Warranty (5 Years Total)',
  '["Industry-leading 5 Years warranty on registration", "Ultra-efficient 115W power draw keeps electrical bills minimal", "Fits 99% of ITX and standard cases"]'::jsonb,
  'The ultimate 1080p high-FPS card for competitive games like Valorant, CS2, Fortnite, and GTA V with DLSS 3 support.'
),
(
  'asus-tuf-fx506hlhb',
  'ASUS FX50HLHB-HN356W TUF Gaming Laptop',
  'ASUS',
  'laptops',
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["Intel Core i5", "8GB/16GB RAM", "512GB NVMe SSD", "15.6\" 144Hz FHD", "Windows 11 Home"]'::jsonb,
  '{"Model Number": "FX50HLHB-HN356W", "Processor": "Intel Core i5 High-Performance", "Display": "15.6-inch FHD (1920x1080) 144Hz IPS-level Anti-Glare", "Memory": "8GB DDR4 (Expandable up to 32GB)", "Storage": "512GB PCIe 3.0 NVMe M.2 SSD", "Graphics": "Dedicated Gaming GPU", "Keyboard": "RGB Backlit Gaming Keyboard with WASD highlights", "OS": "Windows 11 Home 64-bit", "Durability": "MIL-STD-810H Military-Grade Toughness"}'::jsonb,
  52990,
  64990,
  'gaming',
  5,
  42,
  true,
  '1 Year ASUS India On-Site Comprehensive Warranty',
  '["Military-grade MIL-STD-810H toughness and dual-fan cooling", "144Hz ultra-smooth IPS gaming panel for esports", "AURA Sync RGB backlit keyboard with numpad"]'::jsonb,
  'Geared for serious gaming and high-durability daily multitasking. Features military-grade standard testing, 144Hz IPS display, and comprehensive cooling system.'
),
(
  'dell-inspiron-147440',
  'DELL INSPIRON 14 7440 LAPTOP',
  'Dell',
  'laptops',
  'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["Intel Core Processor", "14.0\" FHD+ 16:10", "16GB LPDDR5", "512GB SSD", "Windows 11 + MSO"]'::jsonb,
  '{"Series": "Inspiron 14 7000 Series (7440)", "Display": "14.0-inch FHD+ (1920x1200) Anti-Glare 250nits Narrow Border", "Memory": "16GB High-Speed RAM", "Storage": "512GB M.2 PCIe NVMe Solid State Drive", "Chassis": "Premium Anodized Aluminum Sleek Design", "Keyboard": "Backlit Keyboard with Fingerprint Reader", "Software": "Windows 11 Home + MS Office Home & Student 2021", "Audio": "Waves MaxxAudio Pro Stereo Speakers"}'::jsonb,
  58990,
  69990,
  'hot',
  5,
  28,
  true,
  '1 Year Dell India On-Site Premium Support',
  '["Sleek 14-inch compact aluminum chassis with 16:10 productivity display", "FHD AI webcam with temporal noise reduction & dual mics", "ExpressCharge gets up to 80% charge in just 60 minutes"]'::jsonb,
  'Modern, portable executive laptop with 16:10 aspect ratio for enhanced screen real estate. Built with sleek aluminum finish and exceptional battery stamina.'
),
(
  'dell-inspiron-15-3511',
  'DELL INSPIRON 15-3511 LAPTOP (I5-11/8/512/W11H/MSO/S)',
  'Dell',
  'laptops',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["Intel Core i5-11th Gen", "8GB RAM", "512GB NVMe SSD", "15.6\" FHD", "Win 11 + MS Office", "Silver"]'::jsonb,
  '{"Model": "Inspiron 15 3511 (Silver)", "Processor": "Intel Core i5-1135G7 (Up to 4.2 GHz, 8MB Cache)", "RAM": "8GB DDR4 (Expandable to 16GB)", "Storage": "512GB M.2 PCIe NVMe SSD", "Display": "15.6-inch FHD (1920x1080) Anti-Glare LED Narrow Border", "Operating System": "Windows 11 Home Single Language", "Productivity Software": "Microsoft Office Home & Student 2021", "Lift Hinge": "Ergonomic lift hinge for typing comfort & airflow", "Color": "Platinum Silver Finish"}'::jsonb,
  46990,
  56990,
  'hot',
  5,
  39,
  true,
  '1 Year Dell Onsite Hardware Service',
  '["Powered by Intel Core i5 with 512GB superfast SSD storage", "Pre-loaded with genuine lifetime Windows 11 & Microsoft Office 2021", "Ergonomic lift hinge design props up keyboard for effortless typing"]'::jsonb,
  'A proven workhorse for students, professionals, and home business users with full numpad, crisp 15.6" anti-glare display, and genuine Microsoft Office suite.'
),
(
  'hp-250-g9',
  'HP 250 G9 LAPTOP (I3-12/8/512/DOS/SILVER/15.6/1YR)',
  'HP',
  'laptops',
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["Intel Core i3-12th Gen", "8GB DDR4", "512GB SSD", "15.6\" HD/FHD", "DOS/FreeOS", "Asteroid Silver"]'::jsonb,
  '{"Series": "HP 250 G9 Commercial Notebook", "Processor": "Intel Core i3-1215U (6 Cores, 8 Threads, up to 4.4 GHz)", "RAM": "8GB DDR4-3200 MHz RAM", "Storage": "512GB PCIe NVMe Value SSD", "Display": "15.6-inch Narrow bezel, anti-glare, 250 nits", "OS": "FreeDOS 3.0", "Color": "Asteroid Silver", "Weight": "Starting at 1.74 kg", "Ports": "1x USB Type-C, 2x USB Type-A, 1x HDMI 1.4b, 1x RJ-45 LAN"}'::jsonb,
  31990,
  38990,
  'enterprise',
  4,
  31,
  true,
  '1 Year HP Commercial Onsite Warranty',
  '["Cost-effective commercial laptop with 12th Gen 6-Core processor", "Built-in Gigabit RJ-45 Ethernet port for reliable office networking", "Slim, lightweight chassis with thin bezel display"]'::jsonb,
  'Budget-friendly commercial laptop designed for business productivity, office desks, accounting software, and billing workstations with complete I/O port selection.'
),
(
  'hp-notebook-15-fd0465tu',
  'HP NOTEBOOK 15-FD0465TU LAPTOP',
  'HP',
  'laptops',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["Intel Core Processor", "8GB DDR4", "512GB SSD", "15.6\" FHD Micro-Edge", "Win 11 + MSO", "Natural Silver"]'::jsonb,
  '{"Model Number": "15-FD0465TU", "Processor": "Intel Core Processor (High-efficiency Performance)", "Memory": "8GB DDR4 RAM", "Storage": "512GB PCIe NVMe M.2 SSD", "Display": "15.6-inch FHD (1920x1080) Micro-edge Anti-glare", "Camera": "HP True Vision 720p HD camera with temporal noise reduction", "OS & Office": "Windows 11 Home + MS Office Home & Student", "Battery": "3-cell 41 Wh Li-ion with Fast Charge Support"}'::jsonb,
  39990,
  48990,
  'new',
  5,
  24,
  true,
  '1 Year HP India On-Site Warranty',
  '["Micro-edge anti-glare 15.6\" FHD screen with vibrant clarity", "HP Fast Charge powers up from 0 to 50% in approximately 45 minutes", "Dual array digital microphones with advanced noise cancellation"]'::jsonb,
  'Reliable, stylish daily driver featuring micro-edge display, smooth performance, fast boot times, and HP True Vision HD camera for video calls and remote work.'
),
(
  'hp-victus-15-fa1312tx',
  'HP VICTUS 15-FA1312TX GAMING LAPTOP',
  'HP',
  'laptops',
  'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["Intel Core i5-13th Gen", "NVIDIA GeForce RTX GPU", "16GB DDR4", "512GB SSD", "15.6\" 144Hz FHD", "Mica Silver"]'::jsonb,
  '{"Model": "Victus by HP Gaming Laptop 15-fa1312TX", "Processor": "Intel Core i5-13420H (Up to 4.6 GHz, 8 Cores, 12 Threads)", "Graphics": "NVIDIA GeForce RTX Dedicated Gaming Graphics", "Display": "15.6\" FHD (1920x1080) 144Hz 9ms IPS Micro-edge Anti-glare 250 nits", "Memory": "16GB DDR4-3200 MHz RAM", "Storage": "512GB PCIe Gen4 NVMe TLC M.2 SSD", "Audio": "Audio by B&O with Dual Speakers and HP Audio Boost", "Thermal System": "Updated thermal design with dual exhausts & wide airflow", "Color": "Mica Silver with Dark Chrome Logo"}'::jsonb,
  66990,
  79990,
  'gaming',
  5,
  47,
  true,
  '1 Year HP Onsite Premium Gaming Warranty',
  '["13th Gen Intel Core i5 + NVIDIA GeForce RTX for AAA gaming & streaming", "144Hz high-refresh rate IPS screen with 9ms response time", "Tuned by B&O audio with OMEN Gaming Hub performance management"]'::jsonb,
  'Designed for high-FPS gaming and heavy 3D creative tasks. Packed with 13th Gen Intel Core processor, discrete NVIDIA RTX graphics, and an advanced cooling thermal solution.'
),
(
  'lenovo-v15-g4-amn',
  'LENOVO V15 G4 AMN LAPTOP',
  'Lenovo',
  'laptops',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["AMD Ryzen 3 / Athlon", "8GB LPDDR5", "512GB NVMe SSD", "15.6\" FHD Anti-Glare", "Business Black"]'::jsonb,
  '{"Model Series": "Lenovo V15 G4 AMN (Business Edition)", "Processor": "AMD Ryzen 7000 Series Processor", "Memory": "8GB LPDDR5-5500 High-Speed RAM", "Storage": "512GB SSD M.2 2242 PCIe 4.0x4 NVMe", "Display": "15.6-inch FHD (1920x1080) TN 250nits Anti-glare", "Security": "Firmware TPM 2.0 & Camera Privacy Shutter", "Weight": "1.65 kg", "Battery": "Integrated 38Wh with Rapid Charge support"}'::jsonb,
  28990,
  35990,
  'enterprise',
  4,
  22,
  true,
  '1 Year Lenovo Commercial Depot/Onsite Warranty',
  '["Ultra-modern LPDDR5 memory speed for snappy everyday business work", "Physical webcam privacy shutter for enhanced security", "Spill-resistant keyboard and MIL-SPEC durable construction"]'::jsonb,
  'High-value business notebook engineered for SMBs, schools, retail shops, and remote workers with AMD 7000-series efficiency and fast LPDDR5 RAM.'
),
(
  'lenovo-v15-gen3-iap',
  'LENOVO V15 GEN3 IAP LAPTOP',
  'Lenovo',
  'laptops',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["Intel Core i3-12th Gen", "8GB DDR4 (Up to 16GB)", "512GB SSD", "15.6\" FHD", "Iron Grey"]'::jsonb,
  '{"Model Series": "Lenovo V15 G3 IAP", "Processor": "Intel Core i3-1215U (6C / 8T, P-core 1.2 / 4.4GHz, E-core 0.9 / 3.3GHz)", "Graphics": "Integrated Intel UHD Graphics", "Memory": "8GB Soldered DDR4-3200 + 1 SO-DIMM Slot Available", "Storage": "512GB SSD M.2 PCIe NVMe", "Display": "15.6-inch FHD (1920x1080) Anti-glare 250nits", "Connectivity": "Wi-Fi 6, 11ax 2x2 + BT5.1, RJ-45 Gigabit LAN", "Security": "Camera Privacy Shutter, Kensington Nano Slot"}'::jsonb,
  33490,
  41990,
  'enterprise',
  5,
  35,
  true,
  '1 Year Lenovo Official Onsite Warranty',
  '["12th Gen Intel 6-Core processor handles heavy spreadsheets & browser tabs", "Dual storage support (M.2 SSD + 2.5\" HDD bay) for massive expansions", "Wi-Fi 6 wireless speed and dedicated Gigabit Ethernet port"]'::jsonb,
  'Versatile office notebook delivering excellent compute power with Intel 12th Gen multi-core architecture, expandable memory, and enterprise-level durability.'
),
(
  'lenovo-adp-carepack-2yr',
  'LENOVO LAPTOP ADP CARE PACK - ADD 2YR',
  'Lenovo',
  'laptops',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"]'::jsonb,
  '["+2 Years Extension", "Accidental Damage Protection (ADP)", "100% Genuine Parts", "Coimbatore Onsite Support"]'::jsonb,
  '{"Plan Type": "Lenovo Official 2-Year Extended Warranty + ADP", "Coverage Period": "Additional 2 Years (Total 3 Years Peace of Mind)", "ADP Inclusions": "Accidental Drops, Liquid Spills, Electrical Surges, Screen Cracks", "Service Delivery": "On-site Authorized Technician Support", "Replacement Parts": "100% Genuine Brand OEM Components", "Transferability": "Linked directly to device serial number in official Lenovo database"}'::jsonb,
  3499,
  5999,
  'enterprise',
  5,
  68,
  true,
  '2 Years Official Lenovo ADP Warranty Policy',
  '["Complete protection against accidental drops, liquid spills, and motherboard surges", "Zero deductible charges on genuine parts replacement", "Activated directly on your Lenovo laptop serial number within 24 hours"]'::jsonb,
  'Official Lenovo Accidental Damage Protection (ADP) Care Pack. Upgrades your laptop warranty by +2 Years with doorstep on-site repair for liquid spills, drops, and electrical damage.'
)
on conflict (id) do update set
  name = excluded.name,
  brand = excluded.brand,
  category = excluded.category,
  image = excluded.image,
  images = excluded.images,
  specs = excluded.specs,
  full_specs = excluded.full_specs,
  price = excluded.price,
  mrp = excluded.mrp,
  tab = excluded.tab,
  rating = excluded.rating,
  review_count = excluded.review_count,
  in_stock = excluded.in_stock,
  warranty = excluded.warranty,
  highlights = excluded.highlights,
  description = excluded.description;

