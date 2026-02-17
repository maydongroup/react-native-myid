# Changelog

All notable changes to this project will be documented in this file.

## [3.1.5] - 23 Jan, 2026

- Improved overall performance and stability.

## [3.1.4] - 1 Dec, 2025

- 🔥 New flow
- 🔐 Added new security enhancements for data protection
- 🔥 Improved overall performance and stability.

## [2.4.9] - 24 Oct, 2025

- 🔥 Added User Agreement and Privacy Policy section.
- 🔥 Improved overall performance and stability.
- 🔨 Resolved problem of Public key pinning failed for host.

## [2.4.8] - 20 Aug, 2025

- 🔨 Support 16 KB page sizes.
- 🔨 Resolved problem of Public key pinning failed for host.
- 🔥 Improved overall performance and stability.

## [2.4.7] - 18 Aug, 2025

- 🔐 Added new security enhancements for data protection.

## [2.4.6] - 15 Aug, 2025

- 🔐 Added new security enhancements for data protection.
- 🔨 Deprecated some functions and enums (will be removed in future versions).
- 🔥 Improved overall performance and stability.

## [2.4.5] - 6 Jul, 2025

- 🔥 Improved overall performance and stability.

## [2.4.4] - 5 Jun, 2025

- 🔥 Added Uzbek Cyrillic language.
- 🔥 Improved UI performance and visuals.

## [2.4.3] - 6 May, 2025

- 🔥 Improved overall performance and stability.

## [2.4.2] - 27 Apr, 2025

- 🔥 Maximized efficiency in identification processes for capturing and loading operations.

## [2.4.1] - 23 Apr, 2025

- 🔐 Added new security enhancements for data protection.
- 💥 Added video identification support.
- 🔨 Updated several enum values for better clarity.
- 🔨 Deprecated some functions and enums (will be removed in future versions).
- 🔥 Improved overall performance and stability.

## [2.3.9] - 10 Apr, 2025

- Added new `withMinAge(value: Int)` method for the minimum age to use the MyID service.

## [2.3.8] - 15 Jan, 2025

- Maximized efficiency in identification processes for capturing and loading operations.

## [2.3.7] - 11 Nov, 2024

- Maximized efficiency in identification processes for capturing and loading operations.

## [2.3.4] - 9 Sep, 2024
 
- 🔨 Resolved Camera static screen: Addressed an issue causing the Camera preview to display a static screen on specific devices.

## [2.3.3] - 12 Jul, 2024

- Added new `withDistance(value: Float)` method to sets the distance for taking photo.

## [2.3.2] - 15 Jun, 2024

- Maximized efficiency in identification processes for capturing and loading operations

## [2.3.1] - 15 May, 2024

- 🔨 Resolved CameraX Preview static screen: Addressed an issue causing the CameraX preview to display a static screen on specific devices.

## [2.3.0] - 9 Apr, 2024

- 🔨 Resolved Camera Preview black screen: Addressed an issue causing the CameraX preview to display a black screen on specific devices.

## [2.2.8] - 1 Feb, 2024

- 🔗💥 Breaking change: now in order to retrieve the bitmap, user should call `getGraphicFieldImageByType` method on result object, instead of retrieving the `bitmap` field. This solves the bug with OutOfMemory exceptions on some devices;
- Added configurations for allowing transactions of foreign based end-users;
- Range for available face comparison `threshold` is now between 0.55 and 0.99, and it defaults to 0.55 now

## [2.2.7] - 2 Nov, 2023

- Added new `withMinAge(value: Int)` method for the minimum age to use the MyID service.
- 🔨 Fixed PINFL bug on versions below Android 8.1.
- Added error texts in inputs.

## [2.2.6] - 22 Oct, 2023

- Added new `withScreenOrientation(value: MyIdScreenOrientation)` method for screen orientation.

## [2.2.5] - 19 Oct, 2023

- 🔐 Added enhanced security measures.
- Added `withClientHash` method, which is mandatory if using withEntryType(MyIdEntryType.AUTH).

## [2.2.4] - 20 Sep, 2023

- 🔨 Horizontal and landscape orientation bug on edge cases fixed.

## [2.2.3] - 25 Aug, 2023

- Dev base url changed to [devmyid.uz](https://devmyid.uz/).

## [2.2.2] - 10 Aug, 2023

- Pressing back button during identification is disabled.

## [2.2.0 - 2.2.1] - 24 Jul, 2023

- 🔥 Converted to maven

## [2.1.7] - 20 Jun, 2023

- Added new `withResolution(value: MyIdResolution)` method for resolution.
- Added new `withImageFormat(value: MyIdImageFormat)` method for image format type.

## [2.1.6] - 12 Apr, 2023

### New features

- Added new ability to customize the colors, buttons and strings used in the SDK flow.
- Added new Driver license detection.

### Fixes

- 🔨 Date of birth bug fixed.

## [2.1.5] - 25 Mar, 2023

### Changed features

- Update `cameraVersion` from `1.3.0-alpha01` to `1.2.2`
- Update `mlkit-barcode-scanning` from `18.1.0` to `18.2.0`
- Update `sentry-android` from `6.7.0-alpha.1` to `6.16.0`

### Fixes

- 🔨 Locale change bug fixed.

## [2.1.4] - 21 Feb, 2023

### New features

- Added new `withResidency(value: MyIdResidentType)` method for residency.
- Added new translations to texts in MyID SDK.

## [2.1.3] - 30 Jan, 2023

### New features

- Added an option to handle result on `onActivityResult` method. For more information, please visit our [README](README.md#with-onactivityresult-method).
- Added Content-Language for every request.

### Changed features

- UI: Increased image compression quality parameter.
- UI: Improved Auth screen ui components

## [2.1.2] - 25 Nov, 2022

### New features

- 📝 Added new identification recommendations.
- 🌟 Updated ID Card detection frame.
- 🔥 Added new `withCameraShape(value: MyIdCameraShape)` method to change camera shape.
- 🌟 Added new `withSdkHash(value: String)` method for identification.

### Changed features

- Update `targetSdkVersion` from `31` to `33`
- Update `androidx.core:core-ktx` from `1.8.0` to `1.9.0`
- Update `androidx.appcompat:appcompat` from `1.4.2` to `1.5.1`
- Update `cameraVersion` from `1.2.0-alpha01` to `1.3.0-alpha01`
- Update `mlkit-face-detection` from `17.0.1` to `17.1.0`
- Update `mlkit-text-recognition` from `18.0.0` to `18.0.2`
- Update `mlkit-barcode-scanning` from `18.0.0` to `18.1.0`

## [2.1.1] - 31 Oct, 2022

### Changed features

- Update `withLocale(value: MyIdLocale)` from `MyIdLocale` to `Locale`

## [2.1.0] - 16 Sep, 2022

### New features

- 🔥 Added new `withOrganizationDetails(value: OrganizationDetails)` method. You can customize the
  SDK, for it to match your organization's brand
  book. [Usage](docs/CUSTOMIZATION.md)
- 🌟 Added `comparison` value to the `MyIdResult` object on successful identification.

### Fixes

- 🔨 First April bug fixed.

## [2.0.9] - 30 Aug, 2022

### New features

- 🌟 Added new `withThreshold(value: Float)` method for identification.
- 🔥 Added Ban user feature.
- 🔥 Added Liveness fail and Bad or blurry recommendations.

### Fixes

- 🔨 `Image's size must be lower than 1600 kb`. This bug fixed.
