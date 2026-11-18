// Capture d'un écran Expo Web (ou d'une maquette) en 390 × 844.
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { parseArgs } from './capture-args.mjs';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

function servir(dossier, repli) {
  return createServer((req, res) => {
    const chemin = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let fichier = join(dossier, chemin);
    if (!fichier.startsWith(dossier)) fichier = '';
    if (!fichier || !existsSync(fichier) || statSync(fichier).isDirectory()) {
      fichier = repli ? join(dossier, repli) : '';
    }
    if (!fichier || !existsSync(fichier)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(fichier)] ?? 'application/octet-stream' });
    res.end(readFileSync(fichier));
  });
}

const args = parseArgs(process.argv.slice(2));
let dossier;
let repli;
let chemin;
if (args.mode === 'maquette') {
  dossier = join(racine, 'design', 'canvas');
  chemin = `/${args.maquette}`;
  if (!existsSync(join(dossier, args.maquette))) {
    throw new Error(`Maquette introuvable : design/canvas/${args.maquette}`);
  }
} else {
  dossier = join(racine, 'apps', 'mobile', 'dist');
  repli = 'index.html';
  execFileSync('npm', ['run', 'web:export'], { cwd: racine, stdio: 'inherit' });
  chemin = args.route;
}

const serveur = servir(dossier, repli);
await new Promise((ok) => serveur.listen(0, '127.0.0.1', ok));
const url = `http://127.0.0.1:${serveur.address().port}${chemin}`;

const navigateur = await chromium.launch();
try {
  const page = await navigateur.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const sortie = resolve(racine, args.sortie);
  mkdirSync(dirname(sortie), { recursive: true });
  await page.screenshot({ path: sortie });
  console.log(`Capture enregistrée : ${args.sortie}`);
} finally {
  await navigateur.close();
  serveur.close();
}
