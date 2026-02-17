package uz.myid.sample

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.widget.EditText
import android.widget.Toast

inline val Context.clipboardManager: ClipboardManager?
    get() = getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager

fun Context.copyToClipboard(text: String) {
    val clipboard = clipboardManager
    val clip = ClipData.newPlainText("Copied", text)
    clipboard?.setPrimaryClip(clip)

    Toast.makeText(this, "Copied", Toast.LENGTH_SHORT).show()
}

inline val EditText.value: String get() = text.toString().trim()
