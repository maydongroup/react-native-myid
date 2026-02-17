# CHANGELOG

## [3.1.3] - 1 Dec, 2025

- 🔥 New flow
- 🔐 Added new security enhancements for data protection
- 🔥 Improved overall performance and stability.

## [2.4.93] - 5 January, 2026

- 🔨 Resolved problem of progress indicator
- 🔥 Improved overall performance and stability.

## [2.4.92] - 23 October, 2025

- 🔨 Resolved problem of iOS 26 Navigation controller

## [2.4.91] - 26 August, 2025

- 🔥 Added image on `onFailure` method, in `MyIdException`

## [2.4.9] - 20 August, 2025

- 🔨 Resolved problem of `Public key pinning failed for host`.
- 🔥 Improved overall performance and stability.

## [2.4.8] - 13 August, 2025

- 🔨 Resolved problem of `Public key pinning failed for host`.

## [2.4.7] - 9 July, 2025

- 🔥 Improved UI performance and visuals.

## [2.4.6] - 2 July, 2025

- 🔨 Resolved problem of external_id.

## [2.4.5] - 26 Jun, 2025

- 🔨 Resolved problem "No suitable camera found".

## [2.4.4] - 5 Jun, 2025

- 🔥 Improved UI performance and visuals.

## [2.4.3] - 26 May, 2025

- 🔨 Resolved an issue where "Pixels is empty".
- 🔥 Improved overall performance and stability.

## [2.4.2] - 15 May, 2025

- 🔨 Resolved problem of external_id.

## [2.4.1] - 13 May, 2025

- 🔨 Resolved problem "No suitable camera found".

## [2.4.0] - 6 May, 2025

- 🔥 Improved overall performance and stability.

## [2.3.9] - 29 Apr, 2025

- 🔨 Updated several enum values for better clarity.

## [2.3.8] - 25 Apr, 2025

- 🔥 Improved overall performance and stability.

## [2.3.7] - 23 Apr, 2025

- 🔐 Added new security enhancements for data protection.
- 💥 Added video identification support.
- 🔨 Updated several enum values for better clarity.
- 🔨 Deprecated some functions and enums (will be removed in future versions).
- 🔥 Improved overall performance and stability.

## [2.3.6] - 18 Feb, 2025

- 🔨 Resolved an issue where pasting text into UITextField was not working correctly.

## [2.3.5] - 3 Feb, 2025

- 🔨 Resolved problem "No suitable camera found".

## [2.3.4] - 25 Oct, 2024

- 🔨 Resolved problem that occurs if daylight saving time starts exactly on midnight, as it was the case in Moscow in the years 1981–1984.

## [2.3.3] - 12 Jul, 2024

- Added new `distance: Float` method to sets the distance for taking photo.

## [2.3.2] - 15 Jun, 2024

- Maximized efficiency in identification processes for capturing and loading operations

## [2.3.1] - 15 May, 2024

- 🔨 Resolved CameraX Preview static screen: Addressed an issue causing the CameraX preview to display a static screen on specific devices.

## [2.3.0] - 9 Apr, 2024

- 🔨 Resolved CameraX Preview black screen: Addressed an issue causing the CameraX preview to display a black screen on specific devices.

## [2.2.9] - 21 Feb, 2023

- 🔨 Addressed identification bug on iPhone 7 and earlier devices.

## [2.2.6 - 2.2.8] - 1 Feb, 2023

- Added configurations for allowing transactions of foreign based end-users.
- Range for available face comparison `threshold` is now between 0.55 and 0.99, and it defaults to 0.55 now.

## [2.2.5] - 3 Nov, 2023

- Added new `minAge: Int` method for the minimum age to use the MyID service.
- Added error texts in inputs.

## [2.2.2 - 2.2.4] - 19 Oct, 2023

- Added enhanced security measures.
- Added new `clientHash` and `clientHashId` methods. Those are mandatory if using entryType = AUTH.
- 🤩 New measures of spoof detection, with zero penetration rate.

## [2.2.1] - 25 Aug, 2023

- Dev base url changed to [devmyid.uz](https://devmyid.uz/).

## [2.2.0] 24 Jul, 2023

### New features

- 🔥 Converted to CocoaPods.

## [2.1.1] - 20 Jun, 2023

- Added new `withResolution(value: MyIdResolution)` method for resolution.

## [2.1.0] 8 May, 2023

### New features

- 🔥 Added new ability to customize the colors, buttons and strings used in the SDK flow.
- 🤩 Added new Driver license detection.

### Fixes

- 🔨 `KEY_NOT_FOUND` bug fixed.

## [2.0.9] 12 Apr, 2023

### New features

- 📦 Added Flutter support in `flutter-sample` folder.
- 🤩 Removed MLKit pod, and reduced SDK size from 100+ MB to just **8 MB**.

### Fixes

- 🔨 Fixed bug with freezing on flutter after authorization.
- 🔨 Fixed organization logo not showing up in passport data entry view.

## [2.0.8] 21 Feb, 2023

### New features

- 🔥 Added `residency` option, which enables the non-resident also to register through you application. The options are `USER_DEFINED`, `RESIDENT` and `NON_RESIDENT`. In user defined, once the PINFL is entered - it shows the prompt whether user is non-resident. In `RESIDENT` and `NON_RESIDENT` user cannot choose the request type, but the corresponding request will be sent.

### Fixes

- 🔨 From now on, messages from backend are translated (the ones that have status 103), when returned to parent app, thanks to added `Content-Language` parameter in the request for status.

## [2.0.6] 25 Nov, 2022

### Changed features

- The versions of Xcode and Swift has been updated: **Xcode** to `14.1` and **Swift** to `5.7.1`.

### Fixes

- 🔨 Method `onUserExited()` is now triggered not only when the exit button is pressed, but also when force exit has been performed by user.
- 🔨 If user rejects to provide the camera permission to the app, the app keeps asking until it is provided.
