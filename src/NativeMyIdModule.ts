import { NativeModules } from 'react-native';

// ---------------------------------------------------------------------------
// Native-side contract — these types describe the raw bridge interface
// ---------------------------------------------------------------------------

/** Shape of the config object sent across the bridge to native. */
export interface NativeMyIdConfig {
  sessionId?: string;
  clientHash?: string;
  clientHashId?: string;
  entryType: string;
  buildMode: string;
  locale?: string;
  cameraShape?: string;
  organizationDetails?: { phoneNumber?: string };
}

/** Shape of the raw result dictionary returned from the native side. */
export interface NativeMyIdResult {
  code: string;
  image?: string;
}

/** Typed spec for the native module. */
interface NativeMyIdModuleSpec {
  start(config: NativeMyIdConfig): Promise<NativeMyIdResult>;
}

// ---------------------------------------------------------------------------
// Module resolution with a descriptive error when not linked
// ---------------------------------------------------------------------------

const NativeMyId: NativeMyIdModuleSpec = NativeModules.MyIdModule as NativeMyIdModuleSpec;

if (!NativeMyId) {
  throw new Error(
    'react-native-myid: NativeModule "MyIdModule" is null. ' +
      'Ensure the native module is properly linked.\n' +
      '- iOS: Run `cd ios && pod install`\n' +
      '- Android: Make sure MyIdPackage is added to getPackages() in MainApplication',
  );
}

export default NativeMyId;
