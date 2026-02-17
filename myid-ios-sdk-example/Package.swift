// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "MyIdSDK",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "MyIdSDK",
            targets: ["MyIdSDK"]),
    ],
    targets: [
        .binaryTarget(
            name: "MyIdSDK",
            url: "https://github.com/javokhirsavriev/myid-ios-sdk/releases/download/2.4.93/MyIdSDK.xcframework.zip",
            checksum: "83d90a3d5cb69038e9913d29329b3c4597bd5a333ec9f60ac918f098c0f0b86b"
        )
    ]
)
