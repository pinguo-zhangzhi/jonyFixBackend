

import fs from 'fs'
import { remote, shell } from 'electron'
import ErrorModal from '../components/ErrorModal'
import * as ReactDOM from 'react-dom'
import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import { observer, inject } from "mobx-react"
import { observable, autorun, useStrict, action } from 'mobx'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'


export default class ErrorHandler {
  constructor() {
    
  }

  private static loginExpired = -10004
  private static phoneNumberError = 1

  private static sErrorHandler: ErrorHandler

  static sharedInstance() {
    if (ErrorHandler.sErrorHandler == null) {
      ErrorHandler.sErrorHandler = new ErrorHandler()
    }

    return ErrorHandler.sErrorHandler
  }

  handleErrorCode(code: number) {
      var errorModal = null
      switch (code) {
        case ErrorHandler.loginExpired:
          errorModal = <ErrorModal text="登录已过期，请重新登录." handleOkCallback={() => {
              hashHistory.replace('login')
              window.localStorage.setItem("isLogin", 'false')
              window.localStorage.setItem("uuid", '')  
          }} />
          break;
        case ErrorHandler.phoneNumberError:
          errorModal = <ErrorModal text="请输入正确的手机号" handleOkCallback={() => {
            
          }} />
          break;
      
        default:
          
          break;
      }

      return errorModal
  }

}