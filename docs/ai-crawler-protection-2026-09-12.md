# AI crawler protection — 2026-09-12

## Objective

Reduce AI training, AI-answer, and bulk-scraping access while preserving normal
search-engine indexing. A public page cannot be made impossible to copy: any
visitor (or a bot impersonating one) can read the bytes that a browser receives.
The controls below combine machine-readable preferences, Cloudflare enforcement,
and abuse mitigation to make compliant crawling opt out and non-compliant bulk
collection harder and more visible.

## Implemented in the application

- `/robots.txt` now returns `200` rather than `404`.
- It allows ordinary search indexing but declares
  `ai-input=no` and `ai-train=no` through Content Signals.
- It explicitly disallows known frontier-model, AI-search, and dataset crawlers,
  including GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot,
  Claude-SearchBot, Google-Extended, PerplexityBot, Amazonbot, and Meta's
  external-agent crawlers.
- The `Content-Signal: search=yes, ai-input=no, ai-train=no` response header is
  added to the site so Cloudflare's AI-aware content delivery uses the origin
  policy rather than a permissive default.

These declarations are respected by well-behaved operators but are not a
technical block on a malicious scraper.

## Cloudflare enforcement to enable

Cloudflare's current controls are the necessary enforcement layer:

1. **Security Settings → Bot traffic:** turn on **Block AI bots**. This uses a
   Cloudflare-managed, updating block rule for known AI crawlers.
2. In the same area, turn on **AI Labyrinth**. It targets non-compliant AI
   scrapers that ignore crawler guidance without changing normal visitor paths.
3. Turn on **Managed robots.txt** / **Set your preference to block training in
   robots.txt**. Cloudflare will maintain additional crawler directives as its
   bot list changes.
4. **AI Crawl Control → Crawlers:** set every observed AI crawler to **Block**.
   Review the Overview and Directives tabs monthly; Cloudflare records both
   crawler activity and violations of the robots directives.
5. **Security → WAF → Rate limiting rules:** add a conservative, site-wide rule
   for repeated page fetches, with an exception for verified search engines.
   Start in log/simulate mode and tune using traffic analytics so normal readers
   and LinkedIn visitors are not challenged by mistake.

Do not use a blanket `User-agent: *` block: it would also harm normal search
indexing and link previews. Do not rely on `robots.txt` alone: it is voluntary.

## Existing controls and remaining risks

- The public application already has CSP, clickjacking protection, HSTS,
  restrictive browser permissions, safe download handling, origin checks, and
  a best-effort contact-form rate limit.
- The contact-form limiter is per server instance. Cloudflare rate limiting is
  needed for resilient, distributed enforcement.
- Cloudflare cannot identify every bot on its free-plan user-agent matching;
  a scraper can impersonate a browser. Keeping high-value or unpublished
  material behind authentication is the only reliable way to prevent access.
