import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';

async function capture(theme, outFile, port = 9224) {
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chrome, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const targets = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise(resolve => {
    const curId = id++;
    const handler = (msg) => {
      const res = JSON.parse(msg.data);
      if (res.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(res.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');

  await send('Runtime.evaluate', {
    expression: theme === 'dark' 
      ? `localStorage.setItem('theme', 'dark'); document.documentElement.classList.add('dark');`
      : `localStorage.setItem('theme', 'light'); document.documentElement.classList.remove('dark');`
  });

  // Reload page to ensure React state initializes with the correct theme
  await send('Page.reload');
  await new Promise(r => setTimeout(r, 2000));

  const screenshot = await send('Page.captureScreenshot', {
    captureBeyondViewport: true,
    format: 'png'
  });

  fs.writeFileSync(outFile, Buffer.from(screenshot.data, 'base64'));
  console.log(`[Success] Saved: ${outFile}`);

  ws.close();
  proc.kill();
}

async function main() {
  await capture('light', './screenshots/full-page-light.png', 9225);
  await new Promise(r => setTimeout(r, 1000));
  await capture('dark', './screenshots/full-page-dark.png', 9226);
}

main().catch(err => {
  console.error('[Capture Error]:', err);
  process.exit(1);
});
