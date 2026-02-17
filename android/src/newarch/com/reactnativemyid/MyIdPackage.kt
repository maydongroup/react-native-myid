package com.reactnativemyid

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

/**
 * New architecture package — uses TurboReactPackage.
 * This file is only compiled when newArchEnabled=true.
 */
class MyIdPackage : TurboReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return when (name) {
            MyIdModule.NAME -> MyIdModule(reactContext)
            else -> null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                MyIdModule.NAME to ReactModuleInfo(
                    MyIdModule.NAME,
                    MyIdModule.NAME,
                    false,  // canOverrideExistingModule
                    false,  // needsEagerInit
                    true,   // isCxxModule
                    true    // isTurboModule
                )
            )
        }
    }
}
