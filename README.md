# @maydon_tech/react-native-myid

React Native bridge for the [MyID](https://myid.uz/) biometric identification SDK (iOS & Android).

Full TypeScript types, runtime validation, and [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page) (TurboModules) support.

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

Add the MyID Artifactory repository to your project's `android/build.gradle`:

```gradle
repositories {
    maven { url "https://artifactory.aigroup.uz:443/artifactory/myid/" }
}
```

No other setup needed — auto-linking handles the rest.

### iOS

1. Install pods:

   ```bash
   cd ios && pod install
   ```

2. Add to `Info.plist`:

   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Camera access is required for identity verification</string>
   ```

## Usage

```typescript
import {
  startMyId,
  MyIdError,
  MyIdBuildMode,
  MyIdLocale,
  MyIdResidency,
} from '@maydon_tech/react-native-myid';

try {
  // 1. Get sessionId from YOUR backend
  //    Backend calls: POST https://api.myid.uz/api/v2/sdk/sessions
  const sessionId = await fetchSessionFromBackend();

  // 2. Launch MyID SDK
  const result = await startMyId({
    sessionId,
    clientHash: 'HASH_FROM_MYID_TEAM',
    clientHashId: 'HASH_ID_FROM_MYID_TEAM',
    buildMode: __DEV__ ? MyIdBuildMode.DEBUG : MyIdBuildMode.PRODUCTION,
    locale: MyIdLocale.EN,
    residency: MyIdResidency.RESIDENT,
  });

  // 3. Use the result
  console.log('Code:', result.code);   // authorization code (5 min TTL, single use)
  console.log('Image:', result.image); // base64 face image (if available)

  // 4. Send code to YOUR backend for identity data retrieval
  //    Backend calls: GET https://api.myid.uz/api/v1/sdk/data?code=<result.code>
  await sendCodeToBackend(result.code);
} catch (err) {
  if (err instanceof MyIdError) {
    if (err.isUserExit) return; // user cancelled
    console.error(`SDK error ${err.code}: ${err.message}`);
  }
}
```

### Credentials

You need the following from the **MyID sales team**:

| Credential | Description | Per-environment? |
|------------|-------------|:---:|
| `clientHash` | Client hash string | ✅ Separate for sandbox/production |
| `clientHashId` | Client hash ID | ✅ Separate for sandbox/production |

The `sessionId` is dynamic — your backend creates one per authentication attempt via `POST /api/v2/sdk/sessions`.

## Configuration

All properties are optional. At minimum, provide `sessionId` or both `clientHash` + `clientHashId`. For `IDENTIFICATION` entry type, all three are typically required.

### Auth

| Property | Type | Description |
|----------|------|-------------|
| `sessionId` | `string` | Session ID from your backend |
| `clientHash` | `string` | Client hash from MyID team |
| `clientHashId` | `string` | Client hash ID from MyID team |

### Core

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entryType` | `MyIdEntryType` | `IDENTIFICATION` | `IDENTIFICATION`, `VIDEO_IDENTIFICATION`, or `FACE_DETECTION` |
| `buildMode` | `MyIdBuildMode` | `PRODUCTION` | `PRODUCTION` (real servers) or `DEBUG` (sandbox) |
| `locale` | `MyIdLocale` | `UZ` | `UZ`, `EN`, or `RU` |
| `residency` | `MyIdResidency` | `RESIDENT` | `RESIDENT`, `NON_RESIDENT`, or `USER_DEFINED` |
| `minAge` | `number` | `16` | Minimum age to use the service |

### Camera

| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| `cameraShape` | `MyIdCameraShape` | `CIRCLE` | Both | `CIRCLE` or `ELLIPSE` |
| `cameraSelector` | `MyIdCameraSelector` | `FRONT` | Both | `FRONT` or `BACK` |
| `cameraResolution` | `MyIdCameraResolution` | `LOW` | Android | `LOW` or `HIGH` |

### Image

| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| `imageFormat` | `MyIdImageFormat` | `JPEG` | Android | `JPEG` or `PNG` |

### UI

| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| `showErrorScreen` | `boolean` | `true` | Both | Show SDK's built-in error screen |
| `presentationStyle` | `MyIdPresentationStyle` | `FULL_SCREEN` | iOS | `FULL_SCREEN` or `SHEET` |
| `screenOrientation` | `MyIdScreenOrientation` | `PORTRAIT` | Android | `PORTRAIT` or `LANDSCAPE` |
| `withSoundGuides` | `boolean` | `true` | Android | Enable/disable sound guides |
| `distance` | `number` | `0.65` | Both | Distance threshold for face capture |

### Other

| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| `organizationDetails` | `{ phoneNumber? }` | — | Both | Custom support phone number |
| `huaweiAppId` | `string` | — | Android | Required for HMS devices |

### Runtime Validation

Config is validated before calling native. Invalid configs throw immediately:

```
react-native-myid: You must provide either `sessionId` or both `clientHash` + `clientHashId`.
```

## Result

```typescript
interface MyIdResult {
  code: string;     // Authorization code (5 min TTL, single use)
  image?: string;   // Base64 JPEG face image
}
```

## Error Handling

All errors are thrown as `MyIdError` instances:

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

    switch (err.code) {
      case MyIdErrorCodes.CAMERA_DENIED:
        showPermissionDialog();
        break;
      case MyIdErrorCodes.LIVENESS_FAILED:
        showRetry('Liveness check failed');
        break;
      case MyIdErrorCodes.USER_BANNED:
        showError('Access denied');
        break;
      default:
        showError(`Error ${err.code}: ${err.message}`);
    }
  }
}
```

### Error Codes

Full list: [docs.myid.uz](https://docs.myid.uz/#/ru/embedded?id=javob-kodlar-uz-result_code)

| Code | Constant | Description |
|------|----------|-------------|
| `-1` | `USER_EXITED` | User cancelled the SDK |
| `3` | `LIVENESS_FAILED` | Face liveness check failed |
| `5` | `EXTERNAL_SERVICE_UNAVAILABLE` | External service unavailable |
| `101` | `SDK_ERROR` | Generic SDK error |
| `102` | `CAMERA_DENIED` | Camera permission denied |
| `103` | `SERVER_ERROR` | Server communication error |
| `122` | `USER_BANNED` | User banned from the service |

See `MyIdErrorCodes` in the source for the complete list of 30+ error codes.

## API Reference

### `startMyId(config: MyIdConfig): Promise<MyIdResult>`

Launches the MyID biometric identification SDK.

- **Validates** the config before calling native (throws synchronously on invalid config).
- **Resolves** with `MyIdResult` on successful identification.
- **Throws** `MyIdError` on SDK errors or user cancellation.

```typescript
import { startMyId } from '@maydon_tech/react-native-myid';

