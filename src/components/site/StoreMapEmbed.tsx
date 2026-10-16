import { useState } from "react";
import { ExternalLink, Layers, Loader2, MapPin, Navigation } from "lucide-react";
import type { StoreBranch } from "@/lib/site-data";

interface StoreMapEmbedProps {
  branch: StoreBranch;
  className?: string;
  heightClass?: string;
}

export function StoreMapEmbed({
  branch,
  className = "",
  heightClass = "h-[300px] sm:h-[340px]",
}: StoreMapEmbedProps) {
  const [mapType, setMapType] = useState<"google" | "osm">("google");
  const [isLoading, setIsLoading] = useState(true);

  const embedUrl =
    mapType === "google"
      ? branch.mapEmbedUrl
      : branch.osmEmbedUrl || branch.mapEmbedUrl;

  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-slate-900/10 ${className}`}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-xs">
          <Loader2 className="size-6 animate-spin text-brand-blue mb-2" />
          <span className="text-xs font-semibold text-muted-foreground">
            Loading interactive map for {branch.city}...
          </span>
        </div>
      )}

      {/* Embedded Map iframe */}
      <iframe
        key={`${branch.id}-${mapType}`}
        title={`${branch.name} Location Map`}
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
        className="w-full h-full grayscale-[5%] contrast-[105%] hover:grayscale-0 transition-all duration-500"
      />

      {/* Top Left: Branch City & Verified Pin */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-ink px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur hover:scale-105 transition-transform"
        >
          <MapPin className="size-3.5 text-red-600 animate-pulse" />
          <span>{branch.city}</span>
        </a>
      </div>

      {/* Top Right: Toggle between Google & OpenStreetMap */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 p-1 rounded-full shadow-md backdrop-blur text-[11px] font-bold">
        <button
          type="button"
          onClick={() => {
            if (mapType !== "google") {
              setIsLoading(true);
              setMapType("google");
            }
          }}
          className={`px-2.5 py-1 rounded-full transition-all ${
            mapType === "google"
              ? "bg-brand-blue text-white shadow-xs"
              : "text-muted-foreground hover:text-ink"
          }`}
          title="Switch to Google Maps"
        >
          Google
        </button>
        {branch.osmEmbedUrl && (
          <button
            type="button"
            onClick={() => {
              if (mapType !== "osm") {
                setIsLoading(true);
                setMapType("osm");
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
              mapType === "osm"
                ? "bg-brand-blue text-white shadow-xs"
                : "text-muted-foreground hover:text-ink"
            }`}
            title="Switch to OpenStreetMap (Faster / Adblocker Safe)"
          >
            <Layers className="size-3" />
            OSM
          </button>
        )}
      </div>

      {/* Bottom Bar: Quick Directions overlay on hover / touch */}
      <div className="absolute bottom-2 inset-x-2 z-20 pointer-events-none flex items-center justify-between">
        <span className="hidden sm:inline-block pointer-events-auto rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
          {branch.landmark}
        </span>
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto ml-auto flex items-center gap-1.5 rounded-full bg-brand-blue hover:bg-brand-blue/90 text-white px-3 py-1.5 text-xs font-bold shadow-lg transition-transform hover:scale-105"
        >
          <Navigation className="size-3" />
          <span>Get Directions</span>
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}
