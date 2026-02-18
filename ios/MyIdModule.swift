import Foundation
import UIKit
import React
import MyIdSDK

@objc(MyIdModule)
class MyIdModule: NSObject, RCTBridgeModule {

    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?

    static func moduleName() -> String! {
        return "MyIdModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    func start(_ config: NSDictionary,
               resolver resolve: @escaping RCTPromiseResolveBlock,
               rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            let myIdConfig = MyIdConfig()

            // ── Auth fields ──────────────────────────────────────────────
            if let sessionId = config["sessionId"] as? String {
                myIdConfig.sessionId = sessionId
            }
            if let clientHash = config["clientHash"] as? String {
                myIdConfig.clientHash = clientHash
            }
            if let clientHashId = config["clientHashId"] as? String {
                myIdConfig.clientHashId = clientHashId
            }

            // ── Entry type ───────────────────────────────────────────────
            if let entryType = config["entryType"] as? String {
                switch entryType {
                case "IDENTIFICATION":
                    myIdConfig.entryType = .identification
                case "VIDEO_IDENTIFICATION":
                    myIdConfig.entryType = .videoIdentification
                case "FACE_DETECTION":
                    myIdConfig.entryType = .faceDetection
                default:
                    myIdConfig.entryType = .identification
                }
            }

            // ── Environment (build mode) ─────────────────────────────────
            if let buildMode = config["buildMode"] as? String {
                switch buildMode {
                case "PRODUCTION":
                    myIdConfig.environment = .production
                case "DEBUG":
                    myIdConfig.environment = .debug
                default:
                    myIdConfig.environment = .production
                }
            }

            // ── Locale ───────────────────────────────────────────────────
            if let locale = config["locale"] as? String {
                switch locale {
                case "uz":
                    myIdConfig.locale = .uzbek
                case "en":
                    myIdConfig.locale = .english
                case "ru":
                    myIdConfig.locale = .russian
                default:
                    break
                }
            }

            // ── Residency ────────────────────────────────────────────────
            if let residency = config["residency"] as? String {
                switch residency {
                case "RESIDENT":
                    myIdConfig.residency = .resident
                case "NON_RESIDENT":
                    myIdConfig.residency = .nonResident
                case "USER_DEFINED":
                    myIdConfig.residency = .userDefined
                default:
                    break
                }
            }

            // ── Min age ──────────────────────────────────────────────────
            if let minAge = config["minAge"] as? Int {
                myIdConfig.minAge = minAge
            }

            // ── Camera shape ─────────────────────────────────────────────
            if let cameraShape = config["cameraShape"] as? String {
                switch cameraShape {
                case "CIRCLE":
                    myIdConfig.cameraShape = .circle
                case "ELLIPSE":
                    myIdConfig.cameraShape = .ellipse
                default:
                    myIdConfig.cameraShape = .circle
                }
            }

            // ── Camera selector ──────────────────────────────────────────
            if let cameraSelector = config["cameraSelector"] as? String {
                switch cameraSelector {
                case "FRONT":
                    myIdConfig.cameraSelector = .front
                case "BACK":
                    myIdConfig.cameraSelector = .back
                default:
                    break
                }
            }

            // ── Distance ─────────────────────────────────────────────────
            if let distance = config["distance"] as? Float {
                myIdConfig.distance = distance
            }

            // ── Show error screen ────────────────────────────────────────
            if let showErrorScreen = config["showErrorScreen"] as? Bool {
                myIdConfig.showErrorScreen = showErrorScreen
            }

            // ── Presentation style ───────────────────────────────────────
            if let presentationStyle = config["presentationStyle"] as? String {
                switch presentationStyle {
                case "FULL_SCREEN":
                    myIdConfig.presentationStyle = .fullScreen
                case "SHEET":
                    myIdConfig.presentationStyle = .sheet
                default:
                    break
                }
            }

            // ── Organization details ─────────────────────────────────────
            if let orgDetails = config["organizationDetails"] as? NSDictionary {
                let details = MyIdOrganizationDetails()
                if let phoneNumber = orgDetails["phoneNumber"] as? String {
                    details.phoneNumber = phoneNumber
                }
                myIdConfig.organizationDetails = details
            }

            // ── Appearance (can be extended in the future) ───────────────
            // myIdConfig.appearance = ...

            MyIdClient.start(withConfig: myIdConfig, withDelegate: self)
        }
    }
}

// MARK: - MyIdClientDelegate

extension MyIdModule: MyIdClientDelegate {

    func onSuccess(result: MyIdResult) {
        var response: [String: Any] = [:]

        response["code"] = result.code

        if let image = result.image {
            if let imageData = image.jpegData(compressionQuality: 0.9) {
                response["image"] = imageData.base64EncodedString()
            }
        }

        resolve?(response)
        cleanup()
    }

    func onError(exception: MyIdException) {
        let code = String(exception.code)
        let message = exception.message
        reject?(code, message, nil)
        cleanup()
    }

    func onUserExited() {
        reject?("MYID_USER_EXITED", "User exited MyID SDK", nil)
        cleanup()
    }

    func onEvent(event: MyIdEvent) {
        // Optional: can emit events to JS if needed in the future
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
}
#endif
