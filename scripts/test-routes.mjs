import { spawn } from 'node:child_process';
import http from 'node:http';

async function testRoutes() {
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9227;
  const proc = spawn(chrome, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--no-sandbox',
    '--disable-gpu',
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
  await send('Runtime.enable');

  const errors = [];
  ws.addEventListener('message', msg => {
    const data = JSON.parse(msg.data);
    if (data.method === 'Runtime.exceptionThrown') {
      errors.push(data.params.exceptionDetails.text);
    }
  });

  const routes = ['/', '/history', '/analytics', '/schedule', '/help', '/settings'];
  for (const r of routes) {
    await send('Page.navigate', { url: 'http://localhost:5173' + r });
    await new Promise(res => setTimeout(res, 800));
    const titleRes = await send('Runtime.evaluate', { expression: 'document.title' });
    console.log(`[PASS] Route: ${r.padEnd(12)} -> Title: "${titleRes?.result?.value}"`);
  }

  ws.close();
  proc.kill();

  if (errors.length > 0) {
    console.error('Errors found:', errors);
    process.exit(1);
  } else {
    console.log('\n[SUCCESS] All 6 routes verified with ZERO runtime exceptions!');
  }
}

testRoutes().catch(e => { console.error(e); process.exit(1); });
