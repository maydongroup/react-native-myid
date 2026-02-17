#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNMyIdModuleSpec/RNMyIdModuleSpec.h>
#endif

@interface RCT_EXTERN_MODULE(MyIdModule, NSObject)

RCT_EXTERN_METHOD(start:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
