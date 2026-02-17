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

  # ---------------------------------------------------------------------------
  # New Architecture support
  # ---------------------------------------------------------------------------
  install_modules_dependencies(s)

  # MyID SDK (available as a CocoaPod)
  s.dependency "MyIdSDK"

  s.swift_version = "5.0"
  s.static_framework = true

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "SWIFT_COMPILATION_MODE" => "wholemodule"
  }
end
