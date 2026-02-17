package com.reactnativemyid

import android.app.Activity
import android.graphics.Bitmap
import android.util.Base64
import com.facebook.react.bridge.*
import uz.myid.android.sdk.capture.MyIdClient
import uz.myid.android.sdk.capture.MyIdConfig
import uz.myid.android.sdk.capture.MyIdException
import uz.myid.android.sdk.capture.MyIdResult
import uz.myid.android.sdk.capture.MyIdResultListener
import uz.myid.android.sdk.capture.model.MyIdBuildMode
import uz.myid.android.sdk.capture.model.MyIdCameraShape
import uz.myid.android.sdk.capture.model.MyIdEntryType
import java.io.ByteArrayOutputStream
import java.util.Locale

class MyIdModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), MyIdResultListener {

    private var promise: Promise? = null
    private var withPhoto: Boolean = false
    private val client = MyIdClient()

    companion object {
        const val NAME = "MyIdModule"
        private const val ERROR_USER_EXITED = "MYID_USER_EXITED"
        private const val ERROR_SDK = "MYID_SDK_ERROR"
        private const val ERROR_NO_ACTIVITY = "MYID_NO_ACTIVITY"
        private const val REQUEST_CODE = 1404
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun start(config: ReadableMap, promise: Promise) {
        this.promise = promise
        this.withPhoto = config.getBooleanSafe("withPhoto")

        val activity = currentActivity
        if (activity == null) {
            promise.reject(ERROR_NO_ACTIVITY, "No current activity found")
            return
        }

        try {
            val clientId = config.getString("clientId") ?: run {
                promise.reject(ERROR_SDK, "clientId is required")
                return
            }

            val builder = MyIdConfig.Builder(clientId)

            // --- New flow: sessionId ---
            config.getStringSafe("sessionId")?.let { builder.withSessionId(it) }

            // --- Old flow: clientHash + clientHashId ---
            config.getStringSafe("clientHash")?.let { builder.withClientHash(it) }
            config.getStringSafe("clientHashId")?.let { builder.withClientHashId(it) }

            // --- Common optional fields ---
            config.getStringSafe("passportData")?.let { builder.withPassportData(it) }
            config.getStringSafe("birthDate")?.let { builder.withBirthDate(it) }
            config.getStringSafe("sdkHash")?.let { builder.withSdkHash(it) }
            config.getStringSafe("externalId")?.let { builder.withExternalId(it) }

            if (config.hasKey("threshold")) {
                builder.withThreshold(config.getDouble("threshold").toFloat())
            }

            // Entry type
            when (config.getStringSafe("entryType")) {
                "AUTH" -> builder.withEntryType(MyIdEntryType.AUTH)
                "FACE" -> builder.withEntryType(MyIdEntryType.FACE)
            }

            // Build mode
            when (config.getStringSafe("buildMode")) {
                "PRODUCTION" -> builder.withBuildMode(MyIdBuildMode.PRODUCTION)
                "DEBUG" -> builder.withBuildMode(MyIdBuildMode.DEBUG)
            }

            // Locale
            config.getStringSafe("locale")?.let {
                builder.withLocale(Locale(it))
            }

            // Camera shape
            when (config.getStringSafe("cameraShape")) {
                "CIRCLE" -> builder.withCameraShape(MyIdCameraShape.CIRCLE)
                "ELLIPSE" -> builder.withCameraShape(MyIdCameraShape.ELLIPSE)
            }

            // Photo
            builder.withPhoto(withPhoto)

            // Organization details
            if (config.hasKey("organizationDetails")) {
                config.getMap("organizationDetails")?.let { orgMap ->
                    val orgDetails = uz.myid.android.sdk.capture.model.OrganizationDetails(
                        phoneNumber = orgMap.getStringSafe("phoneNumber") ?: "712022202"
                    )
                    builder.withOrganizationDetails(orgDetails)
                }
            }

            val myIdConfig = builder.build()

            val intent = client.createIntent(activity = activity, myIdConfig = myIdConfig)
            val activityResultHelper = client.takeUserResult(listener = this)
            activityResultHelper.launch(intent)

        } catch (e: Exception) {
            promise.reject(ERROR_SDK, e.message ?: "Unknown error starting MyID SDK")
        }
    }

    // --- MyIdResultListener callbacks ---

    override fun onSuccess(result: MyIdResult) {
        val map = Arguments.createMap().apply {
            putString("code", result.code)
            result.comparison?.let { putDouble("comparison", it.toDouble()) }

            if (withPhoto && result.bitmap != null) {
                putString("image", bitmapToBase64(result.bitmap!!))
            }
        }
        promise?.resolve(map)
        promise = null
    }

    override fun onError(e: MyIdException) {
        promise?.reject(e.code?.toString() ?: ERROR_SDK, e.message ?: "MyID SDK error")
        promise = null
    }

    override fun onUserExited() {
        promise?.reject(ERROR_USER_EXITED, "User exited MyID SDK")
        promise = null
    }

    // --- Helpers ---

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, stream)
        val bytes = stream.toByteArray()
        return Base64.encodeToString(bytes, Base64.NO_WRAP)
    }

    private fun ReadableMap.getStringSafe(key: String): String? {
        return if (hasKey(key) && !isNull(key)) getString(key) else null
    }

    private fun ReadableMap.getBooleanSafe(key: String): Boolean {
        return if (hasKey(key)) getBoolean(key) else false
    }
}
