// Records the captioned demo video in media/demo.mp4.
//
// Usage (from the repo root):
//   npm i --no-save playwright echarts@5.5.0 @fontsource/schibsted-grotesk @fontsource/public-sans @fontsource/ibm-plex-mono
//   npx playwright install chromium
//   node tools/record-demo.js            # writes media/demo-raw.webm
//   ffmpeg -i media/demo-raw.webm -vf "scale=960:-2,fps=24" -c:v libx264 -crf 27 -preset slow \
//     -pix_fmt yuv420p -an -movflags +faststart media/demo.mp4
//   ffmpeg -ss 3 -i media/demo.mp4 -frames:v 1 -q:v 4 media/demo-poster.jpg
//
// It opens index.html in headless Chromium at 1280x800, skips the guided setup,
// plays a scripted walkthrough with on-screen captions, and records it.
// The chart library and fonts are served from node_modules so it works offline.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NM = path.join(ROOT, 'node_modules');
const FONTS = [['schibsted-grotesk', [600, 700]], ['public-sans', [400, 500, 600]], ['ibm-plex-mono', [400, 500]]];
const fontCss = FONTS.map(([f, ws]) => ws.map(w => fs.readFileSync(`${NM}/@fontsource/${f}/latin-${w}.css`, 'utf8')).join('\n')).join('\n');
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: path.join(ROOT, 'media', '.raw'), size: { width: 1280, height: 800 } },
  });
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.includes('echarts')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(`${NM}/echarts/dist/echarts.min.js`) });
    if (u.includes('fonts.googleapis.com')) return route.fulfill({ contentType: 'text/css', body: fontCss.replace(/url\(\.\/files\//g, 'url(https://fontfiles.local/') });
    if (u.startsWith('https://fontfiles.local/')) {
      const n = u.split('/').pop();
      const f = FONTS.map(x => x[0]).find(x => n.startsWith(x));
      return route.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(`${NM}/@fontsource/${f}/files/${n}`) });
    }
    if (u.startsWith('file://')) return route.continue();
    return route.abort();
  });

  const p = await ctx.newPage();
  // Start from the example numbers and skip the guided setup.
  await p.addInitScript(() => { try { localStorage.clear(); localStorage.setItem('runway-onb-done', '1'); } catch (e) {} });
  await p.goto('file://' + path.join(ROOT, 'index.html'));
  await p.evaluate(() => document.fonts.ready);
  await wait(2500);

  await p.addStyleTag({ content: `#cap{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:rgba(21,33,43,.92);color:#fff;font:600 18px "Public Sans",sans-serif;padding:12px 22px;border-radius:10px;z-index:9999;box-shadow:0 6px 24px rgba(0,0,0,.25);max-width:90vw;text-align:center}` });
  const cap = async (t, ms = 2600) => { await p.evaluate(t => { let c = document.getElementById('cap'); if (!c) { c = document.createElement('div'); c.id = 'cap'; document.body.appendChild(c); } c.textContent = t; }, t); await wait(ms); };
  const typeInto = async (sel, val) => { await p.click(sel, { clickCount: 3 }); await wait(250); await p.type(sel, String(val), { delay: 90 }); await wait(900); };
  const scrollTo = async (sel, block = 'start') => { await p.evaluate(([s, b]) => document.querySelector(s).scrollIntoView({ behavior: 'smooth', block: b }), [sel, block]); await wait(1400); };

  await cap('Retirement Runway: how long does a couple’s money last?', 3200);
  await cap('A few summary numbers in. Bridge years, runway and safe spending out.', 3200);
  await p.hover('#kBridge'); await cap('Bridge to 59½: covered by brokerage', 2400);
  await p.hover('#kLasts'); await cap('Money lasts until Spouse 1 is 84½', 2400);
  await cap('What if we spend $24K a month instead of $20K?', 1600);
  await typeInto('#monthly', 24000); await cap('The runway shortens to the new run-out age instantly', 2600);
  await typeInto('#monthly', 20000);
  await cap('Spouse 2 works two more years, to 57…', 1500);
  await typeInto('#retAge2', 57); await cap('…and the money lasts longer', 2600);
  await scrollTo('#timeline', 'center'); await cap('Timeline: who works, the bridge, retirement, pre-65 healthcare', 3200);
  await scrollTo('#convCard'); await cap('Roth plan: the yearly conversion needed to reach $1M by 59½', 3200);
  await p.evaluate(() => window.scrollBy({ top: 330, behavior: 'smooth' })); await wait(1200);
  await cap('Each conversion split by 2026 federal tax bracket', 3000);
  await p.evaluate(() => window.scrollBy({ top: 420, behavior: 'smooth' })); await wait(1200);
  await cap('With vs without conversions, plus the tax implications', 3400);
  await scrollTo('#chBalances'); await cap('Balances by bucket, and where each year’s money comes from', 3400);
  await scrollTo('#chSankey'); await cap('Where the money goes over a lifetime', 3200);
  await scrollTo('#chSens'); await cap('What-if: run-out age at every spending level', 3000);
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await wait(1500);
  await p.hover('#dlReport'); await cap('Download a full report, a CSV, or a shareable scenario link', 3200);
  await cap('Runs entirely in your browser. fostools.github.io/retirement-runway', 3600);

  const video = p.video();
  await ctx.close();
  await browser.close();
  fs.renameSync(await video.path(), path.join(ROOT, 'media', 'demo-raw.webm'));
  fs.rmSync(path.join(ROOT, 'media', '.raw'), { recursive: true, force: true });
  console.log('Wrote media/demo-raw.webm');
})();