const result = await startMyId({
  sessionId: 'uuid-from-backend',
  clientHash: 'hash',
  clientHashId: 'hash-id',
  buildMode: MyIdBuildMode.PRODUCTION,
});
```

---

### Enums

#### `MyIdEntryType`

| Value | Description |
|-------|-------------|
| `IDENTIFICATION` | Full identification: liveness check + face matching via MyID servers |
| `VIDEO_IDENTIFICATION` | Video-based identification (Android requires `myid-video-capture-sdk`) |
| `FACE_DETECTION` | Face detection only — returns a photo, no backend verification |

#### `MyIdBuildMode`

| Value | Description |
|-------|-------------|
| `PRODUCTION` | Production servers |
| `DEBUG` | Sandbox servers for testing |

#### `MyIdLocale`

| Value | Language |
|-------|----------|
| `UZ` (`'uz'`) | Uzbek |
| `EN` (`'en'`) | English |
| `RU` (`'ru'`) | Russian |

#### `MyIdResidency`

| Value | Description |
|-------|-------------|
| `RESIDENT` | Uzbekistan resident (default) |
| `NON_RESIDENT` | Foreign citizen |
| `USER_DEFINED` | SDK prompts the user to select resident/non-resident |

#### `MyIdCameraShape`

| Value | Description |
|-------|-------------|
| `CIRCLE` | Circular camera overlay (default) |
| `ELLIPSE` | Elliptical camera overlay |

#### `MyIdCameraSelector`

| Value | Description |
|-------|-------------|
| `FRONT` | Front-facing camera (default) |
| `BACK` | Rear camera |

#### `MyIdCameraResolution` _(Android only)_

| Value | Description |
|-------|-------------|
| `LOW` | Lower resolution, faster processing (default) |
| `HIGH` | Higher resolution capture |

#### `MyIdImageFormat` _(Android only)_

| Value | Description |
|-------|-------------|
| `JPEG` | JPEG format (default) |
| `PNG` | PNG format |

#### `MyIdScreenOrientation` _(Android only)_

| Value | Description |
|-------|-------------|
| `PORTRAIT` | Portrait orientation (default) |
| `LANDSCAPE` | Landscape orientation |

#### `MyIdPresentationStyle` _(iOS only)_

| Value | Description |
|-------|-------------|
| `FULL_SCREEN` | Full-screen modal (default) |
| `SHEET` | Bottom sheet presentation |

---

### Interfaces

#### `MyIdConfig`

```typescript
interface MyIdConfig {
  // Auth
  sessionId?: string;
  clientHash?: string;
  clientHashId?: string;

