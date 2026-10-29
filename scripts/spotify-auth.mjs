#!/usr/bin/env node
// One-time helper that mints the SPOTIFY_REFRESH_TOKEN for the About page
// vinyl player. Run locally, never in CI:
//
//   1. Create an app at https://developer.spotify.com/dashboard and add the
//      redirect URI  http://127.0.0.1:8888/callback
//   2. SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-auth.mjs
//   3. Open the printed URL, approve, and copy the refresh token into the
//      Vercel environment as SPOTIFY_REFRESH_TOKEN (with the id and secret).
//
// The token is printed once to your terminal and is never written to disk.

import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = "http://127.0.0.1:8888/callback";

if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirectUri,
  scope: "user-top-read",
  state,
}).toString();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", redirectUri);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  if (url.searchParams.get("state") !== state || !url.searchParams.get("code")) {
    res.writeHead(400).end("State mismatch or missing code.");
    return;
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: url.searchParams.get("code"),
      redirect_uri: redirectUri,
    }),
  });
  const body = await tokenRes.json();

  if (!tokenRes.ok || !body.refresh_token) {
    res.writeHead(500).end("Token exchange failed. Check the terminal.");
    console.error("Token exchange failed:", body.error_description ?? body.error ?? tokenRes.status);
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Done. You can close this tab and return to the terminal.");
    console.log("\nSPOTIFY_REFRESH_TOKEN=" + body.refresh_token + "\n");
    console.log("Add it to Vercel (Project → Settings → Environment Variables), then redeploy.");
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Open this URL in your browser and approve access:\n\n" + authorizeUrl.toString() + "\n");
});
