"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { books as allBooks, coverUrl, type Book } from "@/data/books";
import { cn } from "@/lib/utils";

// A shelf of books you can pull out: one is turned in 3D to show its cover,
// the rest stand spine out, endlessly. Covers come from Open Library by ISBN;
// a book without one gets a designed cover in its own colours. Spines are
// drawn from the book's colours, so nothing here is generated art.
//
// One requestAnimationFrame loop drives the shelf, and the Web Animations API
// drives the caption and the detail sheet. No opacity fades: every reveal is a
// mask slide, a clip or a scale.

const THEMES: Book["theme"][] = ["Leadership", "Negotiation & people", "Money & risk", "Strategy", "Crime & power", "Life"];
const TAB_LABEL: Record<Book["theme"], string> = {
  Leadership: "Leadership",
  "Negotiation & people": "People",
  "Money & risk": "Money",
  Strategy: "Strategy",
  "Crime & power": "Crime",
  Life: "Life",
};

// Grouped by theme so each tab jumps to a run of books.
const books: Book[] = THEMES.flatMap((t) => allBooks.filter((b) => b.theme === t));
const N = books.length;
const COPIES = 3;
const M = N * COPIES;
const TILT = -4.5; // degrees: the pulled-out book leans slightly anticlockwise
const EASE = "cubic-bezier(.2,.8,.2,1)";

const mod = (a: number, n: number) => ((a % n) + n) % n;
const smooth = (x: number) => x * x * (3 - 2 * x);
const B = (r: number) => (Math.abs(r) < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : Math.sign(r) * 0.5);
const surname = (a: string) => a.replace(/ & .*/, "").split(" ").slice(-1)[0];

const BLOBS = [
  { cx: 150, cy: 260, delay: 0 },
  { cx: 340, cy: 470, delay: 120 },
  { cx: 250, cy: 100, delay: 220 },
  { cx: 90, cy: 600, delay: 300 },
  { cx: 400, cy: 200, delay: 360 },
  { cx: 260, cy: 680, delay: 420 },
  { cx: 230, cy: 370, delay: 180 },
];

function DesignedCover({ b }: { b: Book }) {
  return (
    <div className="flex h-full w-full flex-col justify-between p-[8%]" style={{ background: b.color, color: b.ink }}>
      <span className="h-[3px] w-[18%]" style={{ background: b.ink }} />
      <div>
        <p className="text-[clamp(11px,calc(var(--d)*.1),22px)] font-bold leading-tight">{b.title}</p>
        <p className="mt-1 text-[clamp(9px,calc(var(--d)*.06),13px)] font-medium opacity-80">{b.author}</p>
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-70">{b.year}</p>
    </div>
  );
}

function CoverFace({ b }: { b: Book }) {
  const [failed, setFailed] = useState(!b.isbn);
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {failed || !b.isbn ? (
        <DesignedCover b={b} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverUrl(b.isbn)} alt="" draggable={false} className="h-full w-full object-cover" style={{ visibility: loaded ? "visible" : "hidden" }} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      )}
    </>
  );
}

