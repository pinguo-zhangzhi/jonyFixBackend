
import * as ReactDOM from 'react-dom';
import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import { observer, inject } from "mobx-react"
import { observable, autorun, useStrict, action } from 'mobx'
import { Spin, Modal, Button } from 'antd'
import { ADDRCONFIG } from 'dns'

import BaseView from '../../components/BaseView'
import ErrorHandler from '../../utils/ErrorHandler'
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

useStrict(false)

@inject("userStore") @observer
export default class Login extends BaseView {

    store: UserStore<BaseStore>

    phoneNumber: number

    verifyCode: number

    constructor(props) {
        super()
        this.store = props.userStore
        this.store.uuid = ""
    }
    
    state = {
        verifyLoading: false,
        verifyText: "获取验证码",
        loginLoading: false,
        loginText: "登录"
    }
    
    componentDidMount() {
        document.addEventListener('keyup', (e) => {
            if (e.keyCode == 13) {
                if (this.phoneNumber && this.verifyCode) {
                    this.handleLogin()
                }
            }
        })
    }

    handleLogin() {
        if (!(this.phoneNumber && /^1[3|4|5|7|8][0-9]{9}$/.test(this.phoneNumber + ''))) {
            Modal.error({
                title: '',
                content: '请输入11位手机号码',
            });
            return
        }
        if (!this.verifyCode) {
            Modal.error({
                title: '',
                content: '请输入验证码',
            });
            return
        }
        this.setState({
            loginLoading: true,
            loginText: "登录中..."
        })
        this.store.isLogin = true
        this.store.login({mobile: this.phoneNumber, code: this.verifyCode}, (res) => {
            this.setState({
                loginLoading: false,
                loginText: "登录"
            })
            if (res.error_code == 0) {
                this.store.userInfo = res.data.info
                this.store.uuid = res.data.uuid
                this.store.isLogin = true
                hashHistory.push('home')
            } else if (res.error_code == -10005) {
                Modal.error({
                    title: '验证码错误',
                    content: '请检查输入或重新获取',
                });
            }
        })
    }

    handleVerifyCode() {
        if (!(this.phoneNumber && /^1[3|4|5|7|8][0-9]{9}$/.test(this.phoneNumber + ''))) {
            Modal.error({
                title: '',
                content: '请输入11位手机号码',
            });
            return
        }
        this.setState({
            verifyLoading: true,
            verifyText: "获取中..."
        })
        this.store.getVerifyCode({mobile: this.phoneNumber}, (res) => {
            let verifyText = 60
            this.setState({
                verifyText: verifyText
            })
            let verifyCodeTimer = setInterval(() => {
                if (verifyText == 0) {
                    clearInterval(verifyCodeTimer)
                    this.setState({
                        verifyLoading: false,
                        verifyText: "获取验证码"
                    })
                    return
                }
                verifyText --
                this.setState({
                    verifyText: verifyText
                })
            }, 1000)
            if (res.error_code != 0) {

            }
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
                    <div className="input-wrapper">
                        <input className="user-input" placeholder="请输入电话号码" type="tel" maxLength={11} onChange={this.handlePhoneChange.bind(this)} />
                    </div>
                    <div className="input-wrapper">
                    <input className="verifycode-input" placeholder="请输入验证码" type="tel" maxLength={4} onChange={this.handleVerifyCodeChange.bind(this)} />
                    <Button className="verify-button" loading={this.state.verifyLoading} onClick={this.handleVerifyCode.bind(this)}>
                    {this.state.verifyText}
                    </Button>
                    </div>
                    <div className="input-wrapper">
                        <div className="submit-area">
                            <Button className="login-button" type="primary"
                                loading={this.state.loginLoading} onClick={this.handleLogin.bind(this)}>
                                {this.state.loginText}
                            </Button>
                        </div>
                    </div>          
                </div>
                {this.isLoading == true? <Spin size="large" /> : null}
                {this.errorModal != null? this.errorModal: null}
            </div>
        
    }
}

