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

            MyIdSdk.start(withConfigureOptions: { options in
                guard let options = options else { return }

                // Client ID (required)
                if let clientId = config["clientId"] as? String {
                    options.clientId = clientId
                }

                // --- New flow: sessionId ---
                if let sessionId = config["sessionId"] as? String {
                    options.sessionId = sessionId
                }

                // --- Old flow: clientHash + clientHashId ---
                if let clientHash = config["clientHash"] as? String {
                    options.clientHash = clientHash
                }
                if let clientHashId = config["clientHashId"] as? String {
                    options.clientHashId = clientHashId
                }

                // --- Common optional fields ---
                if let passportData = config["passportData"] as? String {
                    options.passportData = passportData
                }
                if let birthDate = config["birthDate"] as? String {
                    options.dateOfBirth = birthDate
                }
                if let sdkHash = config["sdkHash"] as? String {
                    options.sdkHash = sdkHash
                }
                if let externalId = config["externalId"] as? String {
                    options.externalId = externalId
                }
                if let threshold = config["threshold"] as? Double {
                    options.threshold = Float(threshold)
                }

                // Entry type
                if let entryType = config["entryType"] as? String {
                    switch entryType {
                    case "AUTH":
                        options.entryType = .auth
                    case "FACE":
                        options.entryType = .face
                    default:
                        options.entryType = .auth
                    }
                }

                // Build mode
                if let buildMode = config["buildMode"] as? String {
                    switch buildMode {
                    case "PRODUCTION":
                        options.buildMode = .production
                    case "DEBUG":
                        options.buildMode = .debug
                    default:
                        options.buildMode = .production
                    }
                }

                // Locale
                if let locale = config["locale"] as? String {
                    switch locale {
                    case "uz":
                        options.locale = .uz
                    case "en":
                        options.locale = .en
                    case "ru":
                        options.locale = .ru
                    default:
                        break
                    }
                }

                // Camera shape
                if let cameraShape = config["cameraShape"] as? String {
                    switch cameraShape {
                    case "CIRCLE":
                        options.cameraShape = .circle
                    case "ELLIPSE":
                        options.cameraShape = .ellipse
                    default:
                        options.cameraShape = .circle
                    }
                }

                // Photo
                options.withPhoto = self.withPhoto

                // Organization details
                if let orgDetails = config["organizationDetails"] as? NSDictionary {
                    if let phoneNumber = orgDetails["phoneNumber"] as? String {
                        let details = OrganizationDetails()
                        details.phoneNumber = phoneNumber
                        options.organizationDetails = details
                    }
                }

            }, withDelegate: self)
        }
    }
}

// MARK: - MyIdSdkDelegate

extension MyIdModule: MyIdSdkDelegate {

    func myidOnSuccess(result: MyIdResult) {
        var response: [String: Any] = [:]

        if let code = result.code {
            response["code"] = code
        }

        if let comparison = result.comparison {
            response["comparison"] = comparison
        }

        if withPhoto, let image = result.image {
            if let imageData = image.jpegData(compressionQuality: 0.9) {
                response["image"] = imageData.base64EncodedString()
            }
        }

        resolve?(response)
        cleanup()
    }

    func myidOnError(exception: MyIdException) {
        let code = String(exception.code ?? 0)
        let message = exception.message ?? "MyID SDK error"
        reject?(code, message, nil)
        cleanup()
    }

    func myidOnUserExited() {
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
