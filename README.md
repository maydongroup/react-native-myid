# @maydon_tech/react-native-myid

React Native bridge for the [MyID](https://myid.uz/) biometric identification SDK (iOS & Android).

Supports both the **session-based flow** (`sessionId`) and the **legacy flow** (`clientHash`), with full TypeScript types, runtime validation, and [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page) (TurboModules) support.

## Requirements

| Platform | Min Version |
|----------|------------|
| Android  | API 21 (5.0) |
| iOS      | 13.0+ |
| React Native | 0.73+ |

## Installation

```bash
npm install @maydon_tech/react-native-myid
```

### Android

No additional setup needed — auto-linking and dependency resolution are handled automatically.

### iOS

1. Download **MyIdSDK.xcframework** and place it in your project's `ios/` folder:

   ```bash
   cd ios
   curl -L -o MyIdSDK.xcframework.zip \
     "https://gitlab.myid.uz/myid-public-code/myid-ios-sdk/-/releases"
   unzip -o MyIdSDK.xcframework.zip
   rm MyIdSDK.xcframework.zip
   ```

   > Or download it manually from the [MyID iOS SDK releases](https://gitlab.myid.uz/myid-public-code/myid-ios-sdk/-/releases) and place `MyIdSDK.xcframework` in your `ios/` directory.

2. Install pods:

   ```bash
   cd ios && pod install
   ```

3. Add to `Info.plist`:

   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Camera access is required for identity verification</string>
   ```

## Usage

### Session Flow (Recommended)

```typescript
import { startMyId, MyIdError, MyIdLocale, MyIdBuildMode } from '@maydon_tech/react-native-myid';

// 1. Get sessionId from YOUR backend
//    Backend calls: POST https://api.myid.uz/api/v2/sdk/sessions
const sessionId = await fetchSessionFromBackend();

// 2. Launch MyID SDK
try {
  const result = await startMyId({
    clientId: 'YOUR_CLIENT_ID',
    sessionId: sessionId,
    locale: MyIdLocale.EN,
    buildMode: MyIdBuildMode.PRODUCTION,
  });

  // 3. Send code to YOUR backend for data retrieval
  //    Backend calls: GET https://api.myid.uz/api/v1/sdk/data?code=<result.code>
  await sendCodeToBackend(result.code);
} catch (err) {
  if (err instanceof MyIdError) {
    if (err.isUserExit) return;  // user cancelled
    console.error(`SDK error ${err.code}: ${err.message}`);
  }
}
```

### Legacy Flow (Client Hash)

```typescript
import { startMyId, MyIdError } from '@maydon_tech/react-native-myid';

try {
  const result = await startMyId({
    clientId: 'YOUR_CLIENT_ID',
    clientHash: 'HASH_FROM_BACKEND',
    clientHashId: 'YOUR_SLUG',
    passportData: 'AA1234567',
    birthDate: '01.01.1990',
  });
  console.log('Code:', result.code);
} catch (err) {
  if (err instanceof MyIdError) {
    console.error(`Error ${err.code}: ${err.message}`);
  }
}
```

> **Note:** The two flows are mutually exclusive at the type level — TypeScript will error if you provide both `sessionId` and `clientHash` in the same config.

## Configuration

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `clientId` | `string` | ✅ | — | Client ID from MyID |
| `sessionId` | `string` | Session flow | — | From backend session creation |
| `clientHash` | `string` | Legacy flow | — | Hash from backend |
| `clientHashId` | `string` | Legacy flow | — | Slug identifier |
| `passportData` | `string` | — | — | Passport number or PINFL |
| `birthDate` | `string` | — | — | Format: `dd.MM.yyyy` |
| `sdkHash` | `string` | — | — | 32-char hash from previous identification |
| `externalId` | `string` | — | — | UUID4 for tracking (36 chars) |
| `threshold` | `number` | — | `0.50` | Face match threshold (0.50–0.99) |
| `entryType` | `MyIdEntryType` | — | `AUTH` | `AUTH` or `FACE` |
| `buildMode` | `MyIdBuildMode` | — | `PRODUCTION` | `PRODUCTION` or `DEBUG` |
| `locale` | `MyIdLocale` | — | `UZ` | `UZ`, `EN`, `RU` |
| `cameraShape` | `MyIdCameraShape` | — | `CIRCLE` | `CIRCLE` or `ELLIPSE` |
| `withPhoto` | `boolean` | — | `false` | Return face image as base64 |
| `organizationDetails` | `object` | — | — | `{ phoneNumber, logo }` |

### Runtime Validation

Config parameters are validated before the native call. Invalid values throw immediately with descriptive messages:

```
react-native-myid: threshold must be a number between 0.5 and 0.99. Received: 2.0
react-native-myid: birthDate must be in "dd.MM.yyyy" format. Received: "1990-01-01"
```

## Result

```typescript
interface MyIdResult {
  code: string;         // Authorization code (5 min TTL, single use)
  comparison?: number;  // Face match value (0.0–1.0, AUTH only)
  image?: string;       // Base64 JPEG (if withPhoto: true)
}
```

## Error Handling

All errors are thrown as `MyIdError` instances with `code`, `message`, and `isUserExit` properties:

```typescript
import { startMyId, MyIdError, MyIdErrorCodes } from '@maydon_tech/react-native-myid';

try {
  const result = await startMyId(config);
} catch (err) {
  if (err instanceof MyIdError) {
    if (err.isUserExit) {
      // User cancelled — handle gracefully
      return;
    }

    // SDK error — err.code is a number from MyIdErrorCodes
    switch (err.code) {
      case MyIdErrorCodes.LIVENESS_FAILED:
        showRetry('Liveness check failed');
        break;
      default:
        showError(`Error ${err.code}: ${err.message}`);
    }
  }
}
```

### Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| `-1` | `USER_EXITED` | User cancelled the SDK |
| `3` | `LIVENESS_FAILED` | Face liveness check failed |
| `5` | `FACE_NOT_DETECTED` | No face found in camera |
| `101` | `SDK_ERROR` | Generic SDK error |

## New Architecture

This library supports React Native's **New Architecture** (TurboModules) out of the box, with full backward compatibility with the old bridge architecture. No configuration needed.

## Development

```bash
npm install --legacy-peer-deps
npm run typecheck    # Type check
npm test             # Run tests (44 tests)
npm run lint         # ESLint
npm run format       # Prettier
```

## License

MIT
