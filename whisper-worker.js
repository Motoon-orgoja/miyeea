/* ---------- on-device speech recognition with Whisper (transformers.js, Apache-2.0) ----------
   Runs in a module worker so the page stays responsive. The model downloads once (the browser caches it) and then works
   offline. Messages in: {type:'load', model} | {type:'run', audio: Float32Array 16 kHz mono}.
   Messages out: {type:'progress', file, loaded, total} | {type:'ready', device} | {type:'result', text} | {type:'error', message}. */
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';
env.allowLocalModels = false;
let asr = null, loading = null, device = 'wasm';
async function load(model, force) {
  if (asr) return asr;
  if (loading) return loading;
  loading = (async () => {
    let gpu = false;
    try { gpu = force !== 'wasm' && !!self.navigator.gpu && !!(await self.navigator.gpu.requestAdapter()); } catch (e) {}
    device = gpu ? 'webgpu' : 'wasm';
    const progress_callback = p => { if (p.status === 'progress') self.postMessage({ type: 'progress', file: p.file, loaded: p.loaded, total: p.total }); };
    try {
      asr = await pipeline('automatic-speech-recognition', model, { device, dtype: gpu ? { encoder_model: 'fp32', decoder_model_merged: 'q4' } : 'q8', progress_callback });
    } catch (e) {
      // a GPU that fails to compile the model still has the CPU path
      if (device !== 'webgpu') throw e;
      device = 'wasm';
      asr = await pipeline('automatic-speech-recognition', model, { device, dtype: 'q8', progress_callback });
    }
    self.postMessage({ type: 'ready', device });
    return asr;
  })();
  return loading;
}
self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'load') { await load(data.model, data.device); return; }
    if (data.type === 'run') {
      const p = await load(data.model, data.device);
      // the Quran fine-tune (Basira) is Arabic-only and its config refuses a language/task
      const opts = /Basira/.test(data.model || '') ? { chunk_length_s: 30, stride_length_s: 5 } : { language: 'arabic', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 };
      let out;
      try { out = await p(data.audio, opts); }
      catch (e) {
        // a GPU that loads the model but fails while running it: run again on the CPU
        if (device !== 'webgpu') throw e;
        asr = null; loading = null;
        out = await (await load(data.model, 'wasm'))(data.audio, opts);
      }
      self.postMessage({ type: 'result', text: (out && out.text || '').trim() });
    }
  } catch (e) {
    loading = null; asr = null;
    self.postMessage({ type: 'error', message: String(e && e.message || e) });
  }
};