export default function Bookshelf() {
  const uid = useId().replace(/:/g, "");
  // False on the server and during hydration, true afterwards (the detail sheet is a portal).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const tapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const titleMask = useRef<HTMLDivElement>(null);
  const subMask = useRef<HTMLDivElement>(null);
  const yearMask = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const blobRefs = useRef<(SVGCircleElement | null)[]>([]);
  const api = useRef<{ open: () => void; close: () => void; go: (dir: 1 | -1) => void; goTo: (i: number) => void }>({
    open: () => {},
    close: () => {},
    go: () => {},
    goTo: () => {},
  });

  const book = books[active];
  const themeIdx = THEMES.indexOf(book.theme);
  const firstOfTheme = useMemo(() => THEMES.map((t) => books.findIndex((b) => b.theme === t)), []);

  // The cobalt-style block under the active tab: it slides and stretches.
  useEffect(() => {
    const place = () => {
      const tab = tabRefs.current[themeIdx];
      const bar = indicatorRef.current;
      if (!tab || !bar) return;
      bar.style.width = `${tab.offsetWidth}px`;
      bar.style.transform = `translateX(${tab.offsetLeft}px)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [themeIdx]);

  useEffect(() => {
    if (!mounted) return;
    const root = rootRef.current!;
    const area = areaRef.current!;
    const dialog = dialogRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let H = 0, ws = 0, d = 0, gap = 0, step = 1;
    const measure = () => {
      H = Math.max(160, area.clientHeight - 80);
      ws = H * 0.135;
      d = H * 0.64;
      gap = H * 0.03;
      step = ws + gap;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(area);

    // state
    let s = N + 0; // current position, in tape units
    let T = s; // target
    let activeIdx = 0;
    let hover = -1;
    let mx = -1000, my = -1000, cx = -1000, cy = -1000;
    let inside = false;
    let overBtn = false;
    let tiltX = 0, tiltY = 0;
    let onCover = false;
    let isOpen = false;
    let dragging = false, dragStartX = 0, dragT0 = 0, suppressClick = false, pressed = false;
    let wheelTimer = 0;
    const lift = new Float32Array(M);
    let raf = 0, last = 0, visible = true;
    const anims: Animation[] = [];

    // ---- caption ----
    const swapLine = (mask: HTMLElement | null, text: string, dir: number) => {
      if (!mask) return;
      if (reduced) {
        mask.textContent = text;
        return;
      }
      const olds = Array.from(mask.children) as HTMLElement[];
      const span = document.createElement("span");
      span.textContent = text;
      span.className = "absolute inset-x-0 top-0 block w-full text-center";
      mask.appendChild(span);
      span.animate([{ transform: `translateY(${dir * 105}%)` }, { transform: "translateY(0%)" }], { duration: 650, easing: EASE, fill: "both" });
      olds.forEach((o) => {
        if (o.dataset.leaving) return;
        o.dataset.leaving = "1";
        o.classList.add("absolute", "inset-x-0", "top-0");
        const from = getComputedStyle(o).transform;
        const a = o.animate([{ transform: from === "none" ? "translateY(0%)" : from }, { transform: `translateY(${-dir * 105}%)` }], { duration: 650, easing: EASE, fill: "both" });
        a.onfinish = () => o.remove();
      });
    };
    const swapCaption = (i: number, dir: number) => {
      const b = books[i];
      swapLine(titleMask.current, b.title, dir);
      swapLine(subMask.current, b.author, dir);
      swapLine(yearMask.current, `${b.year} · ${b.theme}`, dir);
    };

    // ---- actions ----
    const snap = () => {
      T = Math.round(T);
    };
    const go = (dir: 1 | -1) => {
      T = Math.round(T) + dir;
    };
    const goTo = (idx: number) => {
      const delta = mod(idx - Math.round(T), N);
      T = Math.round(T) + (delta > N / 2 ? delta - N : delta);
    };

    // ---- detail sheet ----
    const coverRect = () => {
      const v = mod(Math.round(s), M);
      const cv = tapeRefs.current[v]?.querySelector(".shelf-cv") as HTMLElement | null;
      return cv ? cv.getBoundingClientRect() : area.getBoundingClientRect();
    };
    const inset = (r: DOMRect) =>
      `inset(${Math.max(0, r.top)}px ${Math.max(0, window.innerWidth - r.right)}px ${Math.max(0, window.innerHeight - r.bottom)}px ${Math.max(0, r.left)}px round 3px)`;
    const stopAnims = () => {
      anims.splice(0).forEach((a) => a.cancel());
    };
    let inkRaf = 0;
    const openDetail = () => {
      if (isOpen) return;
      isOpen = true;
      snap();
      s = T;
      stopAnims();
      const r = coverRect();
      document.documentElement.style.overflow = "hidden";
      dialog.style.visibility = "visible";
      dialog.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      const dur = reduced ? 1 : 1050;
      anims.push(
        dialog.animate(
          [
            { clipPath: inset(r), transform: `rotate(${TILT}deg)` },
            { clipPath: "inset(0px 0px 0px 0px round 0px)", transform: "rotate(0deg)" },
          ],
          { duration: dur, easing: "cubic-bezier(.76,0,.18,1)", fill: "both" }
        )
      );
      dialog.querySelectorAll<HTMLElement>("[data-rise]").forEach((el, i) => {
        anims.push(el.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0%)" }], { duration: reduced ? 1 : 900, delay: reduced ? 0 : 620 + i * 75, easing: EASE, fill: "both" }));
      });
      blobRefs.current.forEach((c) => c?.setAttribute("r", "0"));
      const t0 = performance.now() + (reduced ? -5000 : 520);
      cancelAnimationFrame(inkRaf);
      const ink = (now: number) => {
        const el = now - t0;
        BLOBS.forEach((bl, i) => {
          const p = Math.min(1, Math.max(0, (el - bl.delay) / 1250));
          blobRefs.current[i]?.setAttribute("r", String(720 * (1 - Math.pow(1 - p, 3))));
        });
        if (el < 2400) inkRaf = requestAnimationFrame(ink);
      };
      inkRaf = requestAnimationFrame(ink);
      closeRef.current?.focus({ preventScroll: true });
    };
    const closeDetail = () => {
      if (!isOpen) return;
      const r = coverRect();
      cancelAnimationFrame(inkRaf);
      stopAnims();
      dialog.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
      const a = dialog.animate(
        [
          { clipPath: "inset(0px 0px 0px 0px round 0px)", transform: "rotate(0deg)" },
          { clipPath: inset(r), transform: `rotate(${TILT}deg)` },
        ],
        { duration: reduced ? 1 : 850, easing: "cubic-bezier(.76,0,.18,1)", fill: "both" }
      );
      a.onfinish = () => {
        dialog.style.visibility = "hidden";
        a.cancel();
        stopAnims();
        document.documentElement.style.overflow = "";
        isOpen = false;
        root.focus({ preventScroll: true });
      };
    };
    api.current = { open: openDetail, close: closeDetail, go, goTo };

    // ---- frame ----
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.max(0, Math.min(0.05, (t - last) / 1000));
      last = t;

      const k = reduced ? 1 : dragging ? 18 : 5.2;
      s += (T - s) * (reduced ? 1 : 1 - Math.exp(-k * dt));
      if (Math.abs(T - s) < 1e-4) s = T;
      if (Math.abs(s) > 4 * M) {
        const shift = Math.round(s / M) * M;
        s -= shift;
        T -= shift;
      }

      const a = mod(Math.round(s), N);
      if (a !== activeIdx) {
        const dir = Math.sign(T - s) || 1;
        activeIdx = a;
        swapCaption(a, dir);
        setActive(a);
      }

      // cursor + tilt
      const rect = area.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const midY = rect.top + rect.height / 2;
      const settled = Math.abs(T - s) < 0.3;
      onCover = !isOpen && inside && settled && Math.abs(mx - midX) < 0.55 * d && Math.abs(my - midY) < 0.55 * H;
      const ek = reduced ? 1 : 1 - Math.exp(-7 * dt);
      const tyT = onCover ? ((mx - midX) / (0.55 * d)) * 9 : inside ? ((mx - midX) / Math.max(1, rect.width)) * 5 : 0;
      const txT = onCover ? (-(my - midY) / (H / 2)) * 6 : 0;
      tiltY += (tyT - tiltY) * ek;
      tiltX += (txT - tiltX) * ek;

      const ck = reduced ? 1 : 1 - Math.exp(-16 * dt);
      cx += (mx - cx) * ck;
      cy += (my - cy) * ck;
      const cur = cursorRef.current;
      if (cur) {
        cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
        const overSpine = inside && hover >= 0 && Math.abs(mod(hover - s + M / 2, M) - M / 2) > 0.5;
        cur.dataset.state = !inside || !finePointer ? "off" : onCover ? "open" : overBtn ? "btn" : overSpine ? "spine" : "default";
      }

      // tapes
      const limit = rect.width / 2 + 1.5 * d;
      for (let v = 0; v < M; v++) {
        const el = tapeRefs.current[v];
        if (!el) continue;
        const r = mod(v - s + M / 2, M) - M / 2;
        const x = r * step + (d - ws + 1.6 * gap) * B(r);
        if (Math.abs(x) > limit) {
          if (el.style.visibility !== "hidden") el.style.visibility = "hidden";
          continue;
        }
        if (el.style.visibility !== "visible") el.style.visibility = "visible";
        const o = smooth(Math.max(0, 1 - Math.abs(r)));
        const target = hover === v && Math.abs(r) > 0.5 ? 1 : 0;
        lift[v] += (target - lift[v]) * (reduced ? 1 : 1 - Math.exp(-12 * dt));
        const ry = -90 * o + tiltY * o;
        const y = -o * 0.025 * H - lift[v] * 0.045 * H;
        el.style.transform = `translate3d(${x}px,${y}px,${o * 0.2 * H}px) rotateZ(${TILT * o}deg) rotateX(${tiltX * o}deg) rotateY(${ry}deg)`;
        el.style.zIndex = String(Math.round(100 - Math.abs(r) * 4));
        el.style.setProperty("--o", String(o));
        el.style.setProperty("--shade-sp", String(o * 0.55));
        el.style.setProperty("--shade-cv", String((1 - o) * 0.5));
      }

      const ring = ringRef.current;
      if (ring) {
        const sc = isOpen ? 0 : smooth(Math.max(0, 1 - Math.abs(T - s) * 3));
        ring.style.transform = `translate(-50%,-50%) scale(${sc})`;
        ring.tabIndex = sc > 0.5 ? 0 : -1;
      }
    };
    last = performance.now();
    raf = requestAnimationFrame(frame);

    // Only spend frames while the shelf is on screen.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(root);

    // initial caption already server-rendered; sync tape positions on first paint
    // ---- input ----
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!inside) {
        cx = mx;
        cy = my;
      }
      const r = root.getBoundingClientRect();
      inside = mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;
      overBtn = inside && !!(e.target as HTMLElement).closest?.("button, a") && !(e.target as HTMLElement).closest?.("[data-v]");
      if (pressed && !dragging && Math.abs(e.clientX - dragStartX) > 5) dragging = true;
      if (dragging) T = dragT0 - (e.clientX - dragStartX) / step;
    };
    const onUp = () => {
      pressed = false;
      if (dragging) {
        dragging = false;
        suppressClick = true;
        setTimeout(() => (suppressClick = false), 0);
        snap();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (isOpen || e.button !== 0) return;
      pressed = true;
      dragStartX = e.clientX;
      dragT0 = T;
    };
    const onLeave = () => {
      inside = false;
      hover = -1;
    };
    const onWheel = (e: WheelEvent) => {
      if (isOpen) return;
      // Horizontal gestures scrub the shelf; vertical wheel keeps scrolling the page.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      T += (e.deltaX / step) * 0.5;
      clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(snap, 160);
    };
    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    const tapeClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-v]");
      if (!el || isOpen) return;
      const v = Number(el.dataset.v);
      const r = mod(v - s + M / 2, M) - M / 2;
      if (Math.abs(r) < 0.5) openDetail();
      else T = Math.round(T + r);
    };
    const tapeOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-v]");
      hover = el ? Number(el.dataset.v) : -1;
    };
    const onKey = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === "Escape") closeDetail();
        return;
      }
      if (e.target !== root) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        openDetail();
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") closeDetail();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onEsc);
    area.addEventListener("pointerdown", onDown);
    area.addEventListener("pointerover", tapeOver);
    area.addEventListener("click", onClickCapture, true);
    area.addEventListener("click", tapeClick);
    area.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(inkRaf);
      clearTimeout(wheelTimer);
      io.disconnect();
      ro.disconnect();
      stopAnims();
      document.documentElement.style.overflow = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onEsc);
      area.removeEventListener("pointerdown", onDown);
      area.removeEventListener("pointerover", tapeOver);
      area.removeEventListener("click", onClickCapture, true);
      area.removeEventListener("click", tapeClick);
      area.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("keydown", onKey);
    };
  }, [mounted]);

  const goTheme = useCallback((i: number) => api.current.goTo(firstOfTheme[i]), [firstOfTheme]);
  const findUrl = book.isbn ? `https://openlibrary.org/isbn/${book.isbn}` : null;

  const lbl = "text-[10.5px] font-semibold uppercase leading-none tracking-[.09em]";

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      aria-label="Bookshelf. Use the arrow keys to browse and Enter to open a book."
      className="shelf-root relative select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {/* decade-style tabs: one per theme */}
      <nav ref={tabsRef} aria-label="Themes" className="relative mx-auto mb-2 flex w-fit max-w-full overflow-x-auto">
        <span ref={indicatorRef} aria-hidden className="absolute left-0 top-0 h-[23px] bg-primary transition-[width,transform] duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none" style={{ width: 0 }} />
        {THEMES.map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            onClick={() => goTheme(i)}
            aria-pressed={i === themeIdx}
            className={cn(
              lbl,
              "relative -ml-px h-[23px] whitespace-nowrap border border-foreground/90 px-[9px] transition-colors duration-[450ms] first:ml-0 sm:px-[11px]",
              i === themeIdx ? "text-white" : "text-foreground"
            )}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </nav>

      {/* the shelf */}
      <section ref={areaRef} aria-label="Bookshelf" className="shelf-area relative overflow-hidden [perspective:2200px] [perspective-origin:50%_50%] [touch-action:pan-y]" style={{ height: "calc(var(--H) + 80px)" }}>
        <div className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]">
          {Array.from({ length: M }, (_, v) => {
            const b = books[v % N];
            return (
              <div
                key={v}
                ref={(el) => {
                  tapeRefs.current[v] = el;
                }}
                data-v={v}
                aria-hidden
                className="absolute left-0 top-0 h-0 w-0 cursor-pointer [transform-style:preserve-3d] [will-change:transform]"
                style={{ visibility: "hidden" }}
              >
                {/* spine: the front of the box */}
                <div
                  className="shelf-sp absolute overflow-hidden rounded-[2px] [backface-visibility:hidden]"
                  style={{ width: "var(--ws)", height: "var(--H)", left: "calc(var(--ws) / -2)", top: "calc(var(--H) / -2)", transform: "translateZ(calc(var(--d) / 2))", background: b.color, color: b.ink }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-between py-[7%]" style={{ boxShadow: "inset 2px 0 0 rgba(255,255,255,.18), inset -2px 0 0 rgba(0,0,0,.2)" }}>
                    <span className="font-mono text-[max(7px,calc(var(--ws)*.2))] tracking-wider opacity-70">{b.year}</span>
                    <span
                      className="min-h-0 flex-1 overflow-hidden px-1 py-2 text-center font-semibold leading-none tracking-[-0.01em] [text-orientation:mixed] [writing-mode:vertical-rl]"
                      style={{ fontSize: "max(9px, calc(var(--ws) * .3))", textOverflow: "ellipsis" }}
                    >
                      {b.title}
                    </span>
                    <span className="max-w-full truncate px-0.5 text-[max(7px,calc(var(--ws)*.2))] font-medium uppercase tracking-[.08em] opacity-80 [writing-mode:vertical-rl] [height:22%]">{surname(b.author)}</span>
                  </div>
                  <span className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: "var(--shade-sp, .55)" }} />
                </div>
                {/* cover: the right-hand side of the box */}
                <div
                  className="shelf-cv absolute overflow-hidden rounded-[2px] bg-neutral-200 [backface-visibility:hidden]"
                  style={{ boxShadow: "0 calc(30px * var(--o, 0)) calc(60px * var(--o, 0)) calc(-28px * var(--o, 0)) rgba(20,16,10,calc(.55 * var(--o, 0)))", width: "var(--d)", height: "var(--H)", left: "calc(var(--d) / -2)", top: "calc(var(--H) / -2)", transform: "rotateY(90deg) translateZ(calc(var(--ws) / 2))" }}
                >
                  <CoverFace b={b} />
                  <span className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: "var(--shade-cv, .5)" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* play ring on the active cover's lower-left corner */}
        <button
          ref={ringRef}
          type="button"
          onClick={() => api.current.open()}
          aria-label={`Open ${book.title}`}
          className="absolute z-[150] flex h-[42px] w-[42px] items-center justify-center rounded-full border border-primary bg-white/80 text-primary"
          style={{ left: "calc(50% - var(--d) * .5 - 6px)", top: "calc(50% + var(--H) * .36)", transform: "translate(-50%,-50%) scale(0)" }}
        >
          <Play className="ml-0.5 h-3 w-3 fill-current" />
        </button>
      </section>

      {/* caption, with the arrows either side */}
      <div className="mt-2 flex items-start justify-between gap-2 px-1">
        <button type="button" onClick={() => api.current.go(-1)} aria-label="Previous book" className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-muted">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div ref={capRef} aria-live="polite" className="pointer-events-none flex min-w-0 flex-1 flex-col items-center gap-[7px]">
          <div ref={titleMask} className="relative h-[1.2em] w-full overflow-hidden text-center text-[clamp(20px,3vw,28px)] font-semibold leading-[1.2] tracking-[-0.02em]">
            <span className="block w-full">{books[0].title}</span>
          </div>
          <div ref={subMask} className="relative h-[1.1em] w-full overflow-hidden text-center text-sm font-medium leading-[1.1] text-primary">
            <span className="block w-full">{books[0].author}</span>
          </div>
          <div ref={yearMask} className="relative h-[1.1em] w-full overflow-hidden text-center text-[11px] leading-[1.1] tracking-[.06em] text-muted-foreground">
            <span className="block w-full">
              {books[0].year} · {books[0].theme}
            </span>
          </div>
        </div>
        <button type="button" onClick={() => api.current.go(1)} aria-label="Next book" className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-muted">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* every title as text, for readers and parsers */}
      <ul className="sr-only" aria-label="Books on the shelf">
        {books.map((b, i) => (
          <li key={b.id}>
            <button type="button" onClick={() => {
                api.current.goTo(i);
                api.current.open();
              }}>
              {b.title} by {b.author}, {b.year}. {b.summary}
            </button>
          </li>
        ))}
      </ul>

      {/* detail sheet, grown out of the cover */}
      {mounted &&
        createPortal(
          <>
          <div ref={cursorRef} aria-hidden data-state="off" className="shelf-cursor">
            <span className="shelf-cursor-ring" />
            <span className="shelf-cursor-dot" />
            <span className="shelf-cursor-label">Open</span>
          </div>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${book.title} by ${book.author}`}
            className="fixed inset-0 z-[200] overflow-y-auto bg-white"
            style={{ visibility: "hidden" }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => api.current.close()}
              className={cn(lbl, "absolute left-4 top-5 z-10 inline-flex h-[21px] items-center border border-foreground/90 px-2 text-foreground sm:left-8 sm:top-8")}
            >
              Close
            </button>
            <div className="mx-auto grid min-h-full max-w-[1200px] grid-cols-1 items-center gap-6 px-[22px] pb-10 pt-[84px] md:grid-cols-2 md:gap-[4vw] md:px-[6vw] md:pb-14 md:pt-[110px]">
              <div className="order-first mx-auto flex h-[46svh] max-h-[78vh] justify-center md:order-last md:h-[min(78vh,100%)]" style={{ aspectRatio: "2/3" }}>
                <svg viewBox="0 0 474 711" className="h-full w-full" aria-hidden>
                  <defs>
                    <filter id={`ink-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="7" result="n" />
                      <feDisplacementMap in="SourceGraphic" in2="n" scale="120" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                    <mask id={`m-${uid}`} maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1100">
                      <g filter={`url(#ink-${uid})`} fill="#fff">
                        {BLOBS.map((bl, i) => (
                          <circle
                            key={i}
                            ref={(el) => {
                              blobRefs.current[i] = el;
                            }}
                            cx={bl.cx}
                            cy={bl.cy}
                            r="0"
                          />
                        ))}
                      </g>
                    </mask>
                  </defs>
                  <g mask={`url(#m-${uid})`}>
                    <rect width="474" height="711" fill={book.color} />
                    <text x="40" y="560" fill={book.ink} fontSize="44" fontWeight="700">
                      {book.title.length > 18 ? book.title.slice(0, 18) + "…" : book.title}
                    </text>
                    <text x="40" y="600" fill={book.ink} fontSize="22" opacity=".8">
                      {book.author}
                    </text>
                    {book.isbn && <image href={coverUrl(book.isbn)} x="0" y="0" width="474" height="711" preserveAspectRatio="xMidYMid slice" />}
                  </g>
                </svg>
              </div>
              <div className="flex max-w-[520px] flex-col gap-[18px] md:justify-self-end">
                <div className="overflow-hidden">
                  <p data-rise className={cn(lbl, "font-medium text-primary")}>
                    {book.author}
                  </p>
                </div>
                <div className="overflow-hidden">
                  <h3 data-rise className="text-[clamp(36px,5vw,72px)] font-semibold leading-none tracking-[-0.03em] text-foreground">
                    {book.title}
                  </h3>
                </div>
                <div className="overflow-hidden">
                  <p data-rise className={cn(lbl, "text-muted-foreground")}>
                    {book.year} / {book.theme}
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p data-rise className="max-w-[42ch] text-[16px] leading-relaxed text-foreground md:text-[17px]">
                    {book.summary}
                  </p>
                </div>
                {findUrl && (
                  <div className="overflow-hidden pt-2">
                    <a
                      data-rise
                      href={findUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(lbl, "inline-flex h-11 items-center border border-primary px-5 text-primary transition-colors hover:bg-primary hover:text-white")}
                    >
                      Find this book
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          </>,
          document.body
        )}
    </div>
  );
}
