//
//  ViewModel.swift
//

import SwiftUI
import Combine
import MyIdSDK

@objc public class ViewModel: NSObject, ObservableObject {
    
    @Published var sessionId: String = ""
    @Published var environment: MyIdEnvironment = .debug
    @Published var entryType: MyIdEntryType = .identification
    @Published var locale: MyIdLocale = .uzbek
    @Published var cameraShape: MyIdCameraShape = .circle
    
    @Published var image: UIImage?
    @Published var message: String = ""
    
    @objc public func startMyId() {
        let devSessionId = "your_dev_session_id"
        let devClientHash = "your_dev_client_hash"
        let devClientHashId = "your_dev_client_hash_id"
        
        let prodSessionId = "your_prod_session_id"
        let prodClientHash = "your_prod_client_hash"
        let prodClientHashId = "your_prod_client_hash_id"

        let config = MyIdConfig()
        config.sessionId = environment == .production ? prodSessionId : devSessionId
        config.clientHash = environment == .production ? prodClientHash : devClientHash
        config.clientHashId = environment == .production ? prodClientHashId : devClientHashId
        config.environment = environment
        config.entryType = entryType
        config.locale = locale
        config.cameraShape = cameraShape
        config.presentationStyle = .sheet
        
        MyIdClient.start(withConfig: config, withDelegate: self)
    }
}

@objc extension ViewModel: MyIdClientDelegate {
    
    public func onSuccess(result: MyIdResult) {
        message = result.code
        image = result.image
    }
    
    public func onError(exception: MyIdException) {
        message = exception.message
        image = nil
    }
    
    public func onUserExited() {
        message = "User exited"
        image = nil
    }
    
    public func onEvent(event: MyIdEvent) {
    }
}
