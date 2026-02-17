# MyID iOS SDK

## Table of contents

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
    .package(url: "https://gitlab.myid.uz/myid-public-code/myid-ios-sdk.git", from: "3.1.3")
]
```

#### Using Cocoapods

The SDK is available on Cocoapods and you can include it in your projects by adding the following to your Podfile:

```ruby
pod 'MyIdSDK', '~> 3.1.3'
```

Run `pod install` to get the SDK.

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
        config.sessionId = /* Your Session ID */
        config.clientHash = /* Your Client Hash */
        config.clientHashId = /* Your Client Hash ID */
        config.environment = .production
        
        MyIdClient.start(withConfig: config, withDelegate: self)
    }
}

extension ViewController: MyIdClientDelegate {
    
    func onSuccess(result: MyIdResult) {
        if let code = result.code {
            print(code)
        }
        
        if let image = result.image {
            print(img)
        }
    }
    
    func onError(exception: MyIdException) {
        print(exception.code)
        print(exception.message)
    }

    func onUserExited() {
        print("User exited")
    }

    func onEvent(event: MyIdEvent) {
        print("Event: \(event.rawValue)")
    }
}
```
### 2.1 Options

Option | Notes | Default
--- | --- | ---
`sessionId` | Session ID | Provided by MyID sales team. Mandatory, if using entryType = MyIdEntryType.identification
`clientHash` | Client Hash | Provided by MyID sales team. Mandatory, if using entryType = MyIdEntryType.identification
`clientHashId` | Client Hash ID | Provided by MyID sales team. Mandatory, if using entryType = MyIdEntryType.identification
`minAge` | To set a specific minimum age to use MyID service | 16
`environment` | Environment mode (Note 1.4) | MyIdEnvironment.production
`entryType` | Customizing the SDK entry types (Note 1.5) | MyIdEntryType.identification
`residency` | To set a specific residency type | MyIdResidency.resident
`locale` |  To set a specific locale | MyIdLocale.uzbek
`cameraShape` | To set a specific camera shape (Note 1.6) | MyIdCameraShape.circle
`showErrorScreen` | To show error screen in case of an error | true

**Note 1.1.** `MyIdEnvironment` contains **debug** and **production** modes.

- **debug** is used to sandbox.
- **production** is used to production.

**Note 1.2.** `MyIdEntryType` contains **identification** and **faceDetection** types.

- **identification** is used to identify the user through the MyID services.
- **faceDetection** is used to detect a face and returns a picture (bitmap).

**Note 1.3.** `MyIdCameraShape` contains **[circle](images/screen03.jpg)**
and **[ellipse](images/screen04.jpg)** types.

**Note 1.4.** If the SDK **does not receive a passport data** and receives `residency = MyIdResidency.userDefined`, the SDK displays the **MyID passport input screen**. If the user enters a **PINFL**, the screen will show a **checkbox** allowing the user to select **Resident** or **Non-Resident**.

### 2.2 MyIdClientDelegate

```swift
extension ViewController: MyIdClientDelegate {
    
    func onSuccess(result: MyIdResult) {
        // Get face bitmap and result code

        if let code = result.code {
            print(code)
        }
        
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

    func onEvent(event: MyIdEvent) {
       // Handle any events that may occur during the flow
    }
}
```

| Method     |    Notes    |
| -----|-------|
| `onSuccess` | `MyIdResult` contains information about the face captures made during the flow, result code and comparison value. |
| `onError` | Some error happened. `MyIdException` contains information about the error message and code |
| `onUserExited` | User left the SDK flow without completing it. |
| `onEvent` | This method is called when an event occurs during the flow. |

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
