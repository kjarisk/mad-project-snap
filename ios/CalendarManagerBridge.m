//
//  CalendarManagerBridge.m
//  madsnap
//
//  Created by Kjartan Kristjansson on 27/10/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

// CalendarManagerBridge.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarManager, NSObject)
RCT_EXTERN_METHOD(addEventWithName:(NSString * _Nonnull)name location:(NSString * _Nonnull)location date:(NSNumber * _Nonnull)date callback:(SWIFT_NOESCAPE void (^ _Nonnull)(NSObject * _Nonnull))callback)

@end
