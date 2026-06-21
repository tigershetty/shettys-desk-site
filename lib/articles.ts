import localArticles from "@/data/articles.json";

export interface ArticleStats {
  impressions: number;
  reactions: number;
  comments: number;
  reposts: number;
  saves: number;
}

export interface Article {
  slug: string;
  title: string;
  hook: string;
  date: string;
  image: string | null;
  tags: string[];
  featured: boolean;
  audienceBadge: string;
  linkedinUrl: string;
  stats: ArticleStats;
  caption: string;
}

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Refresh the Notion-sourced data at most every 10 minutes (ISR).
const REVALIDATE_SECONDS = 600;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Minimal shapes for the Notion REST API (version 2022-06-28) properties we read.
interface NotionText {
  plain_text: string;
}
interface NotionProperty {
  title?: NotionText[];
  rich_text?: NotionText[];
  number?: number | null;
  url?: string | null;
  checkbox?: boolean;
  date?: { start: string | null } | null;
  multi_select?: { name: string }[];
}
interface NotionPage {
  properties: Record<string, NotionProperty>;
}
interface NotionQueryResponse {
  results: NotionPage[];
}

function plain(prop: NotionProperty | undefined): string {
  const runs = prop?.rich_text ?? prop?.title ?? [];
  return runs.map((run) => run.plain_text).join("").trim();
}

function toNumber(prop: NotionProperty | undefined): number {
  return typeof prop?.number === "number" ? prop.number : 0;
}

function mapPage(page: NotionPage): Article {
  const p = page.properties;
  const title = plain(p["Title"]);
  const image = plain(p["Image"]);
  return {
    slug: plain(p["Slug"]) || slugify(title),
    title,
    hook: plain(p["Hook"]),
    date: p["Date"]?.date?.start ?? "",
    image: image || null,
    tags: (p["Tags"]?.multi_select ?? []).map((option) => option.name),
    featured: p["Featured"]?.checkbox ?? false,
    audienceBadge: plain(p["Audience Badge"]),
    linkedinUrl: p["LinkedIn URL"]?.url ?? "",
    stats: {
      impressions: toNumber(p["Impressions"]),
      reactions: toNumber(p["Reactions"]),
      comments: toNumber(p["Comments"]),
      reposts: toNumber(p["Reposts"]),
      saves: toNumber(p["Saves"]),
    },
    caption: plain(p["Caption"]),
  };
}

async function fetchFromNotion(): Promise<Article[]> {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "Published", checkbox: { equals: true } },
        sorts: [{ property: "Date", direction: "descending" }],
        page_size: 100,
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );

  if (!res.ok) {
    throw new Error(`Notion query failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as NotionQueryResponse;
  return data.results.map(mapPage).filter((a) => a.slug && a.title);
}

/**
 * Articles for the site. Sourced from Notion when NOTION_TOKEN +
 * NOTION_DATABASE_ID are set; otherwise (and on any Notion error) falls back to
 * the bundled data/articles.json so the site always renders.
 */
export async function getArticles(): Promise<Article[]> {
  if (NOTION_TOKEN && NOTION_DATABASE_ID) {
    try {
      const articles = await fetchFromNotion();
      if (articles.length > 0) return articles;
    } catch (err) {
      console.error("[articles] Notion fetch failed; using local fallback:", err);
    }
  }
  return localArticles as Article[];
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}
