plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "uz.myid.sample"
    compileSdk = 36

    defaultConfig {
        applicationId = "uz.myid.sample"
        targetSdk = 36
        minSdk = 21
        versionCode = 1
        versionName = "1.0.$versionCode"
    }

    buildTypes {
        debug {
            isMinifyEnabled = false

            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }

        release {
            isMinifyEnabled = false

            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.appcompat)
    implementation(libs.google.material)

    debugImplementation("uz.myid.sdk.capture:myid-capture-sdk-debug:3.1.4")
    releaseImplementation("uz.myid.sdk.capture:myid-capture-sdk:3.1.4")
}