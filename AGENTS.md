# Shetty's Desk Website

Next.js website for the Shetty's Desk brand. Git-connected Vercel previews are the approval surface before production.

## Working Rules

- Work on a `codex/*` branch. Do not push or merge without explicit approval.
- Preserve the existing editorial visual system: white field, black borders, indigo, teal, amber, and restrained motion.
- Reuse the sidebar, typography, spacing, and existing interaction patterns before creating new visual language.
- Never commit `.env` files, provider credentials, subscriber data, or production exports.
- Keep downloads outside `public/`; deliver them through the controlled resource endpoint.
- Every resource needs a version, update date, package manifest, expected output, limitations, and a planner/user review boundary.
- Every runnable pack needs a beginner start-here guide that names the first safe run, exact files to replace, required fields, expected outputs, and common failure modes.
- Publish a post only when its caption and final still have both been explicitly approved. Do not substitute drafts, inferred copy, placeholder URLs, or estimated engagement metrics.
- Preserve each approved visual at its native aspect ratio. Motion is an optional companion; the approved still remains the canonical post artifact.
- Test new pages at desktop and mobile widths before requesting deployment approval.

## Resource Library

- Index: `app/resources/page.tsx`
- Resource pages: `app/resources/<slug>/page.tsx`
- Download source packages: `resource-packs/<slug>/`
- Private release archives: `private/resources/`
- Public preview media: `public/resources/<slug>/`
- Download APIs: `app/api/resources/<slug>/download/`

The downloadable pack is the product. The landing page must demonstrate the method and provide a direct download without requiring personal information.
