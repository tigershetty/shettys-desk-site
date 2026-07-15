import { getNewsletterProvider } from "./newsletter";

type SubscribeInput = {
  email: string;
};

export async function subscribeToResourceList({ email }: SubscribeInput) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shettysdesk.vercel.app";
  const provider = getNewsletterProvider();

  return provider.subscribe({
    email,
    source: "shettys-desk",
    medium: "resource-library",
    campaign: "demand-sensing-router",
    referringSite: `${siteUrl}/resources/demand-sensing-router`,
    sendWelcomeEmail: true,
  });
}
