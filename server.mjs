import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png'};
const allowed = new Set(['index.html','styles.css','script.js','assets/logo.jpg','assets/brownies-nadia.jpg','assets/brownies-pandan.jpg','assets/logo-black.png','assets/logo-white.png','assets/poster-brownies-1.png','assets/poster-brownies-2.png','assets/poster-brownies-3.png']);
const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!allowed.has(file)) { res.writeHead(404); res.end('Not found'); return; }
    const data = await fs.readFile(path.join(root,file));
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});
    res.end(data);
  } catch { res.writeHead(400); res.end('Bad request'); }
});
server.listen(Number(process.env.PORT || 4173),'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
