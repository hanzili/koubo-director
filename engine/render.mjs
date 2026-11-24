import {bundle} from '@remotion/bundler';
import {renderStill, renderMedia, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

const [mode, ...rest] = process.argv.slice(2);
const t0 = Date.now();
const presetServeUrl = process.env.SERVE_URL || '';
const cacheDir = presetServeUrl ? '' : path.resolve('.render-cache', `b${process.pid}`);
// Keep Chromium SingletonSocket path short (<108 bytes on Linux) while cleaning up on exit
const tmpDir = `/tmp/rm${process.pid}`;
fs.mkdirSync(tmpDir, {recursive: true});
process.env.TMPDIR = tmpDir;

const cleanup = () => {
  for (const d of [cacheDir, tmpDir]) {
    if (!d) continue;
    try {fs.rmSync(d, {recursive: true, force: true});} catch (e) {}
  }
};
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));
process.on('uncaughtException', (e) => {console.error(e); process.exit(1);});
process.on('unhandledRejection', (e) => {console.error(e); process.exit(1);});

const serveUrl = presetServeUrl || await bundle({
  entryPoint: path.resolve('src/index.ts'),
  publicDir: path.resolve('public'),
  outDir: cacheDir,
});
console.log('bundled', ((Date.now() - t0) / 1000).toFixed(1) + 's');

const browser = await openBrowser('chrome', {
  browserExecutable: process.env.REMOTION_BROWSER || null,
  chromiumOptions: {gl: process.env.REMOTION_GL || (process.platform === 'darwin' ? 'angle' : 'swangle')},
});
const composition = await selectComposition({serveUrl, id: 'Main', puppeteerInstance: browser});

if (mode === 'stills') {
  const out = rest[0];
  for (const fr of rest.slice(1).map(Number)) {
    try {
      await renderStill({
        composition, serveUrl, output: `${out}/f_${String(fr).padStart(5, '0')}.png`,
        frame: fr, puppeteerInstance: browser, timeoutInMilliseconds: 120000,
      });
      process.stdout.write(`still ${fr}\n`);
    } catch (err) {
      console.log(`FAIL ${fr}: ${String(err?.message || err).slice(0, 400)}`);
    }
  }
} else if (mode === 'video') {
  const [out, a, b, conc] = rest;
  let last = -1;
  await renderMedia({
    composition, serveUrl, codec: 'h264', crf: 17, outputLocation: out, muted: true,
    concurrency: Number(conc || 6), puppeteerInstance: browser,
    frameRange: a != null ? [Number(a), Number(b)] : undefined,
    timeoutInMilliseconds: 180000,
    onProgress: ({progress}) => {
      const p = Math.floor(progress * 100);
      if (p !== last && p % 5 === 0) {
        last = p;
        console.log('progress', p + '%', ((Date.now() - t0) / 1000).toFixed(0) + 's');
      }
    },
  });
}
await browser.close({silent: true});
console.log('done', ((Date.now() - t0) / 1000).toFixed(1) + 's');
