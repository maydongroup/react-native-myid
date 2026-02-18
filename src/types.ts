// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/**
 * MyID SDK entry type.
 * - `IDENTIFICATION`: Full identification flow (liveness + face matching).
 * - `VIDEO_IDENTIFICATION`: Video-based identification (Android requires `myid-video-capture-sdk`).
 * - `FACE_DETECTION`: Face detection only — returns a photo, no backend verification.
 */
export enum MyIdEntryType {
  IDENTIFICATION = 'IDENTIFICATION',
  VIDEO_IDENTIFICATION = 'VIDEO_IDENTIFICATION',
  FACE_DETECTION = 'FACE_DETECTION',
}

/**
 * MyID SDK build mode (maps to `MyIdEnvironment` on native).
 * - `PRODUCTION`: Production environment.
 * - `DEBUG`: Sandbox environment for testing.
 */
export enum MyIdBuildMode {
  PRODUCTION = 'PRODUCTION',
  DEBUG = 'DEBUG',
}

/**
 * MyID SDK locale for UI language.
 */
export enum MyIdLocale {
  UZ = 'uz',
  EN = 'en',
  RU = 'ru',
}

/**
 * Camera overlay shape for the face capture screen.
 */
export enum MyIdCameraShape {
  CIRCLE = 'CIRCLE',
  ELLIPSE = 'ELLIPSE',
}

/**
 * Residency type.
 * - `RESIDENT`: Uzbekistan resident (default).
 * - `NON_RESIDENT`: Foreign citizen.
 * - `USER_DEFINED`: Let the user select via the SDK's passport input screen.
 */
export enum MyIdResidency {
  RESIDENT = 'RESIDENT',
  NON_RESIDENT = 'NON_RESIDENT',
  USER_DEFINED = 'USER_DEFINED',
}

/**
 * Camera selector.
 * - `FRONT`: Front-facing camera (default).
 * - `BACK`: Rear camera.
 *
 * @platform android
 */
export enum MyIdCameraSelector {
  FRONT = 'FRONT',
  BACK = 'BACK',
}

/**
 * Camera resolution.
 * - `LOW`: Lower resolution, faster processing (default).
 * - `HIGH`: Higher resolution capture.
 *
 * @platform android
 */
export enum MyIdCameraResolution {
  LOW = 'LOW',
  HIGH = 'HIGH',
}

/**
 * Image format for captured photos.
 * - `JPEG`: JPEG format (default).
 * - `PNG`: PNG format.
 *
 * @platform android
 */
export enum MyIdImageFormat {
  JPEG = 'JPEG',
  PNG = 'PNG',
}

/**
 * Screen orientation during the SDK flow.
 * - `PORTRAIT`: Portrait mode (default).
 * - `LANDSCAPE`: Landscape mode.
 *
 * @platform android
 */
export enum MyIdScreenOrientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
}

/**
 * Presentation style for the SDK modal.
 * - `FULL_SCREEN`: Full-screen modal (default).
 * - `SHEET`: Bottom sheet presentation.
 *
 * @platform ios
 */
export enum MyIdPresentationStyle {
  FULL_SCREEN = 'FULL_SCREEN',
  SHEET = 'SHEET',
}

// ---------------------------------------------------------------------------
// Organization details
// ---------------------------------------------------------------------------

/**
 * Organization branding details shown in the SDK.
 */
export interface MyIdOrganizationDetails {
  /** Support phone number displayed on error screens (default: MyID call center). */
  phoneNumber?: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * Configuration for starting the MyID SDK.
 *
 * All three auth fields (`sessionId`, `clientHash`, `clientHashId`) can be
 * provided simultaneously — this is the recommended approach per the official
 * SDK examples.
 *
 * At minimum, provide `sessionId` or both `clientHash` + `clientHashId`.
 * For `IDENTIFICATION` entry type, all three may be required by the server.
 *
 * @example
 * ```ts
 * const config: MyIdConfig = {
 *   sessionId: 'uuid-from-backend',
 *   clientHash: 'hash-from-myid-team',
 *   clientHashId: 'hash-id-from-myid-team',
 *   buildMode: MyIdBuildMode.PRODUCTION,
 *   locale: MyIdLocale.EN,
 *   residency: MyIdResidency.RESIDENT,
 * };
 * ```
 */
export interface MyIdConfig {
  // ── Auth fields ────────────────────────────────────────────────────────

