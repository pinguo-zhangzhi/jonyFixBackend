
export default class Utils {

  constructor() {

  }

  static dictionarySort (dict) {
    const arr = Object.keys(dict)
    const res = arr.sort()
  
    var string = "";
    for (let i = 0; i < arr.length; i++) {
        string += arr[i] + '=' + dict[arr[i]]
        if (i < arr.length-1) {
            string += "&"
        }
    }

    return string
    
  }

}