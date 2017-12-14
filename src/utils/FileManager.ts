

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

        if (!fs.existsSync(orderDir + '/下载目录')) {
            fs.mkdirSync(orderDir + '/下载目录') 
        }
        order.tagList.map((tag, index) => {
            let dirName = tag.name
            let dirPath = orderDir + '/下载目录/' + dirName
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath) 
            }
        })

        let uploadDir = orderDir + '/上传目录'
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir) 
        }
    }

    openDownloadDir(orderId) {
        let orderDir = this.jonyFixDirPath + '/' + orderId + '/下载目录'
        shell.openItem(orderDir)
    }

    openUploadDir(orderId) {
        let uploadDir = this.jonyFixDirPath + '/' + orderId + '/上传目录'
        shell.openItem(uploadDir)
    }

    getUploadDirPath(orderId) {
        let uploadDir = this.jonyFixDirPath + '/' + orderId + '/上传目录'
        if (fs.existsSync(uploadDir)) {
            return uploadDir
        }else {
            return null
        }
    }

    getOrderDirPath(orderId) {
        let orderDir = this.jonyFixDirPath + '/' + orderId
        if (fs.existsSync(orderDir)) {
            return orderDir
        }else {
            return null
        }
    }

    getTagDirPath(orderId, tagName) {
        if (tagName == null) {
            tagName = "全部"
        }
        let tagDir = this.jonyFixDirPath + '/' + orderId + '/下载目录/' + tagName
        if (!fs.existsSync(tagDir)) {
            fs.mkdirSync(tagDir) 
        }

        return tagDir
    }
}