  /**
   * Session ID from your backend.
   * Created via `POST /api/v2/sdk/sessions`.
   *
   * Mandatory for `IDENTIFICATION` entry type.
   */
  sessionId?: string;

  /** Client hash provided by the MyID sales team. Mandatory for `IDENTIFICATION`. */
  clientHash?: string;

  /** Client hash ID provided by the MyID sales team. Mandatory for `IDENTIFICATION`. */
  clientHashId?: string;

  // ── Core options ───────────────────────────────────────────────────────

  /**
   * Entry type: identification, video identification, or face detection.
   * @default MyIdEntryType.IDENTIFICATION
   */
  entryType?: MyIdEntryType;

  /**
   * Build mode: production or sandbox.
   * @default MyIdBuildMode.PRODUCTION
   */
  buildMode?: MyIdBuildMode;

  /**
   * UI language.
   * @default MyIdLocale.UZ
   */
  locale?: MyIdLocale;

  /**
   * Residency type. Determines which verification flow the SDK uses.
   * @default MyIdResidency.RESIDENT
   */
  residency?: MyIdResidency;

  /**
   * Minimum age required to use the service.
   * @default 16
   */
  minAge?: number;

  // ── Camera options ─────────────────────────────────────────────────────

  /**
   * Camera overlay shape.
   * @default MyIdCameraShape.CIRCLE
   */
  cameraShape?: MyIdCameraShape;

  /**
   * Camera selector (front or back).
   * @default MyIdCameraSelector.FRONT
   * @platform android
   */
  cameraSelector?: MyIdCameraSelector;

  /**
   * Camera resolution.
   * @default MyIdCameraResolution.LOW
   * @platform android
   */
  cameraResolution?: MyIdCameraResolution;

  // ── Image options ──────────────────────────────────────────────────────

  /**
   * Image format for captured photos.
   * @default MyIdImageFormat.JPEG
   * @platform android
   */
  imageFormat?: MyIdImageFormat;

  // ── UI options ─────────────────────────────────────────────────────────

  /**
   * Whether to show the SDK's built-in error screen before calling `onError`.
   * @default true
   */
  showErrorScreen?: boolean;

  /**
   * Screen orientation during the SDK flow.
   * @default MyIdScreenOrientation.PORTRAIT
   * @platform android
   */
  screenOrientation?: MyIdScreenOrientation;

  /**
   * Presentation style for the SDK modal.
   * @default MyIdPresentationStyle.FULL_SCREEN
   * @platform ios
   */
  presentationStyle?: MyIdPresentationStyle;

  /**
   * Enable or disable sound guides during the flow.
   * @default true
   * @platform android
   */
  withSoundGuides?: boolean;

  /**
   * Distance threshold for face capture.
   * @default 0.65
   * @platform android
   */
  distance?: number;

  /** Organization branding details. */
  organizationDetails?: MyIdOrganizationDetails;

  /**
   * Huawei App ID for HMS devices.
   * Required only when targeting Huawei devices without Google Play Services.
   * @platform android
   */
  huaweiAppId?: string;
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

/**
 * Result returned on successful identification.
 */
export interface MyIdResult {
  /**
   * Authorization code to exchange for user data on your backend.
   * Exchange via `GET /api/v1/sdk/data?code=`
   *
   * ⚠️ Valid for 5 minutes, single use only.
   */
  code: string;

