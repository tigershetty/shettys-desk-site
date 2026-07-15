import {
  NewsletterConfigurationError,
  type NewsletterProvider,
} from "./types";

function getCredentials() {
  const apiKey =
    process.env.NEWSLETTER_API_KEY || process.env.BEEHIIV_API_KEY;
  const publicationId =
    process.env.NEWSLETTER_AUDIENCE_ID ||
    process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    throw new NewsletterConfigurationError(
      "The newsletter provider credentials are not configured."
    );
  }

  return { apiKey, publicationId };
}

export const beehiivProvider: NewsletterProvider = {
  async subscribe(subscription) {
    const { apiKey, publicationId } = getCredentials();
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: subscription.email,
          reactivate_existing: false,
          send_welcome_email: subscription.sendWelcomeEmail,
          utm_source: subscription.source,
          utm_medium: subscription.medium,
          utm_campaign: subscription.campaign,
          referring_site: subscription.referringSite,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!response.ok) {
      throw new Error(
        `The newsletter provider rejected the signup with status ${response.status}.`
      );
    }

    return { provider: "beehiiv" };
  },
};
