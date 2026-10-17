import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, FileText, MessageCircle, Sparkles } from "lucide-react";
import { CONTACT, waLink } from "@/lib/site-data";
import { useApp } from "@/lib/store";

export default function DevelopmentBanner() {
  const { openQuote } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside aria-label="Development & Pricing Notice" className="relative z-50 border-b border-amber-500/40 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 shadow-md">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-6 lg:px-12 2xl:px-16 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left badge & summary */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-400 shadow-xs">
              <AlertTriangle className="size-3.5 text-amber-400 animate-pulse" />
              Site Under Development
            </span>

            <p className="text-xs sm:text-sm font-semibold leading-tight text-slate-950 truncate sm:whitespace-normal">
              <strong className="font-extrabold underline decoration-slate-950/40">Pricing Notice:</strong>{" "}
              All product prices on this website are currently demo / placeholder values.{" "}
              <span className="hidden md:inline font-medium">
                For the <strong>real, accurate price &amp; official GST quotation</strong>, please submit a quotation request and we will send you the live price.
              </span>
            </p>
          </div>

          {/* Right action CTAs & collapse toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                openQuote(
                  "Real Price Inquiry: Please send me authentic quotations and current live pricing for components/systems.",
                )
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white px-3 py-1 text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <FileText className="size-3.5 text-amber-400" />
              <span>Request Real Price</span>
            </button>

            <a
              href={waLink(
                "Hi ICS Computer Store, I am viewing your preview website. The prices are placeholder/under development — please send me your REAL current price quotation.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 hover:bg-emerald-900 text-emerald-200 hover:text-white px-3 py-1 text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <MessageCircle className="size-3.5 text-emerald-400" />
              <span className="hidden xs:inline">WhatsApp for</span> Real Price
            </a>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand pricing notice" : "Collapse pricing notice"}
              className="grid size-6 place-items-center rounded-full bg-black/10 hover:bg-black/20 text-slate-950 transition-colors"
              title={isCollapsed ? "Expand notice details" : "Collapse notice"}
            >
              {isCollapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable full detailed note for visitors */}
        {!isCollapsed && (
          <div className="mt-2 pt-2 border-t border-slate-950/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-950/90 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold">📢 Notice to Customers:</span>
              <span>
                We are receiving numerous quotation requests based on the provisional/fake sample rates. Please note our team will issue the <strong>actual current market rate</strong> upon quotation submission.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-slate-950 font-bold">
              <span>Coimbatore Store: {CONTACT.phone}</span>
              <span>•</span>
              <a
                href={CONTACT.phoneHref}
                className="underline hover:text-white transition-colors"
              >
                Call for Instant Rate
              </a>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