  /**
   * Captured face image as a base64-encoded JPEG string.
   * Returned when the SDK captures a photo.
   */
  image?: string;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * Error codes returned by the MyID SDK.
 *
 * Full list: https://docs.myid.uz/#/ru/embedded?id=javob-kodlar-uz-result_code
 *
 * @example
 * ```ts
 * import { MyIdError, MyIdErrorCodes } from '@maydon_tech/react-native-myid';
 *
 * try {
 *   await startMyId(config);
 * } catch (err) {
 *   if (err instanceof MyIdError) {
 *     if (err.code === MyIdErrorCodes.LIVENESS_FAILED) {
 *       // handle liveness failure
 *     }
 *   }
 * }
 * ```
 */
export const MyIdErrorCodes = {
  /** User cancelled / exited the SDK. */
  USER_EXITED: -1,
  /** Passport data is incorrect. */
  PASSPORT_DATA_INCORRECT: 2,
  /** Liveness check failed. */
  LIVENESS_FAILED: 3,
  /** Face recognition failed. */
  RECOGNITION_FAILED: 4,
  /** External service unavailable. */
  EXTERNAL_SERVICE_UNAVAILABLE: 5,
  /** Person is marked as deceased. */
  USER_DECEASED: 6,
  /** Selfie photo was not received. */
  PHOTO_NOT_RECEIVED: 7,
  /** Internal server error. */
  INTERNAL_ERROR: 8,
  /** Identification task expired. */
  TASK_EXPIRED: 9,
  /** Processing queue timed out. */
  QUEUE_TIMEOUT: 10,
  /** Service temporarily unavailable. */
  SERVICE_UNAVAILABLE: 11,
  /** Liveness photo is of incorrect quality. */
  LIVENESS_INCORRECT_PHOTO: 14,
  /** Recognition photo is of incorrect quality. */
  RECOGNITION_INCORRECT_PHOTO: 17,
  /** Liveness service error. */
  LIVENESS_SERVICE_ERROR: 18,
  /** Recognition service error. */
  RECOGNITION_SERVICE_ERROR: 19,
  /** Photo is too blurry. */
  BLURRY_PHOTO: 20,
  /** Face is not fully visible in the photo. */
  FACE_NOT_FULLY_SHOWN: 21,
  /** Multiple faces detected. */
  MULTIPLE_FACES: 22,
  /** Image is grayscale. */
  GRAYSCALE_IMAGE: 23,
  /** Darkened glasses detected on face. */
  DARKENED_GLASSES: 24,
  /** Unsupported photo file type. */
  UNSUPPORTED_PHOTO_TYPE: 25,
  /** Eyes are closed. */
  EYES_CLOSED: 26,
  /** Head rotation too large. */
  HEAD_ROTATION: 27,
  /** Face landmarks not detected. */
  LANDMARKS_NOT_DETECTED: 28,
  /** Light artifact / glare detected. */
  LIGHT_ARTIFACT: 29,
  /** Face occlusion detected (mask, hand, etc.). */
  OCCLUSION: 30,
  /** Central face is not the biggest face in frame. */
  CENTRAL_FACE_NOT_BIGGEST: 31,
  /** Nose and mouth not detected. */
  NOSE_MOUTH_NOT_DETECTED: 32,
  /** No infrared image available. */
  NO_INFRARED_IMAGE: 33,
  /** Passport has expired. */
  EXPIRED_PASSPORT: 34,
  /** Generic SDK error. */
  SDK_ERROR: 101,
  /** Camera permission denied. */
  CAMERA_DENIED: 102,
  /** Server communication error. */
  SERVER_ERROR: 103,
  /** Blurry photo detected by SDK locally. */
  SDK_BLURRY_DETECTED: 120,
  /** User is banned from using the service. */
  USER_BANNED: 122,
} as const;

/**
 * Union of all possible numeric error codes from `MyIdErrorCodes`.
 */
export type MyIdErrorCode = (typeof MyIdErrorCodes)[keyof typeof MyIdErrorCodes];

/**
 * Error thrown when the MyID SDK encounters an issue or the user exits.
 */
export class MyIdError extends Error {
  /** Numeric error code. See {@link MyIdErrorCodes}. */
  readonly code: number;

  /** `true` when the user voluntarily exited the SDK (code === -1). */
  readonly isUserExit: boolean;

  constructor(code: number, message: string) {
    super(message);
    this.name = 'MyIdError';
    this.code = code;
    this.isUserExit = code === MyIdErrorCodes.USER_EXITED;

    // Fix prototype chain for `instanceof` checks in transpiled code
    Object.setPrototypeOf(this, MyIdError.prototype);
  }

  /** Ensures `message` is included when serialized via JSON.stringify. */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      isUserExit: this.isUserExit,
    };
  }
}

/** Sentinel error code string used by the native bridge for user exit. */
export const MYID_USER_EXITED = 'MYID_USER_EXITED';
