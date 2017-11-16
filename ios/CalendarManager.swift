//
//  CalendarManager.swift
//  madsnap
//
//  Created by Kjartan Kristjansson on 27/10/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation

// CalendarManager.swift

@objc(CalendarManager)
class CalendarManager: NSObject {
  
  @objc func addEvent(name: String, location: String, date: NSNumber, callback: (NSObject) -> () ) -> Void {
    NSLog("\(name) \(location) \(date)")
    callback( [[
      "name": name,
      "location": location,
      "date" : date
      ]] as NSObject) 
  }
}
