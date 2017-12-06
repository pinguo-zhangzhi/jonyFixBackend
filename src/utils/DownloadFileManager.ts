

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

  private static sManager

  static sharedInstance() {
    if (DownloadFileManager.sManager == null) {
        DownloadFileManager.sManager = new DownloadFileManager()
    }

    return DownloadFileManager.sManager
  }

  downloadFile(url, path) {
    
    if (this.currentCount < this.maxCount) {
        (() => {
            let requestUrl = url,
                imagePath = path
            request.head(requestUrl, (err, res, body) => {
                if(err){
                    console.log(err);
                    this.downloadFile(requestUrl, imagePath)

                }else {
                    this.currentCount -- 
                    let obj = this.queue.pop()
                    if (obj != null) {
                        this.downloadFile(obj.url, obj.path)
                    }
                }
            })

            request(requestUrl).pipe(fs.createWriteStream(imagePath))

        })()

    }else {
        this.queue.push({url: url, path: path})
    }

  }

}