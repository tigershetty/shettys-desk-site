# Website recon and security review — 2026-09-12

## Executive summary

The Experience page was reachable over HTTPS but failed in a browser because its
interactive Spline scene needed a WebAssembly runtime that the Content Security
Policy (CSP) blocked. The repair permits only the exact required CDN and the
browser's dedicated WebAssembly CSP token; it does not add broad script
execution permission. An error boundary also keeps the page usable if the
optional third-party visual fails in the future.

The dependency audit now reports zero known npm vulnerabilities, and the
production build and browser check pass.

## Resolved findings

### AVAIL-001 — High — Experience page could be blanked by a third-party visual error

- **Location:** `components/InteractiveRobotSpline.tsx`, `proxy.ts`
- **Evidence:** the Spline runtime requested a pinned WebAssembly binary from
  `https://unpkg.com/@splinetool/modelling-wasm@1.12.97/build/process.wasm`.
  The deployed policy permitted only `prod.spline.design`, so the browser
  rejected the runtime and React surfaced an uncaught component error.
- **Impact:** visitors could see an unusable Experience page despite the route
  returning HTTP 200.
- **Fix:** allow only `https://unpkg.com` for network connections, add
  `'wasm-unsafe-eval'` (not `'unsafe-eval'`) to production `script-src`, pin the
  WASM path to the installed Spline runtime version, and wrap the optional
  visual in a React error boundary.
- **Verification:** production build succeeded; the browser loaded the scene
  and the WebAssembly resource with no Spline runtime errors.

### NEXT-SUPPLY-001 — High — Framework and image-processing dependency advisories

- **Location:** `package.json`, `package-lock.json`
- **Evidence:** the installed application was on Next.js 16.2.12 before the
  review, and the initial `npm audit` reported vulnerable dependency paths.
- **Impact:** known framework and transitive dependency vulnerabilities could
  expose the public site to published attacks.
- **Fix:** upgraded Next.js and its ESLint configuration to 16.3.5; upgraded
  the affected `brace-expansion` and `sharp` overrides.
- **Verification:** `npm audit` reports 0 critical, 0 high, 0 moderate, 0 low.

## Security controls verified

- CSP is response-header delivered with a per-request nonce, strict-dynamic,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and
  `frame-ancestors 'none'`.
- Runtime headers include HSTS, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, a strict referrer policy, COOP/CORP, and a restricted
  Permissions-Policy.
- The canonical redirect sends `tigershetty.com` to
  `https://www.tigershetty.com`.
- The contact endpoint has same-origin validation, request-size and field
  limits, a honeypot, and bounded per-client rate limiting. It does not log
  submitted contact information.
- The revalidation endpoint is disabled without its environment secret and
  uses a Bearer header with timing-safe comparison when enabled.
- The Notion token is in a server-only module. Public URLs loaded from Notion
  are constrained to relative paths or HTTPS.
- The downloadable resource uses a fixed server-side path and attachment
  disposition; it does not accept a user-supplied filename or path.
- The active scan found no `dangerouslySetInnerHTML`, DOM HTML injection,
  dynamic code execution, open redirect, permissive CORS, service worker, or
  client-side secret pattern in application code.

## Remaining operational note

The Spline scene asks the browser for one embedded `data:` video asset. The
current CSP intentionally blocks it because `media-src` does not allow `data:`.
The interactive robot and the Experience page still render correctly. Keeping
this block is the safer default; if the visual later depends on that asset, the
preferred fix is to replace it with a first-party or explicitly hosted media
file rather than broaden the production policy.

## Validation record

- `npx eslint components/InteractiveRobotSpline.tsx proxy.ts next.config.ts`
- `npm run build`
- `npm audit` — zero known vulnerabilities
- Production-mode browser check of `/experience` — page content and interactive
  robot rendered; Spline scene and pinned WASM resource returned HTTP 200.
