module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: './android',
        packageImportPath: 'import com.reactnativemyid.MyIdPackage;',
      },
      ios: {
        podspecPath: './react-native-myid.podspec',
      },
    },
  },
};
