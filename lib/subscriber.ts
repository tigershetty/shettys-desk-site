type SubscribeInput = {
  email: string;
};

export async function subscribeToResourceList({ email }: SubscribeInput) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.RESOURCE_SIGNUP_PREVIEW === "true"
    ) {
      return { provider: "preview" as const };
    }

    throw new Error("The resource signup provider is not configured.");
  }

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: "shettys-desk",
        utm_medium: "resource-library",
        utm_campaign: "demand-sensing-router",
        referring_site: "https://shettysdesk.vercel.app/resources/demand-sensing-router",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!response.ok) {
    throw new Error(`beehiiv rejected the signup with status ${response.status}.`);
  }

  return { provider: "beehiiv" as const };
}
