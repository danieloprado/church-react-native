Church React Native
===================

[Google Play Store](https://play.google.com/store/apps/details?id=br.com.icbsorocaba.app)

Apple Store - Not available yet

![alt text](https://github.com/danieloprado/church-react-native/raw/master/gifs/android.gif)
![alt text](https://github.com/danieloprado/church-react-native/raw/master/gifs/ios.gif)

Technologies
------------
* React-Native
* RxJs
* Typescript
* Firebase Notification
* NativeBase (UI Framework)

Workspace General
-----------------

```bash
npm install -g yarn react-native-cli
cd path/code/project
yarn
```

ENOSPC ERROR
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

Android
=======

Workspace
---------

* Install ORACLE JAVA SDK
* Set JAVA_HOME enviroment:
```bash
# ~/.bashrc
export JAVA_HOME=$(update-alternatives --query javac | sed -n -e 's/Best: *\(.*\)\/bin\/javac/\1/p')
```

* Download Android Tools SDK Standalone
* Set ANDROID_HOME enviroment:
```bash
# ~/.bashrc
export ANDROID_HOME=/path/to/android/sdk
```

* Open Android Installer: `[sudo] $ANDROID_HOME/tools/android`
* Check and install:
  * Android SDK Tools
  * Android SDK Platform-Tools
  * Android SDK Build-Tools: **v25.0.2**, **v23.0.3** e **v23.0.1**
  * Android SDK (API 23)
    * SDK Platform 23
    * Google APIs 23
  * Android Support Repository
  * Google Play services
  * Google Repository

* Copy **./android/keystores/debug.keystore** to **$ANDROID_HOME**


Development
-----------

```bash
yarn dev-android # Build apk and start the packager
yarn start # Just start packager

# If lost adb connection:
adb reverse tcp:8081 tcp:8081
```

Release
-------


```bash
yarn release-android
# ICBSorocaba-signed.apk will be generated at the project folder
```

IOS
===

Workspace
---------
* Install XCode
* Install [Cocoapods](https://guides.cocoapods.org/using/getting-started.html)
* Download [Facebook SDK for IOS](https://developers.facebook.com/docs/ios/) and unzip on **~/Documents/FacebookSDK**
* Install dependecies:
```bash
# inside project folder
cd ./ios
pod install
```

Known Issue
-----------
https://github.com/facebook/react-native/issues/13198

#### Workaround

Change:  
**#import <RCTAnimation/RCTValueAnimatedNode.h>**  
To:    
**#import "RCTValueAnimatedNode.h"**

Development
-----------

### XCode
Open the *ios/churchReact.xcworkspace*

### Command line:
```bash
react-native run-ios
```

Release
-----------

### XCode:
*Product > Schemes > Edit Scheme*, change configuration to **Release** then build project

### Comamnd line:
```bash
react-native run-ios --configuration Release
```