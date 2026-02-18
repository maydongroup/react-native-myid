/**
 * Runtime validation for MyID SDK config parameters.
 *
 * All validators throw with clear, actionable error messages that tell the
 * developer exactly what's wrong and what the expected format is.
 *
 * @internal — not part of the public API.
 */

import type { MyIdConfig } from './types';

/**
 * Validates the entire MyID SDK config before sending to native.
 * Throws with a clear message if any parameter is invalid.
 */
export function validateConfig(config: MyIdConfig): void {
  // Must have at least sessionId or (clientHash + clientHashId)
  const hasSession = !!config.sessionId;
  const hasHash = !!config.clientHash && !!config.clientHashId;

  if (!hasSession && !hasHash) {
    throw new Error(
      'react-native-myid: You must provide either `sessionId` ' +
        'or both `clientHash` + `clientHashId`.',
    );
  }
}
