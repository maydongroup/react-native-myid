# MyID Android SDK

## Table of contents

- [Getting started](#getting-started)
  - [Before you begin](#11-before-you-begin)
  - [Setup MyID Android SDK](#12-setup-myid-android-sdk)
  - [Permissions](#13-permissions)
- [Usage](#usage)
  - [Methods](#11-methods)
  - [Handling callbacks](#12-handling-callbacks)
- [SDK error codes](#sdk-error-codes)

## Getting started

### 1.1 Before you begin

Install or update Android Studio to its latest version.

The SDK supports API level 21 and above

Make sure that your app meets the following requirements:

- `minSdkVersion = 21`
- `targetSdkVersion = 36`
- `Kotlin = 1.8.22+`
- `android.useAndroidX = true`

``` gradle
compileOptions {
  sourceCompatibility JavaVersion.VERSION_1_8
  targetCompatibility JavaVersion.VERSION_1_8
}
```

### 1.2 Setup MyID Android SDK

#### Step 1: Add the Repository

First, add the Artifactory repository to the repositories block of your module's **_build.gradle_** file:

```gradle
repositories {
  maven { url "https://artifactory.aigroup.uz:443/artifactory/myid" }
}
```

Here’s a clean and concise documentation section based on your instructions:

---

#### Step 2: Add the Dependency

Add the required SDK dependency to your `build.gradle`:

```gradle
dependencies {
  debugImplementation("uz.myid.sdk.capture:myid-capture-sdk-debug:3.1.5")
  releaseImplementation("uz.myid.sdk.capture:myid-capture-sdk:3.1.5")
}
```

Due to the advanced validation support (in C++ code), we recommend that the integrator app performs [multi-APK split](#multi-apk-split) to optimize the app size for individual architectures.

Average size (with Proguard enabled):

| ABI         |   Size   |
|-------------|:--------:|
| armeabi-v7a | 28.7 Mb  |
| arm64-v8a   | 23.3 Mb |
| universal   | 37.2 Mb |

#

If you are using **VideoIdentification** entry mode, also include:

```gradle
dependencies {
  implementation("uz.myid.sdk.capture:myid-video-capture-sdk:3.1.5")
}
```

Average size (with Proguard enabled):

| ABI         |   Size   |
|-------------|:--------:|
| armeabi-v7a | 39.5 Mb  |
| arm64-v8a   | 35.6 Mb |
| universal   | 57.8 Mb |

**Note**: The average sizes were measured by building the minimum possible wrappers around our SDK.
Different versions of the dependencies, such as Gradle or NDK, may result in slightly different values.

#### Multi-APK split

C++ code needs to be compiled for each of the CPU architectures (known as "ABIs") present on the Android environment. Currently, the SDK supports the following ABIs:

* `armeabi-v7a`: Version 7 or higher of the ARM processor. Most recent Android phones use this
* `arm64-v8a`: 64-bit ARM processors. Found on new generation devices
* `x86`: Used by most tablets and emulators
* `x86_64`: Used by 64-bit tablets

The SDK binary contains a copy of the native `.so` file for each of these four platforms.
You can considerably reduce the size of your `.apk` by applying APK split by ABI, editing your `build.gradle` to the following:

```gradle
android {
  splits {
    abi {
        enable true
        reset()
        include 'x86', 'x86_64', 'arm64-v8a', 'armeabi-v7a'
        universalApk false
    }
  }
}
```
Read the [Android documentation](https://developer.android.com/build/configure-apk-splits) for more information.


### 1.3 Permissions

Add following lines to the **_AndroidManifest.xml_**:

``` xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
```

## Usage

### With Activity Result API

``` kotlin
class ExampleActivity : AppCompatActivity(), MyIdResultListener {

    private val client by lazy { MyIdClient() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        startMyId()
    }

    private fun startMyId() {
        val config = MyIdConfig.Builder(sessionId = /* Your session id */)
            .withClientHash(/* Your clientHash */, /* Your clientHashId */)
            .withEnvironment(MyIdEnvironment.Production)
            .build()

        val intent = client.createIntent(activity = this, config)
        result.launch(intent)
    }

    private val result = takeMyIdResult(listener = this)
}
```

### With `onActivityResult` method

``` kotlin
class ExampleActivity : AppCompatActivity(), MyIdResultListener {

    private val client by lazy { MyIdClient() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        startMyId()
    }
    
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        client.handleActivityResult(resultCode, this)
    }

    private fun startMyId() {
        val config = MyIdConfig.Builder(sessionId = /* Your session id */)
            .withClientHash(/* Your clientHash */, /* Your clientHashId */)
            .withEnvironment(MyIdEnvironment.Production)
            .build()

        /*
           Start the flow. 1 should be your request code (customize as needed).
           Must be an Activity or Fragment (support library).
           This request code will be important for you on onActivityResult() to identify the MyIdResultListener.
        */
        client.startActivityForResult(this, 1, config)
    }
}
```

### 1.1 Methods

Method | Notes | Default
--- | --- | ---
`withClientHash(clientHash: String, clientHashId: String)` | Provided by MyID sales team | Mandatory, if using withEntryType(MyIdEntryType.Identification)
`withResidency(residency: MyIdResidency)` | To set a specific residency type | MyIdResidency.Resident
`withMinAge(age: Int)` | To set a specific minimum age to use MyID service | 16
`withDistance(distance: Float)` | To set a specific distance for taking photo | 0.65
`withEnvironment(environment: MyIdEnvironment)` | Environment mode (Note 1.4) | MyIdEnvironment.Production
`withEntryType(type: MyIdEntryType)` | Customizing the SDK Entry types (Note 1.5) | MyIdEntryType.Identification
`withLocale(locale: MyIdLocale)` | To set a specific locale | MyIdLocale.Uzbek
`withCameraShape(shape: MyIdCameraShape)` | To set a specific camera shape (Note 1.6) | MyIdCameraShape.Circle
`withCameraResolution(resolution: MyIdCameraResolution)` | To set a specific camera resolution | MyIdCameraResolution.Low
`withImageFormat(format: MyIdImageFormat)` | To set a specific image format | MyIdImageFormat.JPEG
`withScreenOrientation(orientation: MyIdScreenOrientation)` | To set a specific screen orientation | MyIdScreenOrientation.Portrait
`withOrganizationDetails(details: MyIdOrganizationDetails)` | Custom Organization Details | Optional
`withSoundGuides(enable: Boolean)` | To enable or disable sound guides | true
`withErrorScreen(showErrorScreen: Boolean)` | To enable or disable error screen | true
`withHuaweiAppId(appId: String)` | To set a huawei app id | Required for HMS

**Note 1.1.** `MyIdEnvironment` contains **Debug** and **Production** modes.

- **Debug** is used to sandbox.
- **Production** is used to production.

**Note 1.2.** `MyIdEntryType` contains **Identification**, **VideoIdentification** and **FaceDetection** types.

- **Identification** is used to identify the user through the MyID services.
- **VideoIdentification** is used to identify the user through the MyID services. Requires the `myid-video-capture-sdk` dependency.
- **FaceDetection** is used to detect a face and returns a picture (bitmap).

**Note 1.3.** `MyIdCameraShape` contains **[Circle](images/screen03.jpg)**
and **[Ellipse](images/screen04.jpg)** types.

**Note 1.4.** If the SDK **does not receive a passport data** and receives `residency = MyIdResidency.UserDefined`, the SDK displays the **MyID passport input screen**. If the user enters a **PINFL**, the screen will show a **checkbox** allowing the user to select **Resident** or **Non-Resident**.

### 1.2 Handling callbacks

```kotlin
val resultListener: MyIdResultListener = object : MyIdResultListener {
  override fun onSuccess(result: MyIdResult) {
    // Get face bitmap and result code

    val bitmap = result.getGraphicFieldImageByType(MyIdGraphicFieldType.FacePortrait)
    val code = result.code
  }

  override fun onUserExited() {
    // User left the SDK
  }

  override fun onError(e: MyIdException) {
    // Get error message and code:

    val message = e.message
    val code = e.code
  }
  
  override fun onEvent(event: MyIdEvent) {
    // Get event type
  }
}
```

| Attribute     |    Notes    |
| -----|-------|
| `onSuccess` | `MyIdResult` contains information about the face captures made during the flow, result code and comparison value. |
| `onUserExited` | User left the SDK flow without completing it. |
| `onError` | Some error happened. `MyIdException` contains information about the error message and code |
| `onEvent` | `MyIdEvent` contains information about the event type |

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
