import Link from "next/link";
import articles from "@/data/articles.json";

// "My numbers" as a bill of lading: who ships (shipper), how much they carry
// (cargo), what arrived (delivered, each with its method) and what vouches
// for it (certified by). Every figure comes from the Experience page.

const cargo = [
  { value: "450M+", unit: "EUR / yr", label: "purchasing volume" },
  { value: "150k+", unit: "parts", label: "spare parts" },
  { value: "1,000+", unit: "suppliers", label: "worldwide" },
  { value: "250k+", unit: "POs / yr", label: "purchase orders" },
];

const delivered = [
  { result: "85% → 98%", what: "supply availability", scope: "9 products · 6 countries", how: "scenario planning and rapid replanning through the chip shortage" },
  { result: "−20%", what: "sourcing lead time", scope: "1,500+ parts / yr", how: "direct CAD-drawing access for sourcing" },
  { result: "~2,200 h", what: "freed per year (≈1 FTE)", scope: "order confirmation", how: "automation rescued from a blocking SAP defect" },
];

function Barcode() {
  // Deterministic bar widths spelling nothing in particular; it is a label, not a scanner target.
  const bars = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 1, 2, 3];
  let x = 0;
  return (
    <svg viewBox="0 0 96 28" className="h-7 w-24" aria-hidden>
      {bars.map((w, i) => {
        const r = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={28} fill="currentColor" /> : null;
        x += w;
        return r;
      })}
    </svg>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 border-t border-dashed border-foreground/25 py-3 first:border-t-0 sm:grid-cols-[7rem_1fr] sm:gap-3">
      <p className="pt-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{k}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function ShippingManifest() {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-foreground bg-white p-4 text-foreground sm:p-5">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b-2 border-foreground pb-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Bill of lading</p>
          <p className="mt-0.5 text-lg font-bold leading-tight">Poornajith Shetty</p>
        </div>
        <div className="text-right font-mono text-[10px] leading-relaxed text-muted-foreground">
          <p>No. PS-2019-LND</p>
          <p>Updated Oct 2026</p>
        </div>
      </div>

      <Row k="Shipper">
        <p className="text-sm">
          <span className="font-semibold">Tetra Pak</span> · Lund, Sweden · since 2019
        </p>
        <p className="text-xs text-muted-foreground">Replenishment Manager, Services Supply Network · leads a team of 10</p>
      </Row>

      <Row k="Cargo">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
          {cargo.map((c) => (
            <div key={c.label}>
              <dt className="sr-only">{c.label}</dt>
              <dd className="font-mono text-base font-bold leading-none text-primary sm:text-lg">{c.value}</dd>
              <dd className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                {c.unit} · {c.label}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[11px] text-muted-foreground">Annual scale my team carries today.</p>
      </Row>

      <Row k="Delivered">
        <ul className="space-y-2.5">
          {delivered.map((d) => (
            <li key={d.what} className="grid grid-cols-1 gap-x-3 sm:grid-cols-[6.5rem_1fr] sm:items-baseline">
              <span className="font-mono text-sm font-bold text-[color:var(--chart-3,#0d9488)]">{d.result}</span>
              <span className="text-sm">
                <span className="font-semibold">{d.what}</span>
                <span className="text-muted-foreground"> · {d.scope}</span>
                <span className="block text-xs text-muted-foreground">via {d.how}</span>
              </span>
            </li>
          ))}
        </ul>
      </Row>

      <Row k="Certified by">
        <p className="text-sm">
          M.Sc. Logistics &amp; Supply Chain Management · <span className="font-semibold">LTH, Lund University</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {articles.length} long-form articles published ·{" "}
          <Link href="/articles" className="underline underline-offset-2 hover:text-foreground">
            read them ↗
          </Link>
        </p>
      </Row>

      {/* footer: barcode, proof link, stamp */}
      <div className="mt-1 flex items-end justify-between gap-3 border-t-2 border-foreground pt-3">
        <div className="text-foreground">
          <Barcode />
          <p className="mt-1 font-mono text-[9px] tracking-[0.3em] text-muted-foreground">PS 2019 0450 0098</p>
        </div>
        <span
          aria-hidden
          className="mb-1 hidden rotate-[-8deg] rounded-md border-2 border-amber-500 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 sm:inline-block"
        >
          Delivered
        </span>
        <Link
          href="/experience"
          className="inline-flex min-h-10 items-center rounded-lg bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-foreground/85"
        >
          See the proof →
        </Link>
      </div>
    </div>
  );
}
