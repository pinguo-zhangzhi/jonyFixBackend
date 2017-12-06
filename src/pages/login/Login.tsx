
import * as ReactDOM from 'react-dom';
import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import { observer, inject } from "mobx-react"
import { observable, autorun, useStrict, action } from 'mobx'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import { ADDRCONFIG } from 'dns'

import BaseStore from '../../stores/BaseStore'
import MenuStore from '../../stores/MenuStore'

import { remote, shell, ipcRenderer } from 'electron'
import fs from 'fs'
import os from 'os'

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})

import Network from '../../network/Network'
import UserStore from '../../stores/UserStore'
let network = Network.sharedInstance()


require('./Login.less')
const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

useStrict(true)

@inject("userStore") @observer
export default class Login extends React.Component {

  store: UserStore<BaseStore>

  phoneNumber: number

  verifyCode: number

  constructor(props) {
    super()
    this.store = props.userStore
  }

  handleLogin() {
    this.store.isLogin = true
    this.store.login({mobile: this.phoneNumber, code: this.verifyCode}, (res) => {
        if (res.error_code == 0) {
            this.store.userInfo = res.data.info
            console.log('====================================');
            console.log(this.store.userInfo);
            console.log('====================================');
            this.store.isLogin = true
            browserHistory.push('home')
        }
    })
  }

  handleVerifyCode() {
    this.store.getVerifyCode({mobile: this.phoneNumber}, (res) => {
        console.log('====================================');
        console.log(res);
        console.log('====================================');
    })
  }

  handleVerifyCodeChange(event) {
    this.verifyCode = event.target.value
  }

  handlePhoneChange(event) {
    this.phoneNumber = event.target.value
  }

  public render() {    

    return <div className="login-container">
              <div className="login-content">
                  <div className="logo"></div>
                  <input className="user-input" placeholder="请输入电话号码" type="tel" maxLength={11} onChange={this.handlePhoneChange.bind(this)} />
                  <input className="verifycode-input" placeholder="请输入验证码" type="tel" maxLength={4} onChange={this.handleVerifyCodeChange.bind(this)} />
                  <div className="submit-area">
                      <button className="login-button" onClick={this.handleLogin.bind(this)}>登录</button>
                      <button className="verify-button" onClick={this.handleVerifyCode.bind(this)}>获取验证码</button>
                  </div>                
              </div>
          </div>
    
  }
}

