
const electron = require('electron')
const path = require('path')
const fs = require('fs')

export default class JLocalStorage {

  constructor(userId) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    this.path = path.join(userDataPath, userId + '.json')
    this.data = parseDataFile(this.path)
  }

  private static sJLocalStorage: JLocalStorage

  static sharedInstance(userId): JLocalStorage {
    if (JLocalStorage.sJLocalStorage) {
      JLocalStorage.sJLocalStorage = new JLocalStorage(userId)
    }
    return JLocalStorage.sJLocalStorage
  }
  
  data: any

  path: string
  
  getItem(key) {
    return this.data[key]
  }

  setItem(key, val) {
    this.data[key] = val
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