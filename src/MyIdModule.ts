import NativeMyId from './NativeMyIdModule';
import type { NativeMyIdConfig } from './NativeMyIdModule';
import type { MyIdConfig, MyIdResult } from './types';
import { MyIdError, MYID_USER_EXITED, MyIdErrorCodes } from './types';
import { validateConfig } from './validators';

/**
 * Launches the MyID biometric identification SDK.
 *
 * @param config - SDK configuration. Must include either
 *   `sessionId` or `clientHash` + `clientHashId` (or all three).
 *
 * @returns Promise resolving to {@link MyIdResult} with the authorization code.
 *
 * @throws {@link MyIdError} if the SDK encounters an error or the user exits.
 *   Use `err.isUserExit` to distinguish user cancellation from real errors.
 *
 * @example
 * ```ts
 * import { startMyId, MyIdError, MyIdBuildMode, MyIdLocale } from '@maydon_tech/react-native-myid';
 *
 * try {
 *   const result = await startMyId({
 *     sessionId: 'uuid-from-backend',
 *     clientHash: 'hash-from-myid-team',
 *     clientHashId: 'hash-id-from-myid-team',
 *     buildMode: MyIdBuildMode.PRODUCTION,
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
    entryType: config.entryType ?? 'IDENTIFICATION',
    buildMode: config.buildMode ?? 'PRODUCTION',
  };

  // Auth fields
  if (config.sessionId) nativeConfig.sessionId = config.sessionId;
  if (config.clientHash) nativeConfig.clientHash = config.clientHash;
  if (config.clientHashId) nativeConfig.clientHashId = config.clientHashId;

  // Core options
  if (config.locale) nativeConfig.locale = config.locale;
  if (config.residency) nativeConfig.residency = config.residency;
  if (config.minAge != null) nativeConfig.minAge = config.minAge;

  // Camera options
  if (config.cameraShape) nativeConfig.cameraShape = config.cameraShape;
  if (config.cameraSelector) nativeConfig.cameraSelector = config.cameraSelector;
  if (config.cameraResolution) nativeConfig.cameraResolution = config.cameraResolution;

  // Image options
  if (config.imageFormat) nativeConfig.imageFormat = config.imageFormat;

  // UI options
  if (config.showErrorScreen != null) nativeConfig.showErrorScreen = config.showErrorScreen;
  if (config.screenOrientation) nativeConfig.screenOrientation = config.screenOrientation;
  if (config.presentationStyle) nativeConfig.presentationStyle = config.presentationStyle;
  if (config.withSoundGuides != null) nativeConfig.withSoundGuides = config.withSoundGuides;
  if (config.distance != null) nativeConfig.distance = config.distance;

  // Organization
  if (config.organizationDetails) {
    nativeConfig.organizationDetails = config.organizationDetails;
  }

  // Huawei
  if (config.huaweiAppId) nativeConfig.huaweiAppId = config.huaweiAppId;

  // ── Call native module ────────────────────────────────────────────────
  try {
    const result = await NativeMyId.start(nativeConfig);

    return {
      code: result.code,
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
