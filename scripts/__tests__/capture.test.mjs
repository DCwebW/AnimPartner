import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { parseArgs } from '../capture-args.mjs';

test('route seule : sortie par défaut dans captures/', () => {
  assert.deepEqual(parseArgs(['/']), { mode: 'route', route: '/', sortie: 'captures/accueil.png' });
  assert.equal(parseArgs(['reglages']).route, '/reglages');
});

test('--maquette : capture la maquette', () => {
  const a = parseArgs(['--maquette', 'MvpVentEnigme.dc.html']);
  assert.equal(a.mode, 'maquette');
  assert.equal(a.sortie, 'captures/maquette-MvpVentEnigme.png');
});

test('arguments invalides rejetés', () => {
  assert.throws(() => parseArgs([]));
  assert.throws(() => parseArgs(['--maquette']));
  assert.throws(() => parseArgs(['--x']));
});

test(
  'la commande produit une image non vide pour la route d’accueil',
  { timeout: 300000 },
  async (t) => {
    let chromiumDispo = false;
    try {
      const { chromium } = await import('playwright');
      await (await chromium.launch()).close();
      chromiumDispo = true;
    } catch {}
    if (!chromiumDispo) return t.skip('Chromium absent (npx playwright install chromium)');
    const sortie = join(mkdtempSync(join(tmpdir(), 'cap-')), 'accueil.png');
    execFileSync('node', ['scripts/capture.mjs', '/', sortie], { stdio: 'pipe' });
    assert.ok(statSync(sortie).size > 1000);
  },
);
