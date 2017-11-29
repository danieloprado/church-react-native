VERSION=2.3.0
echo "version $VERSION"

# rm ICBSorocaba.apk
# (cd android && ./gradlew assembleRelease)
# mv android/app/build/outputs/apk/app-release.apk ICBSorocaba.apk

echo "Bundle source map ANDROID"
npm run react-native bundle -- \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/fitfood.android.bundle \
  --sourcemap-output /tmp/fitfood.android.sourcemap

npm run bugsnag-sourcemaps upload -- \
     --api-key xxxx \
     --app-version $VERSION \
     --minified-file /tmp/fitfood.android.bundle \
     --source-map /tmp/fitfood.android.sourcemap \
     --minified-url index.android.bundle \
     --upload-sources \
     --overwrite

echo "Bundle source map IOS"
npm run react-native bundle -- \
  --platform ios \
  --dev false \
  --entry-file index.ios.js \
  --bundle-output /tmp/fitfood.ios.bundle \
  --sourcemap-output /tmp/fitfood.ios.sourcemap

npm run bugsnag-sourcemaps upload -- \
     --api-key xxxx \
     --app-version $VERSION \
     --minified-file /tmp/fitfood.ios.bundle \
     --source-map /tmp/fitfood.ios.sourcemap \
     --minified-url index.ios.bundle \
     --upload-sources \
     --overwrite