require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-myid"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["repository"]["url"] || "https://github.com/example/react-native-myid"
  s.license      = package["license"]
  s.authors      = package["author"]
  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/example/react-native-myid.git", :tag => "v#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.exclude_files = "ios/MyIdSDK.xcframework/**/*"

  # MyIdSDK — vendored xcframework (no SPM step needed for consumers)
  s.vendored_frameworks = "ios/MyIdSDK.xcframework"

  # ---------------------------------------------------------------------------
  # New Architecture support
  # ---------------------------------------------------------------------------
  install_modules_dependencies(s)

  # ML Kit dependencies (required by MyID SDK)
  s.dependency "GoogleMLKit/FaceDetection", "~> 7.0"
  s.dependency "GoogleMLKit/TextRecognition", "~> 7.0"

  s.swift_version = "5.0"
  s.static_framework = true

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "SWIFT_COMPILATION_MODE" => "wholemodule"
  }
end
