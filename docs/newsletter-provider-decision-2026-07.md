# Newsletter Provider Decision - July 2026

## Decision

Use **beehiiv Launch** for the Phase 1 resource library.

## Why beehiiv Wins This Specific Use Case

- free for up to 2,500 subscribers;
- unlimited email sends;
- API access is explicitly included on the free Launch plan;
- the subscription API supports acquisition fields and double-opt-in settings;
- custom domains and a creator newsletter surface are available when needed;
- the website can keep its own visual system and unlock a signed ZIP immediately after a successful subscription.

Official pricing: https://www.beehiiv.com/pricing  
Official create-subscription API: https://developers.beehiiv.com/api-reference/subscriptions/create

## Alternatives Reviewed

### Kit Newsletter Plan

Kit has the most generous audience allowance: up to 10,000 subscribers, unlimited forms, unlimited sends, and one basic sequence. It is the best free option when using Kit's own embedded form and opt-in incentive delivery. Its free-plan API eligibility is not stated clearly enough to make a custom API integration the Phase 1 dependency.

Official plan: https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan  
Official content-upgrade setup: https://help.kit.com/en/articles/2502644-grow-your-list-with-content-upgrades

### MailerLite Free

The June 2026 update reduced the free allowance to 250 active subscribers and 2,500 monthly emails. It is too small for a LinkedIn-led resource library.

Official update: https://www.mailerlite.com/help/free-plan-update-faq

## Integration Shape

The website owns the landing page, consent language, and signed download. The resource API calls a provider-neutral `NewsletterProvider` interface; the selected adapter owns the subscriber record and future broadcasts. Phase 1 ships with a beehiiv adapter, while resource pages and API routes remain vendor-independent. A later provider change should require a new adapter and environment change, not a rewrite of the download flow.

Required Vercel variables:

```text
NEWSLETTER_PROVIDER=beehiiv
NEWSLETTER_API_KEY
NEWSLETTER_AUDIENCE_ID
RESOURCE_DOWNLOAD_SECRET
NEXT_PUBLIC_SITE_URL
```

For beehiiv, `NEWSLETTER_AUDIENCE_ID` is the Publication ID. The adapter temporarily accepts the legacy `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` names so an existing preview cannot break during migration.

No credential belongs in Git. Local visual testing uses `RESOURCE_SIGNUP_PREVIEW=true`; production refuses to issue a download if the selected provider or signing secret is missing.
