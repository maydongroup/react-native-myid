package uz.myid.sample.data

import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.url
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.contentType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import org.json.JSONObject
import uz.myid.sample.BuildConfig
import uz.myid.sample.MainActivity

internal class SessionRepository {

    private val httpClient by lazy {
        HttpClient(OkHttp) {
            install(HttpTimeout) {
                requestTimeoutMillis = 50 * 1_000
                connectTimeoutMillis = 10 * 1_000
            }
            followRedirects = false
        }
    }

    fun getAccessToken(): Flow<String> = flow {
        val httpResponse = httpClient.post {
            url(
                if (BuildConfig.PRODUCTION) {
                    "https://api.myid.uz/api/v1/auth/clients/access-token"
                } else {
                    "https://api.devmyid.uz/api/v1/auth/clients/access-token"
                }
            )
            contentType(ContentType.Application.Json)
            setBody(
                """
                    {
                        "client_id": "${
                    if (BuildConfig.PRODUCTION) {
                        MainActivity.prodClientId
                    } else {
                        MainActivity.devClientId
                    }
                }",
                        "client_secret": "${
                    if (BuildConfig.PRODUCTION) {
                        MainActivity.prodClientSecret
                    } else {
                        MainActivity.devClientSecret
                    }
                }"
                    }
                """.trimIndent()
            )
        }
        val json = httpResponse.bodyAsText()

        val jsonObject = JSONObject(json)
        val accessToken = jsonObject.optString("access_token", "")

        emit(accessToken)
    }.catch { cause ->
        emit(cause.message.orEmpty())
    }.flowOn(Dispatchers.IO)

    fun getSessionId(accessToken: String): Flow<String> = flow {
        val httpResponse = httpClient.post {
            url(
                if (BuildConfig.PRODUCTION) {
                    "https://api.myid.uz/api/v2/sdk/sessions"
                } else {
                    "https://api.devmyid.uz/api/v2/sdk/sessions"
                }
            )
            contentType(ContentType.Application.Json)
            header(
                HttpHeaders.Authorization,
                "Bearer $accessToken"
            )
            setBody("{}")
        }
        val json = httpResponse.bodyAsText()

        val jsonObject = JSONObject(json)
        val sessionId = jsonObject.optString("session_id", "")

        emit(sessionId)
    }.catch { cause ->
        emit(cause.message.orEmpty())
    }.flowOn(Dispatchers.IO)
}