// Supabase Edge Function: sends a Web Push to the OTHER person when a message is inserted.
// Secrets needed (supabase secrets set ...): VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:you@mail.com)
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:you@example.com",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  const { record } = await req.json();
  if (!record) return new Response("no record");

  const { data: subs } = await sb.from("push_subscriptions").select("endpoint,p256dh,auth,user_id");
  const { data: profiles } = await sb.from("profiles").select("id,name");
  const senderIds = new Set((profiles ?? []).filter((p) => p.name === record.sender).map((p) => p.id));

  const body = record.message_type === "voice" ? "🎙️" :
    record.message_type === "image" ? "📷 " + (record.message ?? "") : (record.message ?? "");
  const payload = JSON.stringify({ title: "💌 " + record.sender, body, tag: "ow-message" });

  await Promise.all((subs ?? []).filter((s) => !senderIds.has(s.user_id)).map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) await sb.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
    }
  }));
  return new Response("ok");
});
