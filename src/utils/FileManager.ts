

import fs from 'fs'
import { remote, shell } from 'electron'

export default class FileManager {
  constructor() {
    this.setup()
  }

  private static sFileManager

  static sharedInstance() {
    if (FileManager.sFileManager == null) {
        FileManager.sFileManager = new FileManager()
    }

    return FileManager.sFileManager
  }

  jonyFixDirPath: string = remote.app.getPath('desktop') + '/佳尼修图后台'

  setup() {
    if (!fs.existsSync(this.jonyFixDirPath)) {
        fs.mkdirSync(this.jonyFixDirPath) 
    }
  }

  createDir(order) {
      let orderDir = this.jonyFixDirPath + '/' + order.orderId
      if (!fs.existsSync(orderDir)) {
          fs.mkdirSync(orderDir) 
      }
  }

}