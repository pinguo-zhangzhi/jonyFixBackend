

import fs from 'fs'
import { remote, shell } from 'electron'
import request from 'request'
import { observable, autorun, asStructure, useStrict, action } from 'mobx'
import { observer, Provider } from "mobx-react"

export default class DownloadFileManager {
  constructor() {
    autorun(() => {
        if (this.currentCount < this.maxCount) {
            let request = this.queue.pop()
            request()
            this.currentCount ++
        } 
    })
  }

  private maxCount = 10

  @observable private currentCount = 0

  @observable private queue = []

  // @autorun doRequest = () => {
  //    if (this.currentCount < this.maxCount) {
  //         let request = this.queue.pop()
  //         request()
  //         this.currentCount ++
  //     } 
  // }

  private static sManager

  static sharedInstance() {
    if (DownloadFileManager.sManager == null) {
        DownloadFileManager.sManager = new DownloadFileManager()
    }

    return DownloadFileManager.sManager
  }

  downloadFile(url, path) {
    let imageRequest = () => {
      request.head(url, (err, res, body) => {
          if(err){
              console.log(err);
          }else {
              this.currentCount --
          }
      })
      request(url).pipe(fs.createWriteStream(path))
    }

    this.queue.push(imageRequest)

  }

}