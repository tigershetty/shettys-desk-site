# Security hardening report — 2026-07-28

## Executive summary

This branch adds the amber Shetty's Desk browser icon and hardens the public
Next.js application against common web abuse. The production dependency tree
now has zero known npm advisories, the production build passes, and all changed
source files pass ESLint.

No public website can be guaranteed impossible to attack. These changes reduce
the practical attack surface and provide safe defaults; Vercel's account-level
WAF rate limiting remains an optional additional control.

## Scope

- Next.js application and public assets
- Contact and cache-revalidation API routes
- Response headers and Content Security Policy
- Package and image-optimizer exposure
- Browser icon and web app manifest

## Findings and remediations

### SEC-01 — High — Vulnerable production dependencies

- **Evidence:** The initial production audit reported three high-severity
  findings affecting Next.js, PostCSS, and Sharp.
- **Impact:** Depending on the affected path, the advisories included denial of
  service, request-routing bypass, server-side request forgery, and image
  processing vulnerabilities.
- **Remediation:** Updated Next.js and its matching lint configuration, pinned
  patched PostCSS and Sharp versions, and pinned patched transitive glob
  libraries.
- **Verification:** `npm audit --json` reports zero vulnerabilities across
  production and development dependencies.
- **Status:** Fixed.

### SEC-02 — High — Missing browser security policy

- **Location:** `proxy.ts`, `next.config.ts`
- **Evidence:** The site previously returned no Content Security Policy and had
  no explicit clickjacking, MIME-sniffing, referrer, browser-capability, or
  cross-origin isolation headers.
- **Impact:** A successful injection or embedding attack would have had fewer
  browser-enforced limits.
- **Remediation:** Added a per-request script nonce with `strict-dynamic`,
  blocked inline script attributes, plugins, framing, unsafe base URLs, and
  cross-origin forms, and added defensive response headers. Existing inline
  React style attributes require `style-src 'unsafe-inline'`; scripts do not.
- **Tradeoff:** Nonce-based CSP requires dynamic rendering for HTML routes,
  which reduces static/CDN HTML caching but materially strengthens script
  execution controls.
- **Verification:** Local responses contain a fresh CSP nonce and all expected
  headers; the production build passes.
- **Status:** Fixed.

### SEC-03 — High — Contact endpoint abuse and privacy exposure

- **Location:** `app/api/contact/route.ts`,
  `components/ContactForm.tsx`
- **Evidence:** The endpoint accepted loosely validated JSON, logged submitted
  email/message content, and had no request-size, origin, bot, or rate limits.
- **Impact:** Spam, resource exhaustion, and unnecessary personal-data exposure
  in logs.
- **Remediation:** Added same-origin enforcement, JSON and 8 KiB request limits,
  allow-listed topics, email/message bounds, a honeypot, no-store responses,
  removal of personal-data logging, and a five-request/ten-minute in-process
  rate limiter.
- **Verification:** Valid request returns 200, invalid input returns 400,
  cross-origin request returns 403, and requests six and seven return 429.
- **Residual risk:** The limiter is best-effort per server instance. Distributed
  enforcement should use Vercel WAF rate limiting if its additional usage cost
  is approved.
- **Status:** Fixed with documented residual risk.

### SEC-04 — High — Revalidation secret accepted in a URL

- **Location:** `app/api/revalidate/route.ts`
- **Evidence:** Revalidation could be triggered by GET and accepted its secret
  in the query string.
- **Impact:** Secrets in URLs can leak through browser history, proxies, logs,
  and analytics. GET also made a state-changing action easier to trigger.
- **Remediation:** POST only, `Authorization: Bearer` only, constant-time
  secret comparison, no-store responses, and fail-closed 404 behavior when the
  secret is not configured.
- **Verification:** GET returns 405; POST returns 404 when the environment
  secret is absent.
- **Status:** Fixed.

### SEC-05 — Medium — Unbounded remote image optimizer

- **Location:** `next.config.ts`, `lib/articles.ts`
- **Evidence:** The image optimizer accepted HTTPS images from any hostname.
- **Impact:** It unnecessarily expanded the server-side fetch and image-decoding
  surface.
- **Remediation:** Removed the wildcard remote pattern and allow only local
  image/motion paths in article data. External article links remain limited to
  relative or HTTPS URLs.
- **Status:** Fixed.

### SEC-06 — Informational — Default browser icon

- **Location:** `public/images/favicon-mark.png`,
  `public/images/favicon-mark-32.png`,
  `public/images/apple-touch-icon.png`, `app/layout.tsx`, `app/manifest.ts`
- **Evidence:** The old icon was the default Vercel triangle.
- **Remediation:** Replaced it with a centered transparent amber Shetty's Desk
  mark and registered it for browser tabs, shortcuts, Apple touch icons, and
  the web app manifest.
- **Status:** Fixed.

## Verification record

- Production build: passed
- TypeScript: passed as part of the production build
- Changed-file ESLint: passed
- Full dependency audit: zero known vulnerabilities
- CSP/header checks: passed
- Contact validation, origin, honeypot, size, and burst checks: passed
- Revalidation method/fail-closed checks: passed
- Local final-build headers, CSP, favicon, and manifest: passed
- Final-build visual check: passed locally with zero browser-console errors;
  the protected preview redirects unauthenticated browsers to Vercel login

## Existing out-of-scope lint debt

The repository-wide lint command still reports twelve pre-existing errors in
animation/presentation components that this branch does not modify. They are
primarily React hook immutability/effect rules and explicit `any` types. The
changed security and favicon files themselves lint cleanly.
