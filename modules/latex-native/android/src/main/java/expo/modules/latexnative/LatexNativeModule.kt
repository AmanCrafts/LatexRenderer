package expo.modules.latexnative

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import ru.noties.jlatexmath.JLatexMathAndroid
import ru.noties.jlatexmath.JLatexMathDrawable
import java.io.ByteArrayOutputStream

class LatexNativeModule : Module() {

    private var initialized = false

    override fun definition() = ModuleDefinition {
        Name("LatexNative")

        OnCreate {
            try {
                JLatexMathAndroid.init(appContext.reactContext!!)
                initialized = true
            } catch (e: Exception) {
                initialized = false
            }
        }

        Function("renderToBase64") { latex: String, fontSize: Float, textColor: String, backgroundColor: String ->
            renderLatexToBase64(latex, fontSize, textColor, backgroundColor)
        }

        AsyncFunction("renderToBase64Async") { latex: String, fontSize: Float, textColor: String, backgroundColor: String ->
            renderLatexToBase64(latex, fontSize, textColor, backgroundColor)
        }

        Function("isAvailable") {
            initialized
        }
    }

    private fun renderLatexToBase64(
        latex: String,
        fontSize: Float,
        textColor: String,
        backgroundColor: String
    ): Map<String, Any> {
        if (!initialized) {
            return mapOf(
                "success" to false,
                "error" to "JLaTeXMath not initialized",
                "base64" to "",
                "width" to 0,
                "height" to 0
            )
        }

        return try {
            val fgColor = parseColor(textColor, Color.BLACK)
            val bgColor = parseColor(backgroundColor, Color.WHITE)

            val drawable = JLatexMathDrawable.builder(latex)
                .textSize(fontSize)
                .color(fgColor)
                .background(bgColor)
                .padding(8)
                .build()

            val width = drawable.intrinsicWidth
            val height = drawable.intrinsicHeight

            if (width <= 0 || height <= 0) {
                return mapOf(
                    "success" to false,
                    "error" to "Invalid dimensions: ${width}x${height}",
                    "base64" to "",
                    "width" to 0,
                    "height" to 0
                )
            }

            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            drawable.setBounds(0, 0, width, height)
            drawable.draw(canvas)

            val outputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
            val base64String = Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)
            bitmap.recycle()

            mapOf(
                "success" to true,
                "base64" to "data:image/png;base64,$base64String",
                "width" to width,
                "height" to height,
                "error" to ""
            )
        } catch (e: Exception) {
            mapOf(
                "success" to false,
                "error" to (e.message ?: "Unknown error"),
                "base64" to "",
                "width" to 0,
                "height" to 0
            )
        }
    }

    private fun parseColor(colorString: String, defaultColor: Int): Int {
        return try {
            Color.parseColor(colorString)
        } catch (e: Exception) {
            defaultColor
        }
    }
}
