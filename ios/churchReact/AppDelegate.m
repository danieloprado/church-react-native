/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "SplashScreen.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <BugsnagReactNative/BugsnagReactNative.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  #ifdef DEBUG
    jsCodeLocation = [NSURL URLWithString:@"http://10.84.77.111:8081/index.ios.bundle?platform=ios&dev=true"];
  #else
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  #endif
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"churchReact"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [SplashScreen show];
  [BugsnagReactNative start];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  return YES;
}

- (BOOL)application:(UIApplication *)application
        openURL:(NSURL *)url
        options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                            openURL:url
                                                            sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                            annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                  ]
              ||
                  [RNGoogleSignin application:application
                                  openURL:url
                                  sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                  annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                  ];

  // Add any custom logic here.
  return handled;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

@end
