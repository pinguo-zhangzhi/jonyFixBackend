
const electron = require('electron')
const path = require('path')
const fs = require('fs')

export default class JLocalStorage {

    constructor(userId) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData')
        this.path = path.join(userDataPath, userId + '.json')
        // console.log(this.path)
        this.data = parseDataFile(this.path)
        // console.log(this.data)
        // this.clear()
    }

    private static sJLocalStorage: JLocalStorage

    static sharedInstance(userId): JLocalStorage {
        if (JLocalStorage.sJLocalStorage == null) {
        JLocalStorage.sJLocalStorage = new JLocalStorage(userId)
        }
        return JLocalStorage.sJLocalStorage
    }
    
    data: any

    path: string
    
    getData() {
        return this.data
    }

    setData(data) {
        this.data = data
        // console.log(this.data)
        fs.writeFileSync(this.path, JSON.stringify(this.data))
    }

    clear() {
        this.data = {}
        fs.writeFileSync(this.path, JSON.stringify(this.data))
    }

}

function parseDataFile(filePath) {

    if (fs.existsSync(filePath)) {
        let code = fs.readFileSync(filePath)
        return JSON.parse(code)
    }else {
        fs.writeFileSync(filePath, JSON.stringify({}))
        return {}
    }
}