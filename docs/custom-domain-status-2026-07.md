# Custom Domain Status - July 14, 2026

## Current State

- Vercel project: `tigershettys-projects/shettys-desk-site`
- Active project URL: `https://shettysdesk.vercel.app`
- Custom domains attached to the Vercel account: `0`
- DNS answer for `shettysdesk.com`: none
- Registry lookup for `shettysdesk.com`: no matching registration found

## Decision

Use `shettysdesk.vercel.app` as the Phase 1 canonical URL. The code reads `NEXT_PUBLIC_SITE_URL`, so no page rewrite is required when a custom domain is purchased and attached.

## To Activate shettysdesk.com Later

1. Purchase the domain through a registrar or Vercel.
2. Add `shettysdesk.com` and `www.shettysdesk.com` under the project's Vercel Domains settings.
3. Apply the DNS records Vercel provides.
4. Set `NEXT_PUBLIC_SITE_URL=https://shettysdesk.com` in Vercel.
5. Redeploy and verify canonical, Open Graph, resource, and download URLs.
