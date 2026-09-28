import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function base64EncodeUtf8(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") || "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "");
  if (!accessToken) return json({ error: "Not authenticated" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${accessToken}`, apikey: anonKey },
  });
  if (!userResponse.ok) return json({ error: "Your login session is invalid or expired." }, 401);
  const user = await userResponse.json();

  const allowedEmail = (Deno.env.get("ADMIN_EMAIL") || "").trim().toLowerCase();
  if (allowedEmail && String(user.email || "").toLowerCase() !== allowedEmail) {
    return json({ error: "This account is not authorized to publish." }, 403);
  }

  const owner = Deno.env.get("GITHUB_OWNER");
  const repo = Deno.env.get("GITHUB_REPO");
  const token = Deno.env.get("GITHUB_TOKEN");
  const branch = Deno.env.get("GITHUB_BRANCH") || "main";
  if (!owner || !repo || !token) return json({ error: "GitHub server configuration is incomplete." }, 500);

  const body = await req.json();
  const content = body?.content;
  if (!content || typeof content !== "object") return json({ error: "Invalid content payload." }, 400);

  const api = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/content.json`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  let sha: string | undefined;
  const existing = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
  if (existing.ok) sha = (await existing.json()).sha;
  else if (existing.status !== 404) return json({ error: `GitHub lookup failed (${existing.status}).` }, 502);

  const payload: Record<string, unknown> = {
    message: "Update site content from GreenWave Admin",
    content: base64EncodeUtf8(JSON.stringify(content, null, 2)),
    branch,
  };
  if (sha) payload.sha = sha;

  const published = await fetch(api, { method: "PUT", headers, body: JSON.stringify(payload) });
  if (!published.ok) {
    const detail = await published.text();
    return json({ error: `GitHub rejected the publish request: ${detail.slice(0, 500)}` }, 502);
  }

  return json({ ok: true });
});
