package com.reactnativemyid

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.util.Base64
import com.facebook.react.bridge.*
import uz.myid.android.sdk.capture.MyIdClient
import uz.myid.android.sdk.capture.MyIdConfig
import uz.myid.android.sdk.capture.MyIdException
import uz.myid.android.sdk.capture.MyIdResult
import uz.myid.android.sdk.capture.MyIdResultListener
import uz.myid.android.sdk.capture.model.MyIdCameraShape
import uz.myid.android.sdk.capture.model.MyIdEntryType
import uz.myid.android.sdk.capture.model.MyIdEnvironment
import uz.myid.android.sdk.capture.model.MyIdEvent
import uz.myid.android.sdk.capture.model.MyIdGraphicFieldType
import uz.myid.android.sdk.capture.model.MyIdLocale
import uz.myid.android.sdk.capture.model.MyIdOrganizationDetails
import java.io.ByteArrayOutputStream

class MyIdModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), MyIdResultListener, ActivityEventListener {

    private var promise: Promise? = null
    private val client = MyIdClient()

    companion object {
        const val NAME = "MyIdModule"
        private const val ERROR_USER_EXITED = "MYID_USER_EXITED"
        private const val ERROR_SDK = "MYID_SDK_ERROR"
        private const val ERROR_NO_ACTIVITY = "MYID_NO_ACTIVITY"
        private const val REQUEST_CODE = 1404
    }

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun start(config: ReadableMap, promise: Promise) {
        this.promise = promise

        val activity = currentActivity
        if (activity == null) {
            promise.reject(ERROR_NO_ACTIVITY, "No current activity found")
            return
        }

        try {
            val sessionId = config.getStringSafe("sessionId") ?: ""

            val builder = MyIdConfig.Builder(sessionId = sessionId)

            // --- Old flow: clientHash + clientHashId ---
            val clientHash = config.getStringSafe("clientHash")
            val clientHashId = config.getStringSafe("clientHashId")
            if (clientHash != null && clientHashId != null) {
                builder.withClientHash(
                    clientHash = clientHash,
                    clientHashId = clientHashId
                )
            }

            // Entry type
            when (config.getStringSafe("entryType")) {
                "IDENTIFICATION" -> builder.withEntryType(MyIdEntryType.Identification)
                "VIDEO_IDENTIFICATION" -> builder.withEntryType(MyIdEntryType.VideoIdentification)
                "FACE_DETECTION" -> builder.withEntryType(MyIdEntryType.FaceDetection)
            }

            // Environment
            when (config.getStringSafe("buildMode")) {
                "PRODUCTION" -> builder.withEnvironment(MyIdEnvironment.Production)
                "DEBUG" -> builder.withEnvironment(MyIdEnvironment.Debug)
            }

            // Locale
            when (config.getStringSafe("locale")) {
                "uz" -> builder.withLocale(MyIdLocale.Uzbek)
                "en" -> builder.withLocale(MyIdLocale.English)
                "ru" -> builder.withLocale(MyIdLocale.Russian)
            }

            // Camera shape
            when (config.getStringSafe("cameraShape")) {
                "CIRCLE" -> builder.withCameraShape(MyIdCameraShape.Circle)
                "ELLIPSE" -> builder.withCameraShape(MyIdCameraShape.Ellipse)
            }

            // Organization details
            if (config.hasKey("organizationDetails")) {
                config.getMap("organizationDetails")?.let { orgMap ->
                    val orgDetails = MyIdOrganizationDetails(
                        phoneNumber = orgMap.getStringSafe("phoneNumber") ?: ""
                    )
                    builder.withOrganizationDetails(orgDetails)
                }
            }

            val myIdConfig = builder.build()

            // Use startActivityForResult pattern (works with React Native modules)
            client.startActivityForResult(activity, REQUEST_CODE, myIdConfig)

        } catch (e: Exception) {
            promise.reject(ERROR_SDK, e.message ?: "Unknown error starting MyID SDK")
        }
    }

    // --- ActivityEventListener ---

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CODE) {
            client.handleActivityResult(resultCode, this)
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // Not used
    }

    // --- MyIdResultListener callbacks ---

    override fun onSuccess(result: MyIdResult) {
        val map = Arguments.createMap().apply {
            putString("code", result.code)

            val bitmap = result.getGraphicFieldImageByType(MyIdGraphicFieldType.FacePortrait)
            if (bitmap != null) {
                putString("image", bitmapToBase64(bitmap))
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

    override fun onEvent(event: MyIdEvent) {
        // Optional: can emit events to JS if needed in the future
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
}
