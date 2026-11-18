// Analyse des arguments de `npm run capture`. Logique pure, testée à part.
export const USAGE =
  'Usage : npm run capture -- <route> [fichier]\n' +
  '        npm run capture -- --maquette <Fichier.dc.html> [fichier]';

export function parseArgs(argv) {
  const positionnels = [];
  let maquette;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--maquette') {
      maquette = argv[++i];
      if (!maquette) throw new Error('--maquette attend un nom de fichier.\n' + USAGE);
    } else if (argv[i].startsWith('--')) {
      throw new Error(`Option inconnue : ${argv[i]}\n${USAGE}`);
    } else {
      positionnels.push(argv[i]);
    }
  }
  if (maquette) {
    const nom = maquette.replace(/^.*[\\/]/, '');
    if (positionnels.length > 1) throw new Error(USAGE);
    return {
      mode: 'maquette',
      maquette: nom,
      sortie: positionnels[0] ?? `captures/maquette-${nom.replace(/\.dc\.html$/, '')}.png`,
    };
  }
  if (positionnels.length < 1 || positionnels.length > 2) throw new Error(USAGE);
  const route = positionnels[0].startsWith('/') ? positionnels[0] : `/${positionnels[0]}`;
  const slug = route === '/' ? 'accueil' : route.slice(1).replace(/[^\w-]+/g, '-');
  return { mode: 'route', route, sortie: positionnels[1] ?? `captures/${slug}.png` };
}
