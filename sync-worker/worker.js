// Sync server for حفظ المتون: stores one encrypted blob per sync id in Workers KV.
// The client derives the id and the AES key from a secret only the user's devices know, so the stored bytes are unreadable here.
//   GET /s/<id>  → the blob (404 if none)      PUT /s/<id> → replace it (max 512 KB)
const ORIGINS = ['https://motoon-orgoja.github.io', 'http://localhost:8765'];
const MAX = 512 * 1024;
export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0], 'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
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
