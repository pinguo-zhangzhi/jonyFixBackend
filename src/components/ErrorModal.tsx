

import * as ReactDOM from 'react-dom';
import React from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createHistory } from 'history'
import { observer, inject } from "mobx-react"
import { observable, autorun, useStrict, action } from 'mobx'
import { Layout, Menu, Breadcrumb, Icon, Modal } from 'antd'

interface PassedProps extends React.Props<any> {
  handleOkCallback: any
  text: string
}

export default class ErrorModal extends React.Component<PassedProps> {
  
    constructor(props) {
      super()
      this.handleOkCallback = props.handleOkCallback
      this.text = props.text
    }

    handleOkCallback: any

    text: string

    handleOk() {
      this.handleOkCallback && this.handleOkCallback()
    }
  
    public render() {    
      return <Modal title="友情提示" visible={true} onOk={this.handleOk.bind(this)}>
            {this.text}
        </Modal>
    }
  }

