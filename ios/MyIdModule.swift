import Foundation
import UIKit
import React
import MyIdSDK

@objc(MyIdModule)
class MyIdModule: NSObject, RCTBridgeModule {

    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?
    private var withPhoto: Bool = false

    static func moduleName() -> String! {
        return "MyIdModule"
    }

    // Required to run on main thread (presents UI)
    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    func start(_ config: NSDictionary,
               resolver resolve: @escaping RCTPromiseResolveBlock,
               rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        self.withPhoto = config["withPhoto"] as? Bool ?? false

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            let myIdConfig = MyIdConfig()

            // Client ID (required)
            if let clientId = config["clientId"] as? String {
                myIdConfig.clientId = clientId
            }

            // --- New flow: sessionId ---
            if let sessionId = config["sessionId"] as? String {
                myIdConfig.sessionId = sessionId
            }

            // --- Old flow: clientHash + clientHashId ---
            if let clientHash = config["clientHash"] as? String {
                myIdConfig.clientHash = clientHash
            }
            if let clientHashId = config["clientHashId"] as? String {
                myIdConfig.clientHashId = clientHashId
            }

            // --- Common optional fields ---
            if let passportData = config["passportData"] as? String {
                myIdConfig.passportData = passportData
            }
            if let birthDate = config["birthDate"] as? String {
                myIdConfig.dateOfBirth = birthDate
            }
            if let externalId = config["externalId"] as? String {
                myIdConfig.externalId = externalId
            }
            if let threshold = config["threshold"] as? Double {
                myIdConfig.threshold = Float(threshold)
            }

            // Entry type
            if let entryType = config["entryType"] as? String {
                switch entryType {
                case "AUTH":
                    myIdConfig.entryType = MyIdEntryType.AUTH
                case "FACE":
                    myIdConfig.entryType = MyIdEntryType.FACE
                default:
                    myIdConfig.entryType = MyIdEntryType.AUTH
                }
            }

            // Build mode
            if let buildMode = config["buildMode"] as? String {
                switch buildMode {
                case "PRODUCTION":
                    myIdConfig.buildMode = MyIdBuildMode.PRODUCTION
                case "DEBUG":
                    myIdConfig.buildMode = MyIdBuildMode.DEBUG
                default:
                    myIdConfig.buildMode = MyIdBuildMode.PRODUCTION
                }
            }

            // Locale
            if let locale = config["locale"] as? String {
                switch locale {
                case "uz":
                    myIdConfig.locale = MyIdLocale.UZ
                case "en":
                    myIdConfig.locale = MyIdLocale.EN
                case "ru":
                    myIdConfig.locale = MyIdLocale.RU
                default:
                    break
                }
            }

            // Photo
            myIdConfig.withPhoto = self.withPhoto

            MyIdClient.start(withConfig: myIdConfig, withDelegate: self)
        }
    }
}

// MARK: - MyIdClientDelegate

extension MyIdModule: MyIdClientDelegate {

    func onSuccess(result: MyIdResult) {
        var response: [String: Any] = [:]

        response["code"] = result.code
        response["comparison"] = result.comparisonValue

        if withPhoto, let image = result.image {
            if let imageData = image.jpegData(compressionQuality: 0.9) {
                response["image"] = imageData.base64EncodedString()
            }
        }

        resolve?(response)
        cleanup()
    }

    func onError(exception: MyIdException) {
        let code = String(exception.code ?? 0)
        let message = exception.message ?? "MyID SDK error"
        reject?(code, message, nil)
        cleanup()
    }

    func onUserExited() {
        reject?("MYID_USER_EXITED", "User exited MyID SDK", nil)
        cleanup()
    }

    private func cleanup() {
        resolve = nil
        reject = nil
    }
}

// MARK: - New Architecture (TurboModule) support

#if RCT_NEW_ARCH_ENABLED
extension MyIdModule: NativeMyIdModuleSpec {
    // The `start` method is already implemented above.
    // This conformance ensures Codegen-generated protocol is satisfied.
}
#endif
