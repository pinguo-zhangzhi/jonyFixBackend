

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

  createOrderDir(order) {
      let orderDir = this.jonyFixDirPath + '/' + order.orderId
      if (!fs.existsSync(orderDir)) {
          fs.mkdirSync(orderDir) 
      }

      order.tagList.map((tag, index) => {
          let dirName = tag.name
          let dirPath = orderDir + '/' + dirName
          if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath) 
          }
      })

      let uploadDir = orderDir + '/上传目录'
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir) 
      }
  }

  openDownloadDir(order) {
      let orderDir = this.jonyFixDirPath + '/' + order.orderId
      shell.openItem(orderDir)
  }

  openUploadDir(order) {
      let uploadDir = this.jonyFixDirPath + '/' + order.orderId + '/上传目录'
      shell.openItem(uploadDir)
  }

  getUploadDirPath(order) {
      let uploadDir = this.jonyFixDirPath + '/' + order.orderId + '/上传目录'
      if (fs.existsSync(uploadDir)) {
          return uploadDir
      }else {
        return null
      }
  }

  getOrderDirPath(order) {
      let orderDir = this.jonyFixDirPath + '/' + order.orderId
      if (fs.existsSync(orderDir)) {
          return orderDir
      }else {
        return null
      }
  }

}