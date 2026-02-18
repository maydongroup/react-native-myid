// Public API — single entry point for the library
export { startMyId } from './MyIdModule';

// Enums (runtime values)
export {
  MyIdEntryType,
  MyIdBuildMode,
  MyIdLocale,
  MyIdCameraShape,
  MyIdResidency,
  MyIdCameraSelector,
  MyIdCameraResolution,
  MyIdImageFormat,
  MyIdScreenOrientation,
  MyIdPresentationStyle,
  MyIdErrorCodes,
  MYID_USER_EXITED,
} from './types';

// Error class (runtime value + type)
export { MyIdError } from './types';

// Types (compile-time only)
export type {
  MyIdConfig,
  MyIdResult,
  MyIdErrorCode,
  MyIdOrganizationDetails,
} from './types';
