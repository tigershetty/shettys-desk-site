# Switching to shettysdesk.com

The code now treats **https://www.shettysdesk.com** as the site's address
(`lib/site.ts`: canonical URL, OG image base, resource page URLs). The old
address keeps working until you switch the redirect on, so merging this branch
cannot take the site down.

## Where it stands (29 Oct)

- `www.shettysdesk.com` and `shettysdesk.com` are attached to the Vercel
  project and verified. `www` serves the site (HTTP 200, no DNS warning).
- **The apex `shettysdesk.com` has no DNS records, so it does not resolve.**
  Vercel flags it as misconfigured. In Cloudflare → DNS add, **DNS only**
  (grey cloud):
  - `A` · `@` · `216.198.79.1`
  - `A` · `@` · `64.29.17.1`

  (Vercel's other accepted value for the apex is `76.76.21.21`.) `www` is
  already a `CNAME` to `3fe7a64a9ae8d951.vercel-dns-017.com`.
- `tigershetty.com` still serves the site, as intended, until the switch below.

## Order of operations

1. **Attach the domain in Vercel.** Done.
2. **Point DNS at Vercel.** `www` is done; add the two apex records above.
3. **Wait until `https://shettysdesk.com` redirects to `https://www.shettysdesk.com`.**
4. **In Vercel → Settings → Environment Variables (Production)** add
   `NEXT_PUBLIC_SITE_URL = https://www.shettysdesk.com` (if one already exists
   for the old address, change it) and `REDIRECT_LEGACY_DOMAIN = 1`, then
   redeploy.
5. **Repoint the old redirects.** The `*.vercel.app` project domains currently
   redirect to `www.tigershetty.com`; change their redirect target to
   `www.shettysdesk.com`.
6. Update the LinkedIn profile and article links, and re-check Search Console.

Do not set `REDIRECT_LEGACY_DOMAIN` before step 3: the old address would
redirect to a domain that does not answer yet.
