import 'react-native-get-random-values';
import { Buffer } from '@craftzdog/react-native-buffer';

// Make Buffer globally available
// Type assertion needed: @craftzdog/react-native-buffer is API-compatible
// but has a different TypeScript signature than Node's BufferConstructor
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer as unknown as typeof global.Buffer;
}