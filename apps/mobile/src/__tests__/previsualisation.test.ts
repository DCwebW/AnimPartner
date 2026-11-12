import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PROJECT_ID = '6e4ffded-5c47-45b9-b3c5-51f9705dda40';
const racine = resolve(__dirname, '../../../..');
const lire = (chemin: string) => readFileSync(resolve(racine, chemin), 'utf8');

describe('configuration EAS Update', () => {
  const { expo } = JSON.parse(lire('apps/mobile/app.json'));

  it('déclare le propriétaire, le slug et le projet EAS', () => {
    expect(expo.owner).toBe('dcwebw');
    expect(expo.slug).toBe('animpartner');
    expect(expo.extra.eas.projectId).toBe(PROJECT_ID);
  });

  it("pointe vers l'URL d'EAS Update du projet", () => {
    expect(expo.updates.url).toBe(`https://u.expo.dev/${PROJECT_ID}`);
  });

  it('utilise la politique de version sdkVersion', () => {
    expect(expo.runtimeVersion).toEqual({ policy: 'sdkVersion' });
  });

  it('charge le plugin expo-updates', () => {
    expect(expo.plugins).toContain('expo-updates');
  });

  it('fournit un eas.json valide', () => {
    expect(() => JSON.parse(lire('apps/mobile/eas.json'))).not.toThrow();
  });
});

describe('workflow de préversion', () => {
  const workflow = lire('.github/workflows/previsualisation.yml');

  it('se déclenche sur les pull requests', () => {
    expect(workflow).toMatch(/pull_request:/);
  });

  it('publie avec eas update sur une branche nommée explicitement', () => {
    expect(workflow).toMatch(/expo-github-action\/preview@/);
    expect(workflow).toMatch(/command:\s*eas update --branch pr-\$\{\{ github\.event\.number \}\}/);
    expect(workflow).toMatch(/qr-target:\s*expo-go/);
  });

  it('limite pull-requests: write à ce workflow et lit le jeton dans les secrets', () => {
    expect(workflow).toMatch(/pull-requests:\s*write/);
    expect(workflow).toMatch(/secrets\.EXPO_TOKEN/);
  });

  it('ne contient aucun jeton en clair', () => {
    expect(workflow).not.toMatch(/EXPO_TOKEN:\s*[A-Za-z0-9_-]{20,}/);
  });
});
