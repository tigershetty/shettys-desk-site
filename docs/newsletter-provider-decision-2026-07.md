# Newsletter Provider Decision - July 2026

## Decision

Defer newsletter integration for Phase 1. The first resource ships as a direct download with no email requirement.

If Shetty's Desk later starts a recurring field-notes newsletter, use **beehiiv Launch** as the first provider to evaluate. The research below is retained so the integration can be resumed without repeating the provider audit.

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

## Deferred Integration Shape

The current website owns the landing page and direct download. It does not collect a subscriber record. If newsletter capture is introduced later, the resource API should call a provider-neutral adapter so landing pages remain vendor-independent.

Potential future Vercel variables:

```text
NEWSLETTER_PROVIDER=beehiiv
NEWSLETTER_API_KEY
NEWSLETTER_AUDIENCE_ID
RESOURCE_DOWNLOAD_SECRET
NEXT_PUBLIC_SITE_URL
```

For beehiiv, `NEWSLETTER_AUDIENCE_ID` would be the Publication ID. No credential belongs in Git. None of these variables are required for the Phase 1 direct-download release.
