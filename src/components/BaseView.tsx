

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
import ErrorModal from './ErrorModal'

export default class BaseView extends React.Component {
  
    constructor() {
      super()
    }

    @observable errorModal: ErrorModal
  
    public render() {    
      return <div></div>
    }
  }

