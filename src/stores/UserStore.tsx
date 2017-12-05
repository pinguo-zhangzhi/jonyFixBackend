import * as ReactDOM from 'react-dom'
import React from 'react'
import { observer } from "mobx-react"
import { observable, autorun, asStructure, useStrict, action } from 'mobx'
import BaseStore from './BaseStore'

import Network from '../network/Network'
let network = Network.sharedInstance()

useStrict(true)

export default class UserStore<BaseStore> {

  rootStore: BaseStore

  @observable userInfo: any

  constructor(f:BaseStore) {
    this.rootStore = f
  }

  get isLogin() {
    var localizeProperty: any = window.localStorage.getItem("isLogin")
    if (localizeProperty == null || localizeProperty == 'false') {
      localizeProperty = false
    }else {
      localizeProperty == true
    }
    return localizeProperty
  }

  set isLogin(login: boolean) {
    var localizeProperty
    if (login == true) {
      localizeProperty = 'true'
    }else {
      localizeProperty = 'false'
    }

    window.localStorage.setItem("isLogin", localizeProperty) 
  }

  login(param, callback) {
      network.request('login', param, callback)
  }

  getVerifyCode(param, callback) {
    network.request('verifyCode', param, callback)
  }

}

// Invite:"9cR0VA4v"
// address:""
// appletCode:""
// avatar:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ89PVfQ7icfVQzPmnzP6AYIblsws3wkBicaTm7veGVYvibKOX8UUzCNc3VaWWql2UPsNibUyNmIMy0Hg/0"
// cart:null
// company:""
// contacts:""
// createTime:"1510391870"
// email:""
// fee:""
// introduce:""
// nickname:"migaloo"
// phone:"13060046366"
// realName:null
// sex:0
// status:0
// type:0
// updateTime:"1510392669"
// wxcode:"5a0566a631158"
