import { handle, d1, pushTo } from './circles.js';
import { sendPush } from './push.js';
// Sync server for حفظ المتون: stores one encrypted blob per sync id in Workers KV.
// The client derives the id and the AES key from a secret only the user's devices know, so the stored bytes are unreadable here.
//   GET /s/<id>  → the blob (404 if none)      PUT /s/<id> → replace it (max 512 KB)
// It also serves «الحلقات» (circles.js) from D1: POST /c/<action>, and sends cheers as push notifications (push.js)
// signed with the VAPID key in the secret VAPID_JWK (npx wrangler secret put VAPID_JWK).
const ORIGINS = ['https://motoon-orgoja.github.io', 'http://localhost:8765', 'http://localhost:8767'];
const MAX = 512 * 1024;
export default {
  async fetch(req, env, ctx) {
    const origin = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0], 'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (new URL(req.url).pathname.startsWith('/c/')) {
      const db = d1(env.CIRCLES), vapid = env.VAPID_JWK && { jwk: JSON.parse(env.VAPID_JWK), subject: 'https://motoon-orgoja.github.io/miyeea/' };
      // the push goes out after the answer, so the sender doesn't wait for it
      const notify = vapid && ((mid, msg) => ctx.waitUntil(pushTo(db, mid, msg, (s, m) => sendPush(s, m, vapid))));
      return handle(req, db, cors, notify);
    }
    const m = new URL(req.url).pathname.match(/^\/s\/([0-9a-f]{32})$/);
    if (!m) return new Response('not found', { status: 404, headers: cors });
    const key = 's:' + m[1];
    if (req.method === 'GET') {
      const v = await env.SYNC.get(key, 'arrayBuffer');
      return v ? new Response(v, { headers: { ...cors, 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-store' } }) : new Response('none', { status: 404, headers: cors });
    }
    if (req.method === 'PUT') {
      const body = await req.arrayBuffer();
      if (body.byteLength < 14 || body.byteLength > MAX) return new Response('size', { status: 413, headers: cors });
      // a blob nobody opens for a year expires
      await env.SYNC.put(key, body, { expirationTtl: 365 * 864e2 });
      return new Response('ok', { headers: cors });
    }
    return new Response('method', { status: 405, headers: cors });
  }
};