  // Core
  entryType?: MyIdEntryType;          // default: IDENTIFICATION
  buildMode?: MyIdBuildMode;          // default: PRODUCTION
  locale?: MyIdLocale;                // default: UZ
  residency?: MyIdResidency;          // default: RESIDENT
  minAge?: number;                    // default: 16

  // Camera
  cameraShape?: MyIdCameraShape;      // default: CIRCLE
  cameraSelector?: MyIdCameraSelector; // default: FRONT
  cameraResolution?: MyIdCameraResolution; // default: LOW  (Android only)

  // Image
  imageFormat?: MyIdImageFormat;      // default: JPEG  (Android only)

  // UI
  showErrorScreen?: boolean;          // default: true
  presentationStyle?: MyIdPresentationStyle; // default: FULL_SCREEN  (iOS only)
  screenOrientation?: MyIdScreenOrientation; // default: PORTRAIT  (Android only)
  withSoundGuides?: boolean;          // default: true  (Android only)
  distance?: number;                  // default: 0.65

  // Other
  organizationDetails?: MyIdOrganizationDetails;
  huaweiAppId?: string;               // Android only, HMS devices
}
```

#### `MyIdResult`

```typescript
interface MyIdResult {
  /** Authorization code — exchange on your backend via GET /api/v1/sdk/data?code=<code>.
   *  Valid for 5 minutes, single use only. */
  code: string;

  /** Captured face image as base64-encoded JPEG string. */
  image?: string;
}
```

#### `MyIdOrganizationDetails`

```typescript
interface MyIdOrganizationDetails {
  /** Support phone number displayed on SDK error screens. */
  phoneNumber?: string;
}
```

---

### `MyIdError`

Custom error class thrown by `startMyId`.

```typescript
class MyIdError extends Error {
  readonly code: number;        // Numeric error code (see table below)
  readonly isUserExit: boolean; // true when code === -1
  readonly message: string;     // Human-readable error message

