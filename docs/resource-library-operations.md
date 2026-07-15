# Resource Library Operations

## Phase 1 Release Gate

Before merging a resource-library change to `main`:

1. Confirm the Vercel preview build is successful.
2. Review the resource index and detail page at desktop and mobile widths.
3. Submit one real email address through the preview form.
4. Confirm the subscriber exists in the selected newsletter provider.
5. Confirm the returned download URL expires and the ZIP matches the release version.
6. Confirm the pack opens with its manifest, quick start, sample data, expected outputs, and validation instructions intact.
7. Merge through an approved pull request; never bypass the protected branch.

## Newsletter Configuration

The application-facing contract lives in `lib/newsletter/types.ts`. Resource routes call `lib/subscriber.ts`; they do not know which provider is active.

Vercel configuration:

```text
NEWSLETTER_PROVIDER=beehiiv
NEWSLETTER_API_KEY=<provider API key>
NEWSLETTER_AUDIENCE_ID=<beehiiv Publication ID>
RESOURCE_DOWNLOAD_SECRET=<long random value>
NEXT_PUBLIC_SITE_URL=https://shettysdesk.vercel.app
```

Generate the signing secret locally with `openssl rand -hex 32`. Store all values in Vercel Environment Variables, never in Git or chat.

## Switching Providers

1. Implement `NewsletterProvider` in a new file under `lib/newsletter/`.
2. Register the adapter in `getNewsletterProvider()`.
3. Map `NEWSLETTER_API_KEY` and `NEWSLETTER_AUDIENCE_ID` inside the adapter.
4. Add an adapter-level subscription test.
5. Change `NEWSLETTER_PROVIDER` in Vercel and test on Preview before Production.

The landing page, consent form, signed-download route, and resource pack should remain unchanged.
