import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mobile = resolve(__dirname, '../..');
const { expo } = JSON.parse(readFileSync(resolve(mobile, 'app.json'), 'utf8'));

describe("identité de l'application", () => {
  it("met le fond Soleil clair sous l'icône adaptive", () => {
    expect(expo.android.adaptiveIcon.backgroundColor).toBe('#FEF3D4');
  });

  it("configure le splash natif avec l'icône « AP »", () => {
    const plugin = expo.plugins.find(
      (p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen',
    );
    expect(plugin?.[1]).toEqual({
      image: './assets/splash-icon.png',
      imageWidth: 200,
      resizeMode: 'contain',
      backgroundColor: '#FEF3D4',
      dark: { backgroundColor: '#262231' },
    });
  });

  it.each([
    'icon.png',
    'android-icon-foreground.png',
    'android-icon-background.png',
    'android-icon-monochrome.png',
    'splash-icon.png',
    'favicon.png',
    'logo.png',
  ])('fournit %s', (fichier) => {
    expect(existsSync(resolve(mobile, 'assets', fichier))).toBe(true);
  });
});
