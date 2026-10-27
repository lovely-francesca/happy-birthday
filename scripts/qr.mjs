import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import QRCode from 'qrcode';

const url = process.argv[2];
const name = process.argv[3] ?? 'la festeggiata';

if (!url) {
  console.error('\nUso: npm run qr -- https://<utente>.github.io/<repo>/ "Nome"\n');
  process.exit(1);
}

try {
  new URL(url);
} catch {
  console.error(`\nURL non valido: ${url}\n`);
  process.exit(1);
}

const escapeHtml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const svg = await QRCode.toString(url, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 2,
  width: 512,
  color: {
    dark: '#5b2a86',
    light: '#ffffff',
  },
});

const card = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>QR code · Buon compleanno</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100svh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at 50% 0%, #fff3b0 0%, transparent 42%),
          radial-gradient(circle at 100% 100%, #ffe1ed 0%, transparent 45%),
          #e8f7ff;
        color: #3d3452;
        font-family: 'Nunito', ui-rounded, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .card {
        width: min(100%, 500px);
        padding: 42px 38px 34px;
        border-radius: 30px;
        background: #fff;
        box-shadow: 0 30px 80px rgba(90, 60, 130, 0.18);
        text-align: center;
      }
      .eyebrow {
        display: inline-block;
        padding: 6px 13px;
        border-radius: 999px;
        background: #ffe4ef;
        color: #d92f6a;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.2px;
        text-transform: uppercase;
      }
      h1 {
        margin: 16px 0 6px;
        font-family: 'Baloo 2', 'Nunito', sans-serif;
        font-size: 34px;
        line-height: 1.05;
        color: #3d3452;
      }
      h1 span { color: #d92f6a; }
      p { margin: 0; color: #7c7590; font-size: 14px; font-weight: 600; line-height: 1.5; }
      .qr {
        width: 280px;
        max-width: 74vw;
        margin: 24px auto 18px;
        padding: 12px;
        border: 3px dashed #a9def8;
        border-radius: 24px;
      }
      .qr svg { display: block; width: 100%; height: auto; }
      .hint {
        margin-top: 20px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.3px;
        color: #b0a7c2;
        word-break: break-all;
      }
      .cake { font-size: 26px; line-height: 1; }
      @media print {
        body { background: #fff; }
        .card { box-shadow: none; border: 2px dashed #ff4f8b; }
        .hint { display: none; }
      }
    </style>
  </head>
  <body>
    <main class="card">
      <span class="eyebrow">Un invito speciale</span>
      <h1>Buon compleanno,<br /><span>${escapeHtml(name)}!</span></h1>
      <p>Inquadra il QR code con la fotocamera e inizia il percorso.</p>
      <div class="qr">${svg}</div>
      <div class="cake" aria-hidden="true">🎂</div>
      <p class="hint">${escapeHtml(url)}</p>
    </main>
  </body>
</html>
`;

const publicDir = resolve('public');
await mkdir(publicDir, { recursive: true });
await writeFile(resolve(publicDir, 'qr.svg'), `${svg}\n`, 'utf8');
await writeFile(resolve(publicDir, 'qr-card.html'), card, 'utf8');

console.log(`\n✅ QR generato per: ${url}`);
console.log('   public/qr.svg       → immagine pronta da stampare o condividere');
console.log('   public/qr-card.html → card stampabile (apri nel browser e stampa)\n');
