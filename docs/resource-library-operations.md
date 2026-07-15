# Resource Library Operations

## Phase 1 Release Gate

Before merging a resource-library change to `main`:

1. Confirm the Vercel preview build is successful.
2. Review the resource index and detail page at desktop and mobile widths.
3. Download the ZIP from the visible call to action.
4. Confirm the response filename, content type, and archive checksum match the release version.
5. Confirm the pack opens with its manifest, quick start, sample data, expected outputs, and validation instructions intact.
6. Merge through an approved pull request; never bypass the protected branch.

## Download Configuration

The archive remains outside `public/` and is delivered by the resource-specific download route. Phase 1 does not collect an email address and does not require a newsletter account, API key, database, or signing secret.

Vercel configuration:

```text
NEXT_PUBLIC_SITE_URL=https://shettysdesk.vercel.app
```

`NEXT_PUBLIC_SITE_URL` controls canonical metadata. The project falls back to `https://shettysdesk.vercel.app`, so the direct download remains executable even before this optional variable is set.

## Newsletter Later

Add audience capture only after the newsletter has a clear cadence and publishing promise. Keep any future provider behind a neutral adapter and restore consent, unsubscribe, and privacy language before collecting an address.
