# MyID iOS SDK

## Table of contents

- [Changelog](CHANGELOG.md)
- [Getting started](#getting-started)
  - [Before you begin](#11-before-you-begin)
  - [Add the SDK dependency](#12-add-the-sdk-dependency)
  - [Permissions](#13-permissions)
- [Usage](#usage)
  - [Options](#21-options)
  - [Handling callbacks](#22-handling-callbacks)
- [SDK error codes](#sdk-error-codes)

## Getting started

### 1.1 Before you begin

Install or update Xcode to its latest version.
The SDK supports iOS 13+. The SDK has been built on Xcode 14.1 using Swift 5.8

### 1.2 Add the SDK dependency

#### Using Swift Package Manager

The SDK is available with Swift Package Manager, and you can include it in your project by adding the following package
repository URL:

##### Swift

```swift
dependencies: [
    .package(url: "https://gitlab.myid.uz/myid-public-code/myid-ios-sdk.git", .branch("master"))
]
```

#### Using Cocoapods

The SDK is available on Cocoapods and you can include it in your projects by adding the following to your Podfile:

```ruby
pod 'MyIdSDK', '~> 2.4.93'
```

Run `pod install` to get the SDK.

#### [Manual installation](MANUAL_INSTALLATION.md)

### 1.3 Permissions

The SDK uses the device camera. You're required to have the following keys in your application's `Info.plist` file:
*  `NSCameraUsageDescription`

```xml
<key>NSCameraUsageDescription</key>
<string>Required for document and facial capture</string>
```
**Note**: All keys will be required for app submission.

## Usage
``` swift
import UIKit
import MyIdSDK

class ViewController : UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    private func startMyId() {
        let config = MyIdConfig()
        config.clientId = /* Your Client ID */
        config.clientHash = /* Your Client Hash */
        config.clientHashId = /* Your Client Hash ID */
        config.passportData = passportData
        config.dateOfBirth = dateOfBirth
        config.environment = .production
        
        MyIdClient.start(withConfig: config, withDelegate: self)
    }
}

extension ViewController: MyIdClientDelegate {
    
    func onSuccess(result: MyIdResult) {
        // Get face bitmap and result code

        print(result.code)
        print(result.comparisonValue)
        
        if let image = result.image {
            print(img)
        }
    }
    
    func onError(exception: MyIdException) {
        // Get error message and code

        print(exception.code)
        print(exception.message)
    }

    func onUserExited() {
        // User left the SDK
    }
}
```
### 2.1 Options

Option | Notes | Default
--- | --- | ---
`clientId` | Client ID | Provided by MyID sales team. Mandatory, if using entryType = MyIdEntryType.identification
`clientHash` | Client Hash | Provided by MyID sales team. Mandatory, if using entryType = MyIdEntryType.identification
`clientHashId` | Client Hash ID | Provided by MyID sales team. Mandatory, if using entryType = MyIdEntryType.identification
`passportData` | Passport serial number or PINFL data | Optional
`dateOfBirth` | Date of birth in. Format: `dd.MM.yyyy` | Optional
`minAge` | To set a specific minimum age to use MyID service | 16
`sdkHash` | 32 characters long string (Note 1.2) | Optional
`externalId` | 36 characters long. Should match with UUID4 regex (Note 1.3) | Optional
`threshold` | The value can be in the range of `0.55` - `0.99` | 0.55
`environment` | Environment mode (Note 1.4) | MyIdEnvironment.production
`entryType` | Customizing the SDK entry types (Note 1.5) | MyIdEntryType.identification
`residency` | To set a specific residency type | MyIdResidency.resident
`locale` |  To set a specific locale | MyIdLocale.uzbek
`cameraShape` | To set a specific camera shape (Note 1.6) | MyIdCameraShape.circle

**Note 1.1.** You can customize the screen for entering passport data and date of birth in your
application, in which case you can pass these parameters during initialization to the SDK, otherwise
the SDK requires the input of passport data and date of birth for user identification.

**Note 1.2.** If the `sdkHash` is empty, blank or string with length other than 32 has been
provided, we will continue showing the credentials screen.

**Note 1.3.** If the `externalId` is not empty, has a length of 36 characters and corresponds to the
regular expression UUID4, we will not display a [recommendation](images/screen01.jpg) screen. If a certain number of unsuccessful identification attempts (currently set to 5) occur in MyID within one hour and the `externalId` is not empty, SDK returns to the parent app error message as `message` in `MyIdException`.

**Note 1.4.** `MyIdEnvironment` contains **debug** and **production** modes.

- **debug** is used to sandbox.
- **production** is used to production.

**Note 1.5.** `MyIdEntryType` contains **identification** and **faceDetection** types.

- **identification** is used to identify the user through the MyID services.
- **faceDetection** is used to detect a face and returns a picture (bitmap).

**Note 1.6.** `MyIdCameraShape` contains **[circle](images/screen03.jpg)**
and **[ellipse](images/screen04.jpg)** types.

**Note 1.7.** If the user sends a **passport data** to the SDK, the **residency** must be handled by the **client**. If `residency = MyIdResidency.userDefined` is sent, the SDK will treat the user as **Non-Resident**.

**Note 1.8.** If the SDK **does not receive a passport data** and receives `residency = MyIdResidency.userDefined`, the SDK displays the **MyID passport input screen**. If the user enters a **PINFL**, the screen will show a **checkbox** allowing the user to select **Resident** or **Non-Resident**.

### 2.2 MyIdClientDelegate

```swift
extension ViewController: MyIdClientDelegate {
    
    func onSuccess(result: MyIdResult) {
        // Get face bitmap and result code

        print(result.code)
        print(result.comparisonValue)
        
        if let image = result.image {
            print(img)
        }
    }
    
    func onError(exception: MyIdException) {
        // Get error message and code

        print(exception.code)
        print(exception.message)
    }

    func onUserExited() {
        // User left the SDK
    }
}
```

| Method     |    Notes    |
| -----|-------|
| `onSuccess` | `MyIdResult` contains information about the face captures made during the flow, result code and comparison value. |
| `onError` | Some error happened. `MyIdException` contains information about the error message and code |
| `onUserExited` | User left the SDK flow without completing it. |

## SDK error codes

You can view the full list of SDK error codes at:

👉 [Error Codes Documentation](https://docs.myid.uz/#/ru/embedded?id=javob-kodlar-uz-result_code)

The error code in the following list may appear during the call of SDK. The list below is for your
reference.

| Code   |      Error message
|:----------:|:-------------
|  102  |  Camera access denied
|  103  |  Error while retrieving data from server or SDK
|  122  |  User banned
