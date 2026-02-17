/**
 * Runtime validation for MyID SDK config parameters.
 *
 * All validators throw with clear, actionable error messages that tell the
 * developer exactly what's wrong and what the expected format is.
 *
 * @internal — not part of the public API.
 */

import type { MyIdConfig } from './types';

const THRESHOLD_MIN = 0.5;
const THRESHOLD_MAX = 0.99;
const SDK_HASH_LENGTH = 32;
const EXTERNAL_ID_LENGTH = 36;
const BIRTH_DATE_REGEX = /^\d{2}\.\d{2}\.\d{4}$/;

/**
 * Validates the entire MyID SDK config before sending to native.
 * Throws with a clear message if any parameter is invalid.
 */
export function validateConfig(config: MyIdConfig): void {
  validateClientId(config.clientId);

  if (config.threshold !== undefined) {
    validateThreshold(config.threshold);
  }
  if (config.birthDate !== undefined) {
    validateBirthDate(config.birthDate);
  }
  if (config.externalId !== undefined) {
    validateExternalId(config.externalId);
  }
  if (config.sdkHash !== undefined) {
    validateSdkHash(config.sdkHash);
  }
}

// ---------------------------------------------------------------------------
// Individual validators
// ---------------------------------------------------------------------------

function validateClientId(clientId: string): void {
  if (!clientId || clientId.trim().length === 0) {
    throw new Error('react-native-myid: clientId is required and cannot be empty.');
  }
}

function validateThreshold(threshold: number): void {
  if (
    typeof threshold !== 'number' ||
    Number.isNaN(threshold) ||
    threshold < THRESHOLD_MIN ||
    threshold > THRESHOLD_MAX
  ) {
    throw new Error(
      `react-native-myid: threshold must be a number between ${THRESHOLD_MIN} and ${THRESHOLD_MAX}. ` +
        `Received: ${threshold}`,
    );
  }
}

function validateBirthDate(birthDate: string): void {
  if (!BIRTH_DATE_REGEX.test(birthDate)) {
    throw new Error(
      'react-native-myid: birthDate must be in "dd.MM.yyyy" format ' +
        `(e.g., "01.01.1990"). Received: "${birthDate}"`,
    );
  }
}

function validateExternalId(externalId: string): void {
  if (externalId.length !== EXTERNAL_ID_LENGTH) {
    throw new Error(
      `react-native-myid: externalId must be a UUID4 string (${EXTERNAL_ID_LENGTH} characters). ` +
        `Received ${externalId.length} characters.`,
    );
  }
}

function validateSdkHash(sdkHash: string): void {
  if (sdkHash.length !== SDK_HASH_LENGTH) {
    throw new Error(
      `react-native-myid: sdkHash must be exactly ${SDK_HASH_LENGTH} characters. ` +
        `Received ${sdkHash.length} characters.`,
    );
  }
}
