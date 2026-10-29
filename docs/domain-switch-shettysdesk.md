# Switching to shettysdesk.com

The code now treats **https://www.shettysdesk.com** as the site's address
(`lib/site.ts`: canonical URL, OG image base, resource page URLs). The old
address keeps working until you switch the redirect on, so merging this branch
cannot take the site down.

## Order of operations

1. **Attach the domain in Vercel.** Project → Settings → Domains → add
   `www.shettysdesk.com` (production) and `shettysdesk.com` (redirect to www,
   308), the same way `tigershetty.com` is set up today.
2. **Point DNS at Vercel** (Cloudflare, since that is where the domain lives).
   Vercel shows the exact values when you add the domain; the standard ones are:
   - `A` record, name `@`, value `76.76.21.21`
   - `CNAME` record, name `www`, value `cname.vercel-dns.com`
   - Set both to **DNS only** (grey cloud). The site's bot protection runs in
     Vercel, and Cloudflare's proxy in front of it adds a second place for
     things to fail.
3. **Wait until Vercel shows both domains as verified**, and
   `https://www.shettysdesk.com` loads the site.
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