  toJSON(): { name: string; code: number; message: string; isUserExit: boolean };
}
```

**Usage:**

```typescript
try {
  await startMyId(config);
} catch (err) {
  if (err instanceof MyIdError) {
    console.log(err.code);       // e.g. 102
    console.log(err.message);    // e.g. "Camera access denied"
    console.log(err.isUserExit); // false
  }
}
```

---

### `MyIdErrorCodes`

Full error code constants. Import as:

```typescript
import { MyIdErrorCodes } from '@maydon_tech/react-native-myid';
```

| Code | Constant | Description |
|:----:|----------|-------------|
| `-1` | `USER_EXITED` | User cancelled / exited the SDK |
| `2` | `PASSPORT_DATA_INCORRECT` | Passport data is incorrect |
| `3` | `LIVENESS_FAILED` | Liveness check failed |
| `4` | `RECOGNITION_FAILED` | Face recognition failed |
| `5` | `EXTERNAL_SERVICE_UNAVAILABLE` | External service unavailable |
| `6` | `USER_DECEASED` | Person is marked as deceased |
| `7` | `PHOTO_NOT_RECEIVED` | Selfie photo was not received |
| `8` | `INTERNAL_ERROR` | Internal server error |
| `9` | `TASK_EXPIRED` | Identification task expired |
| `10` | `QUEUE_TIMEOUT` | Processing queue timed out |
| `11` | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `14` | `LIVENESS_INCORRECT_PHOTO` | Liveness photo is of incorrect quality |
| `17` | `RECOGNITION_INCORRECT_PHOTO` | Recognition photo is of incorrect quality |
| `18` | `LIVENESS_SERVICE_ERROR` | Liveness service error |
| `19` | `RECOGNITION_SERVICE_ERROR` | Recognition service error |
| `20` | `BLURRY_PHOTO` | Photo is too blurry |
| `21` | `FACE_NOT_FULLY_SHOWN` | Face is not fully visible |
| `22` | `MULTIPLE_FACES` | Multiple faces detected |
| `23` | `GRAYSCALE_IMAGE` | Image is grayscale |
| `24` | `DARKENED_GLASSES` | Darkened glasses detected |
| `25` | `UNSUPPORTED_PHOTO_TYPE` | Unsupported photo file type |
| `26` | `EYES_CLOSED` | Eyes are closed |
| `27` | `HEAD_ROTATION` | Head rotation too large |
| `28` | `LANDMARKS_NOT_DETECTED` | Face landmarks not detected |
| `29` | `LIGHT_ARTIFACT` | Light artifact / glare detected |
| `30` | `OCCLUSION` | Face occlusion (mask, hand, etc.) |
| `31` | `CENTRAL_FACE_NOT_BIGGEST` | Central face is not the biggest in frame |
| `32` | `NOSE_MOUTH_NOT_DETECTED` | Nose and mouth not detected |
| `33` | `NO_INFRARED_IMAGE` | No infrared image available |
| `34` | `EXPIRED_PASSPORT` | Passport has expired |
| `101` | `SDK_ERROR` | Generic SDK error |
| `102` | `CAMERA_DENIED` | Camera permission denied |
| `103` | `SERVER_ERROR` | Server communication error |
| `120` | `SDK_BLURRY_DETECTED` | Blurry photo detected locally |
| `122` | `USER_BANNED` | User is banned from the service |

Official docs: [docs.myid.uz](https://docs.myid.uz/#/ru/embedded?id=javob-kodlar-uz-result_code)

---

## SDK Versions

| Platform | SDK | Version |
|----------|-----|---------|
| iOS | `MyIdSDK` (CocoaPod) | 3.1.3 |
| Android | `myid-capture-sdk` (Artifactory) | 3.1.5 |
| Android | `myid-video-capture-sdk` (Artifactory) | 3.1.5 |

## New Architecture

This library supports React Native's **New Architecture** (TurboModules) out of the box, with full backward compatibility with the old bridge architecture. No configuration needed.

## Development

```bash
npm install --legacy-peer-deps
npm run typecheck    # Type check
npm test             # Run tests
npm run lint         # ESLint
npm run format       # Prettier
```

## License

MIT

