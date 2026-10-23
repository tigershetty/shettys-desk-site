import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Top tracks on rotation for the About page vinyl player.
 *
 * Uses a long-lived refresh token for the site owner's Spotify account
 * (scope: user-top-read), so visitors never sign in. Set SPOTIFY_CLIENT_ID,
 * SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN in the environment; run
 * `node scripts/spotify-auth.mjs` once locally to mint the refresh token.
 * Without them the endpoint returns an empty fallback and the player shows
 * the curated playlist instead.
 */

export type TopTrack = {
  id: string;
  name: string;
  artists: string;
  album: string;
  image: string | null;
  url: string;
};

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string; width: number }[] };
  external_urls: { spotify: string };
};

const ONE_HOUR = 60 * 60;

function fallback(reason: string) {
  return NextResponse.json(
    { source: "fallback", reason, tracks: [] as TopTrack[] },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return fallback("not-configured");

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      cache: "no-store",
    });
    if (!tokenRes.ok) return fallback("token");
    const { access_token: accessToken } = (await tokenRes.json()) as { access_token: string };

    const topRes = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5", {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: ONE_HOUR },
    });
    if (!topRes.ok) return fallback("top-tracks");
    const { items } = (await topRes.json()) as { items: SpotifyTrack[] };

    const tracks: TopTrack[] = items.map((t) => ({
      id: t.id,
      name: t.name,
      artists: t.artists.map((a) => a.name).join(", "),
      album: t.album.name,
      image: [...t.album.images].sort((a, b) => a.width - b.width).find((i) => i.width >= 160)?.url ?? t.album.images[0]?.url ?? null,
      url: t.external_urls.spotify,
    }));

    return NextResponse.json(
      { source: "spotify", tracks },
      { headers: { "Cache-Control": `public, s-maxage=${ONE_HOUR}, stale-while-revalidate=${ONE_HOUR * 6}` } }
    );
  } catch {
    return fallback("network");
  }
}
