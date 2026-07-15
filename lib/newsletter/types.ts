export type NewsletterSubscription = {
  email: string;
  source: string;
  medium: string;
  campaign: string;
  referringSite: string;
  sendWelcomeEmail: boolean;
};

export type NewsletterSubscriptionResult = {
  provider: string;
};

export interface NewsletterProvider {
  subscribe(
    subscription: NewsletterSubscription
  ): Promise<NewsletterSubscriptionResult>;
}

export class NewsletterConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NewsletterConfigurationError";
  }
}
