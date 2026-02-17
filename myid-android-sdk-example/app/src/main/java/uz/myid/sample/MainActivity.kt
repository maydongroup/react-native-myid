package uz.myid.sample

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import uz.myid.android.sdk.capture.MyIdClient
import uz.myid.android.sdk.capture.MyIdConfig
import uz.myid.android.sdk.capture.MyIdException
import uz.myid.android.sdk.capture.MyIdResult
import uz.myid.android.sdk.capture.MyIdResultListener
import uz.myid.android.sdk.capture.model.MyIdCameraResolution
import uz.myid.android.sdk.capture.model.MyIdCameraSelector
import uz.myid.android.sdk.capture.model.MyIdCameraShape
import uz.myid.android.sdk.capture.model.MyIdEntryType
import uz.myid.android.sdk.capture.model.MyIdEnvironment
import uz.myid.android.sdk.capture.model.MyIdEvent
import uz.myid.android.sdk.capture.model.MyIdGraphicFieldType
import uz.myid.android.sdk.capture.model.MyIdImageFormat
import uz.myid.android.sdk.capture.model.MyIdLocale
import uz.myid.android.sdk.capture.model.MyIdResidency
import uz.myid.android.sdk.capture.model.MyIdScreenOrientation
import uz.myid.android.sdk.capture.takeMyIdResult
import uz.myid.sample.data.SessionRepository
import uz.myid.sample.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity(), MyIdResultListener {

    private val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }

    private val myidClient by lazy { MyIdClient() }

    private var residency = MyIdResidency.Resident
    private var environment = MyIdEnvironment.Debug
    private var entryType = MyIdEntryType.Identification
    private var cameraSelector = MyIdCameraSelector.Front
    private var cameraResolution = MyIdCameraResolution.Low
    private var cameraShape = MyIdCameraShape.Circle
    private var imageFormat = MyIdImageFormat.PNG
    private var locale = MyIdLocale.English

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        with(binding) {
            radioGroupEnvironment.setOnCheckedChangeListener { _, checkedId ->
                environment = if (checkedId == R.id.radioProd) {
                    MyIdEnvironment.Production
                } else {
                    MyIdEnvironment.Debug
                }
            }
            radioGroupEntryType.setOnCheckedChangeListener { _, checkedId ->
                entryType = when (checkedId) {
                    R.id.radioPhoto -> MyIdEntryType.Identification
                    R.id.radioVideo -> MyIdEntryType.VideoIdentification
                    else -> MyIdEntryType.FaceDetection
                }
            }
            radioGroupCameraSelector.setOnCheckedChangeListener { _, checkedId ->
                cameraSelector = if (checkedId == R.id.radioFront) {
                    MyIdCameraSelector.Front
                } else {
                    MyIdCameraSelector.Back
                }
            }
            radioGroupResolution.setOnCheckedChangeListener { _, checkedId ->
                cameraResolution = if (checkedId == R.id.radioHigh) {
                    MyIdCameraResolution.High
                } else {
                    MyIdCameraResolution.Low
                }
            }
            radioGroupShape.setOnCheckedChangeListener { _, checkedId ->
                cameraShape = if (checkedId == R.id.radioEllipse) {
                    MyIdCameraShape.Ellipse
                } else {
                    MyIdCameraShape.Circle
                }
            }
            radioGroupImageFormat.setOnCheckedChangeListener { _, checkedId ->
                imageFormat = if (checkedId == R.id.radioJpeg) {
                    MyIdImageFormat.JPEG
                } else {
                    MyIdImageFormat.PNG
                }
            }
            radioGroupLang.setOnCheckedChangeListener { _, checkedId ->
                locale = when (checkedId) {
                    R.id.radioEn -> MyIdLocale.English
                    R.id.radioRu -> MyIdLocale.Russian
                    else -> MyIdLocale.Uzbek
                }
            }

            buttonStart.setOnClickListener { startMyId() }
        }
    }

    override fun onSuccess(result: MyIdResult) {
        val bitmap = result.getGraphicFieldImageByType(
            MyIdGraphicFieldType.FacePortrait
        )

        binding.imageResult.setImageBitmap(bitmap)

        with(binding) {
            """
                Result code: ${result.code},
                Image width: ${bitmap?.width},
                Image height: ${bitmap?.height},
            """.trimIndent().also {
                textResult.text = it
                textResult.setOnClickListener {
                    copyToClipboard(result.code)
                }
            }
        }
    }

    override fun onError(exception: MyIdException) {
        val bitmap = myidClient.getGraphicFieldImageByType(
            MyIdGraphicFieldType.FacePortrait
        )

        with(binding) {
            imageResult.setImageBitmap(bitmap)

            """
                Result error: ${exception.message}
                Result error code: ${exception.code}
            """.trimIndent().also {
                textResult.text = it
                textResult.setOnClickListener {
                }
            }
        }
    }

    override fun onUserExited() {
        with(binding) {
            imageResult.setImageBitmap(null)

            "User exited".also { textResult.text = it }
        }
    }

    override fun onEvent(event: MyIdEvent) {
    }

    private fun startMyId() {
        val config = MyIdConfig.Builder(
            sessionId = binding.inputSessionId.value
        )
            .withClientHash(
                clientHash = binding.inputHash.value,
                clientHashId = binding.inputHashId.value
            )
            .withResidency(residency)
            .withEnvironment(environment)
            .withEntryType(entryType)
            .withCameraSelector(cameraSelector)
            .withCameraResolution(cameraResolution)
            .withImageFormat(imageFormat)
            .withLocale(locale)
            .build()

        val intent = myidClient.createIntent(this, config)
        result.launch(intent)
    }

    private val result = takeMyIdResult(this)
}