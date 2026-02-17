//
//  ContentView.swift
//

import SwiftUI
import MyIdSDK

struct ContentView: View {
    
    @StateObject private var viewModel = ViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                FormSection(viewModel: viewModel)

                Button(action: {
                    viewModel.startMyId()
                }) {
                    Text("Start SDK")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .padding(.horizontal)
                
                if let image = viewModel.image {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 100)
                        .cornerRadius(12)
                        .padding(.horizontal)
                }

                if !viewModel.message.isEmpty {
                    Text(viewModel.message)
                        .foregroundColor(.blue)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                        .padding(.horizontal)
                        .onTapGesture {
                            copyToClipboard(viewModel.message)
                        }
                }
            }
            .padding(.vertical)
        }
    }

    private func copyToClipboard(_ text: String) {
        UIPasteboard.general.string = text
    }
}

struct FormSection: View {
    
    @ObservedObject var viewModel: ViewModel

    var body: some View {
        VStack(
            alignment: .leading,
            spacing: 16
        ) {
            Group {
                TextField("Session ID", text: $viewModel.sessionId)
            }
            .textFieldStyle(RoundedBorderTextFieldStyle())
            .padding(.horizontal)

            Group {
                Picker("Environment", selection: $viewModel.environment) {
                    Text("Production").tag(MyIdEnvironment.production)
                    Text("Debug").tag(MyIdEnvironment.debug)
                }

                Picker("Entry Type", selection: $viewModel.entryType) {
                    Text("Identification").tag(MyIdEntryType.identification)
                    Text("Face detection").tag(MyIdEntryType.faceDetection)
                }

                Picker("Locale", selection: $viewModel.locale) {
                    Text("Uzbek").tag(MyIdLocale.uzbek)
                    Text("English").tag(MyIdLocale.english)
                    Text("Russian").tag(MyIdLocale.russian)
                }

                Picker("Camera Shape", selection: $viewModel.cameraShape) {
                    Text("Circle").tag(MyIdCameraShape.circle)
                    Text("Ellipse").tag(MyIdCameraShape.ellipse)
                }
            }
            .pickerStyle(MenuPickerStyle())
            .padding(.horizontal)
        }
    }
}
