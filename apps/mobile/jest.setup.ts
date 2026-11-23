// Reanimated en mode test : les animations s'exécutent sur le fil JavaScript et suivent
// les minuteurs simulés de Jest.
import { setUpTests } from 'react-native-reanimated';

setUpTests();

// Gestes simulés : le module natif de react-native-gesture-handler est remplacé par le sien.
import 'react-native-gesture-handler/jestSetup';

// Au chargement, la librairie installe ses liaisons avec le thread de l'interface dans une
// tâche différée, qui échoue sous Jest (pas de runtime d'interface) : rien à installer ici.
jest.mock(
  'react-native-gesture-handler/lib/module/handlers/gestures/installUIRuntimeBindings',
  () => ({
    installUIRuntimeBindings: () => {},
  }),
);

// Zones protégées simulées (sans SafeAreaProvider), fournies par la bibliothèque.
jest.mock(
  'react-native-safe-area-context',
  () =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-safe-area-context/jest/mock').default,
);
