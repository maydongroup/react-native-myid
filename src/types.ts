// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/**
 * MyID SDK entry type.
 * - `IDENTIFICATION`: Full identification flow (liveness + face matching).
 * - `VIDEO_IDENTIFICATION`: Video-based identification.
 * - `FACE_DETECTION`: Face detection only.
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
 * Camera shape for the face capture screen.
 */
export enum MyIdCameraShape {
  CIRCLE = 'CIRCLE',
  ELLIPSE = 'ELLIPSE',
}

// ---------------------------------------------------------------------------
// Organization details
// ---------------------------------------------------------------------------

/**
 * Organization branding details shown in the SDK.
 */
export interface MyIdOrganizationDetails {
  /** Support phone number displayed on error screens. */
  phoneNumber?: string;
}

// ---------------------------------------------------------------------------
// Config — discriminated union (session flow vs hash flow)
// ---------------------------------------------------------------------------

/**
 * Shared configuration fields for both SDK flows.
 *
 * @see {@link MyIdSessionConfig} — new session-based flow.
 * @see {@link MyIdHashConfig}    — legacy client-hash flow.
 */
interface MyIdBaseConfig {
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
   * Camera overlay shape.
   * @default MyIdCameraShape.CIRCLE
   */
  cameraShape?: MyIdCameraShape;

  /** Organization branding details. */
  organizationDetails?: MyIdOrganizationDetails;
}

/**
 * Configuration for the **new session-based flow**.
 *
 * The `sessionId` is obtained from your backend by calling
 * `POST /api/v2/sdk/sessions`.
 *
 * `clientHash` / `clientHashId` must **not** be provided.
 */
export interface MyIdSessionConfig extends MyIdBaseConfig {
  /**
   * Session ID from your backend (new flow).
   * Created via `POST /api/v2/sdk/sessions`.
   */
  sessionId: string;

  /** @deprecated Not allowed in session flow — use `sessionId` instead. */
  clientHash?: never;
  /** @deprecated Not allowed in session flow — use `sessionId` instead. */
  clientHashId?: never;
}

/**
 * Configuration for the **legacy client-hash flow**.
 *
 * `sessionId` must **not** be provided.
 */
export interface MyIdHashConfig extends MyIdBaseConfig {
  /** @deprecated Not allowed in hash flow — use `clientHash` instead. */
  sessionId?: never;

  /** Client hash from your backend (old flow). */
  clientHash: string;

  /** Client hash ID / slug (old flow). */
  clientHashId: string;
}

/**
 * Configuration for starting the MyID SDK.
 *
 * This is a **discriminated union** — you must choose exactly one flow:
 *
 * - **Session flow** (recommended): provide `sessionId`.
 * - **Hash flow** (legacy): provide `clientHash` + `clientHashId`.
 *
 * @example
 * ```ts
 * // ✅ Session flow
 * const config: MyIdConfig = {
 *   sessionId: 'uuid-from-backend',
 * };
 *
 * // ✅ Hash flow
 * const config: MyIdConfig = {
 *   clientHash: 'hash',
 *   clientHashId: 'slug',
 * };
 * ```
 */
export type MyIdConfig = MyIdSessionConfig | MyIdHashConfig;

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
   * Captured face image as a base64-encoded string.
   * Only returned if the SDK captured a photo.
   */
  image?: string;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/**
 * Error codes returned by the MyID SDK.
 *
 * @example
 * ```ts
 * import { MyIdError, MyIdErrorCodes } from 'react-native-myid';
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
