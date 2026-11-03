// Web Push without libraries: the payload is encrypted for the browser (RFC 8291, aes128gcm) and the request is signed
// with the server's VAPID key (RFC 8292). Works on Workers and in Node (both have WebCrypto).
// vapid = { jwk: {kty,crv,d,x,y} (the private key), subject: 'mailto:…' or a URL }
const enc = new TextEncoder();
const b64u = u8 => btoa(String.fromCharCode(...new Uint8Array(u8))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length } return o };
async function hmac(key, data) { const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return new Uint8Array(await crypto.subtle.sign('HMAC', k, data)) }

// the public half of the VAPID key, as the browser's applicationServerKey wants it
export const vapidPublic = jwk => b64u(cat(new Uint8Array([4]), unb64u(jwk.x), unb64u(jwk.y)));

async function vapidHeader(endpoint, vapid) {
  const key = await crypto.subtle.importKey('jwk', { ...vapid.jwk, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const head = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const body = b64u(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: vapid.subject })));
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(head + '.' + body));
  return 'vapid t=' + head + '.' + body + '.' + b64u(sig) + ', k=' + vapidPublic(vapid.jwk);
}

async function encrypt(sub, text) {
  const ua = unb64u(sub.p256dh), auth = unb64u(sub.auth);
  const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const as = new Uint8Array(await crypto.subtle.exportKey('raw', eph.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', ua, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, eph.privateKey, 256));
  const ikm = await hmac(await hmac(auth, shared), cat(enc.encode('WebPush: info\0'), ua, as, new Uint8Array([1])));
  const salt = crypto.getRandomValues(new Uint8Array(16)), prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, enc.encode('Content-Encoding: aes128gcm\0\x01'))).slice(0, 16);
  const nonce = (await hmac(prk, enc.encode('Content-Encoding: nonce\0\x01'))).slice(0, 12);
  const k = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, k, cat(enc.encode(text), new Uint8Array([2]))));
  return cat(salt, new Uint8Array([0, 0, 16, 0, as.length]), as, ct);
}

// sub = {ep, p256dh, auth}; returns the push service's status (404/410 mean the subscription is gone)
export async function sendPush(sub, msg, vapid) {
  const r = await fetch(sub.ep, {
    method: 'POST', body: await encrypt(sub, JSON.stringify(msg)),
    headers: { Authorization: await vapidHeader(sub.ep, vapid), 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '86400', Urgency: 'normal' },
  });
  return r.status;
}
