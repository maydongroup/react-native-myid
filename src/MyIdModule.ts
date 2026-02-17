import NativeMyId from './NativeMyIdModule';
import type { NativeMyIdConfig } from './NativeMyIdModule';
import type { MyIdConfig, MyIdResult } from './types';
import { MyIdError, MYID_USER_EXITED, MyIdErrorCodes } from './types';
import { validateConfig } from './validators';

/**
 * Launches the MyID biometric identification SDK.
 *
 * @param config - SDK configuration. Must include `clientId` and either
 *   `sessionId` (new flow) or `clientHash` + `clientHashId` (legacy flow).
 *
 * @returns Promise resolving to {@link MyIdResult} with the authorization code.
 *
 * @throws {@link MyIdError} if the SDK encounters an error or the user exits.
 *   Use `err.isUserExit` to distinguish user cancellation from real errors.
 *
 * @example
 * ```ts
 * import { startMyId, MyIdError, MyIdErrorCodes, MyIdLocale } from 'react-native-myid';
 *
 * try {
 *   const result = await startMyId({
 *     clientId: 'your_client_id',
 *     sessionId: 'uuid-from-backend',
 *     locale: MyIdLocale.EN,
 *   });
 *   // Send result.code to your backend
 * } catch (err) {
 *   if (err instanceof MyIdError) {
 *     if (err.isUserExit) return; // user cancelled
 *     console.error(`SDK error ${err.code}: ${err.message}`);
 *   }
 * }
 * ```
 */
export async function startMyId(config: MyIdConfig): Promise<MyIdResult> {
  // ── Validate config before crossing the bridge ────────────────────────
  validateConfig(config);

  // ── Build typed native config ─────────────────────────────────────────
  const nativeConfig: NativeMyIdConfig = {
    clientId: config.clientId,
    entryType: config.entryType ?? 'AUTH',
    buildMode: config.buildMode ?? 'PRODUCTION',
    withPhoto: config.withPhoto ?? false,
  };

  // Flow-specific fields
  if ('sessionId' in config && config.sessionId) {
    nativeConfig.sessionId = config.sessionId;
  }
  if ('clientHash' in config && config.clientHash) {
    nativeConfig.clientHash = config.clientHash;
  }
  if ('clientHashId' in config && config.clientHashId) {
    nativeConfig.clientHashId = config.clientHashId;
  }

  // Optional fields — only set when provided (avoids sending `undefined`)
  if (config.passportData) nativeConfig.passportData = config.passportData;
  if (config.birthDate) nativeConfig.birthDate = config.birthDate;
  if (config.sdkHash) nativeConfig.sdkHash = config.sdkHash;
  if (config.externalId) nativeConfig.externalId = config.externalId;
  if (config.threshold !== undefined) nativeConfig.threshold = config.threshold;
  if (config.locale) nativeConfig.locale = config.locale;
  if (config.cameraShape) nativeConfig.cameraShape = config.cameraShape;
  if (config.organizationDetails) {
    nativeConfig.organizationDetails = config.organizationDetails;
  }

  // ── Call native module ────────────────────────────────────────────────
  try {
    const result = await NativeMyId.start(nativeConfig);

    return {
      code: result.code,
      comparison: result.comparison != null ? Number(result.comparison) : undefined,
      image: result.image ?? undefined,
    };
  } catch (error: unknown) {
    // Native errors arrive as { code: string; message: string }
    if (error && typeof error === 'object' && 'code' in error) {
      const native = error as { code: string; message: string };

      if (native.code === MYID_USER_EXITED) {
        throw new MyIdError(MyIdErrorCodes.USER_EXITED, 'User exited MyID SDK');
      }

      throw new MyIdError(
        Number(native.code) || MyIdErrorCodes.SDK_ERROR,
        native.message || 'MyID SDK error',
      );
    }

    // Unknown error — wrap for consistency
    throw new MyIdError(
      MyIdErrorCodes.SDK_ERROR,
      error instanceof Error ? error.message : 'Unknown MyID SDK error',
    );
  }
}
