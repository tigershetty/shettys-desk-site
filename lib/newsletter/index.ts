import { beehiivProvider } from "./beehiiv";
import {
  NewsletterConfigurationError,
  type NewsletterProvider,
} from "./types";

const previewProvider: NewsletterProvider = {
  async subscribe() {
    return { provider: "preview" };
  },
};

export function getNewsletterProvider(): NewsletterProvider {
  const previewEnabled =
    process.env.NODE_ENV !== "production" &&
    process.env.RESOURCE_SIGNUP_PREVIEW === "true";

  if (previewEnabled) {
    return previewProvider;
  }

  const provider = (process.env.NEWSLETTER_PROVIDER || "beehiiv")
    .trim()
    .toLowerCase();

  if (provider === "beehiiv") {
    return beehiivProvider;
  }

  throw new NewsletterConfigurationError(
    `Unsupported newsletter provider: ${provider}`
  );
}

export type {
  NewsletterProvider,
  NewsletterSubscription,
  NewsletterSubscriptionResult,
} from "./types";
