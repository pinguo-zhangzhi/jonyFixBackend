

import fs from 'fs'
import { remote, shell } from 'electron'
import request from 'request'
import { observable, autorun, asStructure, useStrict, action } from 'mobx'
import { observer, Provider } from "mobx-react"

export default class DownloadFileManager {
  constructor() {
    
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
    
    if (this.currentCount < this.maxCount) {
        request.head(url, (err, res, body) => {
            if(err){
                console.log(err);
            }else {
                this.currentCount -- 
                let obj = this.queue.pop()
                if (obj != null) {
                    this.downloadFile(obj.url, obj.path)
                }
            }
        })
        request(url).pipe(fs.createWriteStream(path))

    }else {
        this.queue.push({url: url, path: path})
    }

  }

}