const AI_CRAWLERS = [
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "cohere-ai",
  "Diffbot",
  "Google-Extended",
  "GPTBot",
  "meta-externalagent",
  "meta-externalfetcher",
  "MistralAI-User",
  "OAI-SearchBot",
  "PerplexityBot",
];

const robotsTxt = [
  "# Shetty's Desk crawler policy",
  "# Search indexing is permitted; AI training and AI-answer use are not.",
  "User-agent: *",
  "Content-signal: search=yes, ai-input=no, ai-train=no, use=immediate",
  "Allow: /",
  "",
  ...AI_CRAWLERS.flatMap((crawler) => [
    `User-agent: ${crawler}`,
    "Disallow: /",
    "",
  ]),
].join("\n");

export function GET() {
  return new Response(robotsTxt, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
