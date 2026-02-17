# Huawei Configuration

## Overview

MyID SDK supports Huawei devices that use **Huawei Mobile Services (HMS)** instead of **Google Play Services (GMS)**.

If your app runs on Huawei devices (for example, Mate or P series) **without GMS**,
you must add the **MyID Integrity SDK** and configure your Huawei **App ID**.

If this dependency is **missing** and the device **supports HMS**,
the MyID SDK will **crash during initialization**.

---

## Table of contents

* [1. Add the Huawei Integrity SDK](#1-add-the-huawei-integrity-sdk)
* [2. Configure the App ID](#2-configure-the-app-id)
* [3. Pass Huawei App ID to the SDK](#3-pass-huawei-app-id-to-the-sdk)
* [4. Example setup](#4-example-setup)
* [5. Troubleshooting](#5-troubleshooting)

---

## 1. Add the Huawei Integrity SDK

Add the following dependency to your **module-level** `build.gradle` file:

```gradle
dependencies {
    implementation("uz.myid.sdk.capture:myid-integrity-sdk:1.0.6")
}
```

This library enables the SDK to handle Huawei Mobile Services (HMS)
and prevents runtime crashes on Huawei devices.

---

## 2. Configure the App ID

You need a valid **Huawei App ID** from **AppGallery Connect**.

1. Open [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html).
2. Go to your project → **General information**.
3. Copy your **App ID**.
4. Add it to your `AndroidManifest.xml` inside the `<application>` tag:

```xml
<meta-data
    android:name="com.huawei.hms.client.appid"
    android:value="appid=YOUR_HUAWEI_APP_ID" />
```

Replace `YOUR_HUAWEI_APP_ID` with your actual App ID.

---

## 3. Pass Huawei App ID to the SDK

When initializing `MyIdConfig`, include your Huawei App ID using the `withHuaweiAppId()` method:

```kotlin
val config = MyIdConfig.Builder(clientId = "YOUR_CLIENT_ID")
    .withClientHash("YOUR_CLIENT_HASH", "YOUR_CLIENT_HASH_ID")
    .withEnvironment(MyIdEnvironment.Production)
    .withHuaweiAppId("YOUR_HUAWEI_APP_ID")
    .build()
```

This ensures that the SDK recognizes and properly initializes HMS support.

---

## 4. Example setup

**Gradle dependencies:**

```gradle
dependencies {
    implementation("uz.myid.sdk.capture:myid-integrity-sdk:1.0.6")
}
```

**Initialization:**

```kotlin
val config = MyIdConfig.Builder(sessionId = "SESSION_ID")
    .withClientHash("CLIENT_HASH", "CLIENT_HASH_ID")
    .withEnvironment(MyIdEnvironment.Production)
    .withHuaweiAppId("YOUR_HUAWEI_APP_ID")
    .build()

val intent = MyIdClient().createIntent(this, config)
startActivity(intent)
```

---

## 5. Troubleshooting

| Issue                                  | Cause                           | Solution                                                             |
| -------------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| SDK crashes on Huawei devices          | `myid-integrity-sdk` not added  | Add `implementation("uz.myid.sdk.capture:myid-integrity-sdk:1.0.6")` |
| SDK fails to initialize                | Missing App ID                  | Add `.withHuaweiAppId("YOUR_HUAWEI_APP_ID")`                         |
| Invalid App ID error                   | Wrong App ID in manifest or SDK | Recheck AppGallery Connect for correct ID                            |
| Works on Google devices but not Huawei | HMS dependency missing          | Make sure Integrity SDK is included                                  |
