// Reanimated en mode test : les animations s'exécutent sur le fil JavaScript et suivent
// les minuteurs simulés de Jest.
import { setUpTests } from 'react-native-reanimated';

setUpTests();

// Zones protégées simulées (sans SafeAreaProvider), fournies par la bibliothèque.
jest.mock(
  'react-native-safe-area-context',
  () =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-safe-area-context/jest/mock').default,
);